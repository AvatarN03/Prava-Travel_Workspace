import { detectTravelToolIntent } from "./travel-tools-dispatcher";
import { isItineraryPlanningIntent } from "./trip-agent-graph";

export type ComplexityTier =
  | "QUICK_TOOL"       // 1 Credit
  | "ADVISORY"         // 2 Credits
  | "SPECIALIZED"      // 3 Credits
  | "HEAVY_PLANNING";   // 5 Credits

export interface ComplexityEvaluation {
  tier: ComplexityTier;
  creditsCost: number;
  label: string;
  reason: string;
}

/**
 * Deterministically evaluates user prompt complexity to calculate AI credit usage.
 * Tiers:
 * - QUICK_TOOL (1 Credit): Live weather, currency FX, emergency info, basic factual lookups
 * - ADVISORY (2 Credits): Neighborhood tips, restaurant suggestions, cultural advice
 * - SPECIALIZED (3 Credits): Packing/Checklist generation, comprehensive notes, single-day schedules
 * - HEAVY_PLANNING (5 Credits): Multi-day itinerary drafts, complete workspace proposal generation
 */
export function evaluatePromptComplexity(
  prompt: string,
  options?: {
    tripDurationDays?: number | null;
    history?: Array<{ role: string; content: string }>;
    explicitDomain?: "checklist" | "itinerary" | "notes" | "accommodations";
  }
): ComplexityEvaluation {
  const p = prompt.trim();
  const wordCount = p.split(/\s+/).filter(Boolean).length;

  // 1. Explicit Domain Overrides (from dedicated workspace buttons)
  if (options?.explicitDomain === "checklist") {
    return {
      tier: "SPECIALIZED",
      creditsCost: 3,
      label: "AI Packing & Prep List",
      reason: "Structured checklist generation tailored to trip context",
    };
  }

  // 2. Heavy Multi-Day Itinerary Planning (Tier 4 - 5 Credits)
  const isItinerary = isItineraryPlanningIntent(p, options?.history);
  const multiDayRegex = /\b(\d+)\s*(?:[- ]?days?|d)\b/i;
  const multiDayMatch = p.match(multiDayRegex);
  const requestedDays = multiDayMatch ? parseInt(multiDayMatch[1], 10) : null;
  const isComprehensive =
    /\b(full|starter|kickstart|complete|whole|entire|all\s+days|day-by-day|day\s+by\s+day|populate)\b/i.test(p) ||
    (requestedDays !== null && requestedDays >= 3) ||
    (!requestedDays && (options?.tripDurationDays || 1) >= 3 && isItinerary);

  if (isItinerary && isComprehensive) {
    return {
      tier: "HEAVY_PLANNING",
      creditsCost: 5,
      label: "Multi-Day Itinerary Generation",
      reason: "Full schedule planning with timings, activities, and workspace proposals",
    };
  }

  // 3. Specialized Single-Domain Generation (Tier 3 - 3 Credits)
  const isChecklistPrompt =
    /\b(pack|packing|checklist|to[- ]bring|items\s+to\s+bring|what\s+should\s+i\s+pack|gear\s+list|luggage|preparation\s+list)\b/i.test(p);
  const isNotesOrGuidePrompt =
    /\b(create\s+note|write\s+a\s+guide|travel\s+guide|summary\s+doc|budget\s+breakdown|comprehensive\s+guide)\b/i.test(p);
  const isSingleDayItinerary =
    isItinerary && (requestedDays === 1 || requestedDays === 2 || /\bday\s*\d+\b/i.test(p));

  if (isChecklistPrompt) {
    return {
      tier: "SPECIALIZED",
      creditsCost: 3,
      label: "Checklist Generation",
      reason: "Tailored packing and travel preparation list",
    };
  }

  if (isNotesOrGuidePrompt) {
    return {
      tier: "SPECIALIZED",
      creditsCost: 3,
      label: "Document Generation",
      reason: "Comprehensive travel guide or structured note creation",
    };
  }

  if (isSingleDayItinerary) {
    return {
      tier: "SPECIALIZED",
      creditsCost: 3,
      label: "Single-Day Schedule Plan",
      reason: "Focused day schedule with activities and proposal items",
    };
  }

  // 4. Quick Tools & Fact Q&A (Tier 1 - 1 Credit)
  const toolIntent = detectTravelToolIntent(p);
  if (toolIntent) {
    return {
      tier: "QUICK_TOOL",
      creditsCost: 1,
      label: toolIntent.type === "weather" ? "Weather Lookup" : "Currency Conversion",
      reason: "Live tool lookup with real-time external data",
    };
  }

  const isFactualOrShort =
    wordCount <= 12 &&
    /\b(weather|temp|currency|rate|convert|time|timezone|plug|socket|voltage|water|safe|emergency|police|ambulance|embassy|code|dial|visa|entry)\b/i.test(p);

  const isGreetingOrAcknowledge =
    wordCount <= 5 &&
    /\b(hi|hello|hey|thanks|thank you|ok|okay|got it|sounds good|cool|great|awesome|understood)\b/i.test(p);

  if (isFactualOrShort || isGreetingOrAcknowledge) {
    return {
      tier: "QUICK_TOOL",
      creditsCost: 1,
      label: "Quick Query / Tool Lookup",
      reason: "Direct factual response or lightweight answer",
    };
  }

  // 5. Contextual Advisory (Tier 2 - 2 Credits)
  return {
    tier: "ADVISORY",
    creditsCost: 2,
    label: "Travel Advisory & Recommendations",
    reason: "Curated recommendations, tips, and destination advice",
  };
}
