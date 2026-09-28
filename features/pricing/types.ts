export interface MonthlyHistoryItem {
  id: string;
  month: string;
  period: string;
  plan: "Free Explorer" | "Pro Wanderer";
  tripsCreated: number;
  tripsUsed: number;
  tripsQuota: number;
  aiCreditsUsed: number;
  aiCreditsQuota: number;
  aiCreditsRemaining: number;
  status: "Active Cycle" | "Completed";
}

export interface TripAiUsageItem {
  id: string;
  title: string;
  destination: string | null;
  createdAt: string;
  coverImageUrl?: string | null;
  creditsUsed: number;
  percentageOfQuota: number;
}

export interface AccountUsageData {
  tier: "free" | "pro";
  tierName: "Free Explorer" | "Pro Wanderer";
  tripsUsed: number;
  tripsQuota: number;
  tripsRemaining: number;
  aiCreditsUsed: number;
  aiCreditsQuota: number;
  aiCreditsRemaining: number;
  storiesCount: number;
  totalExpensesLogged: number;
  billingCycleStart: string;
  billingCycleEnd: string;
  nextRenewalDate?: string;
  daysUntilRenewal?: number;
  currentMonthName: string;
  monthlyHistory: MonthlyHistoryItem[];
  tripUsage: TripAiUsageItem[];
  subscription?: {
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
}

export interface ConvertedPricingDTO {
  currencyCode: string;
  currencySymbol: string;
  rateFromInr: number;
  monthlyInr: number;
  annualInr: number;
  monthlyConverted: number;
  annualConverted: number;
  annualMonthlyEquivalent: number;
  savingsAmount: string;
  formattedMonthly: string;
  formattedAnnual: string;
  formattedAnnualMonthly: string;
}

export interface PolarCheckoutResult {
  success: boolean;
  checkoutUrl?: string;
  isSimulation?: boolean;
  message?: string;
  error?: string;
}

export interface PricingPlan {
  id: "free" | "pro";
  name: string;
  badge?: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  limitations?: string[];
  ctaText: string;
  popular?: boolean;
}
