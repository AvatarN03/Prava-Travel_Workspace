"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import {
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  Clock,
  Compass,
  FileText,
  Loader2,
  MapPin,
  Sparkles,
  Wallet,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SUPPORTED_CURRENCIES } from "@/features/travel-essentials";

import { cloneTripTemplate } from "../actions";

import type { TemplateTripItem } from "../types";

interface TemplatePreviewDialogProps {
  trip: TemplateTripItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloned?: (tripId: string) => void;
}

export function TemplatePreviewDialog({
  trip,
  open,
  onOpenChange,
  onCloned,
}: TemplatePreviewDialogProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("itinerary");
  const [showAiCustomizer, setShowAiCustomizer] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isCloning, startCloning] = useTransition();

  // Group itinerary items by day
  const groupedItinerary = useMemo(() => {
    if (!trip) return {};
    const groups: Record<number, typeof trip.itinerary> = {};
    trip.itinerary.forEach((item) => {
      const day = item.day || 1;
      if (!groups[day]) groups[day] = [];
      groups[day].push(item);
    });
    return groups;
  }, [trip]);

  if (!trip) return null;

  const previewDescription =
    trip.description ||
    "Review the full day-by-day schedule, stays, and packing list before cloning.";
  const canExpandDescription = previewDescription.length > 180;
  const currencySymbol =
    SUPPORTED_CURRENCIES.find(
      (currency) => currency.code === trip.metrics.currency.toUpperCase()
    )?.symbol || trip.metrics.currency;

  const handleClone = () => {
    startCloning(async () => {
      const res = await cloneTripTemplate(trip.id, aiPrompt.trim() || undefined);
      if (res.success && res.newTripId) {
        toast.success(
          aiPrompt.trim()
            ? `Tailored and cloned "${trip.title}" into your workspace!`
            : `Cloned "${trip.title}" into your workspace!`
        );
        onCloned?.(trip.id);
        onOpenChange(false);
        router.push(`/trips/${res.newTripId}`);
      } else {
        toast.error(res.error || "Failed to clone itinerary.");
      }
    });
  };

  const daysList = Object.keys(groupedItinerary).map(Number).sort((a, b) => a - b);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setIsDescriptionExpanded(false);
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="template-preview-inverted flex h-[calc(100vh-2rem)] max-h-[44rem] max-w-3xl flex-col gap-0 overflow-hidden rounded-md border-border p-0 sm:h-[85vh] [&>button]:!opacity-100 [&>button]:!text-foreground [&>button]:hover:!bg-muted [&>button]:data-[state=open]:!bg-muted [&>button]:data-[state=open]:!text-foreground">
        <DialogHeader className="border-b border-border bg-muted/20 p-4 pr-11 text-left sm:p-5 sm:pr-12">
          <DialogTitle className="text-xl font-bold leading-tight text-foreground sm:text-2xl">
            {trip.title}
          </DialogTitle>
          <div className="mt-2 max-w-2xl">
            <DialogDescription
              className={`text-sm leading-relaxed text-muted-foreground ${
                isDescriptionExpanded ? "" : "line-clamp-2"
              }`}
            >
              {previewDescription}
            </DialogDescription>
            {canExpandDescription && (
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded((current) => !current)}
                className="mt-1 cursor-pointer text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {isDescriptionExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          <div className="mt-3 flex items-start justify-between gap-4 text-xs">
            {trip.destination && (
              <span className="flex min-w-0 flex-1 flex-wrap items-start gap-x-1.5 font-medium text-foreground">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 break-words">{trip.destination}</span>
              </span>
            )}
            <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {trip.durationDays} {trip.durationDays === 1 ? "day" : "days"}
              </span>
              {trip.metrics.expenseTotal > 0 && (
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <Wallet className="h-3.5 w-3.5" />
                  {currencySymbol}{trip.metrics.expenseTotal.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body with Tabs */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3.5 sm:p-5">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 grid h-9 w-full grid-cols-3 rounded-md border border-border bg-background p-0 sm:h-10">
              <TabsTrigger
                value="itinerary"
                className="gap-1 rounded-sm py-1 text-[11px] data-[state=active]:!bg-white data-[state=active]:!text-slate-950 data-[state=active]:shadow-none dark:data-[state=active]:!bg-black dark:data-[state=active]:!text-white sm:gap-1.5 sm:text-xs"
              >
                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Itinerary ({trip.metrics.activityCount})</span>
              </TabsTrigger>

              <TabsTrigger
                value="stays"
                className="gap-1 rounded-sm py-1 text-[11px] data-[state=active]:!bg-white data-[state=active]:!text-slate-950 data-[state=active]:shadow-none dark:data-[state=active]:!bg-black dark:data-[state=active]:!text-white sm:gap-1.5 sm:text-xs"
              >
                <Compass className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Stays ({trip.metrics.accommodationCount})</span>
              </TabsTrigger>

              <TabsTrigger
                value="prep"
                className="gap-1 rounded-sm py-1 text-[11px] data-[state=active]:!bg-white data-[state=active]:!text-slate-950 data-[state=active]:shadow-none dark:data-[state=active]:!bg-black dark:data-[state=active]:!text-white sm:gap-1.5 sm:text-xs"
              >
                <CheckSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Packing & Tips</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Day-by-day Itinerary */}
            <TabsContent value="itinerary" className="mt-0 space-y-3">
              {daysList.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No scheduled activities logged in this itinerary.
                </div>
              ) : (
                daysList.map((dayNum) => (
                  <div
                    key={dayNum}
                    className="overflow-hidden rounded-md border border-border bg-card"
                  >
                    <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3.5 py-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Day {dayNum}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {groupedItinerary[dayNum].length} activities
                      </span>
                    </div>

                    <div className="divide-y divide-border/60">
                      {groupedItinerary[dayNum].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 px-3.5 py-3 text-xs"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="font-semibold leading-snug text-foreground">
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                                {item.description}
                              </p>
                            )}
                            {item.location && (
                              <p className="flex items-start gap-1 text-[10px] text-muted-foreground">
                                <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                                {item.location}
                              </p>
                            )}
                          </div>

                          <div className="flex shrink-0 flex-col items-end gap-1">
                            {item.category && (
                              <Badge
                                variant="secondary"
                                className="px-1.5 py-0 text-[9px]"
                              >
                                {item.category}
                              </Badge>
                            )}
                            {item.cost && item.cost > 0 ? (
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {trip.metrics.currency} {item.cost}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {/* Tab 2: Accommodations */}
            <TabsContent value="stays" className="mt-0 space-y-2">
              {trip.accommodations.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No accommodations logged for this trip.
                </div>
              ) : (
                trip.accommodations.map((stay, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground">
                          {stay.name}
                        </span>
                        {stay.type && (
                          <Badge
                            variant="secondary"
                            className="px-1.5 py-0 text-[9px]"
                          >
                            {stay.type}
                          </Badge>
                        )}
                      </div>
                      {stay.address && (
                        <p className="text-[11px] text-muted-foreground">
                          {stay.address}
                        </p>
                      )}
                    </div>

                    {stay.cost && stay.cost > 0 ? (
                      <span className="shrink-0 text-xs font-semibold text-primary">
                        {stay.currency} {stay.cost.toLocaleString()}
                      </span>
                    ) : null}
                  </div>
                ))
              )}
            </TabsContent>

            {/* Tab 3: Packing & Tips */}
            <TabsContent value="prep" className="mt-0 space-y-4">
              {trip.checklistHighlights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <CheckSquare className="h-3.5 w-3.5 text-primary" /> Recommended
                    Packing Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {trip.checklistHighlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-sm border border-border/60 bg-muted/30 p-2 text-xs text-foreground"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {trip.tips.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <FileText className="h-3.5 w-3.5 text-primary" /> Local Tips &
                    Notes
                  </h4>
                  <div className="space-y-1.5">
                    {trip.tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="rounded-sm border border-primary/20 bg-primary/5 p-2.5 text-xs text-foreground"
                      >
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {trip.checklistHighlights.length === 0 && trip.tips.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No packing checklist or notes attached to this template.
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Optional AI Tailor Accordion */}
          <div className="rounded-md border border-primary/40 bg-primary/10 p-2">
            <button
              type="button"
              onClick={() => setShowAiCustomizer(!showAiCustomizer)}
              aria-expanded={showAiCustomizer}
              className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-sm px-2.5 py-2 text-left text-xs font-bold text-foreground transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex items-center gap-1.5">
                <Wand2 className="h-3.5 w-3.5 text-primary" />
                <span>Adapt this itinerary before cloning</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-primary transition-transform ${
                  showAiCustomizer ? "rotate-180" : ""
                }`}
              />
            </button>

            {showAiCustomizer && (
              <div className="mx-1 mb-1 space-y-2 rounded-sm border border-border bg-card p-3">
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Add instructions for the cloned plan (e.g. &ldquo;Make all
                  food stops pure vegetarian&rdquo;, &ldquo;Slower pace suitable for toddlers&rdquo;,
                  or &ldquo;Focus on budget-friendly free sights&rdquo;).
                </p>
                <Input
                  placeholder="e.g. Adapt activities for a relaxed, kid-friendly pace..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="h-9 border-primary/35 bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <DialogFooter className="flex flex-row items-center justify-between gap-2 border-t border-border bg-muted/20 p-4 sm:justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsDescriptionExpanded(false);
              onOpenChange(false);
            }}
            className={`h-8 cursor-pointer border-black !bg-white !text-slate-950 hover:!bg-slate-200 dark:border-white dark:!bg-black dark:!text-white dark:hover:!bg-slate-800 ${trip.isOwn ? "ml-auto" : ""}`}
          >
            Close
          </Button>

          {!trip.isOwn && (trip.isCloned ? (
            <Button
              size="sm"
              disabled={true}
              variant="secondary"
              className="h-8 cursor-not-allowed gap-1.5 border border-border bg-muted text-xs text-muted-foreground"
            >
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Already in Workspace</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleClone}
              disabled={isCloning}
              className="dashboard-btn-primary h-8 text-xs gap-1.5 shadow-xs"
            >
              {isCloning ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>
                {aiPrompt.trim() ? "Tailor & Clone to Workspace" : "Clone to Workspace"}
              </span>
            </Button>
          ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
