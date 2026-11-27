"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

import { callOpenRouterFree, hasOpenRouterKey } from "@/lib/ai";
import { syncUserProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import {
  refundStandaloneAiCredits,
  reserveStandaloneAiCredits,
} from "@/services/ai/credit-reservation";
import { hasActiveProSubscription } from "@/services/subscription/subscription-service";
import { assertTripCapacity } from "@/services/trips/trip-capacity";

import type {
  DurationFilter,
  InclusionFilter,
  SortOption,
  TemplateTripItem,
} from "./types";

async function getPublicTemplateRecords(searchQuery?: string, inclusionFilter?: InclusionFilter) {
    const filters: Prisma.TripWhereInput[] = [
      { isPublic: true },
    ];

    if (searchQuery) {
      filters.push({
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { destination: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
          {
            profile: {
              is: {
                OR: [
                  { fullName: { contains: searchQuery, mode: "insensitive" } },
                  { username: { contains: searchQuery, mode: "insensitive" } },
                ],
              },
            },
          },
          { itinerary: { some: { title: { contains: searchQuery, mode: "insensitive" } } } },
        ],
      });
    }

    if (inclusionFilter === "HAS_STAYS") filters.push({ accommodations: { some: {} } });
    if (inclusionFilter === "HAS_STORY") {
      filters.push({ linkedBlogPosts: { some: { status: "PUBLISHED" } } });
    }

    return db.trip.findMany({
      where: { AND: filters },
      include: {
        profile: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            bio: true,
            isPublic: true,
            defaultCurrency: true,
          },
        },
        itinerary: { orderBy: [{ dayNumber: "asc" }, { order: "asc" }] },
        accommodations: { select: { name: true, type: true, address: true } },
        linkedBlogPosts: {
          where: { status: "PUBLISHED" },
          select: { slug: true, title: true },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });
}

export interface TemplateDiscoveryFilters {
  searchQuery?: string;
  durationFilter?: DurationFilter;
  inclusionFilter?: InclusionFilter;
  sortBy?: SortOption;
}

const durationFilters: DurationFilter[] = ["ALL", "WEEKEND", "SHORT", "EXTENDED", "LONG"];
const inclusionFilters: InclusionFilter[] = ["ALL", "HAS_STAYS", "HAS_STORY"];
const sortOptions: SortOption[] = ["NEWEST", "MOST_ACTIONABLE", "DURATION"];
const TEMPLATE_CUSTOMIZATION_CREDIT_COST = 1;
const MAX_TEMPLATE_CUSTOMIZATION_PROMPT_LENGTH = 1000;

interface TemplateCloneQuota {
  used: number;
  quota: number;
  remaining: number;
  isPro: boolean;
}

type TemplateCloneResult =
  | {
      success: false;
      error: string;
      creditDepleted?: boolean;
      userQuota?: TemplateCloneQuota;
    }
  | {
      success: true;
      newTripId: string;
      tripId: string;
      aiCustomized: boolean;
      error?: string;
      creditsDeducted?: number;
      creditsRemaining?: number;
    };

/**
 * Fetch all authentic public trips and templates from PostgreSQL.
 * Computes live expense totals, durations, inclusions, and linked travel stories.
 */
export async function getPublicTripTemplates(
  filters: TemplateDiscoveryFilters = {}
): Promise<TemplateTripItem[]> {
  try {
    const searchQuery = filters.searchQuery?.trim() || undefined;
    const durationFilter = durationFilters.includes(filters.durationFilter as DurationFilter)
      ? filters.durationFilter!
      : "ALL";
    const inclusionFilter = inclusionFilters.includes(filters.inclusionFilter as InclusionFilter)
      ? filters.inclusionFilter!
      : "ALL";
    const cachedInclusionFilter = inclusionFilter === "ALL" ? undefined : inclusionFilter;
    const sortBy = sortOptions.includes(filters.sortBy as SortOption)
      ? filters.sortBy!
      : "NEWEST";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const [publicDbTrips, userTrips] = await Promise.all([
      getPublicTemplateRecords(searchQuery, cachedInclusionFilter),
      user
        ? db.trip.findMany({
            where: { profileId: user.id },
            select: {
              id: true,
              title: true,
              destination: true,
              notes: {
                where: { category: "ClonedTemplate" },
                select: { content: true },
              },
            },
          })
        : Promise.resolve([]),
    ]);

    const mappedTemplates: TemplateTripItem[] = publicDbTrips.map((t) => {
      // Check if current user owns this template (creator) or has cloned it
      const isOwn = Boolean(user && t.profile.id === user.id);
      const isCloned = user
        ? isOwn ||
          userTrips.some(
            (ut) =>
              ut.notes.some((n) => n.content === t.id) ||
              ut.title.toLowerCase() === `${t.title} (plan)`.toLowerCase() ||
              (ut.title.toLowerCase() === t.title.toLowerCase() &&
                (ut.destination || "").toLowerCase() === (t.destination || "").toLowerCase())
          )
        : false;
      // Calculate authentic duration in days
      const days =
        t.startDate && t.endDate
          ? Math.max(
              1,
              Math.ceil(
                (new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) + 1
            )
          : Math.max(
              1,
              t.itinerary.length > 0
                ? Math.max(...t.itinerary.map((i) => i.dayNumber || 1))
                : 3
            );

      const currency = t.profile?.defaultCurrency || "INR";

      return {
        id: t.id,
        title: t.title,
        destination: t.destination,
        description: t.description,
        coverImageUrl: t.coverImageUrl,
        durationDays: days,
        isTemplate: t.isTemplate,
        isPublic: t.isPublic,
        isCloned,
        isOwn,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        author: {
          id: t.profile.id,
          fullName: t.profile.fullName,
          username: t.profile.username,
          avatarUrl: t.profile.avatarUrl,
          bio: t.profile.bio,
          isPublic: t.profile.isPublic,
        },
        metrics: {
          activityCount: t.itinerary.length,
          accommodationCount: t.accommodations.length,
          checklistCount: 0,
          notesCount: 0,
          expenseTotal: 0,
          currency,
        },
        inclusions: {
          hasStays: t.accommodations.length > 0,
          hasExpenses: false,
          hasChecklist: false,
          hasNotes: false,
          hasStory: t.linkedBlogPosts.length > 0,
        },
        itinerary: t.itinerary.map((i) => ({
          day: i.dayNumber || 1,
          title: i.title,
          category: i.category || "Activity",
          description: i.description || undefined,
          location: i.location || undefined,
        })),
        accommodations: t.accommodations.map((a) => ({
          name: a.name,
          type: a.type || "Hotel",
          address: a.address || undefined,
          currency: "USD",
        })),
        checklistHighlights: [],
        tips: [],
        linkedStory: t.linkedBlogPosts[0]
          ? {
              slug: t.linkedBlogPosts[0].slug,
              title: t.linkedBlogPosts[0].title,
            }
          : null,
      };
    });

    const durationFilteredTemplates = mappedTemplates.filter((template) => {
      if (durationFilter === "WEEKEND") return template.durationDays <= 3;
      if (durationFilter === "SHORT") return template.durationDays >= 4 && template.durationDays <= 7;
      if (durationFilter === "EXTENDED") return template.durationDays >= 8 && template.durationDays <= 14;
      if (durationFilter === "LONG") return template.durationDays >= 15;
      return true;
    });

    return durationFilteredTemplates.sort((a, b) => {
      if (sortBy === "MOST_ACTIONABLE") {
        return (
          b.metrics.activityCount + b.metrics.checklistCount -
          (a.metrics.activityCount + a.metrics.checklistCount)
        );
      }
      if (sortBy === "DURATION") return a.durationDays - b.durationDays;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error("Error fetching public trip templates:", error);
    return [];
  }
}

/**
 * Optional OpenRouter Free Tier AI customizer to adapt itinerary items during cloning.
 */
async function customizeItineraryWithAi(
  sourceTitle: string,
  destination: string | null,
  rawItinerary: Array<{ dayNumber: number | null; title: string; description: string | null; category: string | null }>,
  prompt: string
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || !prompt.trim()) {
    return null;
  }

  const systemMessage = `You are a professional travel planner assistant for Prava.
The user wants to customize an existing travel blueprint for "${sourceTitle}" (${destination || "Destination"}).
User customization request: "${prompt}".

CRITICAL INSTRUCTIONS:
1. Retain the complete day-by-day scope and sequence of the original itinerary. Do NOT truncate or drop days unless the user explicitly requested shortening the trip.
2. Adapt the activities, dining, or attractions in direct alignment with the user's customization request while keeping logistical feasibility intact.
3. Every single output activity MUST strictly follow this exact JSON schema:
[
  { "dayNumber": 1, "title": "Concise Activity Name", "category": "Food" | "Sightseeing" | "Transit" | "Activity", "description": "Crisp, practical details and tips" }
]
4. Return ONLY the raw JSON array. Never include markdown codeblocks, conversational commentary, or explanations.`;

  const res = await callOpenRouterFree({
    systemInstruction: systemMessage,
    messages: [
      {
        role: "user",
        content: JSON.stringify(
          rawItinerary.map((i) => ({
            dayNumber: i.dayNumber || 1,
            title: i.title,
            category: i.category,
            description: i.description,
          }))
        ),
      },
    ],
    temperature: 0.3,
    maxTokens: 1500,
  });

  if (res?.success && res.text) {
    try {
      const cleanJson = res.text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Treat malformed provider output as an unsuccessful customization.
    }
  }

  return null;
}

/**
 * Clone a public trip template directly into the authenticated user's workspace.
 * Optionally tailors the itinerary with OpenRouter free AI if a prompt is provided.
 */
export async function cloneTripTemplate(
  templateId: string,
  aiCustomizationPrompt?: string
): Promise<TemplateCloneResult> {
  let reservationToRefund: { userId: string; usageId: string } | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Please sign in to clone this itinerary." };
    }

    // Ensure user profile exists in Postgres safely
    await syncUserProfile(user);

    // Fetch source trip with all real assets
    const sourceTrip = await db.trip.findFirst({
      where: {
        id: templateId,
        isPublic: true,
      },
      include: {
        itinerary: { orderBy: [{ dayNumber: "asc" }, { order: "asc" }] },
        accommodations: { select: { name: true, type: true, address: true } },
      },
    });

    if (!sourceTrip) {
      return { success: false, error: "Template not found or not publicly available." };
    }

    const isPro = await hasActiveProSubscription(user.id);
    const customizationPrompt =
      typeof aiCustomizationPrompt === "string" ? aiCustomizationPrompt.trim() : "";

    if (customizationPrompt.length > MAX_TEMPLATE_CUSTOMIZATION_PROMPT_LENGTH) {
      return {
        success: false,
        error: `Customization instructions must be ${MAX_TEMPLATE_CUSTOMIZATION_PROMPT_LENGTH} characters or fewer.`,
      };
    }

    // Optional AI customization on activities
    let activitiesToCreate = sourceTrip.itinerary.map((i) => ({
      dayNumber: i.dayNumber || 1,
      time: i.time,
      title: i.title,
      description: i.description,
      location: i.location,
      category: i.category || "Activity",
      cost: null,
      order: i.order,
    }));

    let creditsDeducted = 0;
    let creditsRemaining: number | undefined;
    let aiCustomized = false;

    if (customizationPrompt && hasOpenRouterKey()) {
      const reservation = await reserveStandaloneAiCredits(
        user.id,
        TEMPLATE_CUSTOMIZATION_CREDIT_COST
      );

      if (!reservation.success) {
        return {
          success: false,
          error: `Insufficient AI credits (${reservation.userQuota.remaining}/${reservation.userQuota.quota}). Template customization requires ${TEMPLATE_CUSTOMIZATION_CREDIT_COST} credit.`,
          creditDepleted: true,
          userQuota: reservation.userQuota,
        };
      }

      reservationToRefund = { userId: user.id, usageId: reservation.usageId };
      creditsDeducted = TEMPLATE_CUSTOMIZATION_CREDIT_COST;
      creditsRemaining = reservation.userQuota.remaining;

      try {
        const tailored = await customizeItineraryWithAi(
          sourceTrip.title,
          sourceTrip.destination,
          sourceTrip.itinerary,
          customizationPrompt
        );

        if (Array.isArray(tailored) && tailored.length > 0) {
          activitiesToCreate = tailored.map((item, idx) => ({
            dayNumber: item.dayNumber || 1,
            time: null,
            title: item.title,
            description: item.description || null,
            location: null,
            category: item.category || "Activity",
            cost: null,
            order: idx,
          }));
          aiCustomized = true;
        } else {
          await refundStandaloneAiCredits(user.id, reservation.usageId);
          reservationToRefund = null;
          creditsDeducted = 0;
          creditsRemaining = undefined;
        }
      } catch (err) {
        await refundStandaloneAiCredits(user.id, reservation.usageId);
        reservationToRefund = null;
        creditsDeducted = 0;
        creditsRemaining = undefined;
        console.warn("AI Customization skipped due to error, cloning original:", err);
      }
    }

    // Execute atomic cloning transaction
    const newTrip = await db.$transaction(async (tx) => {
      await assertTripCapacity(tx, user.id, isPro, "clone");

      const createdTrip = await tx.trip.create({
        data: {
          profileId: user.id,
          title: `${sourceTrip.title} (Plan)`,
          destination: sourceTrip.destination,
          description: sourceTrip.description,
          coverImageUrl: sourceTrip.coverImageUrl,
          startDate: sourceTrip.startDate,
          endDate: sourceTrip.endDate,
          status: "PLANNING",
          isPublic: false,
          isTemplate: false,
        },
      });

      // Clone Itinerary Activities
      if (activitiesToCreate.length > 0) {
        await tx.itineraryItem.createMany({
          data: activitiesToCreate.map((i) => ({
            tripId: createdTrip.id,
            dayNumber: i.dayNumber,
            time: i.time,
            title: i.title,
            description: i.description,
            location: i.location,
            category: i.category,
            cost: null,
            order: i.order,
          })),
        });
      }

      // Clone Accommodations
      if (sourceTrip.accommodations.length > 0) {
        await tx.accommodation.createMany({
          data: sourceTrip.accommodations.map((a) => ({
            tripId: createdTrip.id,
            name: a.name,
            type: a.type,
            address: a.address,
          })),
        });
      }

      // Track template cloning source note for idempotency
      await tx.note.create({
        data: {
          tripId: createdTrip.id,
          title: "Cloned Template",
          content: templateId,
          category: "ClonedTemplate",
          isPinned: false,
        },
      });

      return createdTrip;
    });

    // The clone committed successfully; keep the ledger charge.
    reservationToRefund = null;

    revalidatePath("/trips");
    revalidatePath("/dashboard");
    revalidatePath("/templates");

    return {
      success: true,
      newTripId: newTrip.id,
      tripId: newTrip.id,
      aiCustomized,
      ...(creditsDeducted > 0
        ? { creditsDeducted, creditsRemaining }
        : {}),
    };
  } catch (error) {
    if (reservationToRefund) {
      try {
        await refundStandaloneAiCredits(reservationToRefund.userId, reservationToRefund.usageId);
      } catch (refundError) {
        console.error("Error refunding template customization credits:", refundError);
      }
    }
    console.error("Error cloning trip template:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clone itinerary.",
    };
  }
}
