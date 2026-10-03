"use server";

import { revalidatePath } from "next/cache";

import { Pool } from "pg";

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

// Shared connection pool singleton for forum SQL queries to prevent connection exhaustion
const globalForPg = globalThis as unknown as { pgPool?: Pool };
const pool =
  globalForPg.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}

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
 * Fetch forum discussions with author profiles, attached trips, and reply counts
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

    const conditions: string[] = [];
    const values: unknown[] = [];

    if (category && category !== "ALL") {
      values.push(category);
      conditions.push(`cp.category = $${values.length}`);
    }

    if (searchQuery && searchQuery.trim()) {
      values.push(`%${searchQuery.trim().toLowerCase()}%`);
      const searchIdx = values.length;
      conditions.push(
        `(LOWER(cp.title) LIKE $${searchIdx} OR LOWER(cp.content) LIKE $${searchIdx} OR LOWER(COALESCE(cp.destination, '')) LIKE $${searchIdx})`
      );
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const upvoteSubquery = currentUserId
      ? `EXISTS (SELECT 1 FROM community_post_upvotes cpu WHERE cpu.post_id = cp.id AND cpu.profile_id = '${currentUserId}')`
      : `false`;

    const savedSubquery = currentUserId
      ? `EXISTS (SELECT 1 FROM community_saved_posts csp WHERE csp.post_id = cp.id AND csp.profile_id = '${currentUserId}')`
      : `false`;

    const isAuthorSubquery = currentUserId
      ? `(cp.profile_id = '${currentUserId}')`
      : `false`;

    const sql = `
      SELECT 
        cp.id,
        cp.slug,
        cp.profile_id,
        cp.title,
        cp.content,
        cp.category,
        cp.destination,
        cp.tags,
        cp.cover_image_url,
        cp.images,
        cp.is_edited,
        cp.upvotes,
        cp.views,
        cp.created_at,
        p.full_name AS author_name,
        p.username AS author_username,
        p.avatar_url AS author_avatar_url,
        p.is_public AS is_creator_public,
        p.bio AS author_bio,
        t.id AS trip_id,
        t.title AS trip_title,
        t.destination AS trip_destination,
        t.start_date AS trip_start_date,
        t.end_date AS trip_end_date,
        t.cover_image_url AS trip_cover_image_url,
        (SELECT COUNT(*)::int FROM community_replies cr WHERE cr.post_id = cp.id) AS replies_count,
        ${upvoteSubquery} AS has_upvoted,
        ${savedSubquery} AS has_saved,
        ${isAuthorSubquery} AS is_author
      FROM community_posts cp
      LEFT JOIN profiles p ON cp.profile_id = p.id
      LEFT JOIN trips t ON cp.linked_trip_id = t.id
      ${whereClause}
      ORDER BY cp.created_at DESC
      LIMIT 50;
    `;

    const res = await pool.query(sql, values);

    return res.rows.map((row) => {
      let linkedTrip = null;
      if (row.trip_id) {
        const days =
          row.trip_start_date && row.trip_end_date
            ? Math.max(
                1,
                Math.ceil(
                  (new Date(row.trip_end_date).getTime() -
                    new Date(row.trip_start_date).getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1
              )
            : 5;

        linkedTrip = {
          id: row.trip_id,
          title: row.trip_title,
          destination: row.trip_destination || "Global",
          durationDays: days,
          activityCount: 4,
          accommodationCount: 1,
          coverImageUrl: row.trip_cover_image_url,
        };
      }

      return {
        id: row.id,
        slug: row.slug || row.id,
        authorId: row.profile_id,
        title: row.title,
        content: row.content,
        category: row.category as ForumCategory,
        categoryLabel: getCategoryLabel(row.category),
        tags: Array.isArray(row.tags) ? row.tags : [],
        destination: row.destination,
        coverImageUrl: row.cover_image_url || (row.images && row.images[0]) || null,
        images: Array.isArray(row.images) ? row.images : [],
        isEdited: Boolean(row.is_edited),
        authorName: row.author_name || row.author_username || "Traveler",
        authorUsername: row.author_username,
        authorAvatarUrl: row.author_avatar_url,
        isCreatorPublic: Boolean(row.is_creator_public),
        authorBio: row.author_bio,
        createdAt: formatRelativeTime(row.created_at),
        upvotes: Number(row.upvotes) || 0,
        views: Number(row.views) || 0,
        repliesCount: Number(row.replies_count) || 0,
        hasUpvoted: Boolean(row.has_upvoted),
        hasSaved: Boolean(row.has_saved),
        isAuthor: Boolean(row.is_author),
        linkedTrip,
      };
    });
  } catch (error) {
    console.error("Error fetching forum discussions:", error);
    return [];
  }
}

/**
 * Fetch a single discussion thread by slug or UUID
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

    const updateCondition = isValidUuid ? "id = $1 OR slug = $1" : "slug = $1";

    // Increment view count safely without invalid table alias
    try {
      await pool.query(`UPDATE community_posts SET views = views + 1 WHERE ${updateCondition}`, [
        decoded,
      ]);
    } catch (viewError) {
      console.warn("Non-fatal error incrementing discussion views:", viewError);
    }

    const upvoteSubquery = currentUserId
      ? `EXISTS (SELECT 1 FROM community_post_upvotes cpu WHERE cpu.post_id = cp.id AND cpu.profile_id = '${currentUserId}')`
      : `false`;

    const savedSubquery = currentUserId
      ? `EXISTS (SELECT 1 FROM community_saved_posts csp WHERE csp.post_id = cp.id AND csp.profile_id = '${currentUserId}')`
      : `false`;

    const isAuthorSubquery = currentUserId
      ? `(cp.profile_id = '${currentUserId}')`
      : `false`;

    const selectCondition = isValidUuid
      ? "cp.id = $1::uuid OR LOWER(cp.slug) = LOWER($1)"
      : "LOWER(cp.slug) = LOWER($1)";

    const postSql = `
      SELECT 
        cp.id,
        cp.slug,
        cp.profile_id,
        cp.title,
        cp.content,
        cp.category,
        cp.destination,
        cp.tags,
        cp.cover_image_url,
        cp.images,
        cp.is_edited,
        cp.upvotes,
        cp.views,
        cp.created_at,
        p.full_name AS author_name,
        p.username AS author_username,
        p.avatar_url AS author_avatar_url,
        p.is_public AS is_creator_public,
        p.bio AS author_bio,
        t.id AS trip_id,
        t.title AS trip_title,
        t.destination AS trip_destination,
        t.start_date AS trip_start_date,
        t.end_date AS trip_end_date,
        t.cover_image_url AS trip_cover_image_url,
        ${upvoteSubquery} AS has_upvoted,
        ${savedSubquery} AS has_saved,
        ${isAuthorSubquery} AS is_author
      FROM community_posts cp
      LEFT JOIN profiles p ON cp.profile_id = p.id
      LEFT JOIN trips t ON cp.linked_trip_id = t.id
      WHERE ${selectCondition};
    `;

    const postRes = await pool.query(postSql, [decoded]);
    if (postRes.rows.length === 0) return null;
    const row = postRes.rows[0];

    // Fetch replies
    const repliesSql = `
      SELECT 
        cr.id,
        cr.post_id,
        cr.profile_id,
        cr.content,
        cr.upvotes,
        cr.is_edited,
        cr.created_at,
        p.full_name AS author_name,
        p.username AS author_username,
        p.avatar_url AS author_avatar_url,
        p.is_public AS is_creator_public,
        ${currentUserId ? `(cr.profile_id = '${currentUserId}')` : `false`} AS is_author
      FROM community_replies cr
      LEFT JOIN profiles p ON cr.profile_id = p.id
      WHERE cr.post_id = $1
      ORDER BY cr.created_at DESC;
    `;

    const repliesRes = await pool.query(repliesSql, [row.id]);

    const replies: ForumReply[] = repliesRes.rows.map((r) => ({
      id: r.id,
      postId: r.post_id,
      authorId: r.profile_id,
      authorName: r.author_name || r.author_username || "Traveler",
      authorUsername: r.author_username,
      authorAvatarUrl: r.author_avatar_url,
      isCreatorPublic: Boolean(r.is_creator_public),
      content: r.content,
      createdAt: formatRelativeTime(r.created_at),
      upvotes: Number(r.upvotes) || 0,
      isEdited: Boolean(r.is_edited),
      isAuthor: Boolean(r.is_author),
    }));

    let linkedTrip = null;
    if (row.trip_id) {
      const days =
        row.trip_start_date && row.trip_end_date
          ? Math.max(
              1,
              Math.ceil(
                (new Date(row.trip_end_date).getTime() -
                  new Date(row.trip_start_date).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) + 1
            )
          : 5;

      linkedTrip = {
        id: row.trip_id,
        title: row.trip_title,
        destination: row.trip_destination || "Global",
        durationDays: days,
        activityCount: 4,
        accommodationCount: 1,
        coverImageUrl: row.trip_cover_image_url,
      };
    }

    return {
      id: row.id,
      slug: row.slug || row.id,
      authorId: row.profile_id,
      title: row.title,
      content: row.content,
      category: row.category as ForumCategory,
      categoryLabel: getCategoryLabel(row.category),
      tags: Array.isArray(row.tags) ? row.tags : [],
      destination: row.destination,
      coverImageUrl: row.cover_image_url || (row.images && row.images[0]) || null,
      images: Array.isArray(row.images) ? row.images : [],
      isEdited: Boolean(row.is_edited),
      authorName: row.author_name || row.author_username || "Traveler",
      authorUsername: row.author_username,
      authorAvatarUrl: row.author_avatar_url,
      isCreatorPublic: Boolean(row.is_creator_public),
      authorBio: row.author_bio,
      createdAt: formatRelativeTime(row.created_at),
      upvotes: Number(row.upvotes) || 0,
      views: Number(row.views) || 0,
      repliesCount: replies.length,
      hasUpvoted: Boolean(row.has_upvoted),
      hasSaved: Boolean(row.has_saved),
      isAuthor: Boolean(row.is_author),
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
