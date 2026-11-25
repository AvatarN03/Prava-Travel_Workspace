import { notFound } from "next/navigation";

import { ItineraryView } from "@/features/trip-workspace";

import { verifyTripOwnership } from "@/features/trip-workspace/common/auth-check";
import { db } from "@/lib/db";

interface ItineraryPageProps {
  params: Promise<{
    tripId: string;
  }>;
}

export const metadata = {
  title: "Itinerary | Trip Workspace",
  description: "Schedule day-by-day activities and travel plans.",
};

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const { tripId } = await params;
  const { authorized, trip, isOwner } = await verifyTripOwnership(tripId);

  if (!authorized || !trip) {
    notFound();
  }

  if (!isOwner) {
    const items = await db.itineraryItem.findMany({
      where: { tripId, trip: { isPublic: true } },
      select: { id: true, dayNumber: true, time: true, title: true, description: true, location: true, category: true },
      orderBy: [{ dayNumber: "asc" }, { order: "asc" }, { createdAt: "asc" }],
    });
    return (
      <section className="space-y-3" aria-label="Itinerary">
        <h2 className="text-lg font-semibold">Itinerary</h2>
        {items.length === 0 && <p className="text-muted-foreground">No activities yet.</p>}
        {items.map((item) => (
          <article key={item.id} className="space-y-1 rounded-md border bg-card p-4">
            <p className="text-xs text-muted-foreground">Day {item.dayNumber || 1}{item.time ? ` · ${item.time}` : ""}</p>
            <h3 className="font-medium">{item.title}</h3>
            {item.location && <p className="text-sm text-muted-foreground">{item.location}</p>}
            {item.description && <p className="whitespace-pre-wrap text-sm">{item.description}</p>}
          </article>
        ))}
      </section>
    );
  }

  const items = await db.itineraryItem.findMany({
    where: { tripId },
    orderBy: [
      { dayNumber: "asc" },
      { order: "asc" },
      { createdAt: "asc" },
    ],
  });

  return (
    <div className="space-y-4">
      <ItineraryView
        tripId={trip.id}
        items={items}
        tripTitle={trip.title}
        destination={trip.destination}
        tripStartDate={trip.startDate}
        tripEndDate={trip.endDate}
      />
    </div>
  );
}
