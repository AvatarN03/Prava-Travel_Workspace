"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import {
  ArrowUpDown,
  Clock,
  Compass,
  Filter,
  LoaderCircle,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getPublicTripTemplates } from "../actions";
import { TemplateCard } from "./template-card";
import { TemplatePreviewDialog } from "./template-preview-dialog";

import type {
  DurationFilter,
  InclusionFilter,
  SortOption,
  TemplateTripItem,
} from "../types";

const INCLUSION_OPTIONS: { value: InclusionFilter; label: string }[] = [
  { value: "ALL", label: "All Inclusions" },
  { value: "HAS_STAYS", label: "Has Stays" },
  { value: "HAS_EXPENSES", label: "Has Budget" },
  { value: "HAS_CHECKLIST", label: "Has Packing List" },
  { value: "HAS_STORY", label: "Has Creator Story" },
];

const DURATION_OPTIONS: { value: DurationFilter; label: string }[] = [
  { value: "ALL", label: "All Durations" },
  { value: "WEEKEND", label: "Weekend (1–3d)" },
  { value: "SHORT", label: "Short Trip (4–7d)" },
  { value: "EXTENDED", label: "Extended (8–14d)" },
  { value: "LONG", label: "Long Journey (15+d)" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "NEWEST", label: "Newest First" },
  { value: "MOST_ACTIONABLE", label: "Most Actionable" },
  { value: "DURATION", label: "Trip Duration" },
];

interface TemplatesViewProps {
  initialTrips: TemplateTripItem[];
}

export function TemplatesView({ initialTrips }: TemplatesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState<DurationFilter>("ALL");
  const [inclusionFilter, setInclusionFilter] = useState<InclusionFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("NEWEST");
  const [trips, setTrips] = useState(initialTrips);
  const [previewTrip, setPreviewTrip] = useState<TemplateTripItem | null>(null);
  const [clonedIds, setClonedIds] = useState<Set<string>>(new Set());
  const [isFetching, startFetching] = useTransition();
  const [isSearchPending, setIsSearchPending] = useState(false);
  const latestRequestId = useRef(0);
  const previousSearchQuery = useRef(searchQuery);
  const isInitialFetch = useRef(true);

  const handleCloned = (tripId: string) => {
    setClonedIds((prev) => new Set(prev).add(tripId));
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    durationFilter !== "ALL" ||
    inclusionFilter !== "ALL" ||
    sortBy !== "NEWEST";

  const handleResetFilters = () => {
    setSearchQuery("");
    setDurationFilter("ALL");
    setInclusionFilter("ALL");
    setSortBy("NEWEST");
  };

  const requestTemplates = useCallback(() => {
    const requestId = ++latestRequestId.current;

    startFetching(async () => {
      const nextTrips = await getPublicTripTemplates({
        searchQuery,
        durationFilter,
        inclusionFilter,
        sortBy,
      });

      if (requestId === latestRequestId.current) {
        setTrips(nextTrips);
        setIsSearchPending(false);
      }
    });
  }, [durationFilter, inclusionFilter, searchQuery, sortBy]);

  useEffect(() => {
    if (isInitialFetch.current) {
      isInitialFetch.current = false;
      return;
    }

    const searchChanged = previousSearchQuery.current !== searchQuery;
    previousSearchQuery.current = searchQuery;
    const timeout = window.setTimeout(requestTemplates, searchChanged ? 400 : 0);

    return () => window.clearTimeout(timeout);
  }, [durationFilter, inclusionFilter, requestTemplates, searchQuery, sortBy]);

  const filteredTrips = trips.map((trip) => ({
    ...trip,
    isCloned: trip.isCloned || clonedIds.has(trip.id),
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1">
          <span className="font-sans text-[11px] font-semibold tracking-widest text-primary uppercase block select-none">
            Trip Blueprints
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground">
            Curated{" "}
            <span className="font-serif italic font-normal text-foreground">
              Itineraries
            </span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl">
            Real trip blueprints published by travelers. Preview complete day-by-day schedules, accommodations, and estimated budgets, then clone directly into your workspace.
          </p>
        </div>

        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search destination, keyword, creator..."
            className="pl-8.5 h-9 text-xs bg-card border-border text-foreground rounded-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchPending(true);
            }}
          />
          {(isFetching || isSearchPending) && (
            <LoaderCircle className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {searchQuery && !isFetching && !isSearchPending && (
            <button
              onClick={() => {
                setSearchQuery("");
                setIsSearchPending(true);
              }}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar (Borderless layout with Inclusions, Duration & Sort selects) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-1">
        {/* Left: Results Counter */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-0.5">
          <span>
            Showing <strong className="text-foreground font-semibold">{filteredTrips.length}</strong> trip{" "}
            {filteredTrips.length === 1 ? "template" : "templates"}
          </span>
        </div>

        {/* Right: Inclusions Select, Duration Select, Sort Select & Reset (Single Horizontal Row) */}
        <div className="flex w-full shrink-0 flex-nowrap items-center justify-end gap-2 md:w-auto">
          {/* Inclusion Filter Dropdown */}
          <Select
            value={inclusionFilter}
            onValueChange={(val) => setInclusionFilter(val as InclusionFilter)}
          >
            <SelectTrigger
              aria-label="Filter inclusions"
              className="h-8 w-9 shrink-0 justify-center rounded-sm border-border bg-background px-0 text-xs text-foreground max-sm:[&>svg:last-child]:hidden sm:w-38.75 sm:justify-between sm:px-3"
            >
              <Filter className="h-3.5 w-3.5 shrink-0 text-muted-foreground sm:mr-1.5" />
              <span className="max-sm:!hidden min-w-0 sm:inline">
                <SelectValue placeholder="Inclusions" />
              </span>
            </SelectTrigger>
            <SelectContent className="rounded-sm">
              {INCLUSION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Duration Filter Dropdown */}
          <Select
            value={durationFilter}
            onValueChange={(val) => setDurationFilter(val as DurationFilter)}
          >
            <SelectTrigger
              aria-label="Filter duration"
              className="h-8 w-9 shrink-0 justify-center rounded-sm border-border bg-background px-0 text-xs text-foreground max-sm:[&>svg:last-child]:hidden sm:w-38.75 sm:justify-between sm:px-3"
            >
              <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground sm:mr-1.5" />
              <span className="max-sm:!hidden min-w-0 sm:inline">
                <SelectValue placeholder="Duration" />
              </span>
            </SelectTrigger>
            <SelectContent className="rounded-sm">
              {DURATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By Dropdown */}
          <Select
            value={sortBy}
            onValueChange={(val) => setSortBy(val as SortOption)}
          >
            <SelectTrigger
              aria-label="Sort templates"
              className="h-8 w-9 shrink-0 justify-center rounded-sm border-border bg-background px-0 text-xs text-foreground max-sm:[&>svg:last-child]:hidden sm:w-36.25 sm:justify-between sm:px-3"
            >
              <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground sm:mr-1.5" />
              <span className="max-sm:!hidden min-w-0 sm:inline">
                <SelectValue placeholder="Sort by" />
              </span>
            </SelectTrigger>
            <SelectContent className="rounded-sm">
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer rounded-sm shrink-0"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Grid of Templates */}
      {filteredTrips.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-card/40 p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Compass className="h-7 w-7 text-primary" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              {hasActiveFilters
                ? "No trip templates match your filters"
                : "No public templates published yet"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              {hasActiveFilters
                ? "Try adjusting your search query, duration range, or inclusions to discover more travel plans."
                : "Be the first to publish a public itinerary! Navigate to any of your trips in the workspace and toggle 'Public' in the header to share your plan."}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs border-border"
              >
                Clear All Filters
              </Button>
            ) : (
              <Link href="/trips">
                <Button size="sm" className="dashboard-btn-primary gap-1.5 text-xs shadow-xs">
                  <Plus className="h-3.5 w-3.5" /> View My Trips
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TemplateCard
              key={trip.id}
              trip={trip}
              onPreview={(selected) => setPreviewTrip(selected)}
              onCloned={handleCloned}
            />
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <TemplatePreviewDialog
        trip={
          previewTrip
            ? {
                ...previewTrip,
                isCloned: previewTrip.isCloned || clonedIds.has(previewTrip.id),
              }
            : null
        }
        open={Boolean(previewTrip)}
        onOpenChange={(open) => {
          if (!open) setPreviewTrip(null);
        }}
        onCloned={handleCloned}
      />
    </div>
  );
}
