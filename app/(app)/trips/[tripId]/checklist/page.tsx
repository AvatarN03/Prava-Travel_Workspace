import { notFound } from "next/navigation";

import { ChecklistView } from "@/features/trip-workspace";
import { verifyTripOwnership } from "@/features/trip-workspace/common/auth-check";

import { db } from "@/lib/db";

interface ChecklistPageProps {
  params: Promise<{
    tripId: string;
  }>;
}

export const metadata = {
  title: "Checklist | Trip Workspace",
  description: "Manage packing lists and pre-trip preparation tasks.",
};

export default async function ChecklistPage({ params }: ChecklistPageProps) {
  const { tripId } = await params;
  const { authorized, trip } = await verifyTripOwnership(tripId);

  if (!authorized || !trip) {
    notFound();
  }

  const items = await db.checklistItem.findMany({
    where: { tripId },
    orderBy: [
      { isCompleted: "asc" },
      { order: "asc" },
      { createdAt: "asc" },
    ],
  });

  return (
    <div className="space-y-4">
      <ChecklistView tripId={trip.id} items={items} />
    </div>
  );
}
