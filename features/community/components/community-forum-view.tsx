"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import {
  Bookmark,
  BookmarkCheck,
  Compass,
  LayoutGrid,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  Radio,
  Route,
  Search,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NewDiscussionDialog } from "@/features/community/components/new-discussion-dialog";

import {
  getForumDiscussions,
  toggleSaveDiscussion,
} from "@/features/community/forum-actions";

import {
  DEFAULT_CATEGORY_IMAGES,
  FORUM_CATEGORIES,
} from "@/features/community/forum-data";
import type {
  ForumCategory,
  ForumPost,
  UserTripOption,
} from "@/features/community/forum-types";

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  ALL: LayoutGrid,
  ROUTE_ADVICE: Route,
  RECOMMENDATIONS: Sparkles,
  PACKING_GEAR: Package,
  LIVE_REPORTS: Radio,
  TEMPLATES: BookmarkCheck,
  DISCUSSIONS: MessageSquare,
};

interface CommunityForumViewProps {
  initialPosts: ForumPost[];
  userTrips?: UserTripOption[];
}

export function CommunityForumView({
  initialPosts = [],
  userTrips = [],
}: CommunityForumViewProps) {
  const [activeCategory, setActiveCategory] = useState<ForumCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [newDiscussionOpen, setNewDiscussionOpen] = useState(false);
  const [, startTransition] = useTransition();
  const requestSequence = useRef(0);
  const isInitialSearch = useRef(true);
  const skipNextSearchRequest = useRef(false);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const bookmarkedCount = useMemo(
    () => posts.filter((post) => post.hasSaved).length,
    [posts]
  );

  const fetchPosts = useCallback(
    (category: ForumCategory, query: string) => {
      const requestId = ++requestSequence.current;

      startTransition(async () => {
        try {
          const freshPosts = await getForumDiscussions(
            category,
            query.trim() || undefined
          );

          if (requestId === requestSequence.current) {
            setPosts(freshPosts);
          }
        } catch {
          if (requestId === requestSequence.current) {
            toast.error("Could not refresh discussions. Please try again.");
          }
        }
      });
    },
    [startTransition]
  );

  useEffect(() => {
    if (isInitialSearch.current) {
      isInitialSearch.current = false;
      return;
    }

    if (skipNextSearchRequest.current) {
      skipNextSearchRequest.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      fetchPosts(activeCategory, searchQuery);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [activeCategory, fetchPosts, searchQuery]);

  const filteredPosts = useMemo(
    () =>
      showBookmarkedOnly
        ? posts.filter((post) => post.hasSaved)
        : posts,
    [posts, showBookmarkedOnly]
  );

  const refreshPosts = () => {
    // Reset filters so a newly published post is immediately visible at the top.
    if (activeCategory !== "ALL" || searchQuery) {
      skipNextSearchRequest.current = true;
    }
    setActiveCategory("ALL");
    setShowBookmarkedOnly(false);
    setSearchQuery("");
    fetchPosts("ALL", "");
  };

  const handleToggleBookmark = async (e: React.MouseEvent, post: ForumPost) => {
    e.preventDefault();
    e.stopPropagation();

    const previousSaved = Boolean(post.hasSaved);
    setPosts((current) =>
      current.map((item) =>
        item.id === post.id ? { ...item, hasSaved: !previousSaved } : item
      )
    );

    const result = await toggleSaveDiscussion(post.id);
    if (!result.success) {
      setPosts((current) =>
        current.map((item) =>
          item.id === post.id ? { ...item, hasSaved: previousSaved } : item
        )
      );
      toast.error(result.error || "Please sign in to bookmark.");
      return;
    }

    toast.success(previousSaved ? "Removed bookmark" : "Discussion bookmarked!");
  };

  const getAuthorInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1">
          <span className="font-sans text-[11px] font-semibold tracking-widest text-primary uppercase block">
            Community Discussions
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground">
            Traveler{" "}
            <span className="font-serif italic font-normal text-foreground">
              Forum
            </span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl">
            Ask for route advice, share secret viewpoints and culinary spots, discuss gear packing, or inspect fellow travelers&apos; itineraries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics, destinations..."
              className="pl-8.5 h-9 text-xs bg-background border-border rounded-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            size="sm"
            onClick={() => setNewDiscussionOpen(true)}
            className="h-9 gap-1.5 text-xs font-medium shadow-xs cursor-pointer shrink-0 rounded-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Start Discussion</span>
            <span className="xs:hidden">New Topic</span>
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2 w-full">
        <div className="w-full sm:w-64 min-w-0">
          <Select
            value={activeCategory}
            onValueChange={(val) => {
              const category = val as ForumCategory;
              if (category !== activeCategory) {
                skipNextSearchRequest.current = true;
              }
              setActiveCategory(category);
              setShowBookmarkedOnly(false);
              fetchPosts(category, searchQuery);
            }}
          >
            <SelectTrigger className="h-9 text-xs bg-card border-border w-full flex items-center justify-between cursor-pointer rounded-sm shadow-xs">
              <div className="flex items-center gap-2 truncate">
                {(() => {
                  const ActiveIcon = CATEGORY_ICON_MAP[activeCategory] || MessageSquare;
                  return <ActiveIcon className="h-3.5 w-3.5 text-primary shrink-0" />;
                })()}
                <span className="truncate">
                  {FORUM_CATEGORIES.find((c) => c.id === activeCategory)?.label || "Category"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {FORUM_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICON_MAP[cat.id] || MessageSquare;
                return (
                  <SelectItem key={cat.id} value={cat.id} className="text-xs cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{cat.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant={showBookmarkedOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowBookmarkedOnly((current) => !current)}
          className={`h-9 shrink-0 gap-1.5 rounded-sm px-3 text-xs font-medium cursor-pointer ${showBookmarkedOnly
              ? "bg-primary text-primary-foreground shadow-xs"
              : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          title="Show saved discussions"
        >
          <Bookmark className={`h-3.5 w-3.5 ${showBookmarkedOnly ? "fill-current" : ""}`} />
          <span>Saved</span>
          {bookmarkedCount > 0 && (
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${showBookmarkedOnly ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"}`}>
              {bookmarkedCount}
            </span>
          )}
        </Button>

      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{filteredPosts.length}</strong>{" "}
          {filteredPosts.length === 1 ? "discussion" : "discussions"}
          {showBookmarkedOnly
            ? " (saved only)"
            : activeCategory !== "ALL"
              ? ` in ${FORUM_CATEGORIES.find((c) => c.id === activeCategory)?.label}`
              : ""}
        </span>
        {(searchQuery || activeCategory !== "ALL" || showBookmarkedOnly) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (activeCategory !== "ALL" || searchQuery) {
                skipNextSearchRequest.current = true;
              }
              setSearchQuery("");
              setActiveCategory("ALL");
              setShowBookmarkedOnly(false);
              fetchPosts("ALL", "");
            }}
            className="h-7 text-xs text-primary hover:text-primary/80 cursor-pointer"
          >
            Reset filters
          </Button>
        )}
      </div>

      {/* Discussions Grid Layout (2–3 Columns) */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-card/40 p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">
              No discussions yet in this topic
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Be the first traveler to start a conversation, ask for pacing advice, or share hidden gems!
            </p>
          </div>
          <Button
              size="sm"
              onClick={() => setNewDiscussionOpen(true)}
              className="gap-1.5 text-xs cursor-pointer shadow-xs rounded-md"
            >
              <Plus className="h-3.5 w-3.5" />
              Start First Discussion
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => {
            const postHref = `/forum/${post.slug || post.id}`;
            const coverImage =
              post.coverImageUrl ||
              DEFAULT_CATEGORY_IMAGES[post.category] ||
              DEFAULT_CATEGORY_IMAGES.ALL;

            return (
              <Card
                key={post.id}
                className="group flex h-[420px] flex-col overflow-hidden rounded-md border border-border bg-card shadow-2xs transition-all duration-200 hover:border-primary/50 hover:shadow-xs sm:h-[400px]"
              >
                {/* Cover Visual Thumbnail with Default Fallback */}
                <div className="relative h-1/2 w-full shrink-0 overflow-hidden border-b border-border bg-muted/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge
                    variant="outline"
                    className="absolute right-3 top-3 z-10 border-primary/40 bg-black px-2 py-0.5 text-[10px] font-semibold text-primary dark:bg-black"
                  >
                    {post.categoryLabel}
                  </Badge>
                </div>

                <CardContent className="flex h-1/2 flex-col justify-between space-y-3 p-4">
                  <div className="space-y-2.5">
                    {/* Title */}
                    <TooltipProvider delayDuration={250}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={postHref} className="block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary">
                            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                              {post.title}
                            </h3>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="start" className="max-w-80 whitespace-pre-wrap break-words text-xs leading-relaxed">
                          {post.title}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Location and date */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      {post.destination && (
                        <span className="flex items-center gap-0.5 truncate">
                          <MapPin className="h-3 w-3 text-primary shrink-0" />
                          <span className="truncate">{post.destination}</span>
                        </span>
                      )}
                      <span>{post.createdAt}</span>
                    </div>

                    {/* Attached Workspace Trip Badge */}
                    {post.linkedTrip && (
                      <div className="flex items-center gap-1.5 rounded-md bg-muted/40 border border-border px-2 py-1 text-[11px] text-foreground">
                        <Compass className="h-3 w-3 text-primary shrink-0" />
                        <span className="font-semibold text-primary truncate max-w-35">
                          {post.linkedTrip.title}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground text-[10px]">
                          {post.linkedTrip.durationDays}d
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer author metadata */}
                  <div className="pt-3 border-t border-border space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      {/* Author */}
                      <div className="flex min-w-0 items-center gap-1.5">
                        {post.authorUsername ? (
                          <Link
                            href={`/u/${encodeURIComponent(post.authorUsername)}`}
                            className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            title={`View ${post.authorName}'s profile`}
                          >
                            <Avatar className="h-5 w-5 border border-border transition-opacity hover:opacity-80">
                              {post.authorAvatarUrl && (
                                <AvatarImage
                                  src={post.authorAvatarUrl}
                                  alt={`${post.authorName}'s avatar`}
                                  referrerPolicy="no-referrer"
                                />
                              )}
                              <AvatarFallback className="text-[9px] font-semibold bg-primary/10 text-primary">
                                {getAuthorInitials(post.authorName)}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                        ) : (
                          <Avatar className="h-5 w-5 border border-border">
                            {post.authorAvatarUrl && (
                              <AvatarImage
                                src={post.authorAvatarUrl}
                                alt={`${post.authorName}'s avatar`}
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <AvatarFallback className="text-[9px] font-semibold bg-primary/10 text-primary">
                              {getAuthorInitials(post.authorName)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {post.authorUsername ? (
                          <Link
                            href={`/u/${encodeURIComponent(post.authorUsername)}`}
                            className="min-w-0 truncate text-[11px] font-medium leading-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            title={`View ${post.authorName}'s profile`}
                          >
                            <span className="block truncate">{post.authorName}</span>
                            <span className="block truncate text-[10px] font-normal text-muted-foreground">
                              @{post.authorUsername}
                            </span>
                          </Link>
                        ) : (
                          <span className="max-w-25 truncate text-[11px] font-medium text-foreground">
                            {post.authorName}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(e, post)}
                        className={`shrink-0 rounded-sm p-1.5 transition-colors cursor-pointer ${post.hasSaved
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        title={post.hasSaved ? "Remove bookmark" : "Save discussion"}
                        aria-label={post.hasSaved ? "Remove bookmark" : "Save discussion"}
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${post.hasSaved ? "fill-current" : ""}`} />
                      </button>

                    </div>

                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Start New Discussion Modal */}
      <NewDiscussionDialog
        open={newDiscussionOpen}
        onOpenChange={setNewDiscussionOpen}
        userTrips={userTrips}
        onDiscussionCreated={refreshPosts}
      />
    </div>
  );
}
