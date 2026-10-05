import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  Compass,
  Plane,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatDateRange } from "@/lib/utils";

import { getTripStatusBadge } from "../constants";
import type { TripSummaryItem } from "../queries";

interface RecentTripsListProps {
  trips: TripSummaryItem[];
}

export function RecentTripsList({ trips }: RecentTripsListProps) {
  return (
    <Card className="dashboard-card">
      <CardHeader className="dashboard-card-header p-4 pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-primary" />
          <CardTitle className="dashboard-title">
            My trips
          </CardTitle>
        </div>

        <Link
          href="/trips"
          className="font-sans text-xs text-primary font-medium hover:underline inline-flex items-center"
        >
          View all ({trips.length}) <ArrowUpRight className="w-3 h-3 ml-0.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5">
        {trips.length === 0 ? (
          <div className="text-center py-6 font-sans text-xs text-muted-foreground dark:text-zinc-400">
            No trips created yet.
          </div>
        ) : (
          trips.map((trip) => {
            const statusConfig = getTripStatusBadge(trip.status);
            const isCompleted = trip.status === "COMPLETED";

            return (
              <div
                key={trip.id}
                className="dashboard-interactive-row flex items-center justify-between gap-3 p-2.5 text-xs group"
              >
                {/* Left: Thumbnail icon & details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-xs overflow-hidden dashboard-surface-subtle flex items-center justify-center shrink-0 border border-border/50 dark:border-zinc-800">
                    {trip.coverImageUrl ? (
                      <Image
                        src={trip.coverImageUrl}
                        alt={trip.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <Compass className="w-5 h-5 text-primary" />
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/trips/${trip.id}`}
                        className="font-sans font-semibold text-foreground dark:text-zinc-100 truncate group-hover:text-primary transition-colors max-w-[180px] sm:max-w-[240px]"
                      >
                        {trip.title}
                      </Link>
                      <Badge
                        variant={statusConfig.variant}
                        className="font-sans text-[10px] px-1.5 py-0 font-medium"
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <div className="font-sans text-[11px] text-muted-foreground dark:text-zinc-400 flex items-center gap-1.5 truncate">
                      {trip.destination && (
                        <>
                          <span className="font-serif italic truncate max-w-[120px] text-foreground/80 dark:text-zinc-300">
                            {trip.destination}
                          </span>
                          <span>·</span>
                        </>
                      )}
                      <span className="tabular-nums">
                        {formatDateRange(trip.startDate, trip.endDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Action Button */}
                <Button
                  size="sm"
                  asChild
                  className="dashboard-btn-primary h-7 px-3 font-sans text-xs font-medium shrink-0 cursor-pointer rounded-xs"
                >
                  <Link href={`/trips/${trip.id}`}>
                    {isCompleted ? "Review" : "Open"}
                  </Link>
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

export default RecentTripsList;
