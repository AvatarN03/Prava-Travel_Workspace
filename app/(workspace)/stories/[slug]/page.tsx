import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  BookOpen,
  Camera,
  Clock,
  Compass,
  Globe,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MarkdownRenderer,
  StoryHeaderActions,
  getPublishedStory,
} from "@/features/blog";
import { StoryLikeButton } from "@/features/blog/components/story-like-button";
import { StoryPhotoGallery } from "@/features/blog/components/story-photo-gallery";
import { CloneTripButton } from "@/features/templates";
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
  const isCreatorPublic = story.profile?.isPublic;
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const wordCount = story.content.split(/\s+/).filter(Boolean).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

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
      <div className="flex items-center justify-between gap-4 border-b border-border dark:border-zinc-800 pb-4">
        <Link
          href="/stories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Stories
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
        <div className="flex items-center gap-2 flex-wrap">
          {story.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2.5 py-0.5 border-border dark:border-zinc-800"
            >
              #{tag}
            </Badge>
          ))}
          <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-zinc-400 ml-auto">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" /> {readTimeMin} min read
            </span>
            <span>•</span>
            <span>Published on {publishedDate}</span>
          </div>
        </div>

        <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-foreground dark:text-zinc-50 leading-tight">
          {story.title}
        </h1>

        {story.excerpt && (
          <p className="text-base sm:text-lg text-muted-foreground dark:text-zinc-300 leading-relaxed font-normal max-w-4xl">
            {story.excerpt}
          </p>
        )}
      </header>

      {/* Hero Cover Image (Wide 7XL Aspect) */}
      {story.coverImageUrl && (
        <div className="rounded-xl overflow-hidden border border-border dark:border-zinc-800 shadow-xs bg-muted dark:bg-zinc-900 max-h-[500px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={story.coverImageUrl}
            alt={story.title}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* 2-Column Responsive Layout: Left (Article & Multi-Photos Gallery) | Right (Author & Linked Trip Companion) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Article Content Column (Left 8 Cols) */}
        <div className="lg:col-span-8 space-y-8 min-w-0">
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
            <div className="p-5 rounded-lg border border-primary/30 dark:border-primary/20 bg-primary/5 dark:bg-primary/10 space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-bold text-foreground dark:text-zinc-100">
                  Follow this Itinerary Blueprint
                </h3>
              </div>
              <p className="text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed">
                The author has linked their complete trip itinerary to this story. You can clone all activities, stays, checklists, and notes directly into your workspace with 1 click.
              </p>

              <div className="p-3.5 rounded-md border border-border dark:border-zinc-800 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-foreground dark:text-zinc-100">
                    {story.linkedTrip.title}
                  </h4>
                  {story.linkedTrip.destination && (
                    <p className="text-xs text-muted-foreground dark:text-zinc-400 flex items-center gap-1">
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

          {/* Author Bio & Engagement Card */}
          <div className="p-6 rounded-xl border border-border dark:border-zinc-800 bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs">
            <div className="flex items-start gap-4">
              {authorUsername ? (
                <Link
                  href={`/u/${authorUsername}`}
                  className="shrink-0"
                  title={`View ${authorName}'s profile`}
                >
                  <Avatar className="h-12 w-12 border-2 border-border dark:border-zinc-800 hover:ring-2 hover:ring-primary transition-all">
                    {story.profile?.avatarUrl && (
                      <AvatarImage src={story.profile.avatarUrl} alt={authorName} />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {authorInitials}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <Avatar className="h-12 w-12 border-2 border-border dark:border-zinc-800">
                  {story.profile?.avatarUrl && (
                    <AvatarImage src={story.profile.avatarUrl} alt={authorName} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground dark:text-zinc-400">Written by</span>
                  {authorUsername ? (
                    <Link
                      href={`/u/${authorUsername}`}
                      className="text-sm font-bold text-foreground dark:text-zinc-100 hover:text-primary transition-colors cursor-pointer"
                      title={`View ${authorName}'s profile`}
                    >
                      {authorName}
                    </Link>
                  ) : (
                    <span className="text-sm font-bold text-foreground dark:text-zinc-100">
                      {authorName}
                    </span>
                  )}
                  {authorUsername && (
                    <Link
                      href={`/u/${authorUsername}`}
                      className="text-xs text-muted-foreground dark:text-zinc-400 hover:text-primary font-mono transition-colors"
                      title={`View @${authorUsername}'s profile`}
                    >
                      @{authorUsername}
                    </Link>
                  )}
                </div>
                <p className="text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed max-w-md">
                  {story.profile?.bio || "Traveler and creator on Prava. Exploring destinations and creating actionable itinerary plans."}
                </p>
                {authorUsername && (
                  <div className="pt-1.5">
                    <Link href={`/u/${authorUsername}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 gap-1.5 cursor-pointer border-border dark:border-zinc-800 dark:hover:bg-zinc-800/60"
                      >
                        <User className="h-3 w-3 text-primary" /> View Creator Profile & Trips
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 flex sm:flex-col items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-border dark:border-zinc-800 sm:pl-5 w-full sm:w-auto justify-between sm:justify-center">
              <span className="text-[11px] text-muted-foreground dark:text-zinc-400 font-medium">Liked this story?</span>
              <StoryLikeButton
                storyId={story.id}
                initialUpvotes={story.upvotes ?? 0}
                initialHasLiked={(story as unknown as { hasLiked?: boolean }).hasLiked ?? false}
                size="default"
              />
            </div>
          </div>
        </div>

        {/* Right Sticky Companion Sidebar (Right 4 Cols - Desktop) */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20 hidden lg:block">
          {/* Author Card */}
          <Card className="border border-border dark:border-zinc-800 bg-card shadow-2xs rounded-md">
            <CardHeader className="pb-3 border-b border-border/60 dark:border-zinc-800/80">
              <CardTitle className="text-xs uppercase tracking-wider font-semibold text-muted-foreground dark:text-zinc-400 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" /> Creator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-4">
              <div className="flex items-center gap-3">
                {authorUsername ? (
                  <Link href={`/u/${authorUsername}`} className="shrink-0" title={`View ${authorName}'s profile`}>
                    <Avatar className="h-11 w-11 border border-border dark:border-zinc-800 hover:ring-2 hover:ring-primary transition-all">
                      {story.profile?.avatarUrl && (
                        <AvatarImage src={story.profile.avatarUrl} alt={authorName} />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {authorInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                ) : (
                  <Avatar className="h-11 w-11 border border-border dark:border-zinc-800">
                    {story.profile?.avatarUrl && (
                      <AvatarImage src={story.profile.avatarUrl} alt={authorName} />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {authorInitials}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="min-w-0">
                  {authorUsername ? (
                    <Link
                      href={`/u/${authorUsername}`}
                      className="text-sm font-bold text-foreground dark:text-zinc-100 hover:text-primary transition-colors block truncate"
                      title={`View ${authorName}'s profile`}
                    >
                      {authorName}
                    </Link>
                  ) : (
                    <h4 className="text-sm font-bold text-foreground dark:text-zinc-100 truncate">
                      {authorName}
                    </h4>
                  )}
                  {authorUsername && (
                    <Link
                      href={`/u/${authorUsername}`}
                      className="text-xs text-muted-foreground dark:text-zinc-400 hover:text-primary font-mono transition-colors block"
                      title={`View @${authorUsername}'s profile`}
                    >
                      @{authorUsername}
                    </Link>
                  )}
                </div>
              </div>

              {story.profile?.bio && (
                <p className="text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {story.profile.bio}
                </p>
              )}

              {authorUsername && (
                <Link href={`/u/${authorUsername}`} className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-8 gap-1.5 cursor-pointer border-border dark:border-zinc-800"
                  >
                    <Globe className="h-3.5 w-3.5 text-primary" /> Visit Creator Profile
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Linked Itinerary Card */}
          {story.linkedTrip && (
            <Card className="border border-border dark:border-zinc-800 bg-card shadow-2xs rounded-md">
              <CardHeader className="pb-3 border-b border-border/60 dark:border-zinc-800/80">
                <CardTitle className="text-xs uppercase tracking-wider font-semibold text-muted-foreground dark:text-zinc-400 flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-primary" /> Attached Blueprint
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground dark:text-zinc-100">
                    {story.linkedTrip.title}
                  </h4>
                  {story.linkedTrip.destination && (
                    <p className="text-xs text-muted-foreground dark:text-zinc-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" /> {story.linkedTrip.destination}
                    </p>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground dark:text-zinc-400 leading-relaxed">
                  Clone all activities, stays, checklists, and notes into your workspace with 1 click.
                </p>

                <div className="pt-1">
                  <CloneTripButton
                    tripId={story.linkedTrip.id}
                    tripTitle={story.linkedTrip.title}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Photo Gallery Quick Preview (If Story Has Multiple Photos) */}
          {imagesList.length > 0 && (
            <Card className="border border-border dark:border-zinc-800 bg-card shadow-2xs rounded-md">
              <CardHeader className="pb-3 border-b border-border/60 dark:border-zinc-800/80 flex flex-row items-center justify-between">
                <CardTitle className="text-xs uppercase tracking-wider font-semibold text-muted-foreground dark:text-zinc-400 flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-primary" /> Gallery
                </CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  {imagesList.length} {imagesList.length === 1 ? "photo" : "photos"}
                </Badge>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="grid grid-cols-3 gap-2">
                  {imagesList.slice(0, 6).map((imgUrl, i) => (
                    <div
                      key={imgUrl + i}
                      className="relative aspect-square rounded-md overflow-hidden border border-border dark:border-zinc-800 bg-muted/30"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt="Photo preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {imagesList.length > 6 && (
                  <p className="text-[10px] text-muted-foreground dark:text-zinc-500 pt-2 text-center">
                    +{imagesList.length - 6} more in article gallery below
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Reading Stats */}
          <Card className="border border-border dark:border-zinc-800 bg-card shadow-2xs rounded-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider font-semibold text-muted-foreground dark:text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Story Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs pt-2">
              <div className="flex items-center justify-between py-1 border-b border-border/60 dark:border-zinc-800/60">
                <span className="text-muted-foreground dark:text-zinc-400">Word Count</span>
                <span className="font-semibold text-foreground dark:text-zinc-200">{wordCount} words</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/60 dark:border-zinc-800/60">
                <span className="text-muted-foreground dark:text-zinc-400">Reading Time</span>
                <span className="font-semibold text-foreground dark:text-zinc-200">{readTimeMin} min</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/60 dark:border-zinc-800/60">
                <span className="text-muted-foreground dark:text-zinc-400">Published</span>
                <span className="font-semibold text-foreground dark:text-zinc-200">{publishedDate}</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-muted-foreground dark:text-zinc-400">Upvotes</span>
                <StoryLikeButton
                  storyId={story.id}
                  initialUpvotes={story.upvotes ?? 0}
                  initialHasLiked={(story as unknown as { hasLiked?: boolean }).hasLiked ?? false}
                  variant="pill"
                />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
