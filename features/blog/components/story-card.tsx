import Link from "next/link";

import { Clock, Compass, Globe } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DEFAULT_STORY_COVER } from "../constants";
import type { StoryCardItem } from "../types";

export type { StoryCardItem };

interface StoryCardProps {
  story: StoryCardItem;
  variant?: "default" | "creatorProfile";
}

export function StoryCard({ story, variant = "default" }: StoryCardProps) {
  const publishedDate = story.publishedAt
    ? new Date(story.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Draft";

  // Calculate estimated reading time (approx 200 words per minute)
  const wordCount = story.content
    ? story.content.split(/\s+/).filter(Boolean).length
    : 250;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const authorName =
    story.profile?.fullName || story.profile?.username || "Prava Traveler";
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const coverUrl = story.coverImageUrl || DEFAULT_STORY_COVER;

  if (variant === "creatorProfile") {
    return (
      <Card className="group relative flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-2xs transition-all duration-200 hover:border-primary/50 hover:shadow-xs">
        <div className="relative h-44 w-full overflow-hidden border-b border-border/60 bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt={story.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <CardHeader className="p-4 pb-2">
          <Link
            href={`/stories/${story.slug}`}
            className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <CardTitle className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
              {story.title}
            </CardTitle>
          </Link>
          <span className="mt-2 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Clock className="h-3 w-3" /> {readTimeMin} min read
          </span>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col p-4 pt-1">
          {story.tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1 pb-3">
              {story.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-1.5 py-0 text-[10px] font-medium"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 border-t border-border/60 pt-2">
            {story.profile?.username ? (
              <Link
                href={`/u/${story.profile.username}`}
                className="shrink-0"
                title={`View ${authorName}'s profile`}
              >
                <Avatar className="h-5 w-5 border border-border transition-all hover:ring-1 hover:ring-primary">
                  {story.profile?.avatarUrl && (
                    <AvatarImage src={story.profile.avatarUrl} alt={authorName} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-[9px] font-bold text-primary">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Avatar className="h-5 w-5 border border-border">
                {story.profile?.avatarUrl && (
                  <AvatarImage src={story.profile.avatarUrl} alt={authorName} />
                )}
                <AvatarFallback className="bg-primary/10 text-[9px] font-bold text-primary">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
            )}

            <div className="flex min-w-0 items-center gap-1 truncate text-xs text-muted-foreground">
              {story.profile?.username ? (
                <Link
                  href={`/u/${story.profile.username}`}
                  className="truncate font-medium text-foreground transition-colors hover:text-primary"
                  title={`View ${authorName} (@${story.profile.username})`}
                >
                  {authorName}
                </Link>
              ) : (
                <span className="truncate font-medium text-foreground">{authorName}</span>
              )}
              {story.profile?.isPublic && (
                <Globe className="h-2.5 w-2.5 shrink-0 text-primary" />
              )}
            </div>
            <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
              {publishedDate}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-200 shadow-2xs hover:shadow-xs rounded-md">
      {/* Cover Image Header */}
      <div className="relative h-44 w-full overflow-hidden bg-muted border-b border-border/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={story.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <CardHeader className="p-4 pb-2">
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/stories/${story.slug}`}
                className="block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <CardTitle className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {story.title}
                </CardTitle>
              </Link>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs whitespace-normal break-words text-xs leading-relaxed sm:max-w-sm">
              {story.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mt-2 flex items-start justify-between gap-3">
          {story.tags.length > 0 ? (
            <div className="flex min-w-0 flex-wrap gap-1">
              {story.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-1.5 py-0 text-[10px] font-medium"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : (
            <span />
          )}
          <span className="flex shrink-0 items-center gap-1 pt-0.5 text-[11px] font-medium text-muted-foreground">
            <Clock className="h-3 w-3" /> {readTimeMin} min read
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col p-4 pb-3 pt-0">
        {/* Attached Workspace Trip Badge */}
        {story.linkedTrip && (
          <div className="flex items-center gap-1.5 rounded-md bg-primary/10 border border-primary/20 px-2 py-1 text-[11px] text-primary">
            <Compass className="h-3 w-3 shrink-0" />
            <span className="font-semibold truncate max-w-37.5">
              {story.linkedTrip.title}
            </span>
            <span className="text-muted-foreground ml-auto text-[10px]">
              Cloneable Trip
            </span>
          </div>
        )}

        {/* Creator Attribution */}
        <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-2">
          {story.profile?.username ? (
            <Link
              href={`/u/${story.profile.username}`}
              className="shrink-0"
              title={`View ${authorName}'s profile`}
            >
              <Avatar className="h-5 w-5 border border-border hover:ring-1 hover:ring-primary transition-all">
                {story.profile?.avatarUrl && (
                  <AvatarImage src={story.profile.avatarUrl} alt={authorName} />
                )}
                <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-bold">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Avatar className="h-5 w-5 border border-border">
              {story.profile?.avatarUrl && (
                <AvatarImage src={story.profile.avatarUrl} alt={authorName} />
              )}
              <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-bold">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0 truncate">
            {story.profile?.username ? (
              <Link
                href={`/u/${story.profile.username}`}
                className="font-medium text-foreground hover:text-primary transition-colors truncate"
                title={`View ${authorName} (@${story.profile.username})`}
              >
                {authorName}
              </Link>
            ) : (
              <span className="font-medium truncate text-foreground">{authorName}</span>
            )}
            {story.profile?.isPublic && (
              <Globe className="w-2.5 h-2.5 text-primary shrink-0" />
            )}
          </div>
          <span className="text-[10px] text-muted-foreground ml-auto">
            {publishedDate}
          </span>
        </div>
      </CardContent>

    </Card>
  );
}
