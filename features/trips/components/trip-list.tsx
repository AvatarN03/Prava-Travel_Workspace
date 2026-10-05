"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Filter,
  HardDrive,
  Layers,
  LayoutGrid,
  LayoutTemplate,
  List,
  Plus,
  Search,
  Sparkles,
  WifiOff,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UpgradeDialog } from "@/features/pricing";
import { CreateTripDialog } from "./create-trip-dialog";
import { TripCard } from "./trip-card";
import { TripTableView } from "./trip-table-view";

import { useOfflineSyncContext } from "@/lib/offline";

import { getOfflineTrips } from "@/lib/offline";
import { isTripDatesPassed } from "@/lib/utils";

import type {
  Trip,
  TripSortOption,
  TripStatus,
  TripUsageQuota,
  TripViewMode,
} from "../types";

interface TripListProps {
  initialTrips: Trip[];
  tripUsage?: TripUsageQuota;
}

export function TripList({ initialTrips, tripUsage }: TripListProps) {
  const { isOnline, lastSyncLabel } = useOfflineSyncContext();
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [isShowingOfflineData, setIsShowingOfflineData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<TripViewMode>("grid");
  const [sortOption, setSortOption] = useState<TripSortOption>("departure");
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  // Sync with initial trips or offline cache
  useEffect(() => {
    if (!isOnline) {
      getOfflineTrips().then((cachedTrips) => {
        if (cachedTrips && cachedTrips.length > 0) {
          const mappedTrips = cachedTrips.map((t) => ({
            ...t,
            startDate: t.startDate ? new Date(t.startDate) : null,
            endDate: t.endDate ? new Date(t.endDate) : null,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
            status: t.status as TripStatus,
          })) as unknown as Trip[];
          setTrips(mappedTrips);
          setIsShowingOfflineData(true);
        } else {
          setTrips(initialTrips);
          setIsShowingOfflineData(false);
        }
      });
    } else {
      setTrips(initialTrips);
      setIsShowingOfflineData(false);
    }
  }, [isOnline, initialTrips]);

  // Overall metric aggregations
  const totalCount = trips.length;
  const activeCount = trips.filter((t) => t.status === "ACTIVE").length;
  const planningCount = trips.filter((t) => t.status === "PLANNING").length;
  const completedCount = trips.filter((t) => t.status === "COMPLETED").length;
  const archivedCount = trips.filter((t) => t.status === "ARCHIVED").length;

  const maxTrips = tripUsage?.maxTrips || (tripUsage?.isPro ? 25 : 10);
  const usageCount = tripUsage?.count ?? totalCount;
  const usagePercentage = Math.min(Math.round((usageCount / maxTrips) * 100), 100);

  // Trips in planning mode whose planned dates have passed
  const stalePlanningCount = useMemo(() => {
    return trips.filter(
      (t) => t.status === "PLANNING" && isTripDatesPassed(t.startDate, t.endDate)
    ).length;
  }, [trips]);

  // Filter and sort trips
  const filteredTrips = useMemo(() => {
    const result = trips.filter((trip) => {
      const matchesSearch =
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.destination &&
          trip.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (trip.description &&
          trip.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" ? true : trip.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return result.sort((a, b) => {
      if (sortOption === "departure") {
        // Trips with upcoming start dates first, then unset dates
        if (!a.startDate && !b.startDate) return 0;
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      if (sortOption === "recent_updated") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortOption === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [trips, searchQuery, statusFilter, sortOption]);

  const statusOptions = [
    { label: "All", value: "ALL", count: totalCount },
    { label: "Active", value: "ACTIVE", count: activeCount },
    { label: "Planning", value: "PLANNING", count: planningCount },
    { label: "Completed", value: "COMPLETED", count: completedCount },
    { label: "Archived", value: "ARCHIVED", count: archivedCount },
  ];

  return (
    <div className="space-y-6">
      {/* Offline Alert Banner */}
      {isShowingOfflineData && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xs bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <WifiOff className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Showing {trips.length} Locally Cached Trip{trips.length === 1 ? "" : "s"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                You are currently offline. Workspace trips and itineraries are accessible in read-only mode.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] bg-background/60 dark:bg-card/60 px-2.5 py-1 rounded-xs border border-border/50 text-muted-foreground self-stretch sm:self-auto justify-center">
            <HardDrive className="h-3 w-3 text-amber-500" />
            <span>Last Synced: <strong>{lastSyncLabel}</strong></span>
          </div>
        </div>
      )}

      {/* Past Planned Dates Advisory Banner */}
      {stalePlanningCount > 0 && (statusFilter === "ALL" || statusFilter === "PLANNING") && (
        <div className="rounded-md border border-amber-500/35 bg-amber-500/10 dark:bg-amber-950/25 dark:border-amber-700/50 p-3 sm:p-3.5 text-xs text-amber-950 dark:text-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xs bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <p className="font-semibold text-amber-950 dark:text-amber-100">
                {stalePlanningCount} trip{stalePlanningCount > 1 ? "s have" : " has"} passed {stalePlanningCount > 1 ? "their" : "its"} planned dates
              </p>
              <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80">
                Still marked as Planning after the scheduled dates. Open any trip to update its status to Active or Completed, reschedule, or delete.
              </p>
            </div>
          </div>
          {statusFilter !== "PLANNING" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatusFilter("PLANNING")}
              className="h-7 px-2.5 text-[11px] font-medium border-amber-500/40 hover:bg-amber-500/20 text-amber-950 dark:text-amber-100 cursor-pointer rounded-xs shrink-0 self-end sm:self-center"
            >
              Filter Planning Trips
            </Button>
          )}
        </div>
      )}

      {/* Top Metrics & Tier Meter Strip */}
      {totalCount > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Active Trips Metric */}
          <Card className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-medium text-muted-foreground dark:text-zinc-400">Active Trips</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-light tracking-tight text-foreground dark:text-zinc-50 tabular-nums">{activeCount}</span>
              <span className="text-[11px] text-muted-foreground dark:text-zinc-400">In progress</span>
            </div>
          </Card>

          {/* Planning Metric */}
          <Card className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-medium text-muted-foreground dark:text-zinc-400">Planning</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-light tracking-tight text-foreground dark:text-zinc-50 tabular-nums">{planningCount}</span>
              <span className="text-[11px] text-muted-foreground dark:text-zinc-400">Upcoming drafts</span>
            </div>
          </Card>

          {/* Completed Metric */}
          <Card className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-medium text-muted-foreground dark:text-zinc-400">Completed</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-light tracking-tight text-foreground dark:text-zinc-50 tabular-nums">{completedCount}</span>
              <span className="text-[11px] text-muted-foreground dark:text-zinc-400">Past journeys</span>
            </div>
          </Card>

          {/* Workspace Tier & Quota Meter */}
          <Card className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground dark:text-zinc-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" /> Workspace Slots
              </span>
              {!tripUsage?.isPro && (
                <button
                  type="button"
                  onClick={() => setIsUpgradeOpen(true)}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  <Sparkles className="h-2.5 w-2.5" /> Upgrade
                </button>
              )}
            </div>
            <div className="mt-2">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-bold text-foreground dark:text-zinc-100">
                  {usageCount} <span className="text-[11px] font-normal text-muted-foreground dark:text-zinc-400">/ {maxTrips} trips</span>
                </span>
                <span className="text-[11px] font-medium text-muted-foreground dark:text-zinc-400">{usagePercentage}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted dark:bg-[#121622] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    usagePercentage >= 90
                      ? "bg-destructive"
                      : usagePercentage >= 70
                      ? "bg-amber-500"
                      : "bg-primary"
                  }`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State when no trips at all */}
      {totalCount === 0 ? (
        <Card className="border-dashed border-border/80 dark:border-zinc-800 bg-card/60 dark:bg-[#0F131C]/60 rounded-md">
          <CardHeader className="text-center py-14">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary mb-3">
              <Compass className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg font-bold text-foreground dark:text-zinc-100">
              {isShowingOfflineData ? "No cached trips found offline" : "Your Travel Workspace is Empty"}
            </CardTitle>
            <CardDescription className="max-w-md mx-auto text-xs mt-1 text-muted-foreground dark:text-zinc-400">
              {isShowingOfflineData
                ? "No trips have been cached on this browser yet. Connect to the internet to sync your workspace."
                : "Organize daily itineraries, bookings, expenses, notes, and packing checklists in one cohesive workspace."}
            </CardDescription>
          </CardHeader>
          {!isShowingOfflineData && (
            <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-14">
              <CreateTripDialog
                trigger={
                  <Button size="sm" className="cursor-pointer gap-1.5">
                    <Plus className="w-4 h-4" />
                    Create First Trip
                  </Button>
                }
              />
              <Link href="/templates">
                <Button variant="outline" size="sm" className="cursor-pointer gap-1.5 dark:border-zinc-800 dark:hover:bg-[#121622]">
                  <LayoutTemplate className="w-4 h-4 text-muted-foreground dark:text-zinc-400" />
                  Explore Curated Templates
                </Button>
              </Link>
            </CardContent>
          )}
        </Card>
      ) : (
        <>
          {/* Controls Bar: Search, Status Filter Pills, Sort Dropdown & View Mode Switcher */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-zinc-400" />
                <Input
                  placeholder="Search title, destination, notes..."
                  className="pl-8.5 h-9 text-xs dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Desktop Controls: Status Select beside Sort Select, View Mode Switcher & Create Trip Button */}
              <div className="hidden sm:flex items-center gap-2 self-end sm:self-auto">
                {/* Status Filter Select */}
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as TripStatus | "ALL")}
                >
                  <SelectTrigger className="h-9 w-[155px] text-xs cursor-pointer dark:bg-[#0F131C] dark:border-zinc-800 dark:text-zinc-200">
                    <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground dark:text-zinc-400 shrink-0" />
                    <span className="truncate">
                      {statusOptions.find((o) => o.value === statusFilter)?.label || "Status"}
                    </span>
                    <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full bg-muted dark:bg-[#121622] text-muted-foreground dark:text-zinc-400 font-semibold shrink-0">
                      {statusOptions.find((o) => o.value === statusFilter)?.count ?? 0}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#0F131C] dark:border-zinc-800">
                    {statusOptions.map(({ label, value, count }) => (
                      <SelectItem key={value} value={value} className="text-xs cursor-pointer dark:text-zinc-200">
                        <div className="flex items-center justify-between gap-3 w-full">
                          <span>{label}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted dark:bg-[#121622] text-muted-foreground dark:text-zinc-400 font-semibold">
                            {count}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Departure Sort Select */}
                <Select
                  value={sortOption}
                  onValueChange={(val) => setSortOption(val as TripSortOption)}
                >
                  <SelectTrigger className="h-9 w-[190px] text-xs cursor-pointer dark:bg-[#0F131C] dark:border-zinc-800 dark:text-zinc-200">
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground dark:text-zinc-400 shrink-0" />
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#0F131C] dark:border-zinc-800">
                    <SelectItem value="departure" className="cursor-pointer dark:text-zinc-200">Departure (Soonest)</SelectItem>
                    <SelectItem value="recent_updated" className="cursor-pointer dark:text-zinc-200">Recently Updated</SelectItem>
                    <SelectItem value="newest" className="cursor-pointer dark:text-zinc-200">Newest Created</SelectItem>
                    <SelectItem value="alphabetical" className="cursor-pointer dark:text-zinc-200">Title (A–Z)</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle Buttons */}
                <div className="flex items-center rounded-md border border-border dark:border-zinc-800 bg-card dark:bg-[#121622] p-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                    className={`flex h-7.5 w-7.5 items-center justify-center rounded-xs transition-colors cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    aria-label="Table view"
                    className={`flex h-7.5 w-7.5 items-center justify-center rounded-xs transition-colors cursor-pointer ${
                      viewMode === "table"
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200"
                    }`}
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Create Trip Trigger Button */}
                <CreateTripDialog
                  trigger={
                    <Button
                      size="sm"
                      className="h-9 gap-1.5 bg-primary hover:bg-primary/90 text-white shadow-xs cursor-pointer text-xs font-semibold shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Trip</span>
                    </Button>
                  }
                />
              </div>
            </div>

            {/* Mobile Responsive Controls: Status Filter Select along the side of Sort Select + View Mode */}
            <div className="flex sm:hidden items-center gap-2 w-full">
              {/* Status Select */}
              <div className="flex-1 min-w-0">
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as TripStatus | "ALL")}
                >
                  <SelectTrigger className="h-9 text-xs w-full cursor-pointer dark:bg-[#0F131C] dark:border-zinc-800 dark:text-zinc-200">
                    <div className="flex items-center gap-1.5 truncate">
                      <Filter className="h-3.5 w-3.5 text-muted-foreground dark:text-zinc-400 shrink-0" />
                      <span className="truncate">
                        {statusOptions.find((o) => o.value === statusFilter)?.label || "Status"}
                      </span>
                      <span className="text-[10px] px-1 py-0.2 rounded-full bg-muted dark:bg-[#121622] text-muted-foreground dark:text-zinc-400 font-semibold shrink-0">
                        {statusOptions.find((o) => o.value === statusFilter)?.count ?? 0}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#0F131C] dark:border-zinc-800">
                    {statusOptions.map(({ label, value, count }) => (
                      <SelectItem key={value} value={value} className="text-xs cursor-pointer dark:text-zinc-200">
                        <div className="flex items-center justify-between gap-3 w-full">
                          <span>{label}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted dark:bg-[#121622] text-muted-foreground dark:text-zinc-400 font-semibold">
                            {count}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Select */}
              <div className="flex-1 min-w-0">
                <Select
                  value={sortOption}
                  onValueChange={(val) => setSortOption(val as TripSortOption)}
                >
                  <SelectTrigger className="h-9 text-xs w-full cursor-pointer dark:bg-[#0F131C] dark:border-zinc-800 dark:text-zinc-200">
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1 text-muted-foreground dark:text-zinc-400 shrink-0" />
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#0F131C] dark:border-zinc-800">
                    <SelectItem value="departure" className="text-xs cursor-pointer dark:text-zinc-200">Departure (Soonest)</SelectItem>
                    <SelectItem value="recent_updated" className="text-xs cursor-pointer dark:text-zinc-200">Recently Updated</SelectItem>
                    <SelectItem value="newest" className="text-xs cursor-pointer dark:text-zinc-200">Newest Created</SelectItem>
                    <SelectItem value="alphabetical" className="text-xs cursor-pointer dark:text-zinc-200">Title (A–Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle Buttons */}
              <div className="flex items-center rounded-md border border-border dark:border-zinc-800 bg-card dark:bg-[#121622] p-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`flex h-7.5 w-7.5 items-center justify-center rounded-xs transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  aria-label="Table view"
                  className={`flex h-7.5 w-7.5 items-center justify-center rounded-xs transition-colors cursor-pointer ${
                    viewMode === "table"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Mobile Create Trip Button */}
              <CreateTripDialog
                trigger={
                  <Button
                    size="sm"
                    className="h-8.5 w-8.5 p-0 bg-primary hover:bg-primary/90 text-white shadow-xs cursor-pointer shrink-0"
                    aria-label="Create Trip"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                }
              />
            </div>
          </div>

          {/* Results: Grid or Table */}
          {filteredTrips.length === 0 ? (
            <div className="text-center py-12 rounded-md border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-6">
              <p className="text-sm font-semibold text-foreground dark:text-zinc-100">No matching trips found</p>
              <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-1">
                Try adjusting your search query or switching the status filter.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 text-xs cursor-pointer dark:border-zinc-800 dark:hover:bg-[#121622]"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <TripTableView trips={filteredTrips} />
          )}
        </>
      )}

      <UpgradeDialog
        open={isUpgradeOpen}
        onOpenChange={setIsUpgradeOpen}
      />
    </div>
  );
}
