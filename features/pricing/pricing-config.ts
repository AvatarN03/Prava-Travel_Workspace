import type { PricingPlan } from "./types";

export type { PricingPlan };

export const MAX_FREE_TRIPS = 10;
export const MAX_PRO_TRIPS = 25;
export const MAX_FREE_AI_MESSAGES = 30;
export const MAX_PRO_AI_MESSAGES = 150;

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free Explorer",
    tagline: "A complete manual travel workspace for every trip.",
    monthlyPrice: 0,
    annualPrice: 0,
    ctaText: "Current Plan",
    features: [
      "Up to 10 active & planned trips",
      "30 AI assistant credits per billing cycle",
      "Full Trip Workspace (Itinerary, Stays, Expenses, Notes)",
      "Standard Travel Essentials (Weather, Currency, Maps)",
      "Community templates, discussions, and stories",
      "Public creator profile and story publishing",
    ],
    limitations: [
      "Maximum 10 trips total",
      "30 AI credits per billing cycle",
    ],
  },
  {
    id: "pro",
    name: "Pro Wanderer",
    badge: "Most Popular",
    popular: true,
    tagline: "More workspace capacity and a larger AI planning allowance.",
    monthlyPrice: 200,
    annualPrice: 2000,
    ctaText: "Upgrade to Pro",
    features: [
      "Up to 25 active & planned trips",
      "150 AI assistant credits per billing cycle",
      "Everything included with Free Explorer",
      "Your Polar subscription remains active until its paid period ends",
    ],
  },
];

export const PRICING_FAQS = [
  {
    question: "What happens when I reach the 10-trip limit on the Free plan?",
    answer:
      "On the Free Explorer tier, you can manage up to 10 trips. If you need more workspaces, upgrade to Pro Wanderer for capacity of 25 trips, or archive trips you no longer need.",
  },
  {
    question: "How does the AI Assistant credit limit work?",
    answer:
      "Free Explorer includes 30 AI assistant credits per billing cycle. Pro Wanderer includes 150. Your next renewal date is shown in Usage and Subscription after your account is billed.",
  },
  {
    question: "How is billing and checkout handled?",
    answer:
      "Subscriptions are handled by Polar, our Merchant of Record. Checkout, invoices, payment methods, and cancellations are managed in Polar's secure customer portal.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your Pro Wanderer subscription at any time with a single click. Your Pro access and privileges will remain active until the end of your current billing period.",
  },
  {
    question: "Are my published trips and stories preserved if I downgrade?",
    answer:
      "Absolutely. All your published itineraries, travel stories, and public profile data remain online and accessible to the community regardless of your subscription tier.",
  },
];
