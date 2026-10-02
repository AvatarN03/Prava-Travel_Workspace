"use client";

import { useMemo } from "react";
import Link from "next/link";

import {
  ArrowUpRight,
  BedDouble,
  Calendar,
  Check,
  CheckSquare,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  FileText,
  Link2,
  MapPin,
  Phone,
  Pin,
  Plus,
  Receipt,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { AddAccommodationDialog } from "../../accommodations/components/add-accommodation-dialog";
import { AddTaskDialog } from "../../checklist/components/add-task-dialog";
import { TaskItem } from "../../checklist/components/task-item";
import { AddToCalendarDialog } from "../../common/add-to-calendar-dialog";
import { AddExpenseDialog } from "../../expenses/components/add-expense-dialog";
import { AddItineraryDialog } from "../../itinerary/components/add-itinerary-dialog";
import { AddLinkDialog } from "../../links/components/add-link-dialog";
import { AddNoteDialog } from "../../notes/components/add-note-dialog";

import { cn } from "@/lib/utils";

import type {
  Accommodation,
  ChecklistItem,
  Expense,
  ItineraryItem,
  Link as PrismaLink,
  Note,
  Trip,
} from "@prisma/client";

interface OverviewDashboardProps {
  trip: Trip;
  itinerary: ItineraryItem[];
  accommodations: Accommodation[];
  expenses: Expense[];
  notes: Note[];
  checklist: ChecklistItem[];
  links: PrismaLink[];
}

export function OverviewDashboard({
  trip,
  itinerary,
  accommodations,
  expenses,
  notes,
  checklist,
  links,
}: OverviewDashboardProps) {
  const totalSpent = useMemo(
    () => expenses.reduce((acc, curr) => acc + curr.amount, 0),
    [expenses]
  );
  const completedTasks = useMemo(
    () => checklist.filter((i) => i.isCompleted).length,
    [checklist]
  );
  const checklistPercent =
    checklist.length > 0 ? Math.round((completedTasks / checklist.length) * 100) : 0;
  const pendingTasks = useMemo(
    () => checklist.filter((i) => !i.isCompleted),
    [checklist]
  );

  // Compute Trip Timeline Context
  const now = new Date();
  const startDate = trip.startDate ? new Date(trip.startDate) : null;
  const endDate = trip.endDate ? new Date(trip.endDate) : null;

  let tripTimelineStatus: "FUTURE" | "ACTIVE_TODAY" | "PAST" | "UNSET" = "UNSET";
  let activeDayNumber = 1;
  let daysUntilStart = 0;
  let totalTripDays = 1;

  if (startDate) {
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
    daysUntilStart = Math.round((startMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

    if (endDate) {
      const endMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
      totalTripDays = Math.max(1, Math.round((endMidnight - startMidnight) / (1000 * 60 * 60 * 24)) + 1);

      if (todayMidnight >= startMidnight && todayMidnight <= endMidnight) {
        tripTimelineStatus = "ACTIVE_TODAY";
        activeDayNumber = Math.min(
          totalTripDays,
          Math.max(1, Math.round((todayMidnight - startMidnight) / (1000 * 60 * 60 * 24)) + 1)
        );
      } else if (todayMidnight < startMidnight) {
        tripTimelineStatus = "FUTURE";
      } else {
        tripTimelineStatus = "PAST";
      }
    } else {
      if (daysUntilStart > 0) tripTimelineStatus = "FUTURE";
      else if (daysUntilStart === 0) tripTimelineStatus = "ACTIVE_TODAY";
      else tripTimelineStatus = "PAST";
    }
  }

  // Budget calculations & category breakdowns for segmented progress bar
  const budget = trip.budget || (totalSpent > 0 ? totalSpent * 1.4 : 1000);
  const spentPercent = budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;
  const headroom = Math.max(0, budget - totalSpent);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {
      ACCOMMODATION: 0,
      TRANSPORT: 0,
      FOOD: 0,
      ACTIVITIES: 0,
      SHOPPING: 0,
      OTHER: 0,
    };
    expenses.forEach((e) => {
      const cat = (e.category || "OTHER").toUpperCase();
      if (totals[cat] !== undefined) {
        totals[cat] += e.amount;
      } else {
        totals.OTHER += e.amount;
      }
    });
    return totals;
  }, [expenses]);

  // Today or Upcoming activities
  const activeActivities = useMemo(() => {
    if (itinerary.length === 0) return [];
    if (tripTimelineStatus === "ACTIVE_TODAY") {
      const today = itinerary.filter((i) => (i.dayNumber || 1) === activeDayNumber);
      if (today.length > 0) return today;
    }
    return itinerary.slice(0, 4);
  }, [itinerary, tripTimelineStatus, activeDayNumber]);

  // Current or Next stay
  const currentStay = useMemo(() => {
    if (accommodations.length === 0) return null;
    const future = accommodations.find((a) => a.checkOut && new Date(a.checkOut) >= now);
    return future || accommodations[0];
  }, [accommodations, now]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Confirmation code copied to clipboard!");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Editorial Workspace Header (Matching Landing Page & Travel Essentials) ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase block">
              Trip Overview
            </span>
            {tripTimelineStatus === "ACTIVE_TODAY" && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live: Day {activeDayNumber} of {totalTripDays}
              </span>
            )}
            {tripTimelineStatus === "FUTURE" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#2D9BF0]/10 text-[#2D9BF0] border border-[#2D9BF0]/20">
                Starts in {daysUntilStart} day{daysUntilStart === 1 ? "" : "s"}
              </span>
            )}
            {tripTimelineStatus === "PAST" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                Completed Journey
              </span>
            )}
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground">
            Journey{" "}
            <span className="font-serif italic font-normal text-foreground">
              Blueprint
            </span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl">
            A high-density workspace summary of your scheduled route, confirmed stays, expense allocations, and preparation checklist.
          </p>
        </div>

        {/* Header Right: Destination & Date context badge */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {trip.destination && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-muted/60 border border-border/80 text-xs font-medium text-foreground">
              <MapPin className="w-3.5 h-3.5 text-[#2D9BF0]" />
              <span>{trip.destination}</span>
            </div>
          )}
          {startDate && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-muted/60 border border-border/80 text-xs font-medium text-foreground tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span>
                {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                {endDate ? ` – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
              </span>
            </div>
          )}

          <AddToCalendarDialog
            trip={trip}
            itinerary={itinerary}
            accommodations={accommodations}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5 px-2.5 font-medium cursor-pointer border-[#2D9BF0]/30 text-[#2D9BF0] hover:bg-[#2D9BF0]/10"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Sync to Calendar</span>
              </Button>
            }
          />
        </div>
      </div>

      {/* ── 4-Stat Metric Header Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Itinerary Events */}
        <div className="p-3.5 rounded-sm border border-border/80 bg-card hover:border-[#2D9BF0]/40 transition-colors shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium uppercase tracking-wider">Itinerary</span>
            <Calendar className="w-3.5 h-3.5 text-[#2D9BF0]" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xl font-bold text-foreground tabular-nums">
              {itinerary.length} <span className="text-xs font-normal text-muted-foreground">events</span>
            </div>
            <Link
              href={`/trips/${trip.id}/itinerary`}
              className="text-[11px] text-[#2D9BF0] hover:underline inline-flex items-center gap-0.5 font-medium cursor-pointer"
            >
              View timeline <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Metric 2: Total Spent */}
        <div className="p-3.5 rounded-sm border border-border/80 bg-card hover:border-[#2D9BF0]/40 transition-colors shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Spent</span>
            <Receipt className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xl font-bold font-mono text-foreground tabular-nums">
              ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <Link
              href={`/trips/${trip.id}/expenses`}
              className="text-[11px] text-[#2D9BF0] hover:underline inline-flex items-center gap-0.5 font-medium cursor-pointer"
            >
              {expenses.length} records <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Metric 3: Preparation Checklist */}
        <div className="p-3.5 rounded-sm border border-border/80 bg-card hover:border-[#2D9BF0]/40 transition-colors shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium uppercase tracking-wider">Preparation</span>
            <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xl font-bold text-foreground tabular-nums">
              {checklistPercent}% <span className="text-xs font-normal text-muted-foreground">ready</span>
            </div>
            <Link
              href={`/trips/${trip.id}/checklist`}
              className="text-[11px] text-[#2D9BF0] hover:underline inline-flex items-center gap-0.5 font-medium cursor-pointer"
            >
              {completedTasks}/{checklist.length} tasks <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Metric 4: Lodging & Links */}
        <div className="p-3.5 rounded-sm border border-border/80 bg-card hover:border-[#2D9BF0]/40 transition-colors shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium uppercase tracking-wider">Stays & Saves</span>
            <BedDouble className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xl font-bold text-foreground tabular-nums">
              {accommodations.length} <span className="text-xs font-normal text-muted-foreground">stays ·</span> {links.length} <span className="text-xs font-normal text-muted-foreground">saves</span>
            </div>
            <Link
              href={`/trips/${trip.id}/accommodations`}
              className="text-[11px] text-[#2D9BF0] hover:underline inline-flex items-center gap-0.5 font-medium cursor-pointer"
            >
              View bookings <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2x2 Elevated Feature Cards Grid (Matching Landing Showcase) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Today's Route / Active Schedule */}
        <div className="rounded-sm border border-border/80 bg-card p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#2D9BF0]" />
                {tripTimelineStatus === "ACTIVE_TODAY" ? `Day ${activeDayNumber} Route` : "Upcoming Schedule"}
              </span>
              <Link
                href={`/trips/${trip.id}/itinerary`}
                className="text-[#2D9BF0] hover:underline cursor-pointer normal-case font-medium flex items-center gap-0.5"
              >
                View all {itinerary.length} events →
              </Link>
            </div>

            {activeActivities.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                <Calendar className="w-6 h-6 mx-auto opacity-40 text-muted-foreground" />
                <p>No itinerary events scheduled yet.</p>
                <AddItineraryDialog
                  tripId={trip.id}
                  trigger={
                    <Button variant="outline" size="sm" className="h-7 text-xs cursor-pointer">
                      <Plus className="w-3 h-3 mr-1" /> Add First Event
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {activeActivities.map((act, idx) => (
                  <div key={act.id} className="flex items-start gap-3">
                    <span className="text-[11px] text-muted-foreground shrink-0 font-mono tabular-nums pt-0.5 w-12 text-right">
                      {act.time || `Stop ${idx + 1}`}
                    </span>
                    <div className="border-l-2 border-[#2D9BF0]/60 pl-3 flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{act.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                        {act.category && (
                          <Badge variant="planning" className="text-[9px] px-1.5 py-0 h-4">
                            {act.category}
                          </Badge>
                        )}
                        {act.location && (
                          <span className="truncate flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {act.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{itinerary.length} total activities planned</span>
            <AddItineraryDialog
              tripId={trip.id}
              trigger={
                <button
                  type="button"
                  className="text-[#2D9BF0] hover:underline font-medium cursor-pointer inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Activity
                </button>
              }
            />
          </div>
        </div>

        {/* Card 2: Current Stay / Next Lodging */}
        <div className="rounded-sm border border-border/80 bg-card p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-indigo-500" />
                Current Stay
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {accommodations.length > 0 ? `${accommodations.length} confirmed stay${accommodations.length === 1 ? "" : "s"}` : "No stays"}
              </span>
            </div>

            {currentStay ? (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-semibold text-foreground truncate">
                      {currentStay.name}
                    </h4>
                    <Badge variant="planning" className="text-[9px]">
                      {currentStay.type || "Hotel"}
                    </Badge>
                  </div>
                  {currentStay.address && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {currentStay.address}
                    </p>
                  )}
                </div>

                <div className="rounded-xs bg-muted/40 p-2.5 border border-border/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {currentStay.checkIn
                        ? `Check-in: ${new Date(currentStay.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                        : "Flexible Check-in"}
                    </span>
                    {currentStay.confirmationCode && (
                      <button
                        type="button"
                        onClick={() => handleCopyCode(currentStay.confirmationCode!)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#2D9BF0] hover:underline cursor-pointer"
                        title="Copy code"
                      >
                        <Copy className="w-3 h-3" />
                        #{currentStay.confirmationCode}
                      </button>
                    )}
                  </div>
                  {currentStay.checkOut && (
                    <p className="text-[11px] text-muted-foreground">
                      Check-out: {new Date(currentStay.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                <BedDouble className="w-6 h-6 mx-auto opacity-40 text-muted-foreground" />
                <p>No accommodations booked yet.</p>
                <AddAccommodationDialog
                  tripId={trip.id}
                  trigger={
                    <Button variant="outline" size="sm" className="h-7 text-xs cursor-pointer">
                      <Plus className="w-3 h-3 mr-1" /> Add Stay
                    </Button>
                  }
                />
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            {currentStay?.address ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${currentStay.name}, ${currentStay.address}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#2D9BF0] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3 h-3" /> Open in Maps
              </a>
            ) : (
              <span>Lodging coordinates saved</span>
            )}
            <Link
              href={`/trips/${trip.id}/accommodations`}
              className="text-foreground hover:text-[#2D9BF0] font-medium cursor-pointer"
            >
              View all stays →
            </Link>
          </div>
        </div>

        {/* Card 3: Expense Ledger & Budget Progress */}
        <div className="rounded-sm border border-border/80 bg-card p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                Expense Ledger
              </span>
              <span className="font-semibold text-foreground font-mono tabular-nums">
                ${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })} / ${budget.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>

            {/* Segmented Color Progress Bar (Matching Landing Showcase) */}
            <div className="space-y-1.5">
              <TooltipProvider delayDuration={150}>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex shadow-2xs">
                  {categoryTotals.ACCOMMODATION > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="h-full bg-[#2D9BF0] cursor-pointer transition-opacity hover:opacity-85"
                          style={{ width: `${Math.min(100, (categoryTotals.ACCOMMODATION / budget) * 100)}%` }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        Lodging · ${categoryTotals.ACCOMMODATION.toLocaleString()}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {categoryTotals.TRANSPORT > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="h-full bg-sky-500 cursor-pointer transition-opacity hover:opacity-85"
                          style={{ width: `${Math.min(100, (categoryTotals.TRANSPORT / budget) * 100)}%` }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        Transit · ${categoryTotals.TRANSPORT.toLocaleString()}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {categoryTotals.FOOD > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="h-full bg-amber-500 cursor-pointer transition-opacity hover:opacity-85"
                          style={{ width: `${Math.min(100, (categoryTotals.FOOD / budget) * 100)}%` }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        Dining · ${categoryTotals.FOOD.toLocaleString()}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {categoryTotals.ACTIVITIES > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="h-full bg-emerald-500 cursor-pointer transition-opacity hover:opacity-85"
                          style={{ width: `${Math.min(100, (categoryTotals.ACTIVITIES / budget) * 100)}%` }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        Activities · ${categoryTotals.ACTIVITIES.toLocaleString()}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {categoryTotals.SHOPPING > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="h-full bg-pink-500 cursor-pointer transition-opacity hover:opacity-85"
                          style={{ width: `${Math.min(100, (categoryTotals.SHOPPING / budget) * 100)}%` }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        Shopping · ${categoryTotals.SHOPPING.toLocaleString()}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {categoryTotals.OTHER > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="h-full bg-slate-400 cursor-pointer transition-opacity hover:opacity-85"
                          style={{ width: `${Math.min(100, (categoryTotals.OTHER / budget) * 100)}%` }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        Other · ${categoryTotals.OTHER.toLocaleString()}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TooltipProvider>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{spentPercent}% allocated</span>
                <span className="font-medium text-foreground tabular-nums">
                  ${headroom.toLocaleString(undefined, { maximumFractionDigits: 0 })} headroom left
                </span>
              </div>
            </div>

            {/* Category Breakdown Chips */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xs bg-muted/40 border border-border/60 flex justify-between">
                <span className="text-muted-foreground">Lodging</span>
                <span className="font-semibold text-foreground font-mono tabular-nums">
                  ${categoryTotals.ACCOMMODATION.toLocaleString()}
                </span>
              </div>
              <div className="p-2 rounded-xs bg-muted/40 border border-border/60 flex justify-between">
                <span className="text-muted-foreground">Transit</span>
                <span className="font-semibold text-foreground font-mono tabular-nums">
                  ${categoryTotals.TRANSPORT.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <AddExpenseDialog
              tripId={trip.id}
              trigger={
                <button
                  type="button"
                  className="text-[#2D9BF0] hover:underline font-medium cursor-pointer inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Record Expense
                </button>
              }
            />
            <Link
              href={`/trips/${trip.id}/expenses`}
              className="text-foreground hover:text-[#2D9BF0] font-medium cursor-pointer"
            >
              Open expenses →
            </Link>
          </div>
        </div>

        {/* Card 4: Immediate Tasks & Checklist */}
        <div className="rounded-sm border border-border/80 bg-card p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
                Immediate Tasks
              </span>
              <span className="text-[#2D9BF0] font-semibold">
                {pendingTasks.length} pending
              </span>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                <CheckSquare className="w-6 h-6 mx-auto opacity-40 text-muted-foreground" />
                <p>All checklist tasks are completed! You&apos;re travel ready.</p>
                <AddTaskDialog
                  tripId={trip.id}
                  trigger={
                    <Button variant="outline" size="sm" className="h-7 text-xs cursor-pointer">
                      <Plus className="w-3 h-3 mr-1" /> Add Task
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {pendingTasks.slice(0, 3).map((item) => (
                  <TaskItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ {completedTasks} tasks completed
            </span>
            <Link
              href={`/trips/${trip.id}/checklist`}
              className="text-foreground hover:text-[#2D9BF0] font-medium cursor-pointer"
            >
              Open checklist →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Pinned Notes & Quick Reference Links ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
        {/* Pinned Notes Shelf */}
        <div className="rounded-sm border border-border/80 bg-card p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#2D9BF0]" />
              Notes & Memos
            </span>
            <div className="flex items-center gap-2">
              <AddNoteDialog
                tripId={trip.id}
                trigger={
                  <button
                    type="button"
                    className="text-xs text-[#2D9BF0] hover:underline cursor-pointer inline-flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Add Note
                  </button>
                }
              />
              <Link
                href={`/trips/${trip.id}/notes`}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5"
              >
                All ({notes.length}) <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              No notes saved yet. Jot down directions, packing tips, or reservations.
            </div>
          ) : (
            <div className="space-y-2">
              {notes.slice(0, 3).map((note) => (
                <div
                  key={note.id}
                  className="p-2.5 rounded-sm border border-border/60 bg-muted/30 text-xs space-y-1 hover:border-border transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground truncate">{note.title}</span>
                    {note.isPinned && (
                      <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Reference Links */}
        <div className="rounded-sm border border-border/80 bg-card p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-blue-500" />
              Saved Links & Vault
            </span>
            <div className="flex items-center gap-2">
              <AddLinkDialog
                tripId={trip.id}
                trigger={
                  <button
                    type="button"
                    className="text-xs text-[#2D9BF0] hover:underline cursor-pointer inline-flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Add Link
                  </button>
                }
              />
              <Link
                href={`/trips/${trip.id}/links`}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5"
              >
                All ({links.length}) <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {links.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              No bookmarks saved yet. Save travel blogs, Google Maps pins, or tickets.
            </div>
          ) : (
            <div className="space-y-2">
              {links.slice(0, 3).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-sm border border-border/60 bg-muted/30 text-xs hover:border-[#2D9BF0]/40 transition-colors group cursor-pointer"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-semibold text-foreground truncate group-hover:text-[#2D9BF0] transition-colors">
                      {link.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate font-mono">
                      {link.url}
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[#2D9BF0] shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
