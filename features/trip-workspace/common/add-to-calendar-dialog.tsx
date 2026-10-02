"use client";

import { useState } from "react";

import {
  Calendar,
  Check,
  Clock,
  Copy,
  Download,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  buildTripGoogleCalendarUrl,
  downloadIcsFile,
  generateTripIcs,
  type MinimalAccommodation,
  type MinimalItineraryItem,
  type MinimalTrip,
} from "@/lib/calendar/calendar-utils";
import { formatDateRange } from "@/lib/utils";

interface AddToCalendarDialogProps {
  trip: MinimalTrip;
  itinerary?: MinimalItineraryItem[];
  accommodations?: MinimalAccommodation[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddToCalendarDialog({
  trip,
  itinerary = [],
  accommodations = [],
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: AddToCalendarDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? setControlledOpen : setInternalOpen;

  const googleCalUrl = buildTripGoogleCalendarUrl(trip);

  const handleOpenGoogleCalendar = () => {
    window.open(googleCalUrl, "_blank", "noopener,noreferrer");
    toast.success("Opened Google Calendar in a new tab!");
    setIsOpen?.(false);
  };

  const handleDownloadIcs = () => {
    try {
      const ics = generateTripIcs(trip, itinerary, accommodations);
      const safeFilename = (trip.title || "trip")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      downloadIcsFile(`${safeFilename || "prava-trip"}.ics`, ics);
      toast.success("Downloaded calendar file (.ics)");
      setIsOpen?.(false);
    } catch {
      toast.error("Failed to generate calendar file.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(googleCalUrl);
    setIsCopied(true);
    toast.success("Google Calendar event link copied!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px] p-6 gap-5">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase block">
              Calendar Sync
            </span>
            <Badge
              variant="outline"
              className="text-[10px] font-medium border-[#2D9BF0]/30 text-[#2D9BF0] bg-[#2D9BF0]/5"
            >
              1-Click
            </Badge>
          </div>
          <DialogTitle className="font-sans text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#2D9BF0]" />
            Add Trip to Calendar
          </DialogTitle>
          <DialogDescription className="font-sans text-xs text-muted-foreground leading-relaxed">
            Sync your travel dates and scheduled stops with Google Calendar, Apple Calendar, or Microsoft Outlook.
          </DialogDescription>
        </DialogHeader>

        {/* Trip Summary Capsule */}
        <div className="rounded-md border border-border/80 bg-muted/30 p-3.5 space-y-2">
          <div className="font-medium text-sm text-foreground truncate">
            {trip.title}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {trip.destination && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2D9BF0]" />
                {trip.destination}
              </span>
            )}
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock className="w-3.5 h-3.5 text-muted-foreground/80" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </span>
          </div>
          {(itinerary.length > 0 || accommodations.length > 0) && (
            <div className="pt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
              {itinerary.length > 0 && (
                <span className="font-medium text-foreground">
                  {itinerary.length} scheduled stop{itinerary.length === 1 ? "" : "s"}
                </span>
              )}
              {itinerary.length > 0 && accommodations.length > 0 && <span>·</span>}
              {accommodations.length > 0 && (
                <span className="font-medium text-foreground">
                  {accommodations.length} stay{accommodations.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Sync Actions Grid */}
        <div className="space-y-2.5">
          {/* Action 1: Google Calendar Direct Web Link */}
          <Button
            type="button"
            onClick={handleOpenGoogleCalendar}
            className="w-full h-11 justify-between px-4 bg-[#2D9BF0] hover:bg-[#2087D6] text-white font-medium cursor-pointer shadow-xs"
          >
            <span className="flex items-center gap-2.5 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Open in Google Calendar</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </Button>

          {/* Action 2: Universal .ics Download */}
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadIcs}
            className="w-full h-11 justify-between px-4 border-border/80 hover:bg-muted font-medium text-foreground cursor-pointer"
          >
            <span className="flex items-center gap-2.5 text-sm">
              <Download className="w-4 h-4 text-[#2D9BF0]" />
              <span>Download Universal iCal (.ics)</span>
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
              Apple / Outlook
            </span>
          </Button>

          {/* Action 3: Copy direct Google Calendar event link */}
          <Button
            type="button"
            variant="ghost"
            onClick={handleCopyLink}
            className="w-full h-9 text-xs text-muted-foreground hover:text-foreground cursor-pointer gap-2"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied Google Calendar URL</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Google Calendar URL</span>
              </>
            )}
          </Button>
        </div>

        {/* Explanatory footer note */}
        <div className="pt-2 border-t border-border/60">
          <p className="text-[11px] text-muted-foreground/90 leading-relaxed flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>Zero-friction sync:</strong> Opens directly in your browser without requiring calendar account permissions or sensitive OAuth tokens.
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
