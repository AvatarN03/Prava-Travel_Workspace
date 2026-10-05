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
  const { authorized, trip } = await verifyTripOwnership(tripId);

  if (!authorized || !trip) {
    notFound();
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
