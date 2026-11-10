import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  Clock,
  Compass,
  MapPin,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkdownRenderer, StoryHeaderActions } from "@/features/blog";
import { StoryLikeButton } from "@/features/blog/components/story-like-button";
import { StoryPhotoGallery } from "@/features/blog/components/story-photo-gallery";
import { StoryTagList } from "@/features/blog/components/story-tag-list";
import { CloneTripButton } from "@/features/templates";

import { getPublishedStory } from "@/features/blog";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getPublishedStory(slug);

  if (!res.success || !res.story) {
    return {
      title: "Story Not Found | Prava",
    };
  }

  const story = res.story;
  return {
    title: `${story.title} | Prava Stories`,
    description: story.excerpt || `Read this travel story by ${story.profile?.fullName || "a Prava traveler"}.`,
    openGraph: {
      title: story.title,
      description: story.excerpt || undefined,
      images: story.coverImageUrl ? [story.coverImageUrl] : undefined,
    },
  };
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const [res, supabase] = await Promise.all([
    getPublishedStory(slug),
    createClient(),
  ]);

  if (!res.success || !res.story) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const story = res.story;
  const isAuthor = Boolean(user && story.profileId === user.id);
  const authorName = story.profile?.fullName || story.profile?.username || "Prava Traveler";
  const authorUsername = story.profile?.username;
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const readTimeMin = Math.max(
    1,
    Math.ceil(story.content.split(/\s+/).filter(Boolean).length / 200)
  );

  const publishedDate = story.publishedAt
    ? new Date(story.publishedAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "Draft";

  const imagesList = story.images || [];
  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full py-2 pb-20 selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation & Action Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <Link
          href="/stories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back to Stories</span>
        </Link>

        <div className="flex items-center gap-2">
          <StoryLikeButton
            storyId={story.id}
            initialUpvotes={story.upvotes ?? 0}
            initialHasLiked={(story as unknown as { hasLiked?: boolean }).hasLiked ?? false}
          />
          <StoryHeaderActions slug={story.slug} isAuthor={isAuthor} />
        </div>
      </div>

      {/* Hero Story Header Banner */}
      <header className="space-y-4">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" /> {readTimeMin} min read
            </span>
            <span>•</span>
            <span>Published on {publishedDate}</span>
          </div>
        </div>

        <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-foreground leading-tight">
          {story.title}
        </h1>

        {story.excerpt && (
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal max-w-4xl">
            {story.excerpt}
          </p>
        )}

        {story.tags.length > 0 && (
          <StoryTagList tags={story.tags} />
        )}
      </header>

      {/* Hero Cover Image (Wide 7XL Aspect) */}
      {story.coverImageUrl && (
        <div className="rounded-xl overflow-hidden border border-border shadow-xs bg-muted max-h-125">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={story.coverImageUrl}
            alt={story.title}
            className="w-full h-auto max-h-125 object-cover"
          />
        </div>
      )}

      {/* Story Content */}
      <div className="min-w-0 space-y-8">
          {/* Story Body Content */}
          <article className="prose prose-neutral dark:prose-invert max-w-none text-base sm:text-[15px] leading-relaxed dark:text-zinc-200">
            <MarkdownRenderer content={story.content} />
          </article>

          {/* Story Photo Gallery (Multiple Trip Photos Visual Showcase) */}
          {imagesList.length > 0 && (
            <StoryPhotoGallery images={imagesList} />
          )}

          {/* Linked Itinerary Callout Card (Mobile & Main Feed fallback) */}
          {story.linkedTrip && (
            <div className="p-5 rounded-lg border border-primary/25 bg-primary/5 space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Follow this Itinerary Blueprint
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The author has linked their complete trip itinerary to this story. You can clone all activities, stays, checklists, and notes directly into your workspace with 1 click.
              </p>

              <div className="p-3.5 rounded-md border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-foreground">
                    {story.linkedTrip.title}
                  </h4>
                  {story.linkedTrip.destination && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {story.linkedTrip.destination}
                    </p>
                  )}
                </div>

                <CloneTripButton
                  tripId={story.linkedTrip.id}
                  tripTitle={story.linkedTrip.title}
                />
              </div>
            </div>
          )}

          {/* Author Identity */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            {authorUsername ? (
              <Link
                href={`/u/${authorUsername}`}
                className="group flex items-center gap-4 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                title={`View ${authorName}'s profile`}
              >
                <Avatar className="h-12 w-12 border-2 border-border transition-all group-hover:ring-2 group-hover:ring-primary">
                  {story.profile?.avatarUrl && (
                    <AvatarImage src={story.profile.avatarUrl} alt={authorName} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                    {authorName}
                  </span>
                  <span className="block truncate font-mono text-xs text-muted-foreground transition-colors group-hover:text-primary">
                    @{authorUsername}
                  </span>
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-border">
                  {story.profile?.avatarUrl && (
                    <AvatarImage src={story.profile.avatarUrl} alt={authorName} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold text-foreground">{authorName}</span>
              </div>
            )}

          </div>
        </div>

    </div>
  );
}
