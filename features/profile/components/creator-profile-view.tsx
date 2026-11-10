"use client";

import Link from "next/link";
import { useState } from "react";

import {
  BedDouble,
  BookOpen,
  Bookmark,
  Compass,
  Globe,
  ListTodo,
  MapPin,
  MessageSquare,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StoryCard, type StoryCardItem } from "@/features/blog";
import { toggleSaveDiscussion } from "@/features/community/forum-actions";
import { DEFAULT_CATEGORY_IMAGES } from "@/features/community/forum-data";
import {
  TemplatePreviewDialog,
  type TemplateTripItem,
} from "@/features/templates";

type CreatorTrip = TemplateTripItem;

interface CreatorForumPost {
  id: string;
  slug: string | null;
  title: string;
  category: string;
  destination: string | null;
  tags: string[];
  coverImageUrl: string | null;
  images: string[];
  hasSaved: boolean;
}

export interface CreatorProfileData {
  id: string;
  fullName: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  memberSince: string;
  trips: CreatorTrip[];
  stories: StoryCardItem[];
  forumPosts?: CreatorForumPost[];
}

interface CreatorProfileViewProps {
  creator: CreatorProfileData;
}

export function CreatorProfileView({ creator }: CreatorProfileViewProps) {
  const [activeTab, setActiveTab] = useState("itineraries");
  const [previewTrip, setPreviewTrip] = useState<CreatorTrip | null>(null);
  const [clonedIds, setClonedIds] = useState<Set<string>>(new Set());

  const forumPosts = creator.forumPosts || [];
  const [savedPostIds, setSavedPostIds] = useState(
    () => new Set(forumPosts.filter((post) => post.hasSaved).map((post) => post.id))
  );

  const handleCloned = (tripId: string) => {
    setClonedIds((current) => new Set(current).add(tripId));
  };

  const handleToggleBookmark = async (postId: string) => {
    const wasSaved = savedPostIds.has(postId);
    setSavedPostIds((current) => {
      const next = new Set(current);
      if (wasSaved) next.delete(postId);
      else next.add(postId);
      return next;
    });

    const result = await toggleSaveDiscussion(postId);
    if (!result.success) {
      setSavedPostIds((current) => {
        const next = new Set(current);
        if (wasSaved) next.add(postId);
        else next.delete(postId);
        return next;
      });
      toast.error(result.error || "Please sign in to bookmark.");
    }
  };

  const handleShare = async () => {
    const profileUrl = window.location.href;
    const shareData = {
      title: `${creator.fullName} on Prava`,
      text: `Explore ${creator.fullName}'s public travel profile on Prava.`,
      url: profileUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(profileUrl);
        toast.success("Profile link copied to clipboard.");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Unable to share this profile.");
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 space-y-6 selection:bg-primary/20 selection:text-primary w-full">
      {/* Instagram-Inspired Creator Identity Hero */}
      <section className="relative rounded-xl border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-3 sm:p-8 sm:pr-28 shadow-xs">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-3 sm:gap-x-6 sm:gap-y-3">
          {/* Avatar (Compact on mobile) */}
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted text-sm font-bold text-foreground shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 sm:h-28 sm:w-28 sm:text-xl">
            {creator.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={creator.avatarUrl}
                alt={creator.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{getInitials(creator.fullName)}</span>
            )}
          </div>

          {/* Identity Info & Metrics */}
          <div className="min-w-0">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                <h1 className="truncate font-sans text-lg font-light tracking-tight text-foreground dark:text-zinc-50 sm:text-3xl">
                  {creator.fullName}
                </h1>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  aria-label="Share profile"
                  title="Share profile"
                  className="h-7 w-7 shrink-0 cursor-pointer rounded-sm border-primary/30 bg-primary/5 text-primary hover:border-primary/50 hover:bg-primary/10 hover:text-primary sm:hidden"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Badge variant="secondary" className="mt-1 gap-1 rounded-sm border-border text-[10px] font-mono dark:border-zinc-800 sm:mt-0 sm:ml-2 sm:inline-flex sm:text-[11px]">
                <Globe className="h-3 w-3 text-primary" /> @{creator.username}
              </Badge>
            </div>
          </div>

          <div className="col-span-2 min-w-0 space-y-2 sm:col-span-1 sm:col-start-2 sm:space-y-3">
            {creator.bio ? (
              <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground dark:text-zinc-300 sm:text-sm">
                {creator.bio}
              </p>
            ) : (
              <p className="text-xs italic text-muted-foreground dark:text-zinc-500 sm:text-sm">
                Traveler and trip architect on Prava.
              </p>
            )}

            {/* Instagram-Style Horizontal Metrics Bar */}
            <div className="border-b border-primary/50 pb-3 pt-1 text-xs text-muted-foreground dark:text-zinc-400">
              <div className="flex flex-nowrap items-center gap-x-3 sm:gap-x-5">
                <button
                  type="button"
                  onClick={() => setActiveTab("itineraries")}
                  className="flex shrink-0 items-baseline gap-1 text-left transition-colors hover:text-primary cursor-pointer"
                >
                  <span className="font-bold text-foreground dark:text-zinc-100">{creator.trips.length}</span>
                  <span>{creator.trips.length === 1 ? "Trip" : "Trips"}</span>
                </button>
                <span className="h-4 w-px shrink-0 bg-primary/45" aria-hidden="true" />

                <button
                  type="button"
                  onClick={() => setActiveTab("stories")}
                  className="flex shrink-0 items-baseline gap-1 text-left transition-colors hover:text-primary cursor-pointer"
                >
                  <span className="font-bold text-foreground dark:text-zinc-100">{creator.stories.length}</span>
                  <span>{creator.stories.length === 1 ? "Story" : "Stories"}</span>
                </button>
                <span className="h-4 w-px shrink-0 bg-primary/45" aria-hidden="true" />

                <button
                  type="button"
                  onClick={() => setActiveTab("forum")}
                  className="flex shrink-0 items-baseline gap-1 text-left transition-colors hover:text-primary cursor-pointer"
                >
                  <span className="font-bold text-foreground dark:text-zinc-100">{forumPosts.length}</span>
                  <span>{forumPosts.length === 1 ? "Discussion" : "Discussions"}</span>
                </button>
              </div>

              <div className="mt-2 text-[11px] text-muted-foreground dark:text-zinc-400 sm:ml-auto sm:mt-0 sm:text-right">
                Joined{" "}
                <span className="font-medium text-foreground dark:text-zinc-200">{creator.memberSince}</span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="absolute right-8 top-8 hidden shrink-0 cursor-pointer gap-1.5 rounded-sm border-primary/30 bg-primary/5 text-xs text-primary hover:border-primary/50 hover:bg-primary/10 hover:text-primary sm:flex"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share profile</span>
          </Button>
        </div>
      </section>

      {/* Instagram-Style Clean Tabbed Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Mobile View: 1-Tap Select Dropdown (< sm) */}
        <div className="sm:hidden w-full pb-1">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="h-10 text-xs w-full bg-card dark:bg-[#0F131C] border-border dark:border-zinc-800 text-foreground dark:text-zinc-200 rounded-sm shadow-xs cursor-pointer">
              <div className="flex items-center gap-2">
                {activeTab === "itineraries" && <Compass className="h-3.5 w-3.5 text-primary" />}
                {activeTab === "stories" && <BookOpen className="h-3.5 w-3.5 text-primary" />}
                {activeTab === "forum" && <MessageSquare className="h-3.5 w-3.5 text-primary" />}
                <span className="font-semibold">
                  {activeTab === "itineraries" && "Itineraries"}
                  {activeTab === "stories" && "Stories"}
                  {activeTab === "forum" && "Discussions"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="dark:bg-[#0F131C] dark:border-zinc-800">
              <SelectItem value="itineraries" className="text-xs cursor-pointer">
                Itineraries
              </SelectItem>
              <SelectItem value="stories" className="text-xs cursor-pointer">
                Stories
              </SelectItem>
              <SelectItem value="forum" className="text-xs cursor-pointer">
                Discussions
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tablet & Desktop View: Navigation Tabs Bar (sm and up) */}
        <div className="hidden sm:block border-b border-border dark:border-zinc-800 pb-px">
          <TabsList className="bg-transparent h-11 p-0 gap-2 sm:gap-6 flex justify-center w-full overflow-x-auto scrollbar-none">
            <TabsTrigger
              value="itineraries"
              className="gap-2 text-xs font-semibold px-4 py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent hover:text-foreground dark:hover:text-zinc-200 transition-all cursor-pointer shrink-0"
            >
              <Compass className="h-4 w-4" />
              <span>Itineraries</span>
            </TabsTrigger>

            <TabsTrigger
              value="stories"
              className="gap-2 text-xs font-semibold px-4 py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent hover:text-foreground dark:hover:text-zinc-200 transition-all cursor-pointer shrink-0"
            >
              <BookOpen className="h-4 w-4" />
              <span>Stories</span>
            </TabsTrigger>

            <TabsTrigger
              value="forum"
              className="gap-2 text-xs font-semibold px-4 py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent hover:text-foreground dark:hover:text-zinc-200 transition-all cursor-pointer shrink-0"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Discussions</span>
            </TabsTrigger>

          </TabsList>
        </div>

        {/* Tab 1: Itineraries */}
        <TabsContent value="itineraries" className="space-y-4 focus-visible:outline-none">
          {creator.trips.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border dark:border-zinc-800 p-12 text-center space-y-3 bg-card dark:bg-[#0F131C]/60">
              <Compass className="h-10 w-10 text-muted-foreground dark:text-zinc-500 mx-auto stroke-1" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground dark:text-zinc-100">No public itineraries yet</p>
                <p className="text-xs text-muted-foreground dark:text-zinc-400 max-w-sm mx-auto">
                  {creator.fullName} hasn&apos;t published any trip blueprints yet. Check back soon!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creator.trips.map((trip) => (
                <Card
                  key={trip.id}
                  className="group relative flex flex-col justify-between overflow-hidden border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] shadow-2xs rounded-md"
                >
                  {/* Cover Image */}
                  {trip.coverImageUrl ? (
                    <div className="relative h-40 w-full overflow-hidden border-b border-border dark:border-zinc-800 bg-muted dark:bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={trip.coverImageUrl}
                        alt={trip.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-3 text-xs font-semibold text-white drop-shadow-sm flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {trip.destination || "Destination"}
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 w-full bg-gradient-to-r from-sky-100 to-slate-100 dark:from-sky-950/30 dark:to-slate-900/40 flex items-center justify-between px-4 border-b border-border dark:border-zinc-800">
                      <div className="text-xs font-semibold text-primary flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {trip.destination || "Destination"}
                      </div>
                    </div>
                  )}

                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {trip.durationDays} {trip.durationDays === 1 ? "Day" : "Days"}
                      </Badge>
                      {trip.isTemplate && (
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                          Template
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base font-bold text-foreground dark:text-zinc-100 leading-snug line-clamp-1 pt-1">
                      {trip.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-4 pt-0 pb-3 space-y-3">
                    {trip.description && (
                      <p className="text-xs text-muted-foreground dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {trip.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground dark:text-zinc-400 pt-1 border-t border-border/60 dark:border-zinc-800/80">
                      <span className="flex items-center gap-1">
                        <ListTodo className="h-3 w-3 text-primary" /> {trip.metrics.activityCount} activities
                      </span>
                      <span className="flex items-center gap-1">
                        <BedDouble className="h-3 w-3 text-primary" /> {trip.metrics.accommodationCount} stays
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-3 border-t border-border dark:border-zinc-800 bg-muted/20 dark:bg-[#121622]/60 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewTrip(trip)}
                      className="h-8 flex-1 cursor-pointer rounded-sm border-border bg-card text-xs text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                      Preview itinerary
                    </Button>
                    {trip.isOwn ? (
                      <Badge className="h-8 shrink-0 rounded-sm border border-primary/25 bg-primary/10 px-2.5 text-[10px] font-semibold text-primary">
                        Your trip
                      </Badge>
                    ) : clonedIds.has(trip.id) || trip.isCloned ? (
                      <Badge variant="secondary" className="h-8 shrink-0 rounded-sm px-2.5 text-[10px] text-muted-foreground">
                        In workspace
                      </Badge>
                    ) : null}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Stories */}
        <TabsContent value="stories" className="space-y-4 focus-visible:outline-none">
          {creator.stories.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border dark:border-zinc-800 p-12 text-center space-y-3 bg-card dark:bg-[#0F131C]/60">
              <BookOpen className="h-10 w-10 text-muted-foreground dark:text-zinc-500 mx-auto stroke-1" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground dark:text-zinc-100">No published stories yet</p>
                <p className="text-xs text-muted-foreground dark:text-zinc-400 max-w-sm mx-auto">
                  {creator.fullName} hasn&apos;t written any travel stories yet. Check back soon!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creator.stories.map((story) => (
                <StoryCard key={story.id} story={story} variant="creatorProfile" />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Discussions (Community Forum) */}
        <TabsContent value="forum" className="space-y-4 focus-visible:outline-none">
          {forumPosts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border dark:border-zinc-800 p-12 text-center space-y-3 bg-card dark:bg-[#0F131C]/60">
              <MessageSquare className="h-10 w-10 text-muted-foreground dark:text-zinc-500 mx-auto stroke-1" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground dark:text-zinc-100">No forum discussions yet</p>
                <p className="text-xs text-muted-foreground dark:text-zinc-400 max-w-sm mx-auto">
                  {creator.fullName} hasn&apos;t started any community discussions yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {forumPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden rounded-md border border-border bg-card shadow-2xs transition-colors hover:border-primary/50 dark:border-zinc-800 dark:bg-[#0F131C]"
                >
                  <div className="flex min-h-28">
                    <Link
                      href={`/forum/${post.slug || post.id}`}
                      className="w-[30%] shrink-0 overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Read ${post.title}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          post.coverImageUrl ||
                          post.images[0] ||
                          DEFAULT_CATEGORY_IMAGES[post.category] ||
                          DEFAULT_CATEGORY_IMAGES.ALL
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    <CardContent className="flex min-w-0 flex-1 flex-col items-start gap-2 p-4">
                      <TooltipProvider delayDuration={250}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/forum/${post.slug || post.id}`}
                              className="block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              <h3 className="line-clamp-1 text-sm font-bold text-foreground transition-colors hover:text-primary sm:text-base dark:text-zinc-100">
                                {post.title}
                              </h3>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="start" className="max-w-80 whitespace-pre-wrap break-words text-xs leading-relaxed">
                            {post.title}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground dark:text-zinc-400">
                        {post.destination && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" /> {post.destination}
                          </span>
                        )}
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleBookmark(post.id)}
                        className={`mt-auto h-8 w-8 shrink-0 self-end cursor-pointer rounded-sm ${savedPostIds.has(post.id)
                            ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        title={savedPostIds.has(post.id) ? "Remove bookmark" : "Save discussion"}
                        aria-label={savedPostIds.has(post.id) ? "Remove bookmark" : "Save discussion"}
                      >
                        <Bookmark className={`h-4 w-4 ${savedPostIds.has(post.id) ? "fill-current" : ""}`} />
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

      </Tabs>

      <TemplatePreviewDialog
        trip={
          previewTrip
            ? {
                ...previewTrip,
                isCloned: previewTrip.isCloned || clonedIds.has(previewTrip.id),
              }
            : null
        }
        open={Boolean(previewTrip)}
        onOpenChange={(open) => {
          if (!open) setPreviewTrip(null);
        }}
        onCloned={handleCloned}
      />
    </div>
  );
}
