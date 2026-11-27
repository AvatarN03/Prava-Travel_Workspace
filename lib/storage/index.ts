import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { createClient as createServerSupabase } from "@/lib/supabase/server";

export const STORAGE_BUCKET = "prava-media";
export const STORAGE_FOLDERS = [
  "trips",
  "avatars",
  "posts",
  "community",
  "stories",
] as const;
export type StorageFolder = (typeof STORAGE_FOLDERS)[number];

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const MAX_PATH_SEGMENT_LENGTH = 100;
const MAX_STORAGE_PATH_LENGTH = 512;
const USER_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STORAGE_OBJECT_MARKER = "/storage/v1/object/";

export function isStorageFolder(value: unknown): value is StorageFolder {
  return typeof value === "string" && STORAGE_FOLDERS.includes(value as StorageFolder);
}

function isValidUserId(userId: string): boolean {
  return USER_ID_PATTERN.test(userId);
}

function isSafePathSegment(segment: string): boolean {
  return (
    segment.length > 0 &&
    segment.length <= MAX_PATH_SEGMENT_LENGTH &&
    !segment.includes("..") &&
    !/[\\\u0000-\u001f\u007f-\u009f]/.test(segment) &&
    /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(segment)
  );
}

function isValidStoragePath(
  path: string,
  userId?: string,
  expectedFolder?: StorageFolder
): boolean {
  if (path.length > MAX_STORAGE_PATH_LENGTH) return false;

  const segments = path.split("/");
  if (
    segments.length < 3 ||
    !isStorageFolder(segments[0]) ||
    !isValidUserId(segments[1]) ||
    segments.some((segment) => !isSafePathSegment(segment))
  ) {
    return false;
  }

  if (expectedFolder && segments[0] !== expectedFolder) return false;
  if (userId && (!isValidUserId(userId) || segments[1].toLowerCase() !== userId.toLowerCase())) {
    return false;
  }

  return true;
}

function getImageMimeType(bytes: Uint8Array): string | null {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    bytes.length >= 24 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a &&
    String.fromCharCode(...bytes.subarray(12, 16)) === "IHDR"
  ) {
    return "image/png";
  }

  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.subarray(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.subarray(8, 12)) === "WEBP"
  ) {
    const riffSize =
      bytes[4] |
      (bytes[5] << 8) |
      (bytes[6] << 16) |
      (bytes[7] << 24);
    if (riffSize >= 4 && riffSize + 8 <= bytes.length) return "image/webp";
  }

  if (bytes.length >= 6) {
    const gifSignature = String.fromCharCode(...bytes.subarray(0, 6));
    if (
      (gifSignature === "GIF87a" || gifSignature === "GIF89a") &&
      bytes[bytes.length - 1] === 0x3b
    ) {
      return "image/gif";
    }
  }

  if (
    bytes.length >= 16 &&
    String.fromCharCode(...bytes.subarray(4, 8)) === "ftyp"
  ) {
    const boxSize =
      (bytes[0] << 24) |
      (bytes[1] << 16) |
      (bytes[2] << 8) |
      bytes[3];
    const brands = [
      String.fromCharCode(...bytes.subarray(8, 12)),
    ];
    for (let offset = 16; offset + 4 <= boxSize; offset += 4) {
      brands.push(String.fromCharCode(...bytes.subarray(offset, offset + 4)));
    }
    if (
      boxSize >= 16 &&
      boxSize <= bytes.length &&
      (brands.includes("avif") || brands.includes("avis"))
    ) {
      return "image/avif";
    }
  }

  return null;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

async function getStorageClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && secretKey) {
    return createSupabaseClient(supabaseUrl, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return await createServerSupabase();
}

async function ensureConfiguredBucket(supabase: Awaited<ReturnType<typeof getStorageClient>>) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError || !buckets) {
    console.warn("Could not verify configured storage bucket:", listError);
    return;
  }
  if (buckets.some((bucket) => bucket.name === STORAGE_BUCKET)) return;

  const { error: createError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
    public: true,
    fileSizeLimit: MAX_FILE_SIZE_BYTES,
    allowedMimeTypes: ALLOWED_IMAGE_TYPES,
  });
  if (createError) {
    throw new Error(`Could not create configured storage bucket: ${createError.message}`);
  }
}

/**
 * Uploads a verified image to the configured bucket under the authenticated user's folder.
 */
export async function uploadImageToStorage(
  file: File | Blob,
  folder: StorageFolder,
  userId: string,
  customFilename?: string
): Promise<UploadResult> {
  try {
    if (!isStorageFolder(folder) || !isValidUserId(userId)) {
      return { success: false, error: "Invalid storage folder or user scope." };
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: file.size > MAX_FILE_SIZE_BYTES
          ? "File size exceeds the 5MB limit."
          : "The uploaded file is empty.",
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    if (arrayBuffer.byteLength !== file.size || arrayBuffer.byteLength > MAX_FILE_SIZE_BYTES) {
      return { success: false, error: "Invalid image size." };
    }

    const buffer = Buffer.from(arrayBuffer);
    const contentType = getImageMimeType(buffer);
    if (!contentType || !ALLOWED_IMAGE_TYPES.includes(contentType)) {
      return {
        success: false,
        error: "Invalid file type. Allowed formats: JPEG, PNG, WebP, GIF, AVIF.",
      };
    }

    const extensionByMimeType: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/avif": "avif",
    };
    const extension = extensionByMimeType[contentType];
    const filename =
      customFilename || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;

    if (!isSafePathSegment(filename)) {
      return { success: false, error: "Invalid image filename." };
    }

    const filenameExtension = filename.split(".").pop()?.toLowerCase();
    const allowedExtensions: Record<string, string[]> = {
      "image/jpeg": ["jpg", "jpeg"],
      "image/png": ["png"],
      "image/webp": ["webp"],
      "image/gif": ["gif"],
      "image/avif": ["avif"],
    };
    if (!filenameExtension || !allowedExtensions[contentType].includes(filenameExtension)) {
      return { success: false, error: "Image filename extension does not match its content." };
    }

    const storagePath = `${folder}/${userId.toLowerCase()}/${filename}`;
    if (!isValidStoragePath(storagePath, userId, folder)) {
      return { success: false, error: "Invalid storage path." };
    }

    const supabase = await getStorageClient();
    await ensureConfiguredBucket(supabase);
    const { data, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError);
      return {
        success: false,
        error: `Storage upload failed: ${uploadError.message}`,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("Unexpected storage error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
  }
}

/**
 * Extracts a safe bucket and path from a Supabase public URL or a relative storage path.
 */
export function parseSupabaseStoragePath(
  urlOrPath?: string | null
): { bucket: string; path: string; filename: string } | null {
  if (!urlOrPath || typeof urlOrPath !== "string") return null;

  let bucket: string | null = null;
  let rawPath: string | null = null;

  try {
    const url = new URL(urlOrPath);
    const markerIndex = url.pathname.indexOf("/storage/v1/object/public/");
    if (markerIndex !== -1) {
      const afterMarker = url.pathname.slice(
        markerIndex + "/storage/v1/object/public/".length
      );
      const firstSlash = afterMarker.indexOf("/");
      if (firstSlash === -1) return null;
      bucket = decodeURIComponent(afterMarker.slice(0, firstSlash));
      rawPath = decodeURIComponent(afterMarker.slice(firstSlash + 1));
    }
  } catch {
    const relativePath = urlOrPath.trim().split(/[?#]/, 1)[0];
    try {
      const decodedPath = decodeURIComponent(relativePath);
      if (isStorageFolder(decodedPath.split("/")[0])) {
        bucket = STORAGE_BUCKET;
        rawPath = decodedPath;
      }
    } catch {
      return null;
    }
  }

  if (
    !bucket ||
    !/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(bucket) ||
    !rawPath ||
    !isValidStoragePath(rawPath)
  ) {
    return null;
  }

  return {
    bucket,
    path: rawPath,
    filename: rawPath.split("/").pop() || "",
  };
}

/**
 * Returns null for external image URLs and otherwise checks bucket, folder, and user ownership.
 */
export function isStorageReferenceAllowedForUser(
  urlOrPath: string,
  userId: string,
  expectedFolder: StorageFolder
): boolean | null {
  const parsed = parseSupabaseStoragePath(urlOrPath);
  if (parsed) {
    return (
      parsed.bucket === STORAGE_BUCKET &&
      parsed.path.split("/").length === 3 &&
      isValidStoragePath(parsed.path, userId, expectedFolder)
    );
  }

  const looksLikeStoragePath =
    urlOrPath.includes(STORAGE_OBJECT_MARKER) ||
    isStorageFolder(urlOrPath.trim().split(/[/?#]/, 1)[0]);
  return looksLikeStoragePath ? false : null;
}

/**
 * Deletes a storage image only when it is in the configured bucket and belongs to the user.
 */
export async function deleteImageFromStorage(
  urlOrPath: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const parsed = parseSupabaseStoragePath(urlOrPath);
    if (!parsed) {
      const looksLikeStoragePath =
        urlOrPath.includes(STORAGE_OBJECT_MARKER) ||
        isStorageFolder(urlOrPath.trim().split(/[/?#]/, 1)[0]);
      return looksLikeStoragePath
        ? { success: false, error: "Invalid storage path." }
        : { success: true };
    }

    if (parsed.bucket !== STORAGE_BUCKET) {
      return { success: false, error: "Storage bucket is not configured." };
    }
    if (!isValidStoragePath(parsed.path, userId)) {
      console.warn(
        `[Storage] Unauthorized path deletion attempt: ${parsed.path} for user ${userId}`
      );
      return { success: false, error: "Unauthorized path deletion" };
    }

    const supabase = await getStorageClient();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([parsed.path]);

    if (error) {
      console.error("Supabase Storage delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected storage deletion error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    };
  }
}

/**
 * Removes unused avatars from the authenticated user's configured-bucket directory.
 */
export async function pruneUnusedUserAvatars(
  userId: string,
  activeAvatarUrl?: string | null
): Promise<{ success: boolean; deletedCount: number; error?: string }> {
  try {
    if (!isValidUserId(userId)) {
      return { success: false, deletedCount: 0, error: "Invalid user ID" };
    }

    let activeFilename: string | null = null;
    if (activeAvatarUrl) {
      const allowedReference = isStorageReferenceAllowedForUser(
        activeAvatarUrl,
        userId,
        "avatars"
      );
      const parsed = parseSupabaseStoragePath(activeAvatarUrl);
      if (allowedReference && parsed) activeFilename = parsed.filename;
    }

    const supabase = await getStorageClient();
    const folderPath = `avatars/${userId.toLowerCase()}`;
    const { data: files, error: listError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folderPath, { limit: 100 });

    if (listError) {
      console.error("Supabase Storage avatar listing error:", listError);
      return { success: false, deletedCount: 0, error: listError.message };
    }

    const staleFiles = (files || []).filter(
      (file) =>
        file.name &&
        file.name !== activeFilename &&
        file.name !== ".emptyFolderPlaceholder" &&
        isSafePathSegment(file.name)
    );
    const pathsToDelete = staleFiles.map((file) => `${folderPath}/${file.name}`);
    if (pathsToDelete.some((path) => !isValidStoragePath(path, userId, "avatars"))) {
      return { success: false, deletedCount: 0, error: "Invalid avatar storage path." };
    }

    if (pathsToDelete.length === 0) {
      return { success: true, deletedCount: 0 };
    }

    const { error: removeError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(pathsToDelete);
    if (removeError) {
      console.error("Supabase Storage avatar removal error:", removeError);
      return { success: false, deletedCount: 0, error: removeError.message };
    }

    return { success: true, deletedCount: pathsToDelete.length };
  } catch (error) {
    console.error("Error pruning unused user avatars:", error);
    return {
      success: false,
      deletedCount: 0,
      error: error instanceof Error ? error.message : "Failed to prune avatars",
    };
  }
}

/**
 * Permanently deletes all uploaded files for a user from the configured media bucket.
 */
export async function deleteUserStorageFolder(
  userId: string
): Promise<{ success: boolean; deletedCount: number }> {
  let totalDeleted = 0;
  try {
    if (!isValidUserId(userId)) {
      return { success: false, deletedCount: 0 };
    }

    const supabase = await getStorageClient();
    const storage = supabase.storage.from(STORAGE_BUCKET);
    for (const folder of STORAGE_FOLDERS) {
      const pendingFolders = [`${folder}/${userId.toLowerCase()}`];
      while (pendingFolders.length > 0) {
        const folderPath = pendingFolders.pop();
        if (!folderPath || !isValidStoragePath(`${folderPath}/placeholder`, userId, folder)) {
          throw new Error("Invalid storage folder path during account cleanup.");
        }

        const filePaths: string[] = [];
        let offset = 0;
        while (true) {
          const { data: files, error: listError } = await storage.list(folderPath, {
            limit: 100,
            offset,
            sortBy: { column: "name", order: "asc" },
          });
          if (listError || !files) {
            throw listError || new Error("Could not list storage files");
          }

          for (const file of files) {
            if (!file.name || file.name === ".emptyFolderPlaceholder") continue;
            if (!isSafePathSegment(file.name)) {
              console.warn(`[Storage] Skipping invalid storage entry during cleanup: ${file.name}`);
              continue;
            }

            const path = `${folderPath}/${file.name}`;
            if (!isValidStoragePath(path, userId, folder)) {
              console.warn(`[Storage] Skipping out-of-scope storage entry: ${path}`);
              continue;
            }
            if (file.id === null) pendingFolders.push(path);
            else filePaths.push(path);
          }

          if (files.length < 100) break;
          offset += files.length;
        }

        for (let index = 0; index < filePaths.length; index += 100) {
          const batch = filePaths.slice(index, index + 100);
          const { error: removeError } = await storage.remove(batch);
          if (removeError) throw removeError;
          totalDeleted += batch.length;
        }
      }
    }

    return { success: true, deletedCount: totalDeleted };
  } catch (error) {
    console.error("Storage folder purge failed:", error);
    return { success: false, deletedCount: totalDeleted };
  }
}
