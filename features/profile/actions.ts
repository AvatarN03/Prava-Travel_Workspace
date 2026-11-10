"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";

import { syncUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteUserStorageFolder, pruneUnusedUserAvatars } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { hasActiveProSubscription } from "@/services/subscription/subscription-service";
import { validateUsername } from "./reserved-usernames";

import {
  updateGeneralPreferencesSchema,
  updateProfileSchema,
  type UpdateGeneralPreferencesInput,
  type UpdateProfileInput,
} from "./schema";
import type { ProfileWithStats, TopBarUserInfo } from "./types";

export type { ProfileWithStats, TopBarUserInfo };

const getCachedProfile = cache(async (): Promise<{ success: boolean; profile?: ProfileWithStats; error?: string }> => {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await syncUserProfile(user);

    const profile = await db.profile.findUniqueOrThrow({
      where: { id: user.id },
      include: {
        _count: {
          select: {
            trips: true,
          },
        },
        trips: {
          where: { isPublic: true, isTemplate: true },
          select: { id: true },
        },
      },
    });

    const isPro = await hasActiveProSubscription(user.id);
    const tier = isPro ? ("pro" as const) : ("free" as const);
    const tripsQuota = isPro ? 25 : 10;
    const aiCreditsQuota = isPro ? 150 : 30;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [aiCreditsAgg, publishedStoriesCount, communityDiscussionsCount] = await Promise.all([
      db.aiMessage.aggregate({
        where: {
          role: "user",
          conversation: { profileId: user.id },
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: {
          creditsCost: true,
        },
      }),
      db.blogPost.count({
        where: { profileId: user.id, status: "PUBLISHED" },
      }),
      db.communityPost.count({
        where: { profileId: user.id },
      }),
    ]);

    const rawAiCredits = aiCreditsAgg._sum.creditsCost ?? 0;
    const aiCreditsUsed = Math.min(aiCreditsQuota, rawAiCredits);
    const tripsRemaining = Math.max(0, tripsQuota - profile._count.trips);
    const aiCreditsRemaining = Math.max(0, aiCreditsQuota - aiCreditsUsed);

    return {
      success: true,
      profile: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        username: profile.username,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        isPublic: profile.isPublic,
        defaultCurrency: (profile as unknown as { defaultCurrency?: string }).defaultCurrency || "INR",
        aiAutoPropose: (profile as unknown as { aiAutoPropose?: boolean }).aiAutoPropose ?? true,
        offlineMode: (profile as unknown as { offlineMode?: boolean }).offlineMode ?? false,
        travelPreferences: (profile as unknown as { travelPreferences?: string | null }).travelPreferences || null,
        createdAt: profile.createdAt.toISOString(),
        totalTrips: profile._count.trips,
        templatesCount: profile.trips.length,
        publishedStories: publishedStoriesCount,
        forumDiscussions: communityDiscussionsCount,
        tier,
        tripsQuota,
        tripsRemaining,
        aiCreditsUsed,
        aiCreditsQuota,
        aiCreditsRemaining,
      },
    };
  } catch (error) {
    console.error("Error fetching current profile:", error);
    return { success: false, error: "Failed to load profile" };
  }
});

/**
 * Get current authenticated user's profile with trip statistics (cached per request).
 */
export async function getCurrentProfile(): Promise<{ success: boolean; profile?: ProfileWithStats; error?: string }> {
  return getCachedProfile();
}

/**
 * Check if a username is available and valid.
 */
export async function checkUsernameAvailability(username: string): Promise<{ available: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const validation = validateUsername(username);
    if (!validation.valid || !validation.cleanUsername) {
      return { available: false, error: validation.error };
    }

    const cleanUsername = validation.cleanUsername;

    const existing = await db.profile.findUnique({
      where: { username: cleanUsername },
      select: { id: true },
    });

    // If already owned by current user, it's available for them
    if (existing && existing.id !== user?.id) {
      return { available: false, error: "Username is already taken." };
    }

    return { available: true };
  } catch (error) {
    console.error("Error checking username:", error);
    return { available: false, error: "Failed to check availability." };
  }
}

/**
 * Update authenticated user's profile and creator identity.
 */
export async function updateProfile(input: UpdateProfileInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    await syncUserProfile(user);

    const parsed = updateProfileSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Invalid profile data" };
    }

    const { fullName, username, bio, isPublic, avatarUrl } = parsed.data;

    // Get existing profile to enforce username immutability
    const existingProfile = await db.profile.findUnique({
      where: { id: user.id },
      select: { username: true },
    });

    let targetUsername = existingProfile?.username;

    // Only allow setting username if user didn't have one previously
    if (!targetUsername && username && username.trim()) {
      const validation = validateUsername(username);
      if (!validation.valid || !validation.cleanUsername) {
        return { success: false, error: validation.error };
      }
      const cleanUsername = validation.cleanUsername;

      // Uniqueness check
      const existing = await db.profile.findUnique({
        where: { username: cleanUsername },
        select: { id: true },
      });

      if (existing && existing.id !== user.id) {
        return { success: false, error: `The username "@${cleanUsername}" is already taken.` };
      }
      targetUsername = cleanUsername;
    }

    const updated = await db.profile.update({
      where: { id: user.id },
      data: {
        ...(fullName !== undefined && { fullName: fullName?.trim() || null }),
        ...(targetUsername && { username: targetUsername }),
        ...(bio !== undefined && { bio: bio?.trim() || null }),
        ...(isPublic !== undefined && { isPublic }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
    });

    try {
      if (avatarUrl !== undefined || fullName !== undefined) {
        await supabase.auth.updateUser({
          data: {
            ...(avatarUrl !== undefined && { avatar_url: avatarUrl, picture: avatarUrl }),
            ...(fullName !== undefined && { full_name: fullName }),
          },
        });
      }
    } catch (authErr) {
      console.warn("Could not sync auth user metadata:", authErr);
    }

    if (avatarUrl !== undefined) {
      try {
        await pruneUnusedUserAvatars(user.id, avatarUrl);
      } catch (cleanupErr) {
        console.warn("Storage avatar cleanup non-fatal warning in updateProfile:", cleanupErr);
      }
    }

    revalidatePath("/profile");
    if (targetUsername) {
      revalidatePath(`/u/${targetUsername}`);
    }
    revalidatePath("/forum");
    revalidatePath("/dashboard");

    return { success: true, profile: updated };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

/**
 * Update authenticated user's workspace & general preferences.
 */
export async function updateGeneralPreferences(input: UpdateGeneralPreferencesInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    await syncUserProfile(user);

    const parsed = updateGeneralPreferencesSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Invalid preferences data" };
    }

    const {
      defaultCurrency,
      aiAutoPropose,
      offlineMode,
      travelPreferences,
    } = parsed.data;

    const updated = await db.profile.update({
      where: { id: user.id },
      data: {
        defaultCurrency,
        aiAutoPropose,
        offlineMode,
        ...(travelPreferences !== undefined && { travelPreferences: travelPreferences?.trim() || null }),
      },
    });

    revalidatePath("/profile");
    revalidatePath("/trips");
    revalidatePath("/settings");

    return { success: true, profile: updated };
  } catch (error) {
    console.error("Error updating general preferences:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save preferences",
    };
  }
}

/**
 * Fetch a public creator profile by username, including their published trips.
 */
export async function getPublicCreatorProfile(username: string) {
  try {
    const cleanUsername = username.trim().toLowerCase();

    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    const profile = await db.profile.findFirst({
      where: {
        username: cleanUsername,
        OR: [
          { isPublic: true },
          { blogPosts: { some: { status: "PUBLISHED" } } },
          { trips: { some: { isPublic: true } } },
        ],
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        bio: true,
        avatarUrl: true,
        isPublic: true,
        createdAt: true,
        trips: {
          where: {
            isPublic: true,
          },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            description: true,
            destination: true,
            startDate: true,
            endDate: true,
            coverImageUrl: true,
            isTemplate: true,
            isPublic: true,
            createdAt: true,
            updatedAt: true,
            itinerary: {
              orderBy: [{ dayNumber: "asc" }, { order: "asc" }],
              select: {
                title: true,
                dayNumber: true,
                category: true,
                description: true,
                location: true,
                cost: true,
              },
            },
            accommodations: {
              select: {
                name: true,
                type: true,
                address: true,
                cost: true,
                currency: true,
              },
            },
            expenses: {
              select: { amount: true, currency: true },
            },
            checklistItems: {
              select: { title: true },
            },
            notes: {
              select: { title: true },
            },
            linkedBlogPosts: {
              where: { status: "PUBLISHED" },
              select: { slug: true, title: true },
              take: 1,
            },
          },
        },
        blogPosts: {
          where: {
            status: "PUBLISHED",
          },
          orderBy: { publishedAt: "desc" },
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            coverImageUrl: true,
            images: true,
            tags: true,
            upvotes: true,
            publishedAt: true,
            linkedTrip: {
              select: {
                id: true,
                title: true,
                destination: true,
              },
            },
          },
        },
        communityPosts: {
          orderBy: { createdAt: "desc" },
          take: 30,
          select: {
            id: true,
            slug: true,
            title: true,
            category: true,
            destination: true,
            tags: true,
            coverImageUrl: true,
            images: true,
          },
        },
      },
    });

    if (!profile) {
      return { success: false, error: "Creator profile not found or private." };
    }

    const [likes, savedPosts, currentUserTrips] = currentUser
      ? await Promise.all([
          profile.blogPosts.length > 0
            ? db.blogPostLike.findMany({
                where: {
                  profileId: currentUser.id,
                  postId: { in: profile.blogPosts.map((post) => post.id) },
                },
                select: { postId: true },
              })
            : Promise.resolve([]),
          profile.communityPosts.length > 0
            ? db.communitySavedPost.findMany({
                where: {
                  profileId: currentUser.id,
                  postId: { in: profile.communityPosts.map((post) => post.id) },
                },
                select: { postId: true },
              })
            : Promise.resolve([]),
          db.trip.findMany({
            where: { profileId: currentUser.id },
            select: {
              title: true,
              destination: true,
              notes: {
                where: { category: "ClonedTemplate" },
                select: { content: true },
              },
            },
          }),
        ])
      : [[], [], []];

    const likedPostIds = new Set(likes.map((like) => like.postId));
    const savedPostIds = new Set(savedPosts.map((savedPost) => savedPost.postId));
    const isOwnProfile = currentUser?.id === profile.id;

    return {
      success: true,
      creator: {
        id: profile.id,
        fullName: profile.fullName || profile.username || "Travel Creator",
        username: profile.username!,
        bio: profile.bio || "Passionate traveler and trip architect on Prava AI.",
        avatarUrl: profile.avatarUrl,
        memberSince: new Date(profile.createdAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        stories: profile.blogPosts.map((post) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          coverImageUrl: post.coverImageUrl,
          images: post.images || [],
          tags: post.tags,
          publishedAt: post.publishedAt,
          upvotes: post.upvotes ?? 0,
          hasLiked: likedPostIds.has(post.id),
          profile: {
            fullName: profile.fullName,
            username: profile.username,
            avatarUrl: profile.avatarUrl,
            isPublic: profile.isPublic,
          },
          linkedTrip: post.linkedTrip
            ? {
                id: post.linkedTrip.id,
                title: post.linkedTrip.title,
                destination: post.linkedTrip.destination,
              }
            : null,
        })),
        trips: profile.trips.map((t) => {
          const durationDays =
            t.startDate && t.endDate
              ? Math.max(
                  1,
                  Math.ceil(
                    (new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1
                )
              : Math.max(
                  1,
                  t.itinerary.length > 0
                    ? Math.max(...t.itinerary.map((item) => item.dayNumber || 1))
                    : 1
                );
          const expenseTotal = Math.round(
            t.expenses.reduce((total, expense) => total + (expense.amount || 0), 0) +
              t.accommodations.reduce((total, stay) => total + (stay.cost || 0), 0)
          );
          const currency =
            t.expenses.find((expense) => expense.currency)?.currency ||
            t.accommodations.find((stay) => stay.currency)?.currency ||
            "INR";
          const isCloned =
            isOwnProfile ||
            currentUserTrips.some(
              (trip) =>
                trip.notes.some((note) => note.content === t.id) ||
                trip.title.toLowerCase() === `${t.title} (plan)`.toLowerCase() ||
                (trip.title.toLowerCase() === t.title.toLowerCase() &&
                  (trip.destination || "").toLowerCase() ===
                    (t.destination || "").toLowerCase())
            );

          return {
            id: t.id,
            title: t.title,
            description: t.description,
            destination: t.destination,
            coverImageUrl: t.coverImageUrl,
            durationDays,
            isTemplate: t.isTemplate,
            isPublic: t.isPublic,
            isOwn: isOwnProfile,
            isCloned,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            author: {
              id: profile.id,
              fullName: profile.fullName,
              username: profile.username,
              avatarUrl: profile.avatarUrl,
              bio: profile.bio,
              isPublic: profile.isPublic,
            },
            metrics: {
              activityCount: t.itinerary.length,
              accommodationCount: t.accommodations.length,
              checklistCount: t.checklistItems.length,
              notesCount: t.notes.length,
              expenseTotal,
              currency,
            },
            inclusions: {
              hasStays: t.accommodations.length > 0,
              hasExpenses: expenseTotal > 0,
              hasChecklist: t.checklistItems.length > 0,
              hasNotes: t.notes.length > 0,
              hasStory: t.linkedBlogPosts.length > 0,
            },
            itinerary: t.itinerary.map((item) => ({
              day: item.dayNumber || 1,
              title: item.title,
              category: item.category,
              description: item.description,
              location: item.location,
              cost: item.cost,
            })),
            accommodations: t.accommodations.map((stay) => ({
              name: stay.name,
              type: stay.type,
              address: stay.address,
              cost: stay.cost,
              currency: stay.currency || currency,
            })),
            checklistHighlights: t.checklistItems.slice(0, 5).map((item) => item.title),
            tips: t.notes.slice(0, 4).map((note) => note.title),
            linkedStory: t.linkedBlogPosts[0]
              ? {
                  slug: t.linkedBlogPosts[0].slug,
                  title: t.linkedBlogPosts[0].title,
                }
              : null,
          };
        }),
        forumPosts: profile.communityPosts.map((post) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          category: post.category,
          destination: post.destination,
          tags: post.tags,
          coverImageUrl: post.coverImageUrl,
          images: post.images || [],
          hasSaved: savedPostIds.has(post.id),
        })),
      },
    };
  } catch (error) {
    console.error("Error loading creator profile:", error);
    return { success: false, error: "Failed to load creator profile" };
  }
}


/**
 * Lightweight query to fetch the current authenticated user's display name and avatar for the TopBar.
 */
export async function getTopBarUserInfo(): Promise<{ success: boolean; data?: TopBarUserInfo }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false };
    }

    const [profile, activeSub] = await Promise.all([
      db.profile.findUnique({
        where: { id: user.id },
        select: {
          fullName: true,
          username: true,
          avatarUrl: true,
          email: true,
          defaultCurrency: true,
          createdAt: true,
          _count: {
            select: { trips: true },
          },
        },
      }),
      db.subscription.findFirst({
        where: {
          userId: user.id,
          status: "ACTIVE",
        },
        select: { id: true },
      }),
    ]);

    const userMeta = user.user_metadata || {};
    const name =
      profile?.fullName ||
      (profile?.username ? `@${profile.username}` : null) ||
      userMeta.full_name ||
      userMeta.name ||
      user.email?.split("@")[0] ||
      "Traveler";

    const avatarUrl =
      profile?.avatarUrl ||
      userMeta.avatar_url ||
      userMeta.picture ||
      null;

    const tier = activeSub ? "pro" : "free";

    return {
      success: true,
      data: {
        name,
        email: profile?.email || user.email || null,
        avatarUrl,
        username: profile?.username || null,
        tier,
        defaultCurrency: profile?.defaultCurrency || "INR",
        totalTrips: profile?._count?.trips ?? 0,
        memberSince: profile?.createdAt
          ? new Date(profile.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          : undefined,
      },
    };
  } catch (err) {
    console.error("Error fetching top bar user info:", err);
    return { success: false };
  }
}

/**
 * Permanently deletes the authenticated user's account and all associated data.
 * Validates the email OTP before cascading deletion across Storage, PostgreSQL, and Supabase Auth.
 */
export async function deleteAccountAction(otpToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return { success: false, error: "Unauthorized. Please sign in again." };
    }

    if (!otpToken || otpToken.trim().length !== 6) {
      return { success: false, error: "Please provide a valid 6-digit verification code." };
    }

    // 1. Verify OTP with Supabase Auth
    const { error: otpError } = await supabase.auth.verifyOtp({
      email: user.email,
      token: otpToken.trim(),
      type: "email",
    });

    if (otpError) {
      return {
        success: false,
        error: otpError.message || "Invalid or expired verification code. Please request a new code.",
      };
    }

    const userId = user.id;

    // 2. Purge user files from Supabase Storage
    try {
      await deleteUserStorageFolder(userId);
    } catch (storageErr) {
      console.warn("Storage deletion warning during account delete:", storageErr);
    }

    // 3. Delete Profile from Prisma database (PostgreSQL cascades and deletes all trips, expenses, stories, posts, etc.)
    try {
      await db.profile.delete({
        where: { id: userId },
      });
    } catch (dbErr) {
      console.error("Prisma profile delete error:", dbErr);
    }

    // 4. Delete Auth User from Supabase Auth via Admin Client
    try {
      const adminClient = createAdminClient();
      await adminClient.auth.admin.deleteUser(userId);
    } catch (adminErr) {
      console.error("Supabase admin deleteUser error:", adminErr);
    }

    // 5. Sign out of active session
    await supabase.auth.signOut();

    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Fatal error during account deletion:", error);
    return {
      success: false,
      error: "An unexpected error occurred while deleting your account. Please try again.",
    };
  }
}

