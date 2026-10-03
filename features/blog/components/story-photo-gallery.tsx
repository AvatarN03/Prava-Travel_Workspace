"use client";

import { useState } from "react";

import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface StoryPhotoGalleryProps {
  images: string[];
  title?: string;
}

export function StoryPhotoGallery({ images, title = "Photos from this Journey" }: StoryPhotoGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const openLightbox = (idx: number) => setSelectedIdx(idx);
  const closeLightbox = () => setSelectedIdx(null);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + images.length) % images.length);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % images.length);
    }
  };

  return (
    <section className="my-10 pt-6 border-t border-border space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" />
          <h3 className="text-base font-bold text-foreground">{title}</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {images.length} {images.length === 1 ? "photo" : "photos"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((url, idx) => (
          <button
            key={url + idx}
            type="button"
            onClick={() => openLightbox(idx)}
            className="group relative aspect-4/3 overflow-hidden rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Trip photo ${idx + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-[11px] font-medium text-white bg-black/60 px-2 py-1 rounded-md backdrop-blur-xs">
                View
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedIdx !== null} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent className="max-w-4xl w-[95vw] p-2 bg-black/95 border-none text-white overflow-hidden rounded-xl">
          <DialogTitle className="sr-only">Trip Photo Preview</DialogTitle>
          {selectedIdx !== null && (
            <div className="relative flex flex-col items-center justify-center min-h-[50vh] max-h-[85vh]">
              {/* Close Button */}
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Previous Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Main Image */}
              <div className="w-full h-full flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[selectedIdx]}
                  alt={`Trip photo ${selectedIdx + 1}`}
                  className="max-h-[75vh] max-w-full object-contain rounded-md"
                />
              </div>

              {/* Next Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Footer Counter */}
              <div className="text-xs text-white/70 pb-2">
                Photo {selectedIdx + 1} of {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
