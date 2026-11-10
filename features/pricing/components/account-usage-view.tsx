"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { ChevronDown as ChevronDownIcon, X } from "lucide";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Compass,
  CreditCard,
  ExternalLink,
  Globe,
  HelpCircle,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { MorphIcon } from "morphicons/react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import {
  createPolarCheckoutSession,
  createPolarCustomerPortalSession,
  getUserPricingCurrency,
} from "../actions";

import { SUPPORTED_CURRENCIES } from "@/features/travel-essentials";
import { PRICING_FAQS, PRICING_PLANS } from "../pricing-config";
import type { AccountUsageData, ConvertedPricingDTO } from "../actions";

interface AccountUsageViewProps {
  initialUsage: AccountUsageData;
  initialPricing?: ConvertedPricingDTO;
  billingAvailability: {
    annual: boolean;
    monthly: boolean;
  };
}

export function AccountUsageView({
  initialUsage,
  initialPricing,
  billingAvailability,
}: AccountUsageViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutSuccess = searchParams?.get("checkout") === "success";

  const usage = initialUsage;
  const [pricing, setPricing] = useState<ConvertedPricingDTO | null>(initialPricing || null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    billingAvailability.annual ? "annual" : "monthly"
  );
  const [openFaqItems, setOpenFaqItems] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  const isPro = usage.tier === "pro";
  const isAnnual = billingCycle === "annual";
  const checkoutAvailable = billingAvailability[billingCycle];

  useEffect(() => {
    if (!pricing) {
      getUserPricingCurrency().then((res) => {
        setPricing(res);
      });
    }
  }, [pricing]);

  const handleCurrencyChange = (currencyCode: string) => {
    startTransition(async () => {
      try {
        const res = await getUserPricingCurrency(currencyCode);
        setPricing(res);
        toast.info(`Pricing updated to ${res.currencyCode} (${res.currencySymbol})`);
      } catch {
        toast.error("Failed to load currency rates");
      }
    });
  };

  const handleStartPolarCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await createPolarCheckoutSession({ billingCycle });

      if (!res.success) {
        toast.error(res.error || "Failed to initiate Polar checkout");
        return;
      }

      if (!res.checkoutUrl) {
        toast.error("Polar did not return a checkout link. Please try again.");
        return;
      }

      toast.info("Redirecting to Polar Checkout...");
      window.location.href = res.checkoutUrl;
    } catch {
      toast.error("An unexpected error occurred contacting Polar.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleOpenCustomerPortal = async () => {
    const portalWindow = typeof window !== "undefined" ? window.open("about:blank", "_blank") : null;
    if (portalWindow) {
      try {
        portalWindow.opener = null;
      } catch {
        // Safe fallback
      }
    }

    setIsOpeningPortal(true);
    try {
      const res = await createPolarCustomerPortalSession();
      if (res.success && res.portalUrl) {
        toast.info("Opening Polar Customer Portal in a new tab...");
        if (portalWindow && !portalWindow.closed) {
          portalWindow.location.href = res.portalUrl;
        } else {
          window.open(res.portalUrl, "_blank", "noopener,noreferrer");
        }
      } else {
        if (portalWindow && !portalWindow.closed) {
          portalWindow.close();
        }
        toast.error(res.error || "Failed to open customer billing portal.");
      }
    } catch {
      if (portalWindow && !portalWindow.closed) {
        portalWindow.close();
      }
      toast.error("An unexpected error occurred contacting Polar.");
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const proMonthlyDisplay = pricing ? pricing.formattedMonthly : "₹200";
  const proAnnualMonthlyDisplay = pricing ? pricing.formattedAnnualMonthly : "₹167";
  const proAnnualTotalDisplay = pricing ? pricing.formattedAnnual : "₹2,000";
  const savingsDisplay = pricing?.savingsAmount || "₹400";
  const currencySymbol = pricing ? pricing.currencySymbol : "₹";
  const activeCurrencyCode = pricing ? pricing.currencyCode : "INR";

  return (
    <div className="max-w-7xl mx-auto space-y-8 w-full pb-16">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-zinc-800 pb-5">
        <div className="space-y-1">
          <span className="font-sans text-[11px] font-semibold tracking-widest text-primary uppercase block">
            Account billing
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground dark:text-zinc-50">
            Subscription <span className="font-serif italic font-normal text-foreground dark:text-zinc-100">& Billing</span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Compare workspace capacity, review your entitlement, and manage a Polar-billed plan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Currency Preference Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                className="h-8 text-xs rounded-sm gap-1.5 font-sans font-medium tabular-nums border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] text-foreground dark:text-zinc-200 hover:bg-muted/70 dark:hover:bg-zinc-800/60 cursor-pointer shadow-2xs"
              >
                <Globe className={`h-3.5 w-3.5 text-primary ${isPending ? "animate-spin" : ""}`} />
                <span>{activeCurrencyCode} ({currencySymbol})</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 max-h-64 overflow-y-auto rounded-sm border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] shadow-md">
              <div className="px-2 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-zinc-400">
                Select Pricing Currency
              </div>
              {SUPPORTED_CURRENCIES.map((c) => (
                <DropdownMenuItem
                  key={c.code}
                  onClick={() => handleCurrencyChange(c.code)}
                  className={`text-xs cursor-pointer font-sans flex items-center justify-between text-foreground dark:text-zinc-200 dark:hover:bg-zinc-800/60 ${c.code === activeCurrencyCode ? "font-semibold text-primary bg-primary/5 dark:bg-primary/10" : ""
                    }`}
                >
                  <span>{c.name}</span>
                  <span className="font-sans font-medium tabular-nums text-muted-foreground dark:text-zinc-400">{c.symbol} {c.code}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      {/* ── Checkout Confirmation Banner ── */}
      {checkoutSuccess && (
        <div className="rounded-md border border-sky-200 bg-sky-50/80 dark:border-sky-900/50 dark:bg-sky-950/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-sans font-semibold text-sky-900 dark:text-sky-100">
                Polar Checkout Completed
              </p>
              <p className="font-sans text-sky-700 dark:text-sky-300/80 mt-0.5 leading-relaxed">
                Your payment was received. As soon as the Polar webhook confirms processing, your workspace will reflect Pro privileges.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.refresh();
              toast.info("Checking subscription state...");
            }}
            className="h-7 text-xs font-sans font-semibold bg-background dark:bg-zinc-900 border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-200 shrink-0 cursor-pointer gap-1.5 rounded-sm"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh Status
          </Button>
        </div>
      )}

      {/* ── Current Active Tier Summary Card ── */}
      <div className={`relative rounded-md overflow-hidden border bg-card p-5 sm:p-6 shadow-xs ${
        isPro ? "border-primary/35" : "border-border"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-primary bg-primary/10 border border-primary/20 rounded-xs px-2 py-0.5">
                Current plan
              </span>
              <Badge
                variant="secondary"
                className={`font-sans text-xs font-semibold rounded-xs px-2 py-0.5 ${isPro
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                    : "bg-muted dark:bg-zinc-800/80 text-foreground dark:text-zinc-200 border-border/80 dark:border-zinc-700"
                  }`}
              >
                {usage.tierName}
              </Badge>
            </div>
            <h2 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground dark:text-zinc-50">
              {isPro ? (
                <>
                  Pro Wanderer <span className="font-serif italic font-normal text-muted-foreground dark:text-zinc-400 text-lg sm:text-xl">Membership</span>
                </>
              ) : (
                <>
                  Free Explorer <span className="font-serif italic font-normal text-muted-foreground dark:text-zinc-400 text-lg sm:text-xl">Membership</span>
                </>
              )}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-muted-foreground dark:text-zinc-400 max-w-xl leading-relaxed">
              {isPro
                ? `Your Pro entitlement is active${usage.nextRenewalDate ? ` through ${usage.nextRenewalDate}` : ""}. You have 25 trip slots and 150 AI credits per billing cycle.`
                : "Free Explorer includes 10 trip slots and 30 AI credits per billing cycle. Upgrade only when you need more capacity."}
            </p>

            {/* Quota metric chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-muted/50 dark:bg-[#121622] border border-border/70 dark:border-zinc-800 font-sans text-xs">
                <Compass className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold tabular-nums text-foreground dark:text-zinc-100">{usage.tripsUsed} / {usage.tripsQuota}</span>
                <span className="text-muted-foreground dark:text-zinc-400 text-[11px]">Trips</span>
              </div>
              {isPro && usage.subscription?.cancelAtPeriodEnd && (
                <span className="text-[11px] font-medium text-warning">
                  Cancels at the end of this paid period
                </span>
              )}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-muted/50 dark:bg-[#121622] border border-border/70 dark:border-zinc-800 font-sans text-xs">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span className="font-semibold tabular-nums text-foreground dark:text-zinc-100">{usage.aiCreditsUsed} / {usage.aiCreditsQuota}</span>
                <span className="text-muted-foreground dark:text-zinc-400 text-[11px]">AI credits</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
            <Link href="/usage">
              <Button variant="outline" size="sm" className="h-8 text-xs rounded-sm font-sans font-medium gap-1.5 cursor-pointer border-border/80 dark:border-zinc-800 dark:bg-[#121622] text-foreground dark:text-zinc-200 hover:bg-muted/70 dark:hover:bg-zinc-800/60 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>View Usage</span>
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
            {isPro && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenCustomerPortal}
                disabled={isOpeningPortal}
                className="h-8 text-xs rounded-sm font-semibold gap-1.5 cursor-pointer border-border"
              >
                {isOpeningPortal ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
                Manage billing
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Plan Comparison Header & Glitch-Free Billing Cycle Switcher ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground block mb-0.5">
              Plan comparison
            </span>
            <h2 className="font-sans text-base sm:text-lg font-semibold tracking-tight text-foreground dark:text-zinc-50">
              Choose the capacity you need
            </h2>
            <p className="font-sans text-xs text-muted-foreground dark:text-zinc-400 mt-0.5">
              Prices are shown in {activeCurrencyCode} ({currencySymbol}) and confirmed by Polar at checkout.
            </p>
          </div>

          {/* Glitch-Free Segmented Billing Switcher (50/50 width on mobile responsive) */}
          <div className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex p-1 bg-muted/60 dark:bg-[#121622] rounded-sm border border-border/80 dark:border-zinc-800 font-sans text-xs select-none">
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              disabled={!billingAvailability.annual}
              className={`py-1.5 px-3 rounded-xs font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border disabled:cursor-not-allowed disabled:opacity-50 ${isAnnual
                  ? "bg-card dark:bg-[#0F131C] text-foreground dark:text-zinc-100 shadow-2xs border-border/80 dark:border-zinc-800"
                  : "border-transparent text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200"
                }`}
            >
              <span>Yearly</span>
              <span className="font-sans text-[9px] font-semibold tabular-nums bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-1 py-0.2 rounded-xs shrink-0">
                Save {savingsDisplay}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              disabled={!billingAvailability.monthly}
              className={`py-1.5 px-3 rounded-xs font-semibold text-xs transition-colors flex items-center justify-center cursor-pointer border disabled:cursor-not-allowed disabled:opacity-50 ${!isAnnual
                  ? "bg-card dark:bg-[#0F131C] text-foreground dark:text-zinc-100 shadow-2xs border-border/80 dark:border-zinc-800"
                  : "border-transparent text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200"
                }`}
            >
              <span>Monthly</span>
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRICING_PLANS.map((plan) => {
            const isPlanPro = plan.id === "pro";
            const isCurrent = (isPlanPro && isPro) || (!isPlanPro && !isPro);

            // Dynamic localized pricing values
            const monthlyPrice = isPlanPro
              ? isAnnual
                ? proAnnualMonthlyDisplay
                : proMonthlyDisplay
              : `${currencySymbol}0`;

            const subPriceText = isPlanPro
              ? isAnnual
                ? `Total ${proAnnualTotalDisplay} / year • Save ${savingsDisplay} • Billed annually`
                : `Total ${proMonthlyDisplay} / month • Billed monthly`
              : "Free forever workspace tier";

            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-md border transition-all ${isPlanPro
                    ? "border-primary/60 dark:border-primary/50 shadow-sm bg-card dark:bg-[#0F131C] ring-1 ring-primary/20"
                    : "border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] shadow-xs"
                  }`}
              >
                {isPlanPro && !isCurrent && (
                  <div className="absolute -top-2.5 right-4 rounded-xs bg-primary px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-xs">
                    {plan.badge || "Recommended"}
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-2.5 right-4 rounded-xs border border-primary/25 bg-card px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-primary shadow-xs">
                    Your plan
                  </div>
                )}

                <div>
                  <CardHeader className="p-5 pb-4">
                    <div className="space-y-1">
                      <CardTitle className="font-brand font-medium tracking-[0.08em] text-base sm:text-lg uppercase text-foreground dark:text-zinc-100">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="font-serif italic font-normal text-xs sm:text-sm text-muted-foreground dark:text-zinc-400">
                        {plan.tagline}
                      </CardDescription>
                    </div>

                    {/* Price Block */}
                    <div className="pt-3 space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-sans text-2xl sm:text-3xl font-light tracking-tight tabular-nums text-foreground dark:text-zinc-50">
                          {monthlyPrice}
                        </span>
                        <span className="font-sans text-xs text-muted-foreground dark:text-zinc-400 font-medium">
                          / month
                        </span>
                        {isPlanPro && isAnnual && (
                          <Badge variant="secondary" className="font-sans text-[10px] font-semibold tabular-nums bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded-xs ml-1">
                            Billed Annually
                          </Badge>
                        )}
                      </div>
                      <p className="font-sans text-[11px] text-muted-foreground dark:text-zinc-400 tabular-nums">
                        {subPriceText}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-3">
                    <Separator className="border-border/60 dark:border-zinc-800" />
                    <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-zinc-400">
                      Included Features
                    </p>
                    <ul className="space-y-2 font-sans text-xs">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-foreground/90 dark:text-zinc-200">
                          <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>

                <CardFooter className="p-5 pt-3 border-t border-border/60 dark:border-zinc-800">
                  {isCurrent ? (
                    isPlanPro && isPro ? (
                      <Button
                        variant="outline"
                        onClick={handleOpenCustomerPortal}
                        disabled={isOpeningPortal}
                        className="w-full h-8 text-xs rounded-sm font-sans font-semibold border-primary/30 text-primary hover:bg-primary/5 dark:hover:bg-primary/10 shadow-xs cursor-pointer gap-1.5"
                        title="Manage billing and payment methods on Polar (opens in a new tab)"
                      >
                        {isOpeningPortal ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <ExternalLink className="h-3.5 w-3.5" />
                        )}
                        Manage Subscription
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        disabled
                        className="w-full h-8 text-xs rounded-sm font-sans font-semibold cursor-default opacity-80 border-border dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                        Active Plan
                      </Button>
                    )
                  ) : isPlanPro ? (
                    <Button
                      onClick={handleStartPolarCheckout}
                      disabled={isCheckingOut || !checkoutAvailable}
                      className="w-full h-8 text-xs rounded-sm font-sans font-semibold shadow-xs cursor-pointer gap-1.5 active:scale-[0.99] transition-all"
                    >
                      {isCheckingOut ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
                      )}
                      {checkoutAvailable ? `Upgrade with Polar (${monthlyPrice}/mo)` : "Billing option unavailable"}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                      className="w-full h-8 text-xs rounded-sm font-sans font-medium opacity-60 border-border dark:border-zinc-800"
                    >
                      Included with Account
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Subscription Details & Billing Navigation ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h2 className="font-sans text-sm sm:text-base font-semibold tracking-tight text-foreground dark:text-zinc-100">
            Billing details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="rounded-md border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="font-sans text-xs font-semibold text-foreground dark:text-zinc-100">Billing cycle & renewal</h3>
            <div className="space-y-2 font-sans text-xs text-muted-foreground dark:text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Current billing cycle</span>
                <span className="font-semibold text-foreground dark:text-zinc-200 tabular-nums">{usage.billingCycleStart} – {usage.billingCycleEnd}</span>
              </div>
              <Separator className="border-border/60 dark:border-zinc-800" />
              <div className="flex items-center justify-between">
                <span>Next renewal</span>
                <span className="font-semibold text-foreground dark:text-zinc-200 tabular-nums">
                  {usage.nextRenewalDate || "Next billing cycle"}
                </span>
              </div>
              <Separator className="border-border/60 dark:border-zinc-800" />
              <div className="flex items-center justify-between">
                <span>Billing provider</span>
                <span className="text-foreground dark:text-zinc-200 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Polar
                </span>
              </div>
            </div>
          </Card>

          <Card className="rounded-md border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="font-sans text-xs font-semibold text-foreground dark:text-zinc-100">Related settings</h3>
            <div className="space-y-2 font-sans">
              <Link
                href="/usage"
                className="flex items-center justify-between p-2.5 rounded-sm border border-border/70 dark:border-zinc-800 bg-muted/40 dark:bg-[#121622] hover:bg-muted dark:hover:bg-zinc-800/60 text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground dark:text-zinc-200">Usage and limits</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground dark:text-zinc-400" />
              </Link>
              <Link
                href="/profile"
                className="flex items-center justify-between p-2.5 rounded-sm border border-border/70 dark:border-zinc-800 bg-muted/40 dark:bg-[#121622] hover:bg-muted dark:hover:bg-zinc-800/60 text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground dark:text-zinc-200">Account settings</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground dark:text-zinc-400" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Frequently Asked Questions ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          <h2 className="font-sans text-sm sm:text-base font-semibold tracking-tight text-foreground dark:text-zinc-100">
            Subscription FAQ
          </h2>
        </div>

        <Accordion
          type="multiple"
          value={openFaqItems}
          onValueChange={setOpenFaqItems}
          className="space-y-2.5"
        >
          {PRICING_FAQS.map((faq, i) => {
            const itemKey = `faq-${i}`;
            const isOpen = openFaqItems.includes(itemKey);

            return (
              <AccordionItem
                key={i}
                value={itemKey}
                className="rounded-md border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] shadow-xs transition-colors duration-200 hover:border-border dark:hover:border-zinc-700 data-[state=open]:border-primary/40 data-[state=open]:bg-muted/10 dark:data-[state=open]:bg-[#121622]/40 overflow-hidden"
              >
                <AccordionTrigger
                  hideChevron
                  className="py-3 px-4 font-sans text-xs sm:text-sm font-semibold text-foreground dark:text-zinc-100 hover:no-underline flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <span className="text-left leading-relaxed">{faq.question}</span>
                  <div
                    className={cn(
                      "p-1.5 rounded-xs transition-all duration-300 ease-out shrink-0 flex items-center justify-center",
                      isOpen
                        ? "bg-primary/10 text-primary rotate-90 scale-105"
                        : "bg-muted/60 dark:bg-zinc-800/60 text-muted-foreground dark:text-zinc-400 group-hover:bg-muted dark:group-hover:bg-zinc-800 group-hover:text-foreground dark:group-hover:text-zinc-200 rotate-0 scale-100"
                    )}
                  >
                    <MorphIcon
                      icon={isOpen ? X : ChevronDownIcon}
                      size={15}
                      strokeWidth={2.2}
                      className="transition-colors duration-300"
                      spring="smooth"
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3.5 pt-0 font-sans text-xs sm:text-sm text-muted-foreground dark:text-zinc-400 leading-relaxed">
                  <div className="pt-2 border-t border-border/40 dark:border-zinc-800/80">
                    <p className="mt-1">{faq.answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

    </div>
  );
}

