import { Calendar, CreditCard, Hotel } from "lucide-react";

// Navigation items used by LandingHeader for desktop and mobile menus.
export const LANDING_NAV_ITEMS = [
  { id: "workspace", label: "Workspace" },
  { id: "travel-tools", label: "Travel Tools" },
  { id: "community", label: "Community" },
  { id: "pricing", label: "Pricing" },
] as const;

// Feature pillars used by ThesisSection's primary architecture cards.
export const LANDING_THESIS_PILLARS = [
  {
    index: "01",
    tag: "Daily Route Flow",
    title: "Multi-Day Itineraries",
    description:
      "Organize daily stops, departure times, transport routes, and travel notes in a structured timeline you can adjust anytime.",
    icon: Calendar,
    detail: "Timed stops · Map coordinates · Reorderable days",
  },
  {
    index: "02",
    tag: "Stays & Reservations",
    title: "Accommodations & Passes",
    description:
      "Keep hotel addresses, check-in dates, confirmation numbers, and transit tickets together without searching across email inboxes.",
    icon: Hotel,
    detail: "Booking references · Check-in dates · Address cards",
  },
  {
    index: "03",
    tag: "Budgets & Essentials",
    title: "Expenses & Travel Tools",
    description:
      "Track shared costs with multi-currency conversions, manage packing checklists, and check live weather forecasts and country guides.",
    icon: CreditCard,
    detail: "Multi-currency ledger · Packing items · Live weather & FX",
  },
] as const;

// Capability metrics used by ThesisSection's supporting metrics row.
export const LANDING_THESIS_CAPABILITIES = [
  { metric: "7 Tabs", desc: "Dedicated trip workspace" },
  { metric: "Live FX", desc: "Multi-currency budgeting" },
  { metric: "Offline", desc: "Cached trip itineraries" },
  { metric: "1-Click", desc: "Community trip cloning" },
] as const;
