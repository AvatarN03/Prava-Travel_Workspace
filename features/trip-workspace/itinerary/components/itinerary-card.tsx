"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Bed,
  Bus,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  Loader2,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plane,
  ShoppingBag,
  Trash2,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditItineraryDialog } from "./edit-itinerary-dialog";

import { buildItineraryItemGoogleCalendarUrl } from "@/lib/calendar/calendar-utils";
import { deleteItineraryItem } from "../actions";

import type { ItineraryItem } from "@prisma/client";

const CAT_STYLES: Record<
  string,
  { label: string; icon: React.ElementType; badgeClass: string }
> = {
  Activity: {
    label: "Activity",
    icon: Camera,
    badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
  Food: {
    label: "Food & Dining",
    icon: Utensils,
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  Transport: {
    label: "Transit",
    icon: Bus,
    badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },
  Accommodation: {
    label: "Stay",
    icon: Bed,
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  Flight: {
    label: "Flight",
    icon: Plane,
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  Shopping: {
    label: "Shopping",
    icon: ShoppingBag,
    badgeClass: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  },
  Tour: {
    label: "Tour",
    icon: CheckCircle2,
    badgeClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  },
};

interface ItineraryCardProps {
  item: ItineraryItem;
  tripTitle?: string;
  destination?: string | null;
  tripStartDate?: Date | string | null;
}

export function ItineraryCard({
  item,
  tripTitle,
  destination,
  tripStartDate,
}: ItineraryCardProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  const handleAddToGoogleCalendar = () => {
    const url = buildItineraryItemGoogleCalendarUrl(
      {
        title: tripTitle || "Trip",
        destination: destination || item.location,
        startDate: tripStartDate,
      },
      item
    );
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("Opened activity in Google Calendar!");
  };

  const handleDelete = () => {
    startDelete(async () => {
      try {
        await deleteItineraryItem({ id: item.id, tripId: item.tripId });
        toast.success(`Removed "${item.title}" from itinerary`);
        setIsDeleteOpen(false);
        router.refresh();
      } catch {
        toast.error("Failed to delete event");
      }
    });
  };

  const catKey = item.category || "Activity";
  const cfg = CAT_STYLES[catKey] || CAT_STYLES.Activity;
  const Icon = cfg.icon;

  const mapsUrl = item.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`
    : null;

  return (
    <>
      <div className="group relative flex items-start gap-3 sm:gap-4 pl-0">
        {/* Timeline circular node */}
        <div className="flex flex-col items-center shrink-0 mt-3.5 z-10">
          <div className="h-6 w-6 rounded-full bg-background border-2 border-[#2D9BF0] flex items-center justify-center shadow-xs">
            <Icon className="h-3 w-3 text-[#2D9BF0]" />
          </div>
        </div>

        {/* Card Body */}
        <div className="flex-1 rounded-sm border border-border/80 bg-card hover:border-[#2D9BF0]/50 hover:shadow-xs transition-all duration-150 p-3.5 sm:p-4 space-y-2.5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 min-w-0 flex-1">
              {/* Category + Time + Cost Meta Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold border rounded-xs px-2 py-0.5 ${cfg.badgeClass}`}
                >
                  {cfg.label}
                </span>

                {item.time && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground font-mono tabular-nums">
                    <Clock className="w-3 h-3 text-[#2D9BF0]" />
                    {item.time}
                  </span>
                )}

                {item.cost !== null && item.cost > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xs px-2 py-0.5 tabular-nums">
                    <DollarSign className="w-3 h-3" />
                    {item.cost.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h4 className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                {item.title}
              </h4>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="cursor-pointer">
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Edit Event
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAddToGoogleCalendar} className="cursor-pointer">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-[#2D9BF0]" />
                  Add to Google Calendar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsDeleteOpen(true)}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Location */}
          {item.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-[#2D9BF0] shrink-0" />
              {mapsUrl ? (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground hover:underline inline-flex items-center gap-1 truncate"
                >
                  <span className="truncate">{item.location}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                </a>
              ) : (
                <span className="truncate">{item.location}</span>
              )}
            </div>
          )}

          {/* Description & Tips */}
          {item.description && (
            <p className="text-xs text-muted-foreground leading-relaxed pt-1.5 whitespace-pre-wrap border-t border-border/60">
              {item.description}
            </p>
          )}
        </div>
      </div>

      <EditItineraryDialog
        item={item}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <ConfirmDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Itinerary Event"
        description={`Are you sure you want to delete "${item.title}" from Day ${item.dayNumber || 1}?`}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
