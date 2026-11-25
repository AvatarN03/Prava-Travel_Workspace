import { notFound } from "next/navigation";
import Link from "next/link";

import { TripWorkspaceContainer } from "@/features/trip-workspace";

import { verifyTripOwnership } from "@/features/trip-workspace/common/auth-check";

interface TripWorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    tripId: string;
  }>;
}

export default async function TripWorkspaceLayout({
  children,
  params,
}: TripWorkspaceLayoutProps) {
  const { tripId } = await params;
  const { authorized, trip, isOwner } = await verifyTripOwnership(tripId);

  if (!authorized || !trip) {
    notFound();
  }

  if (!isOwner) {
    return (
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">{trip.title}</h1>
          {trip.destination && <p className="text-muted-foreground">{trip.destination}</p>}
          <nav aria-label="Public trip" className="flex gap-4 text-sm">
            <Link className="cursor-pointer text-primary" href={`/trips/${tripId}/itinerary`}>Itinerary</Link>
            <Link className="cursor-pointer text-primary" href={`/trips/${tripId}/accommodations`}>Accommodation</Link>
          </nav>
        </header>
        {children}
      </div>
    );
  }

  const tripWithRelations = trip as typeof trip & {
    _count?: {
      itinerary: number;
      accommodations: number;
      checklistItems: number;
      notes: number;
      expenses: number;
      links: number;
    };
    expenses?: { amount: number; currency: string }[];
    checklistItems?: { isCompleted: boolean }[];
  };

  const totalSpend = tripWithRelations.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const completedTasks = tripWithRelations.checklistItems?.filter((c) => c.isCompleted).length || 0;
  const totalTasks = tripWithRelations._count?.checklistItems || 0;

  const counts = {
    itinerary: tripWithRelations._count?.itinerary || 0,
    accommodations: tripWithRelations._count?.accommodations || 0,
    expenses: totalSpend,
    notes: tripWithRelations._count?.notes || 0,
    checklist: totalTasks > 0 ? { completed: completedTasks, total: totalTasks } : undefined,
    links: tripWithRelations._count?.links || 0,
  };

  return (
    <TripWorkspaceContainer trip={trip} counts={counts}>
      {children}
    </TripWorkspaceContainer>
  );
}

