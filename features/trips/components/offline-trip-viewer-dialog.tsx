"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Building2,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Circle,
  Clock,
  Compass,
  CreditCard,
  FileText,
  Key,
  Loader2,
  MapPin,
  Phone,
  Pin,
  Tag,
  WifiOff,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getOfflineTripById } from "@/lib/offline";
import { cn, formatDateRange } from "@/lib/utils";

import type { OfflineTripPayload } from "@/lib/offline";

interface OfflineTripViewerDialogProps {
  tripId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTrip?: OfflineTripPayload | null;
}

export function OfflineTripViewerDialog({
  tripId,
  open,
  onOpenChange,
  initialTrip,
}: OfflineTripViewerDialogProps) {
  const [trip, setTrip] = useState<OfflineTripPayload | null>(initialTrip || null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("itinerary");
  const [selectedDay, setSelectedDay] = useState<number | "ALL">("ALL");

  useEffect(() => {
    if (!open || !tripId) return;

    if (initialTrip && initialTrip.id === tripId) {
      setTrip(initialTrip);
      return;
    }

    setIsLoading(true);
    getOfflineTripById(tripId)
      .then((cached) => {
        setTrip(cached);
      })
      .catch((err) => {
        console.warn("[OfflineTripViewer] Failed to load offline trip:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [open, tripId, initialTrip]);

  // Distinct day numbers in itinerary
  const dayNumbers = useMemo(() => {
    if (!trip?.itinerary) return [];
    const days = new Set<number>();
    trip.itinerary.forEach((item) => {
      if (item.dayNumber !== null && item.dayNumber !== undefined) {
        days.add(item.dayNumber);
      }
    });
    return Array.from(days).sort((a, b) => a - b);
  }, [trip]);

  // Filtered itinerary items
  const filteredItinerary = useMemo(() => {
    if (!trip?.itinerary) return [];
    if (selectedDay === "ALL") return trip.itinerary;
    return trip.itinerary.filter((item) => item.dayNumber === selectedDay);
  }, [trip, selectedDay]);

  // Grouped checklist by category
  const checklistByCategory = useMemo(() => {
    if (!trip?.checklistItems) return {};
    return trip.checklistItems.reduce<Record<string, typeof trip.checklistItems>>((acc, item) => {
      const cat = item.category || "General";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  }, [trip]);

  // Expense total
  const totalExpense = useMemo(() => {
    if (!trip?.expenses) return 0;
    return trip.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  }, [trip]);

  const currencySymbol = trip?.expenses?.[0]?.currency || "USD";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-hidden flex flex-col p-0 rounded-sm border border-border dark:border-zinc-800 bg-background dark:bg-[#0B0F19] text-foreground">
        {/* Header Strip */}
        <DialogHeader className="p-4 sm:p-5 pb-3 border-b border-border/80 dark:border-zinc-800/80 bg-card dark:bg-[#0F131C] shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="rounded-xs border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5"
                >
                  <WifiOff className="h-3 w-3" />
                  Offline Cache (Read-Only)
                </Badge>
                {trip?.destination && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground dark:text-zinc-400 font-medium">
                    <MapPin className="h-3 w-3 text-primary" />
                    {trip.destination}
                  </span>
                )}
              </div>

              <DialogTitle className="text-base sm:text-lg font-bold font-sans text-foreground dark:text-zinc-100 truncate">
                {trip?.title || "Trip Workspace"}
              </DialogTitle>

              <DialogDescription className="text-xs text-muted-foreground dark:text-zinc-400 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {trip ? formatDateRange(trip.startDate, trip.endDate) : "Dates not set"}
                </span>
                {trip?.description && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-xs">{trip.description}</span>
                  </>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs font-sans">Reading trip from offline storage...</p>
          </div>
        )}

        {/* Empty / Not Cached */}
        {!isLoading && !trip && (
          <div className="flex flex-col items-center justify-center p-12 text-center gap-3">
            <WifiOff className="h-8 w-8 text-amber-500/70" />
            <p className="text-sm font-semibold text-foreground">Trip Not Available Offline</p>
            <p className="text-xs text-muted-foreground max-w-sm">
              This trip has not been cached to local storage yet. Connect to the internet and click
              &quot;Sync Now&quot; in Profile &gt; General settings.
            </p>
          </div>
        )}

        {/* Tabbed Content */}
        {!isLoading && trip && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 overflow-hidden flex flex-col min-h-0"
          >
            {/* Tabs Bar */}
            <div className="px-4 sm:px-5 pt-2 border-b border-border/60 dark:border-zinc-800/80 bg-muted/20 dark:bg-[#0D121F] shrink-0 overflow-x-auto">
              <TabsList className="bg-transparent h-9 p-0 space-x-1 sm:space-x-2">
                <TabsTrigger
                  value="itinerary"
                  className="data-[state=active]:bg-card dark:data-[state=active]:bg-[#121622] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-9 text-xs px-2.5 sm:px-3 font-medium gap-1.5 cursor-pointer"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Itinerary</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted dark:bg-zinc-800 text-muted-foreground">
                    {trip.itinerary?.length || 0}
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="accommodations"
                  className="data-[state=active]:bg-card dark:data-[state=active]:bg-[#121622] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-9 text-xs px-2.5 sm:px-3 font-medium gap-1.5 cursor-pointer"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Stays</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted dark:bg-zinc-800 text-muted-foreground">
                    {trip.accommodations?.length || 0}
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="checklist"
                  className="data-[state=active]:bg-card dark:data-[state=active]:bg-[#121622] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-9 text-xs px-2.5 sm:px-3 font-medium gap-1.5 cursor-pointer"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  <span>Checklist</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted dark:bg-zinc-800 text-muted-foreground">
                    {trip.checklistItems?.length || 0}
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="notes"
                  className="data-[state=active]:bg-card dark:data-[state=active]:bg-[#121622] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-9 text-xs px-2.5 sm:px-3 font-medium gap-1.5 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Notes</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted dark:bg-zinc-800 text-muted-foreground">
                    {trip.notes?.length || 0}
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="expenses"
                  className="data-[state=active]:bg-card dark:data-[state=active]:bg-[#121622] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-9 text-xs px-2.5 sm:px-3 font-medium gap-1.5 cursor-pointer"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Expenses</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted dark:bg-zinc-800 text-muted-foreground">
                    {trip.expenses?.length || 0}
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Scrollable Content Viewport */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* 1. ITINERARY TAB */}
              <TabsContent value="itinerary" className="m-0 space-y-4 focus-visible:outline-none">
                {dayNumbers.length > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap pb-2 border-b border-border/50 dark:border-zinc-800">
                    <Button
                      type="button"
                      variant={selectedDay === "ALL" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDay("ALL")}
                      className="h-6 text-[11px] px-2.5 rounded-xs cursor-pointer"
                    >
                      All Days
                    </Button>
                    {dayNumbers.map((d) => (
                      <Button
                        key={d}
                        type="button"
                        variant={selectedDay === d ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDay(d)}
                        className="h-6 text-[11px] px-2.5 rounded-xs cursor-pointer"
                      >
                        Day {d}
                      </Button>
                    ))}
                  </div>
                )}

                {filteredItinerary.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground text-xs font-sans">
                    No scheduled activities found for this selection.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredItinerary.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            {item.dayNumber !== null && (
                              <Badge
                                variant="secondary"
                                className="h-5 px-1.5 text-[10px] font-semibold rounded-xs"
                              >
                                Day {item.dayNumber}
                              </Badge>
                            )}
                            {item.time && (
                              <span className="flex items-center gap-1 text-[11px] font-mono font-medium text-primary">
                                <Clock className="h-3 w-3" />
                                {item.time}
                              </span>
                            )}
                            {item.category && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-muted text-muted-foreground">
                                {item.category}
                              </span>
                            )}
                          </div>

                          {item.cost !== null && item.cost !== undefined && item.cost > 0 && (
                            <span className="text-xs font-semibold font-mono text-muted-foreground shrink-0">
                              ${item.cost}
                            </span>
                          )}
                        </div>

                        <p className="font-semibold text-xs sm:text-sm text-foreground dark:text-zinc-100">
                          {item.title}
                        </p>

                        {item.location && (
                          <p className="flex items-center gap-1 text-[11px] text-muted-foreground dark:text-zinc-400">
                            <MapPin className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                            <span>{item.location}</span>
                          </p>
                        )}

                        {item.description && (
                          <p className="text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed pt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* 2. ACCOMMODATIONS TAB */}
              <TabsContent value="accommodations" className="m-0 space-y-3 focus-visible:outline-none">
                {(!trip.accommodations || trip.accommodations.length === 0) ? (
                  <div className="py-10 text-center text-muted-foreground text-xs font-sans">
                    No accommodations recorded for this trip.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trip.accommodations.map((stay) => (
                      <div
                        key={stay.id}
                        className="p-3.5 rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] space-y-2 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-foreground dark:text-zinc-100">
                                {stay.name}
                              </span>
                              {stay.type && (
                                <Badge variant="outline" className="text-[10px] rounded-xs px-1.5 py-0">
                                  {stay.type}
                                </Badge>
                              )}
                            </div>
                            {(stay.checkIn || stay.checkOut) && (
                              <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                <Calendar className="h-3 w-3 text-primary" />
                                <span>
                                  {stay.checkIn ? new Date(stay.checkIn).toLocaleDateString() : "—"} &rarr;{" "}
                                  {stay.checkOut ? new Date(stay.checkOut).toLocaleDateString() : "—"}
                                </span>
                              </p>
                            )}
                          </div>

                          {stay.confirmationCode && (
                            <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary px-2 py-1 rounded-xs shrink-0">
                              <Key className="h-3 w-3" />
                              <span className="font-mono text-[11px] font-semibold">
                                {stay.confirmationCode}
                              </span>
                            </div>
                          )}
                        </div>

                        {stay.address && (
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground dark:text-zinc-300">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span>{stay.address}</span>
                          </p>
                        )}

                        {stay.contactPhone && (
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground dark:text-zinc-300">
                            <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <a
                              href={`tel:${stay.contactPhone}`}
                              className="font-mono hover:underline text-foreground dark:text-zinc-200"
                            >
                              {stay.contactPhone}
                            </a>
                          </p>
                        )}

                        {stay.notes && (
                          <div className="pt-1 border-t border-border/40 dark:border-zinc-800/60 text-xs text-muted-foreground dark:text-zinc-400">
                            {stay.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* 3. CHECKLIST TAB */}
              <TabsContent value="checklist" className="m-0 space-y-4 focus-visible:outline-none">
                {(!trip.checklistItems || trip.checklistItems.length === 0) ? (
                  <div className="py-10 text-center text-muted-foreground text-xs font-sans">
                    No checklist items saved for this trip.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(checklistByCategory).map(([category, items]) => (
                      <div key={category} className="space-y-1.5">
                        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-zinc-400">
                          {category} ({items.filter((i) => i.isCompleted).length}/{items.length})
                        </p>
                        <div className="rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] divide-y divide-border/60 dark:divide-zinc-800/80">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs"
                            >
                              {item.isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                              )}
                              <span
                                className={cn(
                                  "flex-1 font-sans",
                                  item.isCompleted
                                    ? "line-through text-muted-foreground dark:text-zinc-500"
                                    : "text-foreground dark:text-zinc-200"
                                )}
                              >
                                {item.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* 4. NOTES TAB */}
              <TabsContent value="notes" className="m-0 space-y-3 focus-visible:outline-none">
                {(!trip.notes || trip.notes.length === 0) ? (
                  <div className="py-10 text-center text-muted-foreground text-xs font-sans">
                    No notes or guide documents saved.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trip.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3.5 rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {note.isPinned && (
                              <Pin className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                            )}
                            <p className="font-semibold text-xs sm:text-sm text-foreground dark:text-zinc-100">
                              {note.title}
                            </p>
                          </div>
                          {note.category && (
                            <Badge variant="outline" className="text-[10px] rounded-xs px-1.5 py-0">
                              {note.category}
                            </Badge>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground dark:text-zinc-300 whitespace-pre-wrap leading-relaxed font-sans">
                          {note.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* 5. EXPENSES TAB */}
              <TabsContent value="expenses" className="m-0 space-y-4 focus-visible:outline-none">
                <div className="p-3 rounded-sm border border-border dark:border-zinc-800 bg-muted/30 dark:bg-[#121622] flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-muted-foreground font-sans">Total Recorded Spend</p>
                    <p className="text-lg font-bold font-mono text-foreground dark:text-zinc-100">
                      {totalExpense.toLocaleString()} {currencySymbol}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs font-sans">
                    {trip.expenses?.length || 0} entries
                  </Badge>
                </div>

                {(!trip.expenses || trip.expenses.length === 0) ? (
                  <div className="py-8 text-center text-muted-foreground text-xs font-sans">
                    No expenses logged for this trip.
                  </div>
                ) : (
                  <div className="rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] divide-y divide-border/60 dark:divide-zinc-800/80">
                    {trip.expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between gap-3 px-3 py-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-foreground dark:text-zinc-200 truncate">
                            {expense.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString()} • {expense.category}
                          </p>
                        </div>
                        <span className="font-mono font-semibold text-foreground dark:text-zinc-100 shrink-0">
                          {expense.amount} {expense.currency}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        )}

        {/* Footer */}
        <div className="p-3 px-4 border-t border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] flex items-center justify-between text-xs text-muted-foreground shrink-0">
          <span className="text-[11px]">Prava IndexedDB Cache</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-7 px-3 text-xs rounded-sm cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
