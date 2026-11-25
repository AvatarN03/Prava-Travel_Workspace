import { notFound } from "next/navigation";

import { AccommodationList } from "@/features/trip-workspace";

import { verifyTripOwnership } from "@/features/trip-workspace/common/auth-check";
import { db } from "@/lib/db";

interface AccommodationsPageProps {
  params: Promise<{
    tripId: string;
  }>;
}

export const metadata = {
  title: "Accommodation | Trip Workspace",
  description: "Manage hotel and lodging stays for your trip.",
};

export default async function AccommodationsPage({ params }: AccommodationsPageProps) {
  const { tripId } = await params;
  const { authorized, trip, isOwner } = await verifyTripOwnership(tripId);

  if (!authorized || !trip) {
    notFound();
  }

  if (!isOwner) {
    const items = await db.accommodation.findMany({
      where: { tripId, trip: { isPublic: true } },
      select: { id: true, name: true, type: true, address: true },
      orderBy: [{ checkIn: "asc" }, { createdAt: "asc" }],
    });
    return (
      <section className="space-y-3" aria-label="Accommodation">
        <h2 className="text-lg font-semibold">Accommodation</h2>
        {items.length === 0 && <p className="text-muted-foreground">No accommodations yet.</p>}
        {items.map((item) => (
          <article key={item.id} className="space-y-1 rounded-md border bg-card p-4">
            <h3 className="font-medium">{item.name}</h3>
            {item.type && <p className="text-sm text-muted-foreground">{item.type}</p>}
            {item.address && <p className="text-sm text-muted-foreground">{item.address}</p>}
          </article>
        ))}
      </section>
    );
  }

  const items = await db.accommodation.findMany({
    where: { tripId },
    orderBy: [{ checkIn: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-4">
      <AccommodationList
        tripId={trip.id}
        items={items}
        destination={trip.destination}
        tripTitle={trip.title}
      />
    </div>
  );
}
