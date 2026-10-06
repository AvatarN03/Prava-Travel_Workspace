"use client";

import Link from "next/link";
import { useState } from "react";

import {
  BedDouble,
  BookOpen,
  Calendar,
  Compass,
  Globe,
  Heart,
  ListTodo,
  MapPin,
  MessageSquare,
  Sparkles,
  Tag,
  User,
} from "lucide-react";

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
import { StoryCard, type StoryCardItem } from "@/features/blog";
import { CloneTripButton } from "@/features/templates";

interface CreatorTrip {
  id: string;
  title: string;
  description: string | null;
  destination: string | null;
  coverImageUrl: string | null;
  durationDays: number;
  isTemplate: boolean;
  activityCount: number;
  accommodationCount: number;
  checklistCount: number;
}

interface CreatorForumPost {
  id: string;
  slug: string | null;
  title: string;
  content: string;
  category: string;
  destination: string | null;
  tags: string[];
  upvotes: number;
  replyCount: number;
  createdAt: Date | string | null;
}

export interface CreatorProfileData {
  id: string;
  fullName: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  memberSince: string;
  travelPreferences: string | null;
  trips: CreatorTrip[];
  stories: StoryCardItem[];
  forumPosts?: CreatorForumPost[];
}

interface CreatorProfileViewProps {
  creator: CreatorProfileData;
}

export function CreatorProfileView({ creator }: CreatorProfileViewProps) {
  const [activeTab, setActiveTab] = useState("itineraries");

  const forumPosts = creator.forumPosts || [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 selection:bg-primary/20 selection:text-primary w-full">
      {/* Instagram-Inspired Creator Identity Hero */}
      <section className="rounded-xl border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Avatar (Compact on mobile) */}
          <div className="relative h-14 w-14 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-border dark:border-zinc-800 bg-muted dark:bg-zinc-900 shadow-xs shrink-0 flex items-center justify-center text-base sm:text-xl font-bold text-foreground dark:text-zinc-100">
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
          <div className="space-y-2 sm:space-y-3 flex-1 min-w-0 w-full">
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <h1 className="font-sans text-xl sm:text-3xl font-light tracking-tight text-foreground dark:text-zinc-50 truncate">
                {creator.fullName}
              </h1>
              <Badge variant="secondary" className="gap-1 text-[10px] sm:text-[11px] font-mono rounded-sm border-border dark:border-zinc-800">
                <Globe className="h-3 w-3 text-primary" /> @{creator.username}
              </Badge>
            </div>

            {creator.bio ? (
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-zinc-300 leading-relaxed max-w-3xl">
                {creator.bio}
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-zinc-500 italic">
                Traveler and trip architect on Prava.
              </p>
            )}

            {/* Instagram-Style Horizontal Metrics Bar */}
            <div className="flex items-center gap-4 sm:gap-6 pt-1 text-xs text-muted-foreground dark:text-zinc-400">
              <button
                type="button"
                onClick={() => setActiveTab("itineraries")}
                className="hover:text-primary transition-colors cursor-pointer text-left"
              >
                <span className="font-bold text-foreground dark:text-zinc-100">{creator.trips.length}</span>{" "}
                <span className="text-muted-foreground dark:text-zinc-400">
                  {creator.trips.length === 1 ? "Trip" : "Trips"}
                </span>
              </button>

              <div className="h-3.5 w-px bg-border dark:bg-zinc-800" />

              <button
                type="button"
                onClick={() => setActiveTab("stories")}
                className="hover:text-primary transition-colors cursor-pointer text-left"
              >
                <span className="font-bold text-foreground dark:text-zinc-100">{creator.stories.length}</span>{" "}
                <span className="text-muted-foreground dark:text-zinc-400">
                  {creator.stories.length === 1 ? "Story" : "Stories"}
                </span>
              </button>

              <div className="h-3.5 w-px bg-border dark:bg-zinc-800" />

              <button
                type="button"
                onClick={() => setActiveTab("forum")}
                className="hover:text-primary transition-colors cursor-pointer text-left"
              >
                <span className="font-bold text-foreground dark:text-zinc-100">{forumPosts.length}</span>{" "}
                <span className="text-muted-foreground dark:text-zinc-400">
                  {forumPosts.length === 1 ? "Discussion" : "Discussions"}
                </span>
              </button>

              <div className="h-3.5 w-px bg-border dark:bg-zinc-800 hidden sm:block" />

              <div className="hidden sm:block text-muted-foreground dark:text-zinc-400">
                Joined{" "}
                <span className="font-medium text-foreground dark:text-zinc-200">{creator.memberSince}</span>
              </div>
            </div>
          </div>
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
                {activeTab === "about" && <Sparkles className="h-3.5 w-3.5 text-primary" />}
                <span className="font-semibold">
                  {activeTab === "itineraries" && `Itineraries (${creator.trips.length})`}
                  {activeTab === "stories" && `Stories (${creator.stories.length})`}
                  {activeTab === "forum" && `Discussions (${forumPosts.length})`}
                  {activeTab === "about" && "About & DNA"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="dark:bg-[#0F131C] dark:border-zinc-800">
              <SelectItem value="itineraries" className="text-xs cursor-pointer">
                Itineraries ({creator.trips.length})
              </SelectItem>
              <SelectItem value="stories" className="text-xs cursor-pointer">
                Stories ({creator.stories.length})
              </SelectItem>
              <SelectItem value="forum" className="text-xs cursor-pointer">
                Discussions ({forumPosts.length})
              </SelectItem>
              <SelectItem value="about" className="text-xs cursor-pointer">
                About & DNA
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
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-muted dark:bg-zinc-800 text-muted-foreground dark:text-zinc-300">
                {creator.trips.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="stories"
              className="gap-2 text-xs font-semibold px-4 py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent hover:text-foreground dark:hover:text-zinc-200 transition-all cursor-pointer shrink-0"
            >
              <BookOpen className="h-4 w-4" />
              <span>Stories</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-muted dark:bg-zinc-800 text-muted-foreground dark:text-zinc-300">
                {creator.stories.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="forum"
              className="gap-2 text-xs font-semibold px-4 py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent hover:text-foreground dark:hover:text-zinc-200 transition-all cursor-pointer shrink-0"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Discussions</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-muted dark:bg-zinc-800 text-muted-foreground dark:text-zinc-300">
                {forumPosts.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="about"
              className="gap-2 text-xs font-semibold px-4 py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent hover:text-foreground dark:hover:text-zinc-200 transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              <span>About & DNA</span>
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
                  className="group relative flex flex-col justify-between overflow-hidden border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] hover:border-primary/50 dark:hover:border-primary/50 transition-colors shadow-2xs rounded-md"
                >
                  {/* Cover Image */}
                  {trip.coverImageUrl ? (
                    <div className="relative h-40 w-full overflow-hidden border-b border-border dark:border-zinc-800 bg-muted dark:bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={trip.coverImageUrl}
                        alt={trip.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                    <CardTitle className="text-base font-bold text-foreground dark:text-zinc-100 leading-snug line-clamp-1 pt-1 group-hover:text-primary transition-colors">
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
                        <ListTodo className="h-3 w-3 text-primary" /> {trip.activityCount} activities
                      </span>
                      <span className="flex items-center gap-1">
                        <BedDouble className="h-3 w-3 text-primary" /> {trip.accommodationCount} stays
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-3 border-t border-border dark:border-zinc-800 bg-muted/20 dark:bg-[#121622]/60 flex items-center justify-end">
                    <CloneTripButton tripId={trip.id} tripTitle={trip.title} />
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
                <StoryCard key={story.id} story={story} />
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
            <div className="space-y-3">
              {forumPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/forum/${post.slug || post.id}`}
                  className="block rounded-lg border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4 hover:border-primary/50 dark:hover:border-primary/50 transition-colors shadow-2xs group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                          {post.category}
                        </Badge>
                        {post.destination && (
                          <span className="text-xs text-muted-foreground dark:text-zinc-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" /> {post.destination}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground dark:text-zinc-100 group-hover:text-primary transition-colors line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border dark:border-zinc-800 text-xs text-muted-foreground dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-primary" /> {post.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5 text-primary" /> {post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 4: About & DNA */}
        <TabsContent value="about" className="space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bio & Travel DNA */}
            <Card className="md:col-span-2 border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] shadow-2xs rounded-md">
              <CardHeader className="pb-3 border-b border-border/60 dark:border-zinc-800/80">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-foreground dark:text-zinc-100">
                  <User className="h-4 w-4 text-primary" /> About {creator.fullName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider">
                    Bio & Travel Philosophy
                  </h4>
                  <p className="text-sm text-foreground dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                    {creator.bio || "No detailed biography written yet."}
                  </p>
                </div>

                {creator.travelPreferences && (
                  <div className="space-y-2 pt-3 border-t border-border dark:border-zinc-800">
                    <h4 className="text-xs font-semibold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-primary" /> Travel Style & Preferences
                    </h4>
                    <p className="text-xs text-foreground dark:text-zinc-300 leading-relaxed bg-muted/30 dark:bg-zinc-900/50 p-3 rounded-md border border-border/60 dark:border-zinc-800/60">
                      {creator.travelPreferences}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats Summary Card */}
            <Card className="border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] shadow-2xs rounded-md">
              <CardHeader className="pb-3 border-b border-border/60 dark:border-zinc-800/80">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-foreground dark:text-zinc-100">
                  <Sparkles className="h-4 w-4 text-primary" /> Creator Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/60 dark:border-zinc-800/60">
                  <span className="text-muted-foreground dark:text-zinc-400">Public Blueprints</span>
                  <span className="font-bold text-foreground dark:text-zinc-100">{creator.trips.length}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/60 dark:border-zinc-800/60">
                  <span className="text-muted-foreground dark:text-zinc-400">Published Stories</span>
                  <span className="font-bold text-foreground dark:text-zinc-100">{creator.stories.length}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/60 dark:border-zinc-800/60">
                  <span className="text-muted-foreground dark:text-zinc-400">Forum Discussions</span>
                  <span className="font-bold text-foreground dark:text-zinc-100">{forumPosts.length}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 pt-2">
                  <span className="text-muted-foreground dark:text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> Member Since
                  </span>
                  <span className="font-medium text-foreground dark:text-zinc-200">{creator.memberSince}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
