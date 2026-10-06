"use server";

import { revalidatePath } from "next/cache";

import { syncUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeTime, generateSlug } from "@/lib/utils";

import type {
  CreateDiscussionInput,
  ForumCategory,
  ForumPost,
  ForumReply,
  SaveTipToTripInput,
  UpdateDiscussionInput,
  UserTripOption,
} from "@/features/community/forum-types";

/**
 * Format category identifier to human-readable label
 */
function getCategoryLabel(category: string): string {
  switch (category) {
    case "ROUTE_ADVICE":
      return "Route Advice";
    case "RECOMMENDATIONS":
      return "Recommendations";
    case "PACKING_GEAR":
      return "Gear & Packing";
    case "LIVE_REPORTS":
      return "Live Trip Reports";
    case "TEMPLATES":
      return "Itineraries & Blueprints";
    case "DISCUSSIONS":
    default:
      return "General Discussion";
  }
}

/**
 * Fetch forum discussions with author profiles, attached trips, and reply counts using Prisma
 */
export async function getForumDiscussions(
  category?: ForumCategory,
  searchQuery?: string
): Promise<ForumPost[]> {
  try {
    let currentUserId: string | null = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      currentUserId = data.user?.id || null;
    } catch {
      currentUserId = null;
    }

    const trimmedSearch = searchQuery?.trim();

    const posts = await db.communityPost.findMany({
      where: {
        ...(category && category !== "ALL" ? { category } : {}),
        ...(trimmedSearch
          ? {
              OR: [
                { title: { contains: trimmedSearch, mode: "insensitive" } },
                { content: { contains: trimmedSearch, mode: "insensitive" } },
                { destination: { contains: trimmedSearch, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        profile: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            isPublic: true,
            bio: true,
          },
        },
        linkedTrip: {
          select: {
            id: true,
            title: true,
            destination: true,
            startDate: true,
            endDate: true,
            coverImageUrl: true,
          },
        },
        _count: {
          select: { replies: true },
        },
        ...(currentUserId
          ? {
              upvoteRecords: {
                where: { profileId: currentUserId },
                select: { profileId: true },
              },
              savedRecords: {
                where: { profileId: currentUserId },
                select: { profileId: true },
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return posts.map((post) => {
      let linkedTrip = null;
      if (post.linkedTrip) {
        const days =
          post.linkedTrip.startDate && post.linkedTrip.endDate
            ? Math.max(
                1,
                Math.ceil(
                  (new Date(post.linkedTrip.endDate).getTime() -
                    new Date(post.linkedTrip.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1
              )
            : 5;

        linkedTrip = {
          id: post.linkedTrip.id,
          title: post.linkedTrip.title,
          destination: post.linkedTrip.destination || "Global",
          durationDays: days,
          activityCount: 4,
          accommodationCount: 1,
          coverImageUrl: post.linkedTrip.coverImageUrl,
        };
      }

      return {
        id: post.id,
        slug: post.slug || post.id,
        authorId: post.profileId,
        title: post.title,
        content: post.content,
        category: post.category as ForumCategory,
        categoryLabel: getCategoryLabel(post.category),
        tags: Array.isArray(post.tags) ? post.tags : [],
        destination: post.destination,
        coverImageUrl: post.coverImageUrl || (post.images && post.images[0]) || null,
        images: Array.isArray(post.images) ? post.images : [],
        isEdited: Boolean(post.isEdited),
        authorName: post.profile?.fullName || post.profile?.username || "Traveler",
        authorUsername: post.profile?.username || null,
        authorAvatarUrl: post.profile?.avatarUrl || null,
        isCreatorPublic: Boolean(post.profile?.isPublic),
        authorBio: post.profile?.bio || null,
        createdAt: post.createdAt ? formatRelativeTime(post.createdAt) : "Just now",
        upvotes: Number(post.upvotes) || 0,
        views: Number(post.views) || 0,
        repliesCount: Number(post._count.replies) || 0,
        hasUpvoted: Boolean(post.upvoteRecords && post.upvoteRecords.length > 0),
        hasSaved: Boolean(post.savedRecords && post.savedRecords.length > 0),
        isAuthor: Boolean(currentUserId && post.profileId === currentUserId),
        linkedTrip,
      };
    });
  } catch (error) {
    console.error("Error fetching forum discussions:", error);
    return [];
  }
}

/**
 * Fetch a single discussion thread by slug or UUID using Prisma
 */
export async function getForumPostBySlug(slugOrId: string): Promise<ForumPost | null> {
  try {
    let currentUserId: string | null = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      currentUserId = data.user?.id || null;
    } catch {
      currentUserId = null;
    }

    const decoded = decodeURIComponent(slugOrId).trim();
    const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      decoded
    );

    // Increment view count safely in background
    try {
      await db.communityPost.updateMany({
        where: isValidUuid ? { OR: [{ id: decoded }, { slug: decoded }] } : { slug: decoded },
        data: { views: { increment: 1 } },
      });
    } catch (viewError) {
      console.warn("Non-fatal error incrementing discussion views:", viewError);
    }

    const post = await db.communityPost.findFirst({
      where: isValidUuid
        ? {
            OR: [
              { id: decoded },
              { slug: { equals: decoded, mode: "insensitive" } },
            ],
          }
        : { slug: { equals: decoded, mode: "insensitive" } },
      include: {
        profile: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            isPublic: true,
            bio: true,
          },
        },
        linkedTrip: {
          select: {
            id: true,
            title: true,
            destination: true,
            startDate: true,
            endDate: true,
            coverImageUrl: true,
          },
        },
        replies: {
          include: {
            profile: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true,
                isPublic: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        ...(currentUserId
          ? {
              upvoteRecords: {
                where: { profileId: currentUserId },
                select: { profileId: true },
              },
              savedRecords: {
                where: { profileId: currentUserId },
                select: { profileId: true },
              },
            }
          : {}),
      },
    });

    if (!post) return null;

    const replies: ForumReply[] = post.replies.map((r) => ({
      id: r.id,
      postId: r.postId,
      authorId: r.profileId,
      authorName: r.profile?.fullName || r.profile?.username || "Traveler",
      authorUsername: r.profile?.username || null,
      authorAvatarUrl: r.profile?.avatarUrl || null,
      isCreatorPublic: Boolean(r.profile?.isPublic),
      content: r.content,
      createdAt: r.createdAt ? formatRelativeTime(r.createdAt) : "Just now",
      upvotes: Number(r.upvotes) || 0,
      isEdited: Boolean(r.isEdited),
      isAuthor: Boolean(currentUserId && r.profileId === currentUserId),
    }));

    let linkedTrip = null;
    if (post.linkedTrip) {
      const days =
        post.linkedTrip.startDate && post.linkedTrip.endDate
          ? Math.max(
              1,
              Math.ceil(
                (new Date(post.linkedTrip.endDate).getTime() -
                  new Date(post.linkedTrip.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) + 1
            )
          : 5;

      linkedTrip = {
        id: post.linkedTrip.id,
        title: post.linkedTrip.title,
        destination: post.linkedTrip.destination || "Global",
        durationDays: days,
        activityCount: 4,
        accommodationCount: 1,
        coverImageUrl: post.linkedTrip.coverImageUrl,
      };
    }

    return {
      id: post.id,
      slug: post.slug || post.id,
      authorId: post.profileId,
      title: post.title,
      content: post.content,
      category: post.category as ForumCategory,
      categoryLabel: getCategoryLabel(post.category),
      tags: Array.isArray(post.tags) ? post.tags : [],
      destination: post.destination,
      coverImageUrl: post.coverImageUrl || (post.images && post.images[0]) || null,
      images: Array.isArray(post.images) ? post.images : [],
      isEdited: Boolean(post.isEdited),
      authorName: post.profile?.fullName || post.profile?.username || "Traveler",
      authorUsername: post.profile?.username || null,
      authorAvatarUrl: post.profile?.avatarUrl || null,
      isCreatorPublic: Boolean(post.profile?.isPublic),
      authorBio: post.profile?.bio || null,
      createdAt: post.createdAt ? formatRelativeTime(post.createdAt) : "Just now",
      upvotes: Number(post.upvotes) || 0,
      views: Number(post.views) || 0,
      repliesCount: replies.length,
      hasUpvoted: Boolean(post.upvoteRecords && post.upvoteRecords.length > 0),
      hasSaved: Boolean(post.savedRecords && post.savedRecords.length > 0),
      isAuthor: Boolean(currentUserId && post.profileId === currentUserId),
      replies,
      linkedTrip,
    };
  } catch (error) {
    console.error("Error fetching forum post by slug:", error);
    return null;
  }
}

/**
 * Backward compatible alias for getForumThread
 */
export async function getForumThread(postId: string): Promise<ForumPost | null> {
  return getForumPostBySlug(postId);
}

/**
 * Create a real forum discussion with auto-generated slug
 */
export async function createForumDiscussion(input: CreateDiscussionInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Please sign in to start a discussion." };
    }

    const profile = await syncUserProfile(user);

    if (!input.title || input.title.trim().length < 5) {
      return { success: false, error: "Title must be at least 5 characters long." };
    }

    if (!input.content || input.content.trim().length < 10) {
      return { success: false, error: "Description must be at least 10 characters long." };
    }

    // Generate unique slug
    const shortId = Math.random().toString(36).substring(2, 8);
    const baseSlug = generateSlug(input.title).replace(/-+$/, "");
    const slug = `${baseSlug || "discussion"}-${shortId}`;

    const post = await db.communityPost.create({
      data: {
        profileId: profile.id,
        slug,
        title: input.title.trim(),
        content: input.content.trim(),
        category: input.category || "DISCUSSIONS",
        destination: input.destination?.trim() || null,
        tags: input.tags || [],
        images: input.images || [],
        coverImageUrl: input.coverImageUrl || (input.images && input.images[0]) || null,
        linkedTripId: input.linkedTripId || null,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    revalidatePath("/forum");
    return { success: true, postId: post.id, slug: post.slug || slug };
  } catch (error) {
    console.error("Error creating forum discussion:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish discussion.",
    };
  }
}

/**
 * Update a forum discussion (Author only)
 */
export async function updateForumDiscussion(postId: string, input: UpdateDiscussionInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Please sign in to edit this discussion." };
    }

    const profile = await syncUserProfile(user);

    // Verify ownership
    const post = await db.communityPost.findUnique({
      where: { id: postId },
      select: { profileId: true, slug: true },
    });

    if (!post) {
      return { success: false, error: "Discussion not found." };
    }

    if (post.profileId !== profile.id) {
      return { success: false, error: "You can only edit your own discussions." };
    }

    const updated = await db.communityPost.update({
      where: { id: postId },
      data: {
        title: input.title.trim(),
        content: input.content.trim(),
        category: input.category,
        destination: input.destination?.trim() || null,
        tags: input.tags || [],
        images: input.images || [],
        coverImageUrl: input.coverImageUrl || (input.images && input.images[0]) || null,
        linkedTripId: input.linkedTripId || null,
        isEdited: true,
      },
      select: { slug: true },
    });

    revalidatePath("/forum");
    if (updated.slug) {
      revalidatePath(`/forum/${updated.slug}`);
    }

    return { success: true, slug: updated.slug };
  } catch (error) {
    console.error("Error updating forum discussion:", error);
    return { success: false, error: "Failed to update discussion." };
  }
}

/**
 * Delete a forum discussion (Author only)
 */
export async function deleteForumDiscussion(postId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Please sign in to delete this discussion." };
    }

    const profile = await syncUserProfile(user);

    const post = await db.communityPost.findUnique({
      where: { id: postId },
      select: { profileId: true },
    });

    if (!post) {
      return { success: false, error: "Discussion not found." };
    }

    if (post.profileId !== profile.id) {
      return { success: false, error: "You can only delete your own discussions." };
    }

    await db.communityPost.delete({
      where: { id: postId },
    });

    revalidatePath("/forum");
    return { success: true };
  } catch (error) {
    console.error("Error deleting forum discussion:", error);
    return { success: false, error: "Failed to delete discussion." };
  }
}

/**
 * Post a real reply to a discussion
 */
export async function postForumReply(postId: string, content: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Please sign in to reply." };
    }

    if (!content || content.trim().length < 2) {
      return { success: false, error: "Reply cannot be empty." };
    }

    const profile = await syncUserProfile(user);

    const reply = await db.communityReply.create({
      data: {
        postId,
        profileId: profile.id,
        content: content.trim(),
      },
      include: {
        post: {
          select: { slug: true },
        },
      },
    });

    revalidatePath("/forum");
    if (reply.post?.slug) {
      revalidatePath(`/forum/${reply.post.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error posting forum reply:", error);
    return { success: false, error: "Failed to post reply." };
  }
}

/**
 * Update a reply (Author only)
 */
export async function updateForumReply(replyId: string, content: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Please sign in to edit your reply." };
    }

    if (!content || content.trim().length < 2) {
      return { success: false, error: "Reply cannot be empty." };
    }

    const profile = await syncUserProfile(user);

    const reply = await db.communityReply.findUnique({
      where: { id: replyId },
      include: {
        post: {
          select: { slug: true },
        },
      },
    });

    if (!reply) {
      return { success: false, error: "Reply not found." };
    }

    if (reply.profileId !== profile.id) {
      return { success: false, error: "You can only edit your own replies." };
    }

    await db.communityReply.update({
      where: { id: replyId },
      data: {
        content: content.trim(),
        isEdited: true,
      },
    });

    revalidatePath("/forum");
    if (reply.post?.slug) {
      revalidatePath(`/forum/${reply.post.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating reply:", error);
    return { success: false, error: "Failed to update reply." };
  }
}

/**
 * Delete a reply (Author only)
 */
export async function deleteForumReply(replyId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Please sign in to delete your reply." };
    }

    const profile = await syncUserProfile(user);

    const reply = await db.communityReply.findUnique({
      where: { id: replyId },
      include: {
        post: {
          select: { slug: true },
        },
      },
    });

    if (!reply) {
      return { success: false, error: "Reply not found." };
    }

    if (reply.profileId !== profile.id) {
      return { success: false, error: "You can only delete your own replies." };
    }

    await db.communityReply.delete({
      where: { id: replyId },
    });

    revalidatePath("/forum");
    if (reply.post?.slug) {
      revalidatePath(`/forum/${reply.post.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting reply:", error);
    return { success: false, error: "Failed to delete reply." };
  }
}

/**
 * Toggle upvote for a discussion
 */
export async function toggleForumPostUpvote(postId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Please sign in to upvote." };
    }

    const profile = await syncUserProfile(user);

    const existing = await db.communityPostUpvote.findUnique({
      where: {
        profileId_postId: {
          profileId: profile.id,
          postId,
        },
      },
    });

    if (existing) {
      await db.$transaction([
        db.communityPostUpvote.delete({
          where: {
            profileId_postId: {
              profileId: profile.id,
              postId,
            },
          },
        }),
        db.communityPost.update({
          where: { id: postId },
          data: {
            upvotes: { decrement: 1 },
          },
        }),
      ]);

      revalidatePath("/forum");
      return { success: true, hasUpvoted: false };
    } else {
      await db.$transaction([
        db.communityPostUpvote.create({
          data: {
            profileId: profile.id,
            postId,
          },
        }),
        db.communityPost.update({
          where: { id: postId },
          data: {
            upvotes: { increment: 1 },
          },
        }),
      ]);

      revalidatePath("/forum");
      return { success: true, hasUpvoted: true };
    }
  } catch (error) {
    console.error("Error toggling upvote:", error);
    return { success: false, error: "Failed to update upvote." };
  }
}

/**
 * Toggle bookmark / save discussion
 */
export async function toggleSaveDiscussion(postId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Please sign in to bookmark discussions." };
    }

    const profile = await syncUserProfile(user);

    const existing = await db.communitySavedPost.findUnique({
      where: {
        profileId_postId: {
          profileId: profile.id,
          postId,
        },
      },
    });

    if (existing) {
      await db.communitySavedPost.delete({
        where: {
          profileId_postId: {
            profileId: profile.id,
            postId,
          },
        },
      });

      revalidatePath("/forum");
      return { success: true, hasSaved: false };
    } else {
      await db.communitySavedPost.create({
        data: {
          profileId: profile.id,
          postId,
        },
      });

      revalidatePath("/forum");
      return { success: true, hasSaved: true };
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { success: false, error: "Failed to bookmark discussion." };
  }
}

/**
 * THE WORKSPACE BRIDGE: Save a community tip/advice directly into a user's Trip Notes!
 */
export async function saveForumTipToTripNote(input: SaveTipToTripInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Please sign in to save this tip." };
    }

    const profile = await syncUserProfile(user);

    // Verify trip ownership
    const trip = await db.trip.findFirst({
      where: { id: input.tripId, profileId: profile.id },
      select: { id: true, title: true },
    });

    if (!trip) {
      return { success: false, error: "Target trip not found in your workspace." };
    }

    const noteContent = `${input.tipContent.trim()}\n\n---\n*Community Tip via Prava Forum on "${input.sourceTitle}" (by @${input.authorName})*`;

    await db.note.create({
      data: {
        tripId: trip.id,
        title: `Tip: ${input.sourceTitle.slice(0, 45)}...`,
        content: noteContent,
        category: "Advice",
        isPinned: false,
      },
    });

    revalidatePath(`/trips/${trip.id}/notes`);
    return { success: true, tripTitle: trip.title };
  } catch (error) {
    console.error("Error saving tip to trip note:", error);
    return { success: false, error: "Failed to save tip to your trip workspace." };
  }
}

/**
 * Fetch authenticated user's workspace trips to attach to a discussion or save tips to
 */
export async function getUserTripsForDiscussion(): Promise<UserTripOption[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const profile = await syncUserProfile(user);

    const trips = await db.trip.findMany({
      where: { profileId: profile.id },
      select: {
        id: true,
        title: true,
        destination: true,
        startDate: true,
        endDate: true,
        coverImageUrl: true,
        _count: {
          select: { itinerary: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return trips.map((t) => ({
      id: t.id,
      title: t.title,
      destination: t.destination,
      startDate: t.startDate ? t.startDate.toISOString() : null,
      endDate: t.endDate ? t.endDate.toISOString() : null,
      activityCount: t._count.itinerary,
      coverImageUrl: t.coverImageUrl,
    }));
  } catch (error) {
    console.error("Error fetching user trips for forum:", error);
    return [];
  }
}
