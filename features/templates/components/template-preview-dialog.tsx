"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import {
  Calendar,
  Check,
  CheckSquare,
  Clock,
  Compass,
  FileText,
  Loader2,
  MapPin,
  Sparkles,
  User,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-sm sm:rounded-sm dark:bg-[#0F131C] dark:border-zinc-800">
        {/* Modal Header: Space-efficient, left-aligned, won't crowd the close button */}
        <DialogHeader className="p-3.5 sm:p-4 pb-2.5 sm:pb-3 pr-11 border-b border-border bg-muted/20 dark:bg-card-subtle text-left">
          {/* Top Metadata Badges in a single compact row */}
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap mb-1">
            <Badge variant="secondary" className="text-[10px] sm:text-[11px] px-1.5 py-0.2 shrink-0 dark:border-zinc-800">
              <Clock className="w-3 h-3 mr-1 text-primary" />
              {trip.durationDays} {trip.durationDays === 1 ? "Day" : "Days"}
            </Badge>

            {trip.isOwn && (
              <Badge className="bg-primary/15 text-primary border border-primary/30 text-[10px] sm:text-[11px] px-1.5 py-0.2 shrink-0">
                <User className="w-3 h-3 mr-1" /> Your Template
              </Badge>
            )}

            {trip.destination && (
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground dark:text-zinc-400 font-medium truncate">
                <MapPin className="w-3 h-3 text-primary shrink-0" />
                <span className="truncate">{trip.destination}</span>
              </span>
            )}

            {trip.metrics.expenseTotal > 0 && (
              <Badge className="sm:ml-auto bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] sm:text-[11px] px-1.5 py-0.2 shrink-0">
                <Wallet className="w-3 h-3 mr-1" />
                Est. ~{trip.metrics.expenseTotal.toLocaleString()}{" "}
                {trip.metrics.currency}
              </Badge>
            )}
          </div>

          <DialogTitle className="text-base sm:text-lg font-bold text-foreground dark:text-zinc-100 truncate text-left">
            {trip.title}
          </DialogTitle>

          <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground dark:text-zinc-400 line-clamp-1 text-left mt-0.5">
            {trip.description ||
              "Review the full day-by-day schedule, stays, and packing list before cloning."}
          </DialogDescription>
        </DialogHeader>

        {/* Modal Body with Tabs */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 space-y-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 h-8 sm:h-9 mb-3 rounded-sm dark:bg-zinc-900 dark:border-zinc-800">
              <TabsTrigger value="itinerary" className="text-[11px] sm:text-xs gap-1 sm:gap-1.5 rounded-sm py-1">
                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Itinerary ({trip.metrics.activityCount})</span>
              </TabsTrigger>

              <TabsTrigger value="stays" className="text-[11px] sm:text-xs gap-1 sm:gap-1.5 rounded-sm py-1">
                <Compass className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Stays ({trip.metrics.accommodationCount})</span>
              </TabsTrigger>

              <TabsTrigger value="prep" className="text-[11px] sm:text-xs gap-1 sm:gap-1.5 rounded-sm py-1">
                <CheckSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Packing & Tips</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Day-by-day Itinerary */}
            <TabsContent value="itinerary" className="space-y-4 mt-0">
              {daysList.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground dark:text-zinc-400">
                  No scheduled activities logged in this itinerary.
                </div>
              ) : (
                daysList.map((dayNum) => (
                  <div
                    key={dayNum}
                    className="rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#121622] p-3.5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-border/60 dark:border-zinc-800/80 pb-1.5">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                         Day {dayNum}
                      </span>
                      <span className="text-[11px] text-muted-foreground dark:text-zinc-400">
                        {groupedItinerary[dayNum].length} activities
                      </span>
                    </div>

                    <div className="space-y-2 pt-0.5">
                      {groupedItinerary[dayNum].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <p className="font-semibold text-foreground dark:text-zinc-100">
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="text-[11px] text-muted-foreground dark:text-zinc-400 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                            {item.location && (
                              <p className="text-[10px] text-muted-foreground dark:text-zinc-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-primary" />
                                {item.location}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.category && (
                              <Badge
                                variant="secondary"
                                className="text-[9px] px-1.5 py-0 dark:border-zinc-800"
                              >
                                {item.category}
                              </Badge>
                            )}
                            {item.cost && item.cost > 0 ? (
                              <span className="text-[10px] font-mono text-muted-foreground dark:text-zinc-400">
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
            <TabsContent value="stays" className="space-y-3 mt-0">
              {trip.accommodations.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground dark:text-zinc-400">
                  No accommodations logged for this trip.
                </div>
              ) : (
                trip.accommodations.map((stay, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#121622] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground dark:text-zinc-100">
                          {stay.name}
                        </span>
                        {stay.type && (
                          <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0 dark:border-zinc-800"
                          >
                            {stay.type}
                          </Badge>
                        )}
                      </div>
                      {stay.address && (
                        <p className="text-[11px] text-muted-foreground dark:text-zinc-400">
                          {stay.address}
                        </p>
                      )}
                    </div>

                    {stay.cost && stay.cost > 0 ? (
                      <span className="font-semibold text-xs text-foreground dark:text-zinc-100 shrink-0">
                        {stay.currency} {stay.cost.toLocaleString()}
                      </span>
                    ) : null}
                  </div>
                ))
              )}
            </TabsContent>

            {/* Tab 3: Packing & Tips */}
            <TabsContent value="prep" className="space-y-4 mt-0">
              {trip.checklistHighlights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-zinc-400 flex items-center gap-1.5">
                    <CheckSquare className="h-3.5 w-3.5 text-primary" /> Recommended
                    Packing Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {trip.checklistHighlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-sm bg-muted/30 dark:bg-[#121622] border border-border/50 dark:border-zinc-800 text-xs text-foreground dark:text-zinc-200 flex items-center gap-2"
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-zinc-400 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" /> Local Tips &
                    Notes
                  </h4>
                  <div className="space-y-1.5">
                    {trip.tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-sm bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 text-xs text-foreground dark:text-zinc-200"
                      >
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {trip.checklistHighlights.length === 0 && trip.tips.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground dark:text-zinc-400">
                  No packing checklist or notes attached to this template.
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Optional AI Tailor Accordion */}
          <div className="rounded-sm border border-primary/30 dark:border-primary/40 bg-primary/5 dark:bg-primary/10 p-3.5 space-y-2">
            <div
              onClick={() => setShowAiCustomizer(!showAiCustomizer)}
              className="flex items-center justify-between cursor-pointer text-xs font-bold text-foreground dark:text-zinc-100 hover:text-primary transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Wand2 className="h-3.5 w-3.5 text-primary" />
                <span>Tailor this itinerary with AI before cloning</span>
                <span className="text-[10px] font-normal text-primary/80 bg-primary/10 px-1.5 py-0.2 rounded-full">
                  Free
                </span>
              </div>
              <span className="text-xs text-muted-foreground dark:text-zinc-400">
                {showAiCustomizer ? "▲ Hide" : "▼ Open"}
              </span>
            </div>

            {showAiCustomizer && (
              <div className="space-y-2 pt-1">
                <p className="text-[11px] text-muted-foreground dark:text-zinc-400 leading-relaxed">
                  Provide custom instructions for our free AI model (e.g. &ldquo;Make all
                  food stops pure vegetarian&rdquo;, &ldquo;Slower pace suitable for toddlers&rdquo;,
                  or &ldquo;Focus on budget-friendly free sights&rdquo;).
                </p>
                <Input
                  placeholder="e.g. Adapt activities for a relaxed, kid-friendly pace..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="h-8 text-xs bg-background dark:bg-[#0A0E17] border-border dark:border-zinc-800 text-foreground dark:text-zinc-100"
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <DialogFooter className="p-4 border-t border-border dark:border-zinc-800 bg-muted/20 dark:bg-[#090D16] flex flex-row items-center justify-between gap-2 sm:justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs cursor-pointer dark:border-zinc-800 dark:text-zinc-200"
          >
            Close
          </Button>

          {trip.isOwn ? (
            <Button
              size="sm"
              disabled={true}
              variant="secondary"
              className="h-8 text-xs gap-1.5 opacity-90 cursor-not-allowed bg-primary/10 text-primary border border-primary/25 font-semibold"
            >
              <User className="h-3.5 w-3.5 text-primary" />
              <span>Your Template</span>
            </Button>
          ) : trip.isCloned ? (
            <Button
              size="sm"
              disabled={true}
              variant="secondary"
              className="h-8 text-xs gap-1.5 opacity-90 cursor-not-allowed bg-muted dark:bg-zinc-850 text-muted-foreground dark:text-zinc-400 border border-border dark:border-zinc-800"
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
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
