"use client";

import { useEffect, type ReactNode } from "react";

import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceNav } from "./workspace-nav";
import { useWorkspaceAi } from "../context/workspace-ai-context";

import type { Trip } from "@prisma/client";

interface TripWorkspaceContainerProps {
  trip: Trip;
  counts: {
    itinerary: number;
    accommodations: number;
    expenses: number;
    notes: number;
    checklist?: { completed: number; total: number };
    links: number;
  };
  children: ReactNode;
}

export function TripWorkspaceContainer({
  trip,
  counts,
  children,
}: TripWorkspaceContainerProps) {
  const { setActiveTrip } = useWorkspaceAi();

  useEffect(() => {
    setActiveTrip({
      tripId: trip.id,
      tripTitle: trip.title,
      destination: trip.destination,
      counts,
    });
    return () => {
      setActiveTrip(null);
    };
  }, [trip.id, trip.title, trip.destination, counts, setActiveTrip]);

  return (
    <div className="w-full max-w-5xl mx-auto min-w-0 space-y-4">
      <WorkspaceHeader trip={trip} />
      <WorkspaceNav tripId={trip.id} counts={counts} />
      <div className="pt-2">{children}</div>
    </div>
  );
}
