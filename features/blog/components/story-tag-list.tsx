"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StoryTagListProps {
  tags: string[];
}

const INITIAL_TAG_COUNT = 4;

export function StoryTagList({ tags }: StoryTagListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleTags = isExpanded ? tags : tags.slice(0, INITIAL_TAG_COUNT);
  const remainingCount = Math.max(0, tags.length - INITIAL_TAG_COUNT);

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      {visibleTags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="border-border px-2.5 py-0.5 text-xs"
        >
          #{tag}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded((current) => !current)}
          className="h-6 cursor-pointer rounded-sm border-border px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {isExpanded ? "Show less" : `+${remainingCount} more`}
        </Button>
      )}
    </div>
  );
}
