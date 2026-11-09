import type {
  Accommodation,
  ChecklistItem,
  Expense,
  ItineraryItem,
  Link,
  Note,
  Trip,
} from "@prisma/client";

import { syncUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export type TripSummaryItem = Trip;

export interface CategoryExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface UpcomingTripDetails extends Trip {
  itinerary: ItineraryItem[];
  expenses: Expense[];
  checklistItems: ChecklistItem[];
  accommodations: Accommodation[];
  notes: Note[];
  links: Link[];
  countdownDays: number | null;
  durationDays: number | null;
  isPastTrip: boolean;
  isOngoing: boolean;
  daysSinceEnd: number | null;
  readiness: {
    totalItems: number;
    completedItems: number;
    percentage: number;
    staysCount: number;
    transitCount: number;
    tasksRemaining: number;
  };
  financials: {
    currency: string;
    totalSpent: number;
    allocatedBudget: number | null;
    remainingBudget: number | null;
    percentUtilized: number;
    categoryBreakdown: CategoryExpenseBreakdown[];
  };
  featuredStop: {
    title: string;
    subtitle: string;
  } | null;
}

export interface DashboardSummary {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    defaultCurrency: string;
  } | null;
  metrics: {
    totalTrips: number;
    activeTrips: number;
    planningTrips: number;
    completedTrips: number;
    totalBudget: number;
    totalSpend: number;
    tripSpend: number;
    generalSpend: number;
    pendingTasksCount: number;
    totalItineraryCount: number;
  };
  upcomingTrip: UpcomingTripDetails | null;
  generalExpenses: Expense[];
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      metrics: {
        totalTrips: 0,
        activeTrips: 0,
        planningTrips: 0,
        completedTrips: 0,
        totalBudget: 0,
        totalSpend: 0,
        tripSpend: 0,
        generalSpend: 0,
        pendingTasksCount: 0,
        totalItineraryCount: 0,
      },
      upcomingTrip: null,
      generalExpenses: [],
    };
  }

  // Ensure profile is synced safely
  let profile = null;
  try {
    profile = await syncUserProfile(user);
  } catch {
    profile = await db.profile.findUnique({
      where: { id: user.id },
      select: { id: true, fullName: true, defaultCurrency: true },
    });
  }

  const profileId = profile?.id || user.id;
  const defaultCurrency = profile?.defaultCurrency || "INR";

  // Fetch all user trips with relations
  const [trips, generalExpenses] = await Promise.all([
    db.trip.findMany({
      where: { profileId },
      include: {
        itinerary: {
          orderBy: [{ dayNumber: "asc" }, { order: "asc" }],
        },
        accommodations: {
          orderBy: { checkIn: "asc" },
        },
        expenses: {
          orderBy: { date: "desc" },
        },
        checklistItems: {
          orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
        },
        notes: {
          orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
          take: 3,
        },
        links: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.expense.findMany({
      where: {
        profileId: user.id,
        tripId: null,
      },
      orderBy: { date: "desc" },
    }),
  ]);

  const totalTrips = trips.length;
  const activeTrips = trips.filter((t) => t.status === "ACTIVE").length;
  const planningTrips = trips.filter((t) => t.status === "PLANNING").length;
  const completedTrips = trips.filter((t) => t.status === "COMPLETED").length;

  let tripSpend = 0;
  let totalBudget = 0;
  let pendingTasksCount = 0;
  let totalItineraryCount = 0;

  trips.forEach((trip) => {
    tripSpend += trip.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    totalBudget += trip.budget ?? 0;
    const pendingItems = trip.checklistItems.filter((i) => !i.isCompleted);
    pendingTasksCount += pendingItems.length;
    totalItineraryCount += trip.itinerary.length;

  });

  const generalSpend = generalExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSpend = tripSpend + generalSpend;

  // Identify next upcoming/active trip:
  // First priority: ACTIVE trip, then PLANNING trip with earliest start date, else most recent trip
  const now = new Date();
  const isWithinTripDates = (trip: Trip) => {
    const startsBeforeOrToday = !trip.startDate || new Date(trip.startDate) <= now;
    const endsAfterOrToday = !trip.endDate || new Date(trip.endDate) >= now;
    return startsBeforeOrToday && endsAfterOrToday;
  };

  const activeTrip = trips.find(
    (t) => t.status === "ACTIVE" && isWithinTripDates(t)
  );
  const upcomingPlanning = trips
    .filter((t) => t.status === "PLANNING" && t.startDate && new Date(t.startDate) >= now)
    .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())[0];

  const selectedTrip = activeTrip || upcomingPlanning || trips[0] || null;

  let upcomingTripDetails: UpcomingTripDetails | null = null;

  if (selectedTrip) {
    // 1. Countdown Days calculation
    let countdownDays: number | null = null;
    if (selectedTrip.startDate) {
      const startMs = new Date(selectedTrip.startDate).getTime();
      const diffMs = startMs - now.getTime();
      countdownDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    // 2. Ongoing and Past Trip Status calculation
    const isOngoing = isWithinTripDates(selectedTrip) &&
      (selectedTrip.status === "ACTIVE" ||
        Boolean(selectedTrip.startDate && selectedTrip.endDate));

    const isPastTrip =
      !isOngoing &&
      (selectedTrip.status === "COMPLETED" ||
        Boolean(
          selectedTrip.endDate && new Date(selectedTrip.endDate).getTime() < now.getTime()
        ) ||
        Boolean(
          !selectedTrip.endDate &&
          selectedTrip.startDate &&
          new Date(selectedTrip.startDate).getTime() < now.getTime() &&
          selectedTrip.status !== "ACTIVE"
        ));

    let daysSinceEnd: number | null = null;
    if (isPastTrip) {
      if (selectedTrip.endDate) {
        const endMs = new Date(selectedTrip.endDate).getTime();
        daysSinceEnd = Math.max(0, Math.floor((now.getTime() - endMs) / (1000 * 60 * 60 * 24)));
      } else if (selectedTrip.startDate) {
        const startMs = new Date(selectedTrip.startDate).getTime();
        daysSinceEnd = Math.max(0, Math.floor((now.getTime() - startMs) / (1000 * 60 * 60 * 24)));
      }
    }

    // 2. Duration Days calculation
    let durationDays: number | null = null;
    if (selectedTrip.startDate && selectedTrip.endDate) {
      const s = new Date(selectedTrip.startDate).getTime();
      const e = new Date(selectedTrip.endDate).getTime();
      durationDays = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
    }

    // 3. Readiness calculations
    const totalItin = selectedTrip.itinerary.length;
    const totalAcc = selectedTrip.accommodations.length;
    const totalTasks = selectedTrip.checklistItems.length;
    const completedTasks = selectedTrip.checklistItems.filter((c) => c.isCompleted).length;
    const pendingTasks = totalTasks - completedTasks;

    // A balanced readiness formula: completed items / total items
    // If no items at all, readiness defaults to 0%
    const totalItems = totalItin + totalAcc + totalTasks;
    const completedItems = totalItin + totalAcc + completedTasks;
    const readinessPercentage =
      totalItems > 0 ? Math.min(100, Math.round((completedItems / totalItems) * 100)) : 0;

    const transitCount = selectedTrip.itinerary.filter(
      (i) =>
        i.category?.toUpperCase() === "TRAVEL" ||
        i.category?.toUpperCase() === "TRANSIT" ||
        i.category?.toUpperCase() === "FLIGHT"
    ).length;

    // 4. Financial breakdown
    const tripCurrency =
      selectedTrip.expenses[0]?.currency || defaultCurrency;
    const tripTotalSpent = selectedTrip.expenses.reduce((acc, curr) => acc + curr.amount, 0);

    // A trip budget is user-owned data. Never manufacture a planning amount for the dashboard.
    const allocatedBudget = selectedTrip.budget ?? null;
    const remainingBudget = allocatedBudget === null ? null : Math.max(0, allocatedBudget - tripTotalSpent);
    const percentUtilized =
      allocatedBudget !== null && allocatedBudget > 0
        ? Math.min(100, Math.round((tripTotalSpent / allocatedBudget) * 1000) / 10)
        : 0;

    // Categorized breakdown
    const categoryTotals = new Map<string, number>();
    selectedTrip.expenses.forEach((e) => {
      const cat = e.category || "OTHER";
      categoryTotals.set(cat, (categoryTotals.get(cat) || 0) + e.amount);
    });

    const categoryBreakdown: CategoryExpenseBreakdown[] = Array.from(
      categoryTotals.entries()
    ).map(([category, amount]) => ({
      category,
      amount,
      percentage:
        tripTotalSpent > 0 ? Math.round((amount / tripTotalSpent) * 100) : 0,
    }));

    // 5. Featured Stop calculation
    let featuredStop: UpcomingTripDetails["featuredStop"] = null;
    if (selectedTrip.itinerary[0]) {
      featuredStop = {
        title: selectedTrip.itinerary[0].title,
        subtitle:
          selectedTrip.itinerary[0].location ||
          (selectedTrip.itinerary[0].dayNumber
            ? `Day ${selectedTrip.itinerary[0].dayNumber} Stop`
            : "Featured Itinerary Activity"),
      };
    } else if (selectedTrip.destination) {
      featuredStop = {
        title: selectedTrip.destination,
        subtitle: "Key Travel Destination",
      };
    }

    upcomingTripDetails = {
      ...selectedTrip,
      countdownDays,
      durationDays,
      isPastTrip,
      isOngoing,
      daysSinceEnd,
      readiness: {
        totalItems,
        completedItems,
        percentage: readinessPercentage,
        staysCount: totalAcc,
        transitCount,
        tasksRemaining: pendingTasks,
      },
      financials: {
        currency: tripCurrency,
        totalSpent: tripTotalSpent,
        allocatedBudget,
        remainingBudget,
        percentUtilized,
        categoryBreakdown,
      },
      featuredStop,
    };
  }

  return {
    user: {
      id: user.id,
      email: user.email ?? "",
      fullName: profile?.fullName ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      defaultCurrency,
    },
    metrics: {
      totalTrips,
      activeTrips,
      planningTrips,
      completedTrips,
      totalBudget,
      totalSpend,
      tripSpend,
      generalSpend,
      pendingTasksCount,
      totalItineraryCount,
    },
    upcomingTrip: upcomingTripDetails,
    generalExpenses,
  };
}
