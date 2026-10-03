"use server";

import { revalidatePath } from "next/cache";

import { syncUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";

import { blogPostSchema, type BlogPostInput } from "./schema";
import type { StoryItem } from "./types";

/**
 * Internal helper to authenticate the current user.
 */
async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

/**
 * Internal helper to resolve unique, collision-free URL slugs.
 */
async function resolveUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let attempt = 0;
  while (true) {
    const existing = await db.blogPost.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) break;
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }
  return slug;
}

/**
 * Create a new blog post (draft by default).
 */
export async function createBlogPost(input: BlogPostInput) {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const profile = await syncUserProfile(user);

    const parsed = blogPostSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid blog post data",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { title, excerpt, content, coverImageUrl, images, tags, status, linkedTripId } = parsed.data;
    const baseSlug = parsed.data.slug || generateSlug(title);
    const slug = await resolveUniqueSlug(baseSlug);
    const isPublishing = status === "PUBLISHED";

    const post = await db.blogPost.create({
      data: {
        profileId: profile.id,
        slug,
        title: title.trim(),
        excerpt: excerpt?.trim() || null,
        content,
        coverImageUrl: coverImageUrl || (images && images[0]) || null,
        images: images || [],
        tags: tags || [],
        status: status || "DRAFT",
        linkedTripId: linkedTripId || null,
        publishedAt: isPublishing ? new Date() : null,
      },
    });

    revalidatePath("/stories");
    revalidatePath("/profile");

    return { success: true, post };
  } catch (error) {
    console.error("Error creating blog post:", error);
    return { success: false, error: "Failed to create blog post" };
  }
}

/**
 * Update an existing blog post.
 */
export async function updateBlogPost(postId: string, input: BlogPostInput) {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const profile = await syncUserProfile(user);

    const existing = await db.blogPost.findFirst({
      where: { id: postId, profileId: profile.id },
    });

    if (!existing) {
      return { success: false, error: "Blog post not found or permission denied" };
    }

    const parsed = blogPostSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Invalid blog post data" };
    }

    const { title, excerpt, content, coverImageUrl, images, tags, status, linkedTripId } = parsed.data;

    let slug = existing.slug;
    if (parsed.data.slug && parsed.data.slug !== existing.slug) {
      slug = await resolveUniqueSlug(parsed.data.slug, postId);
    }

    const wasPublished = existing.status === "PUBLISHED";
    const isPublishing = status === "PUBLISHED";

    const post = await db.blogPost.update({
      where: { id: postId },
      data: {
        slug,
        title: title.trim(),
        excerpt: excerpt?.trim() || null,
        content,
        coverImageUrl: coverImageUrl || (images && images[0]) || null,
        images: images || [],
        tags: tags || [],
        status: status || existing.status,
        linkedTripId: linkedTripId || null,
        publishedAt: isPublishing && !wasPublished ? new Date() : existing.publishedAt,
      },
    });

    revalidatePath("/stories");
    revalidatePath(`/stories/${post.slug}`);
    revalidatePath("/profile");

    return { success: true, post };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { success: false, error: "Failed to update blog post" };
  }
}

/**
 * Delete a blog post.
 */
export async function deleteBlogPost(postId: string) {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const post = await db.blogPost.findFirst({
      where: { id: postId, profileId: user.id },
    });

    if (!post) {
      return { success: false, error: "Blog post not found or permission denied" };
    }

    await db.blogPost.delete({ where: { id: postId } });

    revalidatePath("/stories");
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { success: false, error: "Failed to delete blog post" };
  }
}

/**
 * Fetch the current user's blog posts (all statuses).
 */
export async function getMyBlogPosts() {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized", posts: [] };

    const posts = await db.blogPost.findMany({
      where: { profileId: user.id },
      include: {
        linkedTrip: { select: { id: true, title: true, destination: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return { success: true, posts };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { success: false, error: "Failed to load blog posts", posts: [] };
  }
}

/**
 * Fetch a single blog post by slug OR ID for the owner (editing).
 */
export async function getBlogPostForEdit(slugOrId: string) {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    const post = await db.blogPost.findFirst({
      where: {
        AND: [
          { profileId: user.id },
          {
            OR: [
              { slug: slugOrId },
              ...(isValidUuid ? [{ id: slugOrId }] : []),
            ],
          },
        ],
      },
      include: {
        linkedTrip: { select: { id: true, title: true, destination: true } },
      },
    });

    if (!post) {
      return { success: false, error: "Blog post not found" };
    }

    return { success: true, post };
  } catch (error) {
    console.error("Error fetching blog post for edit:", error);
    return { success: false, error: "Failed to load blog post" };
  }
}

/**
 * Fetch a story by slug OR id (public if published, or accessible to the author if draft).
 */
export async function getPublishedStory(slugOrId: string) {
  try {
    if (!slugOrId) {
      return { success: false, error: "Invalid story identifier" };
    }

    const user = await getAuthUser();
    const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    const post = await db.blogPost.findFirst({
      where: {
        AND: [
          {
            OR: [
              { slug: slugOrId },
              ...(isValidUuid ? [{ id: slugOrId }] : []),
            ],
          },
          {
            OR: [
              { status: "PUBLISHED" },
              ...(user ? [{ profileId: user.id }] : []),
            ],
          },
        ],
      },
      include: {
        profile: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            bio: true,
            isPublic: true,
          },
        },
        linkedTrip: {
          select: {
            id: true,
            title: true,
            destination: true,
            coverImageUrl: true,
            isPublic: true,
          },
        },
      },
    });

    if (!post) {
      return { success: false, error: "Story not found" };
    }

    let hasLiked = false;
    if (user) {
      const like = await db.blogPostLike.findUnique({
        where: {
          profileId_postId: {
            profileId: user.id,
            postId: post.id,
          },
        },
      });
      hasLiked = Boolean(like);
    }

    return {
      success: true,
      story: {
        ...post,
        upvotes: post.upvotes ?? 0,
        hasLiked,
      },
    };
  } catch (error) {
    console.error("Error fetching published story:", error);
    return { success: false, error: "Failed to load story" };
  }
}

/**
 * Fetch all published stories for public discovery.
 */
export async function getAllPublishedStories() {
  try {
    const user = await getAuthUser();
    const posts = await db.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: {
        profile: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            bio: true,
            isPublic: true,
          },
        },
        linkedTrip: {
          select: {
            id: true,
            title: true,
            destination: true,
          },
        },
      },
      orderBy: { publishedAt: "desc" },
    });

    let likedPostIds = new Set<string>();
    if (user && posts.length > 0) {
      try {
        const likes = await db.blogPostLike.findMany({
          where: {
            profileId: user.id,
            postId: { in: posts.map((p) => p.id) },
          },
          select: { postId: true },
        });
        likedPostIds = new Set(likes.map((l) => l.postId));
      } catch (err) {
        console.warn("Could not query user story likes:", err);
      }
    }

    const stories: StoryItem[] = posts.map((post) => {
      const hasLiked = likedPostIds.has(post.id);
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImageUrl: post.coverImageUrl,
        images: post.images || [],
        tags: post.tags,
        status: post.status,
        upvotes: post.upvotes ?? 0,
        hasLiked,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
        profile: post.profile
          ? {
              fullName: post.profile.fullName,
              username: post.profile.username,
              avatarUrl: post.profile.avatarUrl,
              isPublic: post.profile.isPublic,
              bio: post.profile.bio,
            }
          : null,
        linkedTrip: post.linkedTrip
          ? {
              id: post.linkedTrip.id,
              title: post.linkedTrip.title,
              destination: post.linkedTrip.destination,
            }
          : null,
      };
    });

    return { success: true, stories };
  } catch (error) {
    console.error("Error fetching published stories:", error);
    return { success: false, error: "Failed to load stories", stories: [] };
  }
}

/**
 * Toggle a story between DRAFT and PUBLISHED status.
 */
export async function toggleStoryPublishStatus(postId: string) {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const existing = await db.blogPost.findFirst({
      where: { id: postId, profileId: user.id },
    });

    if (!existing) {
      return { success: false, error: "Story not found or unauthorized" };
    }

    const nextStatus = existing.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const post = await db.blogPost.update({
      where: { id: postId },
      data: {
        status: nextStatus,
        publishedAt:
          nextStatus === "PUBLISHED"
            ? existing.publishedAt || new Date()
            : null,
      },
    });

    revalidatePath("/stories");
    revalidatePath("/stories/manage");
    return { success: true, post };
  } catch (error) {
    console.error("Error toggling story status:", error);
    return { success: false, error: "Failed to update story status" };
  }
}

/**
 * Toggle like / upvote on a published story.
 */
export async function toggleStoryLike(postId: string) {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Please sign in to like this story." };

    const profile = await syncUserProfile(user);

    const post = await db.blogPost.findUnique({
      where: { id: postId },
      select: { id: true, slug: true, upvotes: true },
    });

    if (!post) {
      return { success: false, error: "Story not found." };
    }

    const existingLike = await db.blogPostLike.findUnique({
      where: {
        profileId_postId: {
          profileId: profile.id,
          postId,
        },
      },
    });

    if (existingLike) {
      const [, updatedPost] = await db.$transaction([
        db.blogPostLike.delete({
          where: {
            profileId_postId: {
              profileId: profile.id,
              postId,
            },
          },
        }),
        db.blogPost.update({
          where: { id: postId },
          data: {
            upvotes: { decrement: 1 },
          },
          select: { upvotes: true },
        }),
      ]);

      revalidatePath("/stories");
      revalidatePath(`/stories/${post.slug}`);
      return { success: true, hasLiked: false, upvotes: Math.max(0, updatedPost.upvotes ?? 0) };
    } else {
      const [, updatedPost] = await db.$transaction([
        db.blogPostLike.create({
          data: {
            profileId: profile.id,
            postId,
          },
        }),
        db.blogPost.update({
          where: { id: postId },
          data: {
            upvotes: { increment: 1 },
          },
          select: { upvotes: true },
        }),
      ]);

      revalidatePath("/stories");
      revalidatePath(`/stories/${post.slug}`);
      return { success: true, hasLiked: true, upvotes: updatedPost.upvotes ?? 1 };
    }
  } catch (error) {
    console.error("Error toggling story like:", error);
    return { success: false, error: "Failed to update like." };
  }
}
