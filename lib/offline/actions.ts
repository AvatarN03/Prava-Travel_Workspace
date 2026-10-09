"use server";

import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export interface OfflineItineraryItem {
  id: string;
  dayNumber: number | null;
  date: string | null;
  time: string | null;
  title: string;
  description: string | null;
  location: string | null;
  category: string | null;
  cost: number | null;
  order: number;
}

export interface OfflineAccommodation {
  id: string;
  name: string;
  type: string | null;
  address: string | null;
  checkIn: string | null;
  checkOut: string | null;
  confirmationCode: string | null;
  contactPhone: string | null;
  cost: number | null;
  currency: string;
  notes: string | null;
}

export interface OfflineChecklistItem {
  id: string;
  title: string;
  category: string;
  isCompleted: boolean;
  dueDate: string | null;
  order: number;
}

export interface OfflineNote {
  id: string;
  title: string;
  content: string;
  category: string | null;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OfflineExpense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  paidBy: string | null;
  notes: string | null;
}

export interface OfflineLink {
  id: string;
  title: string;
  url: string;
  category: string | null;
  description: string | null;
}

export interface OfflineTripPayload {
  id: string;
  title: string;
  destination: string | null;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  itinerary: OfflineItineraryItem[];
  accommodations: OfflineAccommodation[];
  checklistItems: OfflineChecklistItem[];
  notes: OfflineNote[];
  expenses: OfflineExpense[];
  links: OfflineLink[];
  _counts: {
    itinerary: number;
    accommodations: number;
    checklistItems: number;
    notes: number;
    expenses: number;
    links: number;
  };
}

/**
 * Server action to fetch active and planning trips with complete workspace relations
 * for client-side offline caching.
 */
export async function fetchTripsForOfflineSync(): Promise<{
  success: boolean;
  trips?: OfflineTripPayload[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const trips = await db.trip.findMany({
      where: {
        profileId: user.id,
        status: { in: ["PLANNING", "ACTIVE"] },
      },
      include: {
        itinerary: {
          orderBy: [{ dayNumber: "asc" }, { order: "asc" }, { createdAt: "asc" }],
        },
        accommodations: {
          orderBy: [{ checkIn: "asc" }, { createdAt: "asc" }],
        },
        checklistItems: {
          orderBy: [{ isCompleted: "asc" }, { order: "asc" }, { createdAt: "asc" }],
        },
        notes: {
          orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
        },
        expenses: {
          orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        },
        links: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { startDate: "asc" },
    });

    const serializedTrips: OfflineTripPayload[] = trips.map((t) => ({
      id: t.id,
      title: t.title,
      destination: t.destination,
      description: t.description,
      startDate: t.startDate ? t.startDate.toISOString() : null,
      endDate: t.endDate ? t.endDate.toISOString() : null,
      status: t.status,
      coverImageUrl: t.coverImageUrl,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      itinerary: t.itinerary.map((item) => ({
        id: item.id,
        dayNumber: item.dayNumber,
        date: item.date ? item.date.toISOString() : null,
        time: item.time,
        title: item.title,
        description: item.description,
        location: item.location,
        category: item.category,
        cost: item.cost,
        order: item.order,
      })),
      accommodations: t.accommodations.map((acc) => ({
        id: acc.id,
        name: acc.name,
        type: acc.type,
        address: acc.address,
        checkIn: acc.checkIn ? acc.checkIn.toISOString() : null,
        checkOut: acc.checkOut ? acc.checkOut.toISOString() : null,
        confirmationCode: acc.confirmationCode,
        contactPhone: acc.contactPhone,
        cost: acc.cost,
        currency: acc.currency,
        notes: acc.notes,
      })),
      checklistItems: t.checklistItems.map((chk) => ({
        id: chk.id,
        title: chk.title,
        category: chk.category,
        isCompleted: chk.isCompleted,
        dueDate: chk.dueDate ? chk.dueDate.toISOString() : null,
        order: chk.order,
      })),
      notes: t.notes.map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        category: note.category,
        isPinned: note.isPinned,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
      })),
      expenses: t.expenses.map((exp) => ({
        id: exp.id,
        title: exp.title,
        amount: exp.amount,
        currency: exp.currency,
        category: exp.category,
        date: exp.date.toISOString(),
        paidBy: exp.paidBy,
        notes: exp.notes,
      })),
      links: t.links.map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        category: link.category,
        description: link.description,
      })),
      _counts: {
        itinerary: t.itinerary.length,
        accommodations: t.accommodations.length,
        checklistItems: t.checklistItems.length,
        notes: t.notes.length,
        expenses: t.expenses.length,
        links: t.links.length,
      },
    }));

    return { success: true, trips: serializedTrips };
  } catch (error) {
    console.error("[OfflineSync] Error fetching trips for sync:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch trips",
    };
  }
}
