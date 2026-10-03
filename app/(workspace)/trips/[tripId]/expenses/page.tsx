import { notFound } from "next/navigation";

import { ExpenseTracker } from "@/features/trip-workspace";

import { fetchFxRates } from "@/features/travel-essentials";
import { verifyTripOwnership } from "@/features/trip-workspace/common/auth-check";
import { db } from "@/lib/db";

interface ExpensesPageProps {
  params: Promise<{
    tripId: string;
  }>;
}

export const metadata = {
  title: "Expenses | Trip Workspace",
  description: "Track your trip budget, costs, and expenditures.",
};

export default async function ExpensesPage({ params }: ExpensesPageProps) {
  const { tripId } = await params;
  const { authorized, trip, user } = await verifyTripOwnership(tripId);

  if (!authorized || !trip) {
    notFound();
  }

  // Fetch user profile to get default preferred currency
  const profile = user
    ? await db.profile.findUnique({
        where: { id: user.id },
        select: { defaultCurrency: true },
      })
    : null;

  const userCurrency = profile?.defaultCurrency || "INR";

  const [items, fxRatesData] = await Promise.all([
    db.expense.findMany({
      where: { tripId },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    }),
    fetchFxRates(userCurrency),
  ]);

  return (
    <div className="space-y-4">
      <ExpenseTracker
        tripId={trip.id}
        items={items}
        userCurrency={userCurrency}
        fxRates={fxRatesData?.rates || {}}
        tripTitle={trip.title}
        initialBudget={trip.budget ?? null}
      />
    </div>
  );
}
