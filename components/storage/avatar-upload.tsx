"use client";

import { useEffect, useRef, useState } from "react";

import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { updateProfileAvatar, uploadImageAction } from "@/features/storage";
import { resizeImageToBlob } from "@/lib/utils/image-resize";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  name?: string | null;
  onAvatarUpdated?: (url: string | null) => void;
  size?: "sm" | "md" | "lg";
  allowRemove?: boolean;
}

export function AvatarUpload({
  currentAvatarUrl,
  name,
  onAvatarUpdated,
  size = "md",
  allowRemove = true,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep local state in sync when parent profile updates
  useEffect(() => {
    setAvatarUrl(currentAvatarUrl || null);
  }, [currentAvatarUrl]);

  const sizeClasses =
    size === "lg"
      ? "h-20 w-20 text-xl"
      : size === "sm"
        ? "h-9 w-9 text-xs"
        : "h-14 w-14 text-base";

  const cameraBadgeClasses =
    size === "lg"
      ? "h-7 w-7 -top-1 -right-1"
      : size === "sm"
        ? "h-5 w-5 -top-0.5 -right-0.5"
        : "h-6 w-6 -top-1 -right-1";

  const cameraIconClasses =
    size === "lg"
      ? "h-3.5 w-3.5"
      : size === "sm"
        ? "h-2.5 w-2.5"
        : "h-3 w-3";

  const removeBadgeClasses =
    size === "lg"
      ? "h-6.5 w-6.5 -bottom-1 -right-1"
      : size === "sm"
        ? "h-4.5 w-4.5 -bottom-0.5 -right-0.5"
        : "h-5.5 w-5.5 -bottom-1 -right-1";

  const removeIconClasses =
    size === "lg"
      ? "h-3 w-3"
      : size === "sm"
        ? "h-2 w-2"
        : "h-2.5 w-2.5";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB raw)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // Client-side downscale avatar to 512x512 square crop WebP/JPEG
      const resizedBlob = await resizeImageToBlob(file, {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.85,
        format: "image/webp",
      });

      const formData = new FormData();
      formData.append("file", resizedBlob, "avatar.webp");
      formData.append("folder", "avatars");

      const res = await uploadImageAction(formData);

      if (res.success && res.url) {
        setAvatarUrl(res.url);
        if (onAvatarUpdated) {
          onAvatarUpdated(res.url);
        }

        // Auto-save to profile and prune previous unused avatar images in Supabase Storage
        const updateRes = await updateProfileAvatar(res.url);
        if (updateRes.success) {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("prava-profile-updated"));
          }
          toast.success("Profile photo updated");
        } else {
          toast.error("Failed to sync photo with profile record");
        }
      } else {
        toast.error(res.error || "Failed to upload image");
      }
    } catch (err: unknown) {
      console.error("Error processing avatar image:", err);
      toast.error("Error processing image file");
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be picked again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUploading || isRemoving) return;

    try {
      setIsRemoving(true);
      const res = await updateProfileAvatar(null);

      if (res.success) {
        setAvatarUrl(null);
        if (onAvatarUpdated) {
          onAvatarUpdated(null);
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("prava-profile-updated"));
        }
        toast.success("Profile photo removed and storage freed");
      } else {
        toast.error(res.error || "Failed to remove photo");
      }
    } catch (err: unknown) {
      console.error("Error removing avatar photo:", err);
      toast.error("Error removing profile photo");
    } finally {
      setIsRemoving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getInitials = (n?: string | null) => {
    if (!n) return "U";
    return n
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const isBusy = isUploading || isRemoving;

  return (
    <div className="relative inline-block group select-none">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleFileChange}
        disabled={isBusy}
      />

      {/* Circular Avatar Surface */}
      <div
        onClick={() => !isBusy && fileInputRef.current?.click()}
        className={`relative ${sizeClasses} rounded-full overflow-hidden border border-border bg-muted/60 flex items-center justify-center font-bold text-foreground cursor-pointer shadow-xs transition-shadow hover:shadow-sm`}
        title="Click to upload or change profile photo"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!isBusy) fileInputRef.current?.click();
          }
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name || "User Avatar"}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}

        {/* Hover Camera Overlay / Uploading Spinner (Desktop) */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center text-white transition-opacity ${
            isBusy ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {isBusy ? (
            <Loader2 className={`${cameraIconClasses} animate-spin`} />
          ) : (
            <Camera className={cameraIconClasses} />
          )}
        </div>
      </div>

      {/* Prominent Camera / Upload Badge in Top-Right Corner */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!isBusy) fileInputRef.current?.click();
        }}
        disabled={isBusy}
        aria-label="Upload profile photo"
        title="Upload or change profile photo"
        className={`absolute ${cameraBadgeClasses} z-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-background shadow-xs cursor-pointer hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all`}
      >
        {isUploading ? (
          <Loader2 className={`${cameraIconClasses} animate-spin`} />
        ) : (
          <Camera className={cameraIconClasses} />
        )}
      </button>

      {/* Contextual Remove Photo Badge in Bottom-Right Corner (Only shown when custom avatar exists) */}
      {avatarUrl && allowRemove && (
        <button
          type="button"
          onClick={handleRemovePhoto}
          disabled={isBusy}
          aria-label="Remove profile photo"
          title="Remove profile photo and free storage"
          className={`absolute ${removeBadgeClasses} z-10 rounded-full bg-background text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center border border-border shadow-xs cursor-pointer hover:scale-110 active:scale-95 transition-all`}
        >
          {isRemoving ? (
            <Loader2 className={`${removeIconClasses} animate-spin`} />
          ) : (
            <Trash2 className={removeIconClasses} />
          )}
        </button>
      )}
    </div>
  );
}
