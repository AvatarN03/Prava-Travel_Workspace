
import {
  CreateTripDialog,
  getTrips,
  getTripUsageQuota,
  TripList,
} from "@/features/trips";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Prava Trips",
  description: "Manage your personal travel itineraries, accommodations, expenses, and checklists.",
};

export default async function TripsPage() {
  const [trips, usage] = await Promise.all([
    getTrips(),
    getTripUsageQuota(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1">
          <span className="font-sans text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase block">
            Travel Workspace
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground">
            My{" "}
            <span className="font-serif italic font-normal text-foreground">
              Trips
            </span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl">
            Manage your travel itineraries, bookings, budgets, notes, and preparation checklists.
          </p>
        </div>
        <CreateTripDialog />
      </div>

      <TripList initialTrips={trips} tripUsage={usage} />
    </div>
  );
}
