"use client";

import { useState } from "react";

import {
  Camera,
  ImageIcon,
  Loader2,
  MapPin,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUpload } from "./image-upload";

import { updateTripCoverImage } from "@/features/storage";

interface CoverImageProps {
  tripId?: string;
  coverImageUrl?: string | null;
  title: string;
  destination?: string | null;
  isEditable?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function CoverImage({
  tripId,
  coverImageUrl: initialCoverImageUrl,
  title,
  destination,
  isEditable = false,
  className = "",
  children,
}: CoverImageProps) {
  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverImageUrl || null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleUploaded = async (url: string) => {
    setCoverUrl(url);
    if (tripId) {
      await updateTripCoverImage(tripId, url);
    }
    setIsDialogOpen(false);
  };

  const handleRemove = async () => {
    if (!tripId) return;
    setIsRemoving(true);
    try {
      await updateTripCoverImage(tripId, null);
      setCoverUrl(null);
      setIsDialogOpen(false);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <div
        className={`relative w-full overflow-hidden rounded-md border border-border/80 bg-muted/40 shadow-xs ${className}`}
      >
        {coverUrl ? (
          <div className="relative h-56 sm:h-64 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
            {/* Deep editorial vignette gradient for crystal-clear text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15 pointer-events-none" />

            {/* Overlaid Title & Metadata Content */}
            {children && (
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 z-10 text-white">
                {children}
              </div>
            )}
          </div>
        ) : (
          <div className="relative min-h-[160px] sm:min-h-[190px] w-full bg-gradient-to-br from-slate-900 via-sky-950 to-slate-950 flex flex-col justify-end p-4 sm:p-6 text-white border-b border-border/40">
            {children || (
              <div className="space-y-1">
                {destination && (
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{destination}</span>
                  </div>
                )}
                <h2 className="text-lg font-bold text-white tracking-tight line-clamp-1">
                  {title}
                </h2>
              </div>
            )}
            <div className="absolute right-4 bottom-4 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 pointer-events-none">
              <ImageIcon className="h-5 w-5" />
            </div>
          </div>
        )}

        {/* Change Cover Button (if editable) */}
        {isEditable && tripId && (
          <div className="absolute right-3 top-3 z-20">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="h-7 gap-1.5 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-medium shadow-xs border border-white/20 cursor-pointer"
            >
              <Camera className="h-3.5 w-3.5 text-white/90" />
              <span>{coverUrl ? "Change Cover" : "Add Cover"}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      {isEditable && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Trip Cover Image
              </DialogTitle>
              <DialogDescription className="text-xs">
                Upload a cover banner for {title} to display in your workspace and community.
              </DialogDescription>
            </DialogHeader>

            <div className="py-2">
              <ImageUpload
                folder="trips"
                currentImageUrl={coverUrl}
                aspectRatio="banner"
                onUploaded={handleUploaded}
                onRemoved={coverUrl ? handleRemove : undefined}
              />
            </div>

            {coverUrl && (
              <div className="flex justify-end pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isRemoving}
                  className="h-8 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  {isRemoving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                  )}
                  Remove Cover Image
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
