"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import {
  deleteImageFromStorage,
  normalizeMimeType,
  pruneUnusedUserAvatars,
  uploadImageToStorage,
} from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/storage";

export type StorageFolder =
  | "trips"
  | "avatars"
  | "posts"
  | "community"
  | "stories";

/**
 * Server action to upload an image to Supabase Storage.
 */
export async function uploadImageAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as StorageFolder) || "trips";

    if (!file || typeof file === "string") {
      return { success: false, error: "No image file provided." };
    }

    const rawMime = (file.type || "").toLowerCase();
    const normalizedMime = normalizeMimeType(rawMime, file.name);

    if (!ALLOWED_IMAGE_TYPES.includes(normalizedMime)) {
      return {
        success: false,
        error: "Invalid file type. Please upload a JPG, PNG, WebP, GIF, or AVIF image.",
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: "Image exceeds 5MB size limit. Please upload a smaller image.",
      };
    }

    const result = await uploadImageToStorage(file, folder, user.id);
    return result;
  } catch (error) {
    console.error("Storage action error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Image upload failed",
    };
  }
}

/**
 * Safely deletes an unreferenced trip cover image from Supabase Storage if no other trip uses it.
 */
export async function deleteUnusedTripCoverImage(
  coverImageUrl: string | null | undefined,
  userId: string
) {
  if (!coverImageUrl) return;

  try {
    const inUseCount = await db.trip.count({
      where: { coverImageUrl },
    });

    if (inUseCount === 0) {
      await deleteImageFromStorage(coverImageUrl, userId);
    }
  } catch (err) {
    console.warn("[Storage] Non-fatal error cleaning up unreferenced trip cover image:", err);
  }
}

/**
 * Server action to update or clear a Trip's cover image.
 * Automatically deletes the old custom cover image from Supabase Storage if no longer referenced.
 */
export async function updateTripCoverImage(tripId: string, coverImageUrl: string | null) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const trip = await db.trip.findFirst({
      where: { id: tripId, profileId: user.id },
    });

    if (!trip) {
      return { success: false, error: "Trip not found or unauthorized" };
    }

    const previousCoverImageUrl = trip.coverImageUrl;

    await db.trip.update({
      where: { id: tripId },
      data: { coverImageUrl },
    });

    // If the trip had a previous custom cover image and it changed/was removed, delete the old file from Supabase Storage
    if (previousCoverImageUrl && previousCoverImageUrl !== coverImageUrl) {
      await deleteUnusedTripCoverImage(previousCoverImageUrl, user.id);
    }

    revalidatePath(`/trips/${tripId}`);
    revalidatePath(`/trips/${tripId}/overview`);
    revalidatePath(`/trips`);
    revalidatePath(`/dashboard`);
    revalidatePath(`/community`);

    return { success: true, coverImageUrl };
  } catch (error) {
    console.error("Error updating trip cover image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update cover image",
    };
  }
}

/**
 * Server action to update or clear the authenticated user's profile avatar.
 * Automatically deletes unused or historical orphaned avatar images from Supabase Storage.
 */
export async function updateProfileAvatar(avatarUrl: string | null) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    await db.profile.update({
      where: { id: user.id },
      data: { avatarUrl },
    });

    try {
      await supabase.auth.updateUser({
        data: {
          avatar_url: avatarUrl,
          picture: avatarUrl,
        },
      });
    } catch (authMetaErr) {
      console.warn("Could not sync auth metadata for avatar:", authMetaErr);
    }

    // Storage optimization: purge orphaned or previous avatar files in the user's avatar folder
    try {
      await pruneUnusedUserAvatars(user.id, avatarUrl);
    } catch (cleanupErr) {
      console.warn("Storage avatar cleanup non-fatal warning:", cleanupErr);
    }

    revalidatePath(`/profile`);
    revalidatePath(`/dashboard`);
    revalidatePath(`/community`);

    return { success: true, avatarUrl };
  } catch (error) {
    console.error("Error updating profile avatar:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update avatar",
    };
  }
}

/**
 * Server action to explicitly remove the authenticated user's profile avatar and free storage.
 */
export async function deleteProfileAvatarAction() {
  return await updateProfileAvatar(null);
}

