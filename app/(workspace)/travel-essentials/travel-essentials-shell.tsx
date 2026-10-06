"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";

import {
  Bookmark,
  BookOpen,
  CloudSun,
  Coins,
  Languages,
  Loader2,
  Map,
} from "lucide-react";
import type { Link as PrismaLink } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type {
  CitySuggestion,
  CurrencyPerformanceData,
  FxRates,
  WeatherData,
} from "@/features/travel-essentials/types";

// High-fidelity tab skeleton fallback for on-demand bundle loading
function TabLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse w-full">
      {/* Top Module Card Header */}
      <div className="rounded-sm border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-sm bg-muted/60 shrink-0" />
            <div className="space-y-1.5">
              <div className="h-5 w-40 sm:w-52 bg-muted/80 rounded-xs" />
              <div className="h-3.5 w-60 sm:w-80 max-w-full bg-muted/50 rounded-xs" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-card-subtle border border-border rounded-xs" />
            <div className="h-8 w-28 bg-primary/20 rounded-xs" />
          </div>
        </div>

        {/* Search / Control Bar Placeholder */}
        <div className="pt-2">
          <div className="h-10 w-full max-w-lg bg-card-subtle border border-border rounded-sm" />
        </div>
      </div>

      {/* Grid of Metric / Content Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-border bg-card p-4 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-muted/70 rounded-xs" />
              <div className="h-5 w-5 bg-muted/40 rounded-xs" />
            </div>
            <div className="h-7 w-32 bg-muted/80 rounded-sm" />
            <div className="h-3 w-4/5 bg-muted/50 rounded-xs" />
          </div>
        ))}
      </div>

      {/* Bottom Main Content Surface */}
      <div className="rounded-sm border border-border bg-card p-6 shadow-xs space-y-3">
        <div className="h-4 w-44 bg-muted/70 rounded-xs" />
        <div className="h-36 w-full bg-card-subtle/50 rounded-sm border border-border/60" />
      </div>
    </div>
  );
}

// Next.js dynamic imports for lazy loading tab bundles without bloating initial page load
const CurrencyConverter = dynamic(
  () =>
    import("@/features/travel-essentials/currency/currency-converter").then(
      (m) => m.CurrencyConverter
    ),
  { loading: () => <TabLoadingSkeleton /> }
);

const WeatherView = dynamic(
  () => import("@/features/travel-essentials/weather/weather-view").then((m) => m.WeatherView),
  { loading: () => <TabLoadingSkeleton /> }
);

const CountryGuideView = dynamic(
  () =>
    import("@/features/travel-essentials/country-guide/country-guide-view").then(
      (m) => m.CountryGuideView
    ),
  { loading: () => <TabLoadingSkeleton /> }
);

const LanguageView = dynamic(
  () =>
    import("@/features/travel-essentials/language/language-view").then((m) => m.LanguageView),
  { loading: () => <TabLoadingSkeleton /> }
);

const MapView = dynamic(
  () => import("@/features/travel-essentials/maps/map-view").then((m) => m.MapView),
  { ssr: false, loading: () => <TabLoadingSkeleton /> }
);

const VaultView = dynamic(
  () =>
    import("@/features/travel-essentials/vault/components/vault-view").then(
      (m) => m.VaultView
    ),
  { loading: () => <TabLoadingSkeleton /> }
);

export type TabType = "currency" | "weather" | "guide" | "language" | "maps" | "vault";

interface TravelEssentialsShellProps {
  initialTab?: TabType;
  initialWeather: WeatherData | null;
  initialFxRates: FxRates | null;
  initialVaultLinks?: PrismaLink[];
  preferredCurrency?: string;
  onWeatherSearch: (city: string) => Promise<WeatherData | null>;
  onCitySuggestions?: (query: string) => Promise<CitySuggestion[]>;
  onFxRefresh: (base: string) => Promise<FxRates | null>;
  onFetchPerformance?: (
    base: string,
    target: string,
    range: "7D" | "1M" | "3M" | "1Y"
  ) => Promise<CurrencyPerformanceData | null>;
}

// Curated priority order: Most frequent tools first (Currency -> Weather -> Country Guide -> Language -> Maps -> Vault)
const TABS: { id: TabType; label: string; description: string; icon: React.ElementType; iconColor: string }[] = [
  { id: "currency", label: "Currency", description: "Live ECB rates & conversions", icon: Coins, iconColor: "text-emerald-500" },
  { id: "weather", label: "Weather", description: "Forecasts & packing tips", icon: CloudSun, iconColor: "text-amber-500" },
  { id: "guide", label: "Country Guide", description: "Visas, plugs & emergency facts", icon: BookOpen, iconColor: "text-indigo-500" },
  { id: "language", label: "Language", description: "Local phrases & phrasebooks", icon: Languages, iconColor: "text-violet-500" },
  { id: "maps", label: "Maps", description: "Interactive POI radar & amenities", icon: Map, iconColor: "text-sky-500" },
  { id: "vault", label: "Resource Vault", description: "Saved links, docs & bookings", icon: Bookmark, iconColor: "text-blue-500" },
];

export function TravelEssentialsShell({
  initialTab = "currency",
  initialWeather,
  initialFxRates,
  initialVaultLinks = [],
  preferredCurrency = "INR",
  onWeatherSearch,
  onCitySuggestions,
  onFxRefresh,
  onFetchPerformance,
}: TravelEssentialsShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize active tab from search params if available, fallback to initialTab
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const rawQueryTab = searchParams.get("tab");
    const normalized =
      rawQueryTab === "emergency" ? "guide" : (rawQueryTab as TabType | null);
    if (normalized && TABS.some((t) => t.id === normalized)) {
      return normalized;
    }
    return initialTab;
  });

  // Track visited tabs to lazy-mount components on their first click, then retain them in DOM
  const [visitedTabs, setVisitedTabs] = useState<Set<TabType>>(() => new Set([activeTab]));

  // Find metadata for the currently active tab
  const activeTabMeta = TABS.find((t) => t.id === activeTab) || TABS[0];
  const ActiveIcon = activeTabMeta.icon;

  // Instant client-side tab switching with shallow URL synchronization
  const handleTabChange = (val: string) => {
    const nextTab = val as TabType;
    setActiveTab(nextTab);
    setVisitedTabs((prev) => {
      if (prev.has(nextTab)) return prev;
      const nextSet = new Set(prev);
      nextSet.add(nextTab);
      return nextSet;
    });

    // Shallow history replace — updates address bar without triggering Next.js server component re-renders
    if (typeof window !== "undefined") {
      const url = nextTab === "currency" ? pathname : `${pathname}?tab=${nextTab}`;
      window.history.replaceState(null, "", url);
    }
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("tab");
      const normalized = raw === "emergency" ? "guide" : (raw as TabType | null);
      const target: TabType =
        normalized && TABS.some((t) => t.id === normalized) ? normalized : "currency";
      setActiveTab(target);
      setVisitedTabs((prev) => {
        if (prev.has(target)) return prev;
        const nextSet = new Set(prev);
        nextSet.add(target);
        return nextSet;
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Synchronize when URL search param ?tab= changes (e.g. from desktop sidebar clicks)
  useEffect(() => {
    const rawQueryTab = searchParams.get("tab");
    const normalized =
      rawQueryTab === "emergency" ? "guide" : (rawQueryTab as TabType | null);
    const target: TabType =
      normalized && TABS.some((t) => t.id === normalized) ? normalized : "currency";
    setActiveTab(target);
    setVisitedTabs((prev) => {
      if (prev.has(target)) return prev;
      const nextSet = new Set(prev);
      nextSet.add(target);
      return nextSet;
    });
  }, [searchParams]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* ── Editorial Workspace Header ── */}
      <div className="flex flex-col gap-1.5 pb-5 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <span className="font-sans text-[11px] font-semibold tracking-widest text-primary uppercase block">
            Travel Toolkit
          </span>
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-primary/10 border border-primary/20 text-primary text-xs font-semibold dark:bg-primary/15 dark:border-primary/30">
            <ActiveIcon className="w-3.5 h-3.5" />
            <span>{activeTabMeta.label}</span>
          </div>
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground dark:text-zinc-50">
          Travel{" "}
          <span className="font-serif italic font-normal text-foreground dark:text-zinc-200">
            Essentials
          </span>
        </h1>
        <p className="font-sans text-xs sm:text-sm text-muted-foreground dark:text-slate-400 font-normal leading-relaxed max-w-3xl">
          A dedicated toolkit for smooth journeys. Check live forecasts, convert currencies, explore maps, and access emergency contacts and phrasebooks.
        </p>
      </div>

      {/* Navigation Controls: Mobile Select Dropdown (< sm) & Tablet Tab Strip (sm to md) — Hidden on Desktop (md:hidden) as sidebar drives navigation */}
      <div className="md:hidden space-y-3">
        {/* Mobile Tool Selector (< sm) */}
        <div className="sm:hidden space-y-1.5">
          <div className="flex items-center justify-between px-0.5">
            <span className="font-sans text-[10px] font-semibold text-primary uppercase tracking-widest">
              Active Travel Tool
            </span>
            <span className="font-sans text-[10px] font-medium text-primary tabular-nums">
              {TABS.findIndex((t) => t.id === activeTab) + 1} of {TABS.length} tools
            </span>
          </div>

          <Select value={activeTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full h-12 bg-card border-border shadow-xs px-3 rounded-sm text-left cursor-pointer focus:ring-primary">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-muted/60 dark:bg-slate-800/60 shrink-0">
                  <ActiveIcon className={`w-4 h-4 ${activeTabMeta.iconColor}`} />
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="truncate font-sans text-xs font-bold text-foreground dark:text-zinc-100">
                    {activeTabMeta.label}
                  </span>
                  <span className="truncate font-sans text-[10px] text-muted-foreground dark:text-slate-400 font-normal">
                    {activeTabMeta.description}
                  </span>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="w-[calc(100vw-2rem)] max-w-sm bg-popover border-border">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <SelectItem
                    key={tab.id}
                    value={tab.id}
                    className="cursor-pointer py-2.5 font-sans text-xs font-medium focus:bg-accent"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-muted/50 dark:bg-slate-800/50 shrink-0">
                        <Icon className={`w-3.5 h-3.5 ${tab.iconColor}`} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-sans font-semibold text-foreground dark:text-zinc-100 text-xs">{tab.label}</span>
                        <span className="font-sans text-[10px] text-muted-foreground dark:text-slate-400">{tab.description}</span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Tablet Tabs (sm to md) */}
        <div className="hidden sm:block overflow-x-auto pb-1 no-scrollbar">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="h-10 bg-muted/70 dark:bg-card p-1 rounded-sm border border-border/60 inline-flex items-center gap-1 w-auto min-w-full sm:min-w-0 justify-start">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 rounded-sm px-3.5 py-1.5 font-sans text-xs font-medium transition-all duration-150 data-[state=active]:bg-background dark:data-[state=active]:bg-card-subtle data-[state=active]:text-foreground data-[state=active]:border data-[state=active]:border-primary/40 dark:text-slate-400 dark:hover:text-white cursor-pointer select-none"
                  >
                    <Icon className={`w-3.5 h-3.5 ${tab.iconColor} shrink-0`} />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Tab Contents: Retained in DOM once visited with zero skeleton flash & instant 0ms switching */}
      <div className="w-full">
        {/* Currency Converter */}
        <div className={activeTab === "currency" ? "block" : "hidden"}>
          {visitedTabs.has("currency") && (
            <CurrencyConverter
              initialRates={initialFxRates}
              userPreferredCurrency={preferredCurrency}
              onRefresh={onFxRefresh}
              onFetchPerformance={onFetchPerformance}
            />
          )}
        </div>

        {/* Weather Forecasts */}
        <div className={activeTab === "weather" ? "block" : "hidden"}>
          {visitedTabs.has("weather") && (
            <WeatherView
              initialData={initialWeather}
              onSearch={onWeatherSearch}
              onCitySuggestions={onCitySuggestions}
            />
          )}
        </div>

        {/* Country Guide */}
        <div className={activeTab === "guide" ? "block" : "hidden"}>
          {visitedTabs.has("guide") && <CountryGuideView />}
        </div>

        {/* Language Phrasebook */}
        <div className={activeTab === "language" ? "block" : "hidden"}>
          {visitedTabs.has("language") && <LanguageView />}
        </div>

        {/* Interactive Maps */}
        <div className={activeTab === "maps" ? "block" : "hidden"}>
          {visitedTabs.has("maps") && <MapView />}
        </div>

        {/* Resource Vault */}
        <div className={activeTab === "vault" ? "block" : "hidden"}>
          {visitedTabs.has("vault") && <VaultView initialLinks={initialVaultLinks} />}
        </div>
      </div>
    </div>
  );
}
