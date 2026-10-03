"use client";

import { useState, useTransition } from "react";

import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { toggleStoryLike } from "../actions";

interface StoryLikeButtonProps {
  storyId: string;
  initialUpvotes?: number;
  initialHasLiked?: boolean;
  size?: "sm" | "default";
  variant?: "outline" | "ghost" | "pill";
  showCount?: boolean;
  className?: string;
}

export function StoryLikeButton({
  storyId,
  initialUpvotes = 0,
  initialHasLiked = false,
  size = "sm",
  variant = "outline",
  showCount = true,
  className = "",
}: StoryLikeButtonProps) {
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isPending, startTransition] = useTransition();

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const prevLiked = hasLiked;
    const prevCount = upvotes;

    const nextLiked = !prevLiked;
    const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1);

    setHasLiked(nextLiked);
    setUpvotes(nextCount);

    startTransition(async () => {
      const res = await toggleStoryLike(storyId);
      if (!res.success) {
        setHasLiked(prevLiked);
        setUpvotes(prevCount);
        toast.error(res.error || "Please sign in to like this story.");
      } else {
        setHasLiked(res.hasLiked ?? nextLiked);
        setUpvotes(res.upvotes ?? nextCount);
      }
    });
  };

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleToggleLike}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
          hasLiked
            ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
            : "bg-muted/50 dark:bg-zinc-800/60 hover:bg-muted dark:hover:bg-zinc-800 text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200 border border-border dark:border-zinc-800"
        } ${className}`}
        title={hasLiked ? "Unlike story" : "Like story"}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Heart
            className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
              hasLiked ? "fill-red-500 text-red-500" : "text-muted-foreground dark:text-zinc-400"
            }`}
          />
        )}
        {showCount && <span className="tabular-nums">{upvotes}</span>}
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant === "outline" ? "outline" : "ghost"}
      size={size}
      onClick={handleToggleLike}
      disabled={isPending}
      className={`h-8 text-xs gap-1.5 cursor-pointer border-border dark:border-zinc-800 transition-colors ${
        hasLiked
          ? "text-red-600 dark:text-red-400 border-red-500/30 bg-red-500/5 hover:bg-red-500/10"
          : "text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200 dark:hover:bg-zinc-800/60"
      } ${className}`}
      title={hasLiked ? "Unlike story" : "Like story"}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Heart
          className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
            hasLiked ? "fill-red-500 text-red-500" : ""
          }`}
        />
      )}
      {showCount && <span className="tabular-nums font-semibold">{upvotes}</span>}
    </Button>
  );
}
