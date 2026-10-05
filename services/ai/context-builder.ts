import { db } from "@/lib/db";
import { isTripDatesPassed } from "@/lib/utils";
import {
  assembleConversationalPrompt,
  assembleProposalPrompt,
} from "./prompts";

import type { ActiveTripPromptContext } from "./prompts";

export interface TripContextResult {
  systemInstruction: string;
  conversationalPrompt: string;
  proposalPrompt: string;
  tripTitle: string;
  destination: string | null;
  startDate: Date | null;
  endDate: Date | null;
  userCurrency: string;
}

/**
 * Builds fresh trip-scoped context from PostgreSQL.
 * Implements "the application remembers, the LLM does not".
 */
export async function buildTripContext(
  tripId: string,
  profileId: string,
  userCurrencyParam?: string
): Promise<TripContextResult | null> {
  const trip = await db.trip.findFirst({
    where: {
      id: tripId,
      OR: [{ profileId }, { isPublic: true }],
    },
    include: {
      profile: {
        select: {
          defaultCurrency: true,
        },
      },
      itinerary: {
        orderBy: [{ dayNumber: "asc" }, { order: "asc" }, { createdAt: "asc" }],
      },
      accommodations: {
        orderBy: [{ checkIn: "asc" }, { createdAt: "asc" }],
      },
      expenses: {
        orderBy: [{ date: "desc" }],
      },
      notes: {
        orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
      },
      checklistItems: {
        orderBy: [{ isCompleted: "asc" }, { order: "asc" }],
      },
      links: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!trip) {
    return null;
  }

  const userCurrency = userCurrencyParam || trip.profile?.defaultCurrency || "INR";
  const formatDate = (d?: Date | null) => (d ? new Date(d).toISOString().split("T")[0] : "Not set");

  const totalSpent = trip.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingTasks = trip.checklistItems.filter((i) => !i.isCompleted);
  const completedTasks = trip.checklistItems.filter((i) => i.isCompleted);

  const itinerarySummary =
    trip.itinerary.length > 0
      ? trip.itinerary
          .map(
            (item) =>
              `- [ID: ${item.id}] Day ${item.dayNumber || 1}${item.time ? ` (${item.time})` : ""}: ${item.title}${
                item.location ? ` @ ${item.location}` : ""
              } [${item.category}]${item.cost !== null && item.cost !== undefined ? ` (Est. cost: ${userCurrency} ${item.cost})` : ""}${
                item.description ? ` - ${item.description}` : ""
              }`
          )
          .join("\n")
      : "No activities scheduled yet.";

  const accommodationsSummary =
    trip.accommodations.length > 0
      ? trip.accommodations
          .map(
            (acc) =>
              `- [ID: ${acc.id}] ${acc.name} (${acc.type || "Hotel"})${acc.address ? ` at ${acc.address}` : ""}, Check-in: ${formatDate(
                acc.checkIn
              )}, Check-out: ${formatDate(acc.checkOut)}${
                acc.confirmationCode ? `, Confirmation: #${acc.confirmationCode}` : ""
              }${acc.cost !== null && acc.cost !== undefined ? `, Cost: ${acc.currency || userCurrency} ${acc.cost}` : ""}`
          )
          .join("\n")
      : "No lodging added yet.";

  const expensesSummary =
    trip.expenses.length > 0
      ? `Total Spent: ${userCurrency} ${totalSpent.toFixed(2)}\n` +
        trip.expenses
          .slice(0, 10)
          .map(
            (exp) =>
              `- ${exp.title}: ${exp.currency || userCurrency} ${exp.amount.toFixed(2)} [${exp.category}] on ${formatDate(exp.date)}`
          )
          .join("\n")
      : "No expenses recorded yet.";

  const notesSummary =
    trip.notes.length > 0
      ? trip.notes
          .map((n) => `- [${n.isPinned ? "PINNED " : ""}${n.category || "Note"}] ${n.title}: ${n.content}`)
          .join("\n")
      : "No notes saved.";

  const checklistSummary =
    trip.checklistItems.length > 0
      ? `Pending (${pendingTasks.length}):\n` +
        (pendingTasks.map((t) => `  [ ] ${t.title} (${t.category})`).join("\n") || "  None") +
        `\nCompleted (${completedTasks.length}):\n` +
        (completedTasks.map((t) => `  [x] ${t.title}`).join("\n") || "  None")
      : "No checklist tasks created.";

  const linksSummary =
    trip.links.length > 0
      ? trip.links.map((l) => `- ${l.title} (${l.category}): ${l.url}`).join("\n")
      : "No bookmarks saved.";

  const isPastPlanning = trip.status === "PLANNING" && isTripDatesPassed(trip.startDate, trip.endDate);

  const promptContext: ActiveTripPromptContext = {
    title: trip.title,
    destination: trip.destination,
    formattedStartDate: formatDate(trip.startDate),
    formattedEndDate: formatDate(trip.endDate),
    status: trip.status,
    isPastPlanning,
    userCurrency,
    budget: trip.budget,
  };

  const summaries = {
    itinerarySummary,
    accommodationsSummary,
    expensesSummary,
    notesSummary,
    checklistSummary,
  };

  const conversationalPrompt = assembleConversationalPrompt(promptContext, summaries);
  const proposalPrompt = assembleProposalPrompt(promptContext, summaries);

  return {
    systemInstruction: proposalPrompt,
    conversationalPrompt,
    proposalPrompt,
    tripTitle: trip.title,
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    userCurrency,
  };
}

