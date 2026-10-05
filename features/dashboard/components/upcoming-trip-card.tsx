import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  BedDouble,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Flag,
  MapPin,
  Plane,
  Plus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CreateTripDialog } from "@/features/trips";

import { formatDateRange } from "@/lib/utils";

import type { UpcomingTripDetails } from "../queries";

interface UpcomingTripCardProps {
  trip: UpcomingTripDetails;
}

export function UpcomingTripCard({ trip }: UpcomingTripCardProps) {
  const getStatusBadge = (status: string, isPastTrip?: boolean, isOngoing?: boolean) => {
    if (isOngoing || status === "ACTIVE") {
      return { label: "• ONGOING", variant: "default" as const };
    }
    if (isPastTrip || status === "COMPLETED") {
      return { label: "• CONCLUDED", variant: "secondary" as const };
    }
    return { label: "• CONFIRMED", variant: "outline" as const };
  };

  const statusConfig = getStatusBadge(trip.status, trip.isPastTrip, trip.isOngoing);

  // Default fallback travel image
  const fallbackCover =
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="space-y-2">
      {/* Tracker label */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="dashboard-section-eyebrow">
          {trip.isPastTrip
            ? "Previous Journey"
            : trip.isOngoing
            ? "Current Journey"
            : "Upcoming Trip"}
        </span>
      </div>

      <Card className="dashboard-card overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Column: Details & Logistics (7 cols on desktop) */}
            <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Badges row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={statusConfig.variant}
                    className="font-sans text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5"
                  >
                    {statusConfig.label}
                  </Badge>

                  {trip.isPastTrip ? (
                    <Badge
                      variant="outline"
                      className="font-sans text-[10px] font-semibold tabular-nums gap-1.5 px-2.5 py-0.5 border-border text-muted-foreground dark:text-zinc-400"
                    >
                      <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                      {trip.daysSinceEnd !== null && trip.daysSinceEnd !== undefined
                        ? trip.daysSinceEnd === 0
                          ? "Ended today"
                          : `Ended ${trip.daysSinceEnd} ${trip.daysSinceEnd === 1 ? "day" : "days"} ago`
                        : "Concluded"}
                    </Badge>
                  ) : trip.isOngoing ? (
                    <Badge
                      variant="outline"
                      className="dashboard-badge-cerulean font-sans text-[10px] font-semibold tabular-nums gap-1.5 px-2.5 py-0.5"
                    >
                      <Plane className="w-3 h-3 text-primary shrink-0" />
                      Happening now
                    </Badge>
                  ) : trip.countdownDays !== null ? (
                    <Badge
                      variant="outline"
                      className="dashboard-badge-cerulean font-sans text-[10px] font-semibold tabular-nums gap-1.5 px-2.5 py-0.5"
                    >
                      <Clock className="w-3 h-3 text-primary shrink-0" />
                      {trip.countdownDays > 0
                        ? `${trip.countdownDays} ${trip.countdownDays === 1 ? "day left" : "days left"}`
                        : "Departing today"}
                    </Badge>
                  ) : null}
                </div>

                {/* Main Destination Title & Route */}
                <div>
                  <h2 className="font-sans text-2xl sm:text-3xl font-semibold tracking-tight text-foreground dark:text-zinc-50">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                      {trip.title}
                    </Link>
                  </h2>

                  {trip.destination && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-serif italic text-sm text-foreground/80 dark:text-zinc-300">
                        {trip.destination}
                      </span>
                    </div>
                  )}
                </div>

                {/* Dates & duration metadata */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-xs text-muted-foreground dark:text-zinc-400 tabular-nums">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0" />
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </span>
                  {trip.durationDays && (
                    <>
                      <span>·</span>
                      <span>{trip.durationDays} days</span>
                    </>
                  )}
                  <span>·</span>
                  <span className="font-sans font-medium text-foreground/70 dark:text-zinc-300">
                    {trip.isPastTrip ? "Archived Journey" : "Active Workspace"}
                  </span>
                </div>

                {/* Past Trip Callout to Create New Trip */}
                {trip.isPastTrip && (
                  <div className="p-3.5 rounded-md bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-foreground dark:text-zinc-200">
                        Ready to plan your next adventure?
                      </span>
                      <p className="text-muted-foreground dark:text-zinc-400">
                        This journey concluded {trip.daysSinceEnd !== null && trip.daysSinceEnd !== undefined ? `${trip.daysSinceEnd} ${trip.daysSinceEnd === 1 ? "day" : "days"} ago` : "recently"}. Start drafting a fresh itinerary!
                      </p>
                    </div>
                    <CreateTripDialog
                      trigger={
                        <Button size="sm" className="dashboard-btn-primary h-8 px-3 gap-1.5 shrink-0 self-start sm:self-auto">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create new trip</span>
                        </Button>
                      }
                    />
                  </div>
                )}

                {/* Progress / Logistics readiness gauge */}
                <div className="pt-2 space-y-2.5">
                  <div className="flex items-center justify-between font-sans text-xs">
                    <span className="font-medium text-foreground dark:text-zinc-200">
                      {trip.isPastTrip
                        ? `Itinerary & logistics was ${trip.readiness.percentage}% planned`
                        : `Itinerary & logistics ${trip.readiness.percentage}% planned`}
                    </span>
                    <span className="text-muted-foreground dark:text-zinc-400 tabular-nums">
                      {trip.readiness.completedItems} / {trip.readiness.totalItems} items ready
                    </span>
                  </div>

                  <Progress
                    value={trip.readiness.percentage}
                    className="h-2 rounded-full bg-muted dark:bg-zinc-800"
                  />

                  {/* Readiness indicators */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 font-sans text-[11px]">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xs dashboard-surface-subtle text-foreground/90 dark:text-zinc-200 font-medium">
                      <Plane className="w-3 h-3 text-primary" />
                      {trip.readiness.transitCount > 0
                        ? `${trip.readiness.transitCount} Transit items`
                        : "Transit ready"}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xs dashboard-surface-subtle text-foreground/90 dark:text-zinc-200 font-medium">
                      <BedDouble className="w-3 h-3 text-primary" />
                      {trip.readiness.staysCount > 0
                        ? `${trip.readiness.staysCount} Stays booked`
                        : "Stays flexible"}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xs dashboard-surface-subtle text-foreground/90 dark:text-zinc-200 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {trip.readiness.tasksRemaining === 0
                        ? "Checklist complete"
                        : `${trip.readiness.tasksRemaining} tasks pending`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-4 border-t border-border/60 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
                  <Button asChild className="dashboard-btn-primary h-9 px-4 gap-2 w-full sm:w-auto">
                    <Link href={`/trips/${trip.id}`}>
                      {trip.isPastTrip ? "View trip memories & details" : "Open trip workspace"}
                      <ArrowRight className="w-4 h-4 ml-0.5" />
                    </Link>
                  </Button>

                  {trip.isPastTrip && (
                    <CreateTripDialog
                      trigger={
                        <Button className="dashboard-btn-primary h-9 px-4 gap-1.5 w-full sm:w-auto">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create new trip</span>
                        </Button>
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Featured Image & Next Checkpoint (5 cols on desktop) */}
            <div className="lg:col-span-5 p-5 dashboard-surface-subtle border-t lg:border-t-0 lg:border-l border-border/60 dark:border-zinc-800/80 flex flex-col justify-between gap-4">
              {/* Featured Stop Image Card */}
              <div className="relative w-full aspect-16/10 sm:aspect-16/9 lg:aspect-auto lg:h-[220px] rounded-md overflow-hidden border border-border/60 dark:border-zinc-800 shadow-xs group">
                <Image
                  src={trip.coverImageUrl || fallbackCover}
                  alt={trip.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {trip.featuredStop && (
                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                    <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-sky-300">
                      Featured Stop
                    </span>
                    <div className="font-sans text-sm font-semibold truncate">
                      {trip.featuredStop.title}
                    </div>
                    <div className="font-serif italic text-xs text-white/80 truncate">
                      {trip.featuredStop.subtitle}
                    </div>
                  </div>
                )}
              </div>

              {/* Next Checkpoint Alert Box */}
              {trip.nextCheckpoint ? (
                <div className="p-3.5 rounded-md dashboard-interactive-row flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-1 rounded-sm dashboard-icon-box shrink-0 mt-0.5">
                      <Flag className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-sans text-[11px] font-semibold text-foreground dark:text-zinc-200">
                        {trip.isPastTrip ? "Final checkpoint" : "Next checkpoint"}
                      </span>
                      <p className="font-sans text-muted-foreground dark:text-zinc-400 truncate font-medium">
                        {trip.nextCheckpoint.title}
                      </p>
                    </div>
                  </div>

                  {trip.nextCheckpoint.daysRemaining !== null && (
                    <Badge variant="outline" className="font-sans text-[11px] shrink-0 tabular-nums">
                      {trip.isPastTrip
                        ? "Completed"
                        : trip.nextCheckpoint.daysRemaining > 0
                        ? `In ${trip.nextCheckpoint.daysRemaining}d`
                        : trip.nextCheckpoint.daysRemaining === 0
                        ? "Today"
                        : "Overdue"}
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-md dashboard-surface-subtle flex items-center justify-between font-sans text-xs text-muted-foreground dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-primary" />
                    {trip.isPastTrip ? "All trip checkpoints recorded" : "All trip checkpoints in order"}
                  </span>
                  {!trip.isPastTrip && (
                    <Link
                      href={`/trips/${trip.id}/checklist`}
                      className="text-primary hover:underline font-medium"
                    >
                      Add task
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UpcomingTripCard;
