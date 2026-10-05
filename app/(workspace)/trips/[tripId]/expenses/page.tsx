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

  // Run profile currency lookup and expense fetch in parallel — saves one sequential round-trip
  const [profileRes, items] = await Promise.all([
    user
      ? db.profile.findUnique({
          where: { id: user.id },
          select: { defaultCurrency: true },
        })
      : Promise.resolve(null),
    db.expense.findMany({
      where: { tripId },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  const userCurrency = profileRes?.defaultCurrency || "INR";

  // FX rates need the currency known first, so one more network call
  const fxRatesData = await fetchFxRates(userCurrency);

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
