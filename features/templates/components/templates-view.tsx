"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ArrowUpDown,
  Clock,
  Compass,
  Filter,
  Plus,
  Search,
  Sparkles,
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
  const [previewTrip, setPreviewTrip] = useState<TemplateTripItem | null>(null);
  const [clonedIds, setClonedIds] = useState<Set<string>>(new Set());

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

  const filteredTrips = useMemo(() => {
    let result = initialTrips.map((t) => ({
      ...t,
      isCloned: t.isCloned || clonedIds.has(t.id),
    }));

    // 1. Destination & Keyword Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((trip) => {
        return (
          trip.title.toLowerCase().includes(q) ||
          (trip.destination && trip.destination.toLowerCase().includes(q)) ||
          (trip.description && trip.description.toLowerCase().includes(q)) ||
          (trip.author.fullName && trip.author.fullName.toLowerCase().includes(q)) ||
          (trip.author.username && trip.author.username.toLowerCase().includes(q)) ||
          trip.itinerary.some((i) => i.title.toLowerCase().includes(q))
        );
      });
    }

    // 2. Duration Filter
    if (durationFilter === "WEEKEND") {
      result = result.filter((t) => t.durationDays <= 3);
    } else if (durationFilter === "SHORT") {
      result = result.filter((t) => t.durationDays >= 4 && t.durationDays <= 7);
    } else if (durationFilter === "EXTENDED") {
      result = result.filter((t) => t.durationDays >= 8 && t.durationDays <= 14);
    } else if (durationFilter === "LONG") {
      result = result.filter((t) => t.durationDays >= 15);
    }

    // 3. Inclusions Filter
    if (inclusionFilter === "HAS_STAYS") {
      result = result.filter((t) => t.inclusions.hasStays);
    } else if (inclusionFilter === "HAS_EXPENSES") {
      result = result.filter((t) => t.inclusions.hasExpenses);
    } else if (inclusionFilter === "HAS_CHECKLIST") {
      result = result.filter((t) => t.inclusions.hasChecklist);
    } else if (inclusionFilter === "HAS_STORY") {
      result = result.filter((t) => t.inclusions.hasStory);
    }

    // 4. Sorting
    if (sortBy === "MOST_ACTIONABLE") {
      result.sort(
        (a, b) =>
          b.metrics.activityCount +
          b.metrics.checklistCount -
          (a.metrics.activityCount + a.metrics.checklistCount)
      );
    } else if (sortBy === "DURATION") {
      result.sort((a, b) => a.durationDays - b.durationDays);
    } else {
      // NEWEST
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [initialTrips, searchQuery, durationFilter, inclusionFilter, sortBy, clonedIds]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1">
          <span className="font-sans text-[11px] font-semibold tracking-widest text-primary uppercase block select-none">
            Trip Blueprints
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground dark:text-zinc-50">
            Curated{" "}
            <span className="font-serif italic font-normal text-foreground dark:text-zinc-200">
              Itineraries
            </span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground dark:text-zinc-400 font-normal leading-relaxed max-w-2xl">
            Real trip blueprints published by travelers. Preview complete day-by-day schedules, accommodations, and estimated budgets, then clone directly into your workspace.
          </p>
        </div>

        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-zinc-400" />
          <Input
            placeholder="Search destination, keyword, creator..."
            className="pl-8.5 h-9 text-xs bg-card dark:bg-[#0F131C] border-border dark:border-zinc-800 text-foreground dark:text-zinc-100 rounded-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
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
        <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-zinc-400 px-0.5">
          <span>
            Showing <strong className="text-foreground dark:text-zinc-100 font-semibold">{filteredTrips.length}</strong> trip{" "}
            {filteredTrips.length === 1 ? "template" : "templates"}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground/80 dark:text-zinc-400">
            • <Sparkles className="w-3 h-3 text-primary ml-0.5" /> 1-Click Atomic Workspace Clone
          </span>
        </div>

        {/* Right: Inclusions Select, Duration Select, Sort Select & Reset (Single Horizontal Row) */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-nowrap">
          {/* Inclusion Filter Dropdown */}
          <Select
            value={inclusionFilter}
            onValueChange={(val) => setInclusionFilter(val as InclusionFilter)}
          >
            <SelectTrigger className="h-8 text-xs min-w-[130px] sm:w-[155px] shrink-0 bg-background border-border text-foreground rounded-sm">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Inclusions" />
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
            <SelectTrigger className="h-8 text-xs min-w-[130px] sm:w-[155px] shrink-0 bg-background border-border text-foreground rounded-sm">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Duration" />
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
            <SelectTrigger className="h-8 text-xs min-w-[125px] sm:w-[145px] shrink-0 bg-background border-border text-foreground rounded-sm">
              <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Sort by" />
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
              className="h-8 px-2 text-xs text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-100 cursor-pointer rounded-sm shrink-0"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Grid of Templates */}
      {filteredTrips.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-card/40 dark:bg-card-subtle/60 p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Compass className="h-7 w-7 text-primary" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground dark:text-zinc-100">
              {hasActiveFilters
                ? "No trip templates match your filters"
                : "No public templates published yet"}
            </h3>
            <p className="text-xs text-muted-foreground dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
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
                className="text-xs dark:border-zinc-800 dark:text-zinc-200"
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
