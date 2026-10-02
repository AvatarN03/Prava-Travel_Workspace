import Link from "next/link";
import {
  BedDouble,
  BookOpen,
  Compass,
  Globe,
  ListTodo,
  MapPin,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StoryCard } from "@/features/blog";
import { CloneTripButton } from "@/features/templates";
import { getPublicCreatorProfile } from "@/features/profile";

interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicCreatorProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const res = await getPublicCreatorProfile(username);

  if (!res.success || !res.creator) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <User className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold">Profile Not Available</h1>
        <p className="text-xs text-muted-foreground">
          The creator profile <span className="font-semibold text-foreground">@{username}</span> either does not exist or has set their profile to private.
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <Link href="/forum">
            <Button size="sm">Explore Forum</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { creator } = res;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 selection:bg-primary/20 selection:text-primary">
      {/* Creator Identity Hero */}
      <section className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          {/* Avatar */}
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-border bg-muted shadow-xs shrink-0 flex items-center justify-center text-xl font-bold text-foreground">
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

          {/* Identity Info */}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground truncate">
                {creator.fullName}
              </h1>
              <Badge variant="secondary" className="gap-1 text-[11px] font-mono rounded-sm">
                <Globe className="h-3 w-3 text-primary" /> @{creator.username}
              </Badge>
            </div>

            {creator.bio ? (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {creator.bio}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Traveler and trip architect on Prava.
              </p>
            )}

            {/* Quick Stats */}
            <div className="flex items-center gap-5 pt-1 text-xs text-muted-foreground">
              <div>
                <span className="font-bold text-foreground">{creator.trips.length}</span>{" "}
                {creator.trips.length === 1 ? "Trip" : "Trips"}
              </div>
              <div className="h-3 w-px bg-border" />
              <div>
                <span className="font-bold text-foreground">{creator.stories.length}</span>{" "}
                {creator.stories.length === 1 ? "Story" : "Stories"}
              </div>
              <div className="h-3 w-px bg-border" />
              <div>
                Member since{" "}
                <span className="font-medium text-foreground">{creator.memberSince}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Published Trips Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" /> Published Itineraries
            </h2>
            <p className="text-xs text-muted-foreground">
              Explore and 1-click clone complete travel blueprints designed by {creator.fullName}.
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {creator.trips.length} {creator.trips.length === 1 ? "Blueprint" : "Blueprints"}
          </Badge>
        </div>

        {creator.trips.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center space-y-2 bg-card">
            <p className="text-sm font-semibold">No public itineraries yet</p>
            <p className="text-xs text-muted-foreground">
              This creator hasn't published any trips to the community yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {creator.trips.map((trip) => (
              <Card
                key={trip.id}
                className="group relative flex flex-col justify-between overflow-hidden border-border bg-card hover:border-primary/40 transition-colors shadow-2xs"
              >
                {/* Cover Image */}
                {trip.coverImageUrl ? (
                  <div className="relative h-36 w-full overflow-hidden border-b border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={trip.coverImageUrl}
                      alt={trip.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="h-24 w-full bg-gradient-to-r from-sky-100 to-slate-100 dark:from-sky-950/40 dark:to-slate-900/40 flex items-center justify-between px-4 border-b border-border">
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
                    {trip.destination && (
                      <span className="text-xs text-muted-foreground truncate">
                        {trip.destination}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base font-bold text-foreground leading-snug line-clamp-1 pt-1 group-hover:text-primary transition-colors">
                    {trip.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-0 pb-3 space-y-3">
                  {trip.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {trip.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <ListTodo className="h-3 w-3 text-primary" /> {trip.activityCount} activities
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3 w-3 text-primary" /> {trip.accommodationCount} stays
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-3 border-t border-border bg-muted/20 flex items-center justify-end">
                  <CloneTripButton tripId={trip.id} tripTitle={trip.title} />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Published Stories Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Published Stories
            </h2>
            <p className="text-xs text-muted-foreground">
              Travel field notes, deep dives, and reflective stories authored by {creator.fullName}.
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {creator.stories.length} {creator.stories.length === 1 ? "Story" : "Stories"}
          </Badge>
        </div>

        {creator.stories.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center space-y-2 bg-card">
            <p className="text-sm font-semibold">No published stories yet</p>
            <p className="text-xs text-muted-foreground">
              {creator.fullName} hasn't published any travel stories yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {creator.stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
