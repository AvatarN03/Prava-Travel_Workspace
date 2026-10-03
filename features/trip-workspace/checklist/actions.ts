"use server";

import { revalidatePath } from "next/cache";

import { GEMINI_TRIPS_MODELS, getGeminiClient } from "@/lib/ai";
import { db } from "@/lib/db";
import { getUserAiCredits } from "../ai/actions";
import { verifyTripOwnership } from "../common/auth-check";

import type { UserAiQuotaDTO } from "../ai/actions";
import {
  createChecklistItemSchema,
  deleteChecklistItemSchema,
  toggleChecklistItemSchema,
  updateChecklistItemSchema,
  type CreateChecklistItemInput,
  type DeleteChecklistItemInput,
  type ToggleChecklistItemInput,
  type UpdateChecklistItemInput,
} from "./schema";

export async function createChecklistItem(input: CreateChecklistItemInput) {
  try {
    const validated = createChecklistItemSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validation failed", fieldErrors: validated.error.flatten().fieldErrors };
    }

    const { tripId, title, category, dueDate, order } = validated.data;
    const { authorized, isOwner } = await verifyTripOwnership(tripId);
    if (!authorized || !isOwner) {
      return { success: false, error: "Unauthorized" };
    }

    const item = await db.checklistItem.create({
      data: {
        tripId,
        title,
        category: category || "General",
        dueDate: dueDate ? new Date(dueDate) : null,
        order: order ?? 0,
        isCompleted: false,
      },
    });

    revalidatePath(`/trips/${tripId}/checklist`);
    revalidatePath(`/trips/${tripId}/overview`);

    return { success: true, data: item };
  } catch (error) {
    console.error("Error creating checklist item:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to add task" };
  }
}

export async function updateChecklistItem(input: UpdateChecklistItemInput) {
  try {
    const validated = updateChecklistItemSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Validation failed", fieldErrors: validated.error.flatten().fieldErrors };
    }

    const { id, tripId, title, category, dueDate, isCompleted, order } = validated.data;
    const { authorized, isOwner } = await verifyTripOwnership(tripId);
    if (!authorized || !isOwner) {
      return { success: false, error: "Unauthorized" };
    }

    const updated = await db.checklistItem.update({
      where: { id },
      data: {
        title,
        category: category || "General",
        dueDate: dueDate ? new Date(dueDate) : null,
        isCompleted,
        order: order ?? 0,
      },
    });

    revalidatePath(`/trips/${tripId}/checklist`);
    revalidatePath(`/trips/${tripId}/overview`);

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating checklist item:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update task" };
  }
}

export async function deleteChecklistItem(input: DeleteChecklistItemInput) {
  try {
    const validated = deleteChecklistItemSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Invalid input" };
    }

    const { id, tripId } = validated.data;
    const { authorized, isOwner } = await verifyTripOwnership(tripId);
    if (!authorized || !isOwner) {
      return { success: false, error: "Unauthorized" };
    }

    await db.checklistItem.delete({
      where: { id },
    });

    revalidatePath(`/trips/${tripId}/checklist`);
    revalidatePath(`/trips/${tripId}/overview`);

    return { success: true, data: { id } };
  } catch (error) {
    console.error("Error deleting checklist item:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete task" };
  }
}

/**
 * Server Action: 1-Click Seed of Essential Travel Packing & Document Checklist.
 * Deduplicates against existing items to prevent repeat duplicate entries.
 */
export async function seedEssentialChecklist(tripId: string) {
  try {
    const { authorized, isOwner } = await verifyTripOwnership(tripId);
    if (!authorized || !isOwner) {
      return { success: false, error: "Unauthorized" };
    }

    const ESSENTIALS = [
      { title: "Check Passport expiration (valid for 6+ months)", category: "Documents" },
      { title: "Verify Visa and entry requirements", category: "Documents" },
      { title: "Purchase Travel Insurance policy", category: "Documents" },
      { title: "Universal travel power adapter & plug converter", category: "Packing" },
      { title: "Prescription medications & mini first-aid kit", category: "Packing" },
      { title: "Portable power bank & charging cables", category: "Packing" },
      { title: "Download offline maps (Google Maps / Maps.me)", category: "Preparation" },
      { title: "Notify credit card bank / check international fees", category: "Finance" },
      { title: "Save copies of lodging bookings & confirmation codes", category: "Documents" },
    ];

    const existing = await db.checklistItem.findMany({
      where: { tripId },
      select: { title: true },
    });
    const existingTitles = new Set(existing.map((i) => i.title.toLowerCase().trim()));

    const toInsert = ESSENTIALS.filter(
      (item) => !existingTitles.has(item.title.toLowerCase().trim())
    );

    if (toInsert.length === 0) {
      return {
        success: true,
        count: 0,
        alreadySeeded: true,
        message: "All starter essentials are already in your checklist.",
      };
    }

    const startOrder = existing.length;

    await db.checklistItem.createMany({
      data: toInsert.map((item, idx) => ({
        tripId,
        title: item.title,
        category: item.category,
        isCompleted: false,
        order: startOrder + idx,
      })),
    });

    revalidatePath(`/trips/${tripId}/checklist`);
    revalidatePath(`/trips/${tripId}/overview`);

    return { success: true, count: toInsert.length };
  } catch (error) {
    console.error("Error seeding checklist:", error);
    return { success: false, error: "Failed to add starter checklist" };
  }
}

/**
 * Server Action: Generate customized, destination-tailored packing & preparation checklist using AI.
 * Deducts 3 credits (Tier 3: Specialized Generation) and deduplicates against existing items.
 */
export async function generateAiChecklist(tripId: string): Promise<{
  success: boolean;
  count?: number;
  creditsCost?: number;
  userQuota?: UserAiQuotaDTO;
  error?: string;
  message?: string;
}> {
  try {
    const { authorized, isOwner, user, trip } = await verifyTripOwnership(tripId);
    if (!authorized || !isOwner || !user || !trip) {
      return { success: false, error: "Unauthorized or trip not found" };
    }

    const REQUIRED_CREDITS = 3;
    const userQuota = await getUserAiCredits(user.id);
    if (userQuota.remaining < REQUIRED_CREDITS) {
      return {
        success: false,
        error: `Insufficient AI credits (${userQuota.remaining}/${userQuota.quota}). AI Checklist generation requires ${REQUIRED_CREDITS} credits.`,
      };
    }

    const ai = getGeminiClient();
    if (!ai) {
      return { success: false, error: "AI service is currently unavailable. Please verify API configuration." };
    }

    // Existing items to avoid duplicates
    const existing = await db.checklistItem.findMany({
      where: { tripId },
      select: { title: true },
    });
    const existingTitles = new Set(existing.map((i) => i.title.toLowerCase().trim()));

    const destination = trip.destination || trip.title;
    const datesInfo = trip.startDate
      ? `from ${trip.startDate.toISOString().split("T")[0]}${trip.endDate ? ` to ${trip.endDate.toISOString().split("T")[0]}` : ""}`
      : "dates unspecified";

    const prompt = `You are an expert travel assistant. Generate 8 to 12 essential, highly practical travel preparation and packing checklist items for a trip to "${destination}" (${datesInfo}).
Include categories such as "Packing", "Documents", "Health", "Finance", and "Preparation".
Focus on specific destination-appropriate essentials (e.g. climate-specific gear, local health/vaccine requirements, currency/payment essentials, adapter types, entry rules).
Return ONLY a valid JSON array of objects with keys "title" (concise actionable task string, e.g. "Pack breathable rain shell jacket") and "category" ("Packing" | "Documents" | "Health" | "Finance" | "Preparation"). Do not enclose in markdown code fences if possible, or use standard json markdown.`;

    let generatedItems: Array<{ title: string; category: string }> = [];

    for (const model of GEMINI_TRIPS_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const raw = response.text || "";
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            generatedItems = parsed
              .map((item: any) => ({
                title: String(item.title || "").trim(),
                category: String(item.category || "Preparation").trim(),
              }))
              .filter((item) => item.title.length > 0);
            break;
          }
        }
      } catch (err) {
        console.warn(`Model ${model} failed for checklist generation:`, err);
      }
    }

    if (generatedItems.length === 0) {
      return { success: false, error: "AI was unable to generate checklist items. Please try again." };
    }

    // Deduplicate against existing items
    const toInsert = generatedItems.filter(
      (item) => !existingTitles.has(item.title.toLowerCase().trim())
    );

    if (toInsert.length === 0) {
      return {
        success: true,
        count: 0,
        message: "All suggested items are already in your checklist!",
        userQuota,
      };
    }

    const startOrder = existing.length;

    await db.checklistItem.createMany({
      data: toInsert.map((item, idx) => ({
        tripId,
        title: item.title,
        category: item.category,
        isCompleted: false,
        order: startOrder + idx,
      })),
    });

    // Record credit usage in AI conversation thread
    let conversation = await db.aiConversation.findFirst({
      where: { tripId, profileId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    if (!conversation) {
      conversation = await db.aiConversation.create({
        data: {
          tripId,
          profileId: user.id,
          title: `${trip.title} Assistant`,
        },
      });
    }

    await db.aiMessage.createMany({
      data: [
        {
          conversationId: conversation.id,
          role: "user",
          content: `Generate tailored packing & travel checklist for ${destination}`,
          creditsCost: REQUIRED_CREDITS,
        },
        {
          conversationId: conversation.id,
          role: "model",
          content: `Generated ${toInsert.length} tailored checklist items for ${destination} across ${Array.from(new Set(toInsert.map((i) => i.category))).join(", ")}.`,
          creditsCost: 0,
        },
      ],
    });

    revalidatePath(`/trips/${tripId}/checklist`);
    revalidatePath(`/trips/${tripId}/overview`);

    const updatedQuota = await getUserAiCredits(user.id);

    return {
      success: true,
      count: toInsert.length,
      creditsCost: REQUIRED_CREDITS,
      userQuota: updatedQuota,
    };
  } catch (error) {
    console.error("Error generating AI checklist:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate AI checklist",
    };
  }
}

export async function toggleChecklistItem(input: ToggleChecklistItemInput) {
  try {
    const validated = toggleChecklistItemSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Invalid input" };
    }

    const { id, tripId, isCompleted } = validated.data;
    const { authorized, isOwner } = await verifyTripOwnership(tripId);
    if (!authorized || !isOwner) {
      return { success: false, error: "Unauthorized" };
    }

    const updated = await db.checklistItem.update({
      where: { id },
      data: { isCompleted },
    });

    revalidatePath(`/trips/${tripId}/checklist`);
    revalidatePath(`/trips/${tripId}/overview`);

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error toggling checklist item:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to toggle task" };
  }
}
