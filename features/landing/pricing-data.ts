export interface PricingFeature {
  emphasis?: string;
  suffix?: string;
  text?: string;
}

export const PRICING_FEATURES: Record<"free" | "pro", readonly PricingFeature[]> = {
  free: [
    { emphasis: "10 Trips", suffix: " total workspace capacity" },
    { emphasis: "30 AI Workspace Credits", suffix: " per month (Proposal Actions)" },
    { text: "Full 7-tab trip workspace (Itinerary, Stays, Expenses, Notes)" },
    { text: "Live travel essentials (Weather, Currency FX, Emergency)" },
    { text: "Offline cache via IndexedDB for flights & roaming" },
  ],
  pro: [
    { emphasis: "25 Active Trips", suffix: " with unlimited trip archives" },
    { emphasis: "150 AI Workspace Credits", suffix: " per month (5x capacity)" },
    { text: "AI Route & Itinerary Resequencing (heat & transit buffers)" },
    { text: "Publish unlimited public itineraries & travel stories" },
    { text: "Verified Creator badge & custom @username profile" },
    { text: "Priority multi-device cloud synchronization" },
  ],
} as const;
