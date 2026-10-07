"use client";

import { useMemo, useState } from "react";

import {
  Calendar,
  Compass,
  Plus,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddItineraryDialog } from "./add-itinerary-dialog";
import { AddToCalendarDialog } from "../../common/add-to-calendar-dialog";
import { ItineraryCard } from "./itinerary-card";

import { useWorkspaceAi } from "../../context/workspace-ai-context";

import { cn } from "@/lib/utils";

import type { ItineraryItem } from "@prisma/client";

interface ItineraryViewProps {
  tripId: string;
  items: ItineraryItem[];
  tripTitle?: string;
  destination?: string | null;
  tripStartDate?: Date | string | null;
  tripEndDate?: Date | string | null;
}

export function ItineraryView({
  tripId,
  items,
  tripTitle,
  destination,
  tripStartDate,
  tripEndDate,
}: ItineraryViewProps) {
  const [selectedDay, setSelectedDay] = useState<number | "ALL">("ALL");
  const { sendAiPrompt } = useWorkspaceAi();

  // Compute total trip days if dates are present
  const tripDurationDays = useMemo(() => {
    if (!tripStartDate || !tripEndDate) return null;
    try {
      const start = new Date(tripStartDate);
      const end = new Date(tripEndDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return null;
    }
  }, [tripStartDate, tripEndDate]);

  // Progressive Itinerary Chunking: 3 days max per generation chunk
  const isMultiDayTrip = (tripDurationDays || 1) > 3;
  const initialDaysToKickstart = isMultiDayTrip ? 3 : (tripDurationDays || 3);

  const handleKickstartWithAi = () => {
    const dest = destination || tripTitle || "my destination";
    const prompt = isMultiDayTrip
      ? `Please propose a comprehensive, day-by-day starter itinerary for the first 3 days (Days 1 to 3) of my ${tripDurationDays}-day trip to ${dest}. Organize 2 to 3 well-timed activities per day with dayNumber=1 through 3, estimated start times, recommended durations, and locations. Provide this as a structured itinerary proposal so I can review and add it to my workspace.`
      : `Please propose a comprehensive, day-by-day starter itinerary for my ${initialDaysToKickstart}-day trip to ${dest}. Organize 2 to 3 well-timed activities per day with estimated start times, recommended durations, and locations. Provide this as a structured itinerary proposal so I can review and add it to my workspace.`;
    sendAiPrompt(prompt);
  };

  const handlePlanNextDaysChunk = (startDay: number, endDay: number) => {
    const dest = destination || tripTitle || "my destination";
    const prompt = `Please propose a day-by-day itinerary for Days ${startDay} to ${endDay} of my ${tripDurationDays}-day trip to ${dest}. Organize 2 to 3 well-timed activities per day with dayNumber=${startDay} through ${endDay}, estimated start times, recommended durations, and locations. Provide this as a structured itinerary proposal so I can review and add it to my workspace.`;
    sendAiPrompt(prompt);
  };

  // Helper to format date for a day number
  const getDayDateLabel = (dayNum: number) => {
    if (!tripStartDate) return null;
    try {
      const baseDate = new Date(tripStartDate);
      if (isNaN(baseDate.getTime())) return null;
      const targetDate = new Date(baseDate);
      targetDate.setDate(baseDate.getDate() + (dayNum - 1));
      return targetDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  // Group items by day number
  const groupedDays = useMemo(() => {
    const map = new Map<number, ItineraryItem[]>();

    items.forEach((item) => {
      const day = item.dayNumber || 1;
      const list = map.get(day) || [];
      list.push(item);
      map.set(day, list);
    });

    // Sort days
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [items]);

  const daysList = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.dayNumber || 1))).sort((a, b) => a - b);
  }, [items]);

  // Compute daily cost totals
  const dayCosts = useMemo(() => {
    const map = new Map<number, number>();
    items.forEach((item) => {
      if (item.cost && item.cost > 0) {
        const d = item.dayNumber || 1;
        map.set(d, (map.get(d) || 0) + item.cost);
      }
    });
    return map;
  }, [items]);

  const totalCost = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  }, [items]);

  const maxPlannedDay = useMemo(() => {
    return daysList.length > 0 ? Math.max(...daysList) : 0;
  }, [daysList]);

  const nextChunkStart = maxPlannedDay + 1;
  const nextChunkEnd = tripDurationDays ? Math.min(maxPlannedDay + 3, tripDurationDays) : maxPlannedDay + 3;

  if (items.length === 0) {
    const destName = destination || tripTitle || "your destination";

    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border">
          <div className="space-y-1.5">
            <span className="font-sans text-[11px] font-semibold tracking-widest text-primary uppercase block">
              Daily Itinerary
            </span>
            <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground">
              Curated{" "}
              <span className="font-serif italic font-normal text-foreground">
                Timeline
              </span>
            </h1>
            <p className="font-sans text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl">
              Organize your journey day by day with museum timings, transit legs, restaurant reservations, and activities.
            </p>
          </div>
        </div>

        {/* Actionable Empty State */}
        <div className="rounded-sm border border-dashed border-border/80 bg-card/60 p-8 sm:p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 text-primary border border-primary/20">
            <Compass className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base font-semibold text-foreground">
              Ready to plan your days in {destName}?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your itinerary is currently empty. You can kickstart {isMultiDayTrip ? `an initial 3-day starter draft (Days 1–3 of your ${tripDurationDays}-day trip) ` : tripDurationDays ? `a full ${tripDurationDays}-day draft ` : "a starter draft "}with Ichinose AI, or craft your schedule manually.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="sm"
              onClick={handleKickstartWithAi}
              className="w-full sm:w-auto cursor-pointer gap-2 font-semibold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>
                AI Assist · Kickstart {isMultiDayTrip ? `Days 1–3 (${tripDurationDays}-Day Trip)` : `${initialDaysToKickstart}-Day Itinerary`}
              </span>
            </Button>

            <AddItineraryDialog
              tripId={tripId}
              defaultDayNumber={1}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto cursor-pointer gap-1.5 border-border hover:bg-muted text-foreground"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Plan Manually</span>
                </Button>
              }
            />
          </div>

          <p className="text-[11px] text-muted-foreground pt-1">
            AI proposals are structured suggestions that you can review and selectively approve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Editorial Workspace Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] font-semibold tracking-widest text-primary uppercase block">
              Daily Itinerary
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              {daysList.length} Days · {items.length} Stops
            </span>
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground">
            Curated{" "}
            <span className="font-serif italic font-normal text-foreground">
              Timeline
            </span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl">
            A chronological timeline of activities, meal stops, transit coordinates, and reservations for every day of your trip.
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {totalCost > 0 && (
            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-sm border border-border/80">
              <span>Est. Cost:</span>
              <span className="text-foreground font-mono font-bold tabular-nums">
                ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <AddToCalendarDialog
            trip={{
              id: tripId,
              title: tripTitle || "Trip Itinerary",
              destination,
              startDate: tripStartDate,
              endDate: tripEndDate,
            }}
            itinerary={items}
            trigger={
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 text-xs font-medium cursor-pointer border-border dark:border-zinc-800 dark:bg-[#121622] hover:bg-muted dark:hover:bg-zinc-800 text-foreground dark:text-zinc-100"
              >
                <Calendar className="w-3.5 h-3.5 text-[#2D9BF0]" />
                <span className="hidden sm:inline">Add to Calendar</span>
              </Button>
            }
          />

          <AddItineraryDialog
            tripId={tripId}
            defaultDayNumber={typeof selectedDay === "number" ? selectedDay : 1}
            trigger={
              <Button size="sm" className="h-8 gap-1.5 text-xs font-semibold cursor-pointer shadow-xs">
                <Plus className="w-3.5 h-3.5" />
                Add Activity
              </Button>
            }
          />
        </div>
      </div>

      {/* ── Day Filter Navigation Strip ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-border/60 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setSelectedDay("ALL")}
          className={cn(
            "px-3 py-1.5 text-xs rounded-sm font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5",
            selectedDay === "ALL"
              ? "bg-[#2D9BF0] text-white font-semibold shadow-xs"
              : "bg-muted/50 dark:bg-[#121622] text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-100 hover:bg-muted dark:hover:bg-zinc-800 border border-border/60 dark:border-zinc-800"
          )}
        >
          <span>All Days</span>
          <span className="text-[10px] opacity-80 tabular-nums">({items.length})</span>
        </button>

        {daysList.map((day) => {
          const dateLabel = getDayDateLabel(day);
          const isSelected = selectedDay === day;
          const dayCount = items.filter((i) => (i.dayNumber || 1) === day).length;

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-sm font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5",
                isSelected
                  ? "bg-[#2D9BF0] text-white font-semibold shadow-xs"
                  : "bg-muted/50 dark:bg-[#121622] text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-100 hover:bg-muted dark:hover:bg-zinc-800 border border-border/60 dark:border-zinc-800"
              )}
            >
              <span>Day {day}</span>
              {dateLabel && <span className="text-[10px] opacity-75 font-normal">· {dateLabel}</span>}
              <span className="text-[10px] opacity-80 tabular-nums">({dayCount})</span>
            </button>
          );
        })}
      </div>

      {/* ── Timeline Section by Day ── */}
      <div className="space-y-8">
        {groupedDays
          .filter(([day]) => selectedDay === "ALL" || selectedDay === day)
          .map(([day, dayItems]) => {
            const dateLabel = getDayDateLabel(day);
            const costForDay = dayCosts.get(day) || 0;

            return (
              <div key={day} className="space-y-3.5">
                {/* Day Header Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-border/70 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#2D9BF0]/15 text-[#2D9BF0] text-xs font-bold font-mono">
                      {day}
                    </span>
                    <h3 className="text-sm font-bold text-foreground dark:text-zinc-100 flex items-center gap-2">
                      <span>Day {day}</span>
                      {dateLabel && (
                        <span className="text-xs font-normal text-muted-foreground dark:text-zinc-400">
                          · {dateLabel}
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {costForDay > 0 && (
                      <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/20 tabular-nums">
                        ${costForDay.toFixed(2)} est.
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground dark:text-zinc-400 tabular-nums">
                      {dayItems.length} {dayItems.length === 1 ? "activity" : "activities"}
                    </span>
                  </div>
                </div>

                {/* Day Items Timeline List with continuous vertical accent */}
                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/70 dark:before:bg-zinc-800">
                  {dayItems.map((item) => (
                    <ItineraryCard
                      key={item.id}
                      item={item}
                      tripTitle={tripTitle}
                      destination={destination}
                      tripStartDate={tripStartDate}
                    />
                  ))}
                </div>
              </div>
            );
          })}

        {/* Progressive Multi-Day Chunking: Next 3 Days Continuation Banner */}
        {tripDurationDays && maxPlannedDay > 0 && maxPlannedDay < tripDurationDays && (
          <div className="rounded-sm border border-dashed border-primary/30 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  Progressive Planning
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-primary/15 text-primary font-semibold">
                  Days {nextChunkStart}–{nextChunkEnd} of {tripDurationDays}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ready to plan Days {nextChunkStart} to {nextChunkEnd}?</span>
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                You have scheduled up to Day {maxPlannedDay}. Keep your generation fast, high-quality, and cost-effective by generating the next 3-day block with Ichinose AI.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => handlePlanNextDaysChunk(nextChunkStart, nextChunkEnd)}
              className="w-full sm:w-auto gap-2 font-semibold cursor-pointer shrink-0 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Plan Days {nextChunkStart}–{nextChunkEnd} with AI</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
