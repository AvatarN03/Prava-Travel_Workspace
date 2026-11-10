"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

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
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cloneTripTemplate } from "../actions";

import type { TemplateTripItem } from "../types";

interface TemplateCardProps {
  trip: TemplateTripItem;
  onPreview: (trip: TemplateTripItem) => void;
  onCloned?: (tripId: string) => void;
}

const DEFAULT_TRIP_COVER =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";

export function TemplateCard({ trip, onPreview, onCloned }: TemplateCardProps) {
  const router = useRouter();
  const [isCloning, startCloning] = useTransition();

  const handleQuickClone = () => {
    startCloning(async () => {
      const res = await cloneTripTemplate(trip.id);
      if (res.success && res.newTripId) {
        toast.success(`Cloned "${trip.title}" into your workspace!`);
        onCloned?.(trip.id);
        router.push(`/trips/${res.newTripId}`);
      } else {
        toast.error(res.error || "Failed to clone template.");
      }
    });
  };

  const coverUrl = trip.coverImageUrl || DEFAULT_TRIP_COVER;
  const authorInitials = (trip.author.fullName || trip.author.username || "T")
    .substring(0, 2)
    .toUpperCase();

  return (
    <Card className="dashboard-card group relative flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-xs rounded-sm">
      {/* Cover Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-muted border-b border-border/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={trip.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top-Right Ownership Marker */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {trip.isOwn && (
            <Badge className="bg-primary text-primary-foreground border-0 text-[10px] font-bold uppercase tracking-wider shadow-xs gap-1">
              <User className="w-3 h-3" /> Yours
            </Badge>
          )}
        </div>

        {/* Bottom Banner Title Overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <TooltipProvider delayDuration={250}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onPreview(trip)}
                  className="block w-full rounded-sm text-left text-base font-bold leading-snug line-clamp-2 drop-shadow-xs transition-colors group-hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {trip.title}
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs whitespace-normal break-words text-xs leading-relaxed sm:max-w-sm">
                {trip.title}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Card Content & Details */}
      <CardContent className="flex flex-1 flex-col gap-3 p-4 pb-3">
        <div className="flex items-start justify-between gap-4 text-xs text-muted-foreground">
          <div className="min-w-0 space-y-1">
            {trip.destination && (
              <span className="flex min-w-0 flex-wrap items-start gap-x-1.5 font-medium text-foreground">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 break-words">{trip.destination}</span>
              </span>
            )}
            {trip.metrics.expenseTotal > 0 && (
              <span className="flex items-center gap-1 font-semibold text-primary">
                <Wallet className="h-3 w-3" />
                ~{trip.metrics.expenseTotal.toLocaleString()} {trip.metrics.currency}
              </span>
            )}
          </div>
          <span className="flex shrink-0 items-center gap-1 pt-0.5">
            <Clock className="h-3 w-3 text-primary" />
            {trip.durationDays} {trip.durationDays === 1 ? "day" : "days"}
          </span>
        </div>

        {/* "What's Included" Asset Strip */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <div className="dashboard-surface-subtle flex items-center gap-1.5 px-2 py-1 text-[11px] text-foreground">
            <Calendar className="h-3 w-3 text-primary shrink-0" />
            <span className="font-medium truncate">
              {trip.metrics.activityCount} Activities
            </span>
          </div>

          <div className="dashboard-surface-subtle flex items-center gap-1.5 px-2 py-1 text-[11px] text-foreground">
            <Compass className="h-3 w-3 text-primary shrink-0" />
            <span className="font-medium truncate">
              {trip.metrics.accommodationCount} Stays
            </span>
          </div>

          {trip.metrics.checklistCount > 0 && (
            <div className="dashboard-surface-subtle flex items-center gap-1.5 px-2 py-1 text-[11px] text-foreground">
              <CheckSquare className="h-3 w-3 text-primary shrink-0" />
              <span className="font-medium truncate">
                {trip.metrics.checklistCount} Packing
              </span>
            </div>
          )}

          {trip.metrics.notesCount > 0 && (
            <div className="dashboard-surface-subtle flex items-center gap-1.5 px-2 py-1 text-[11px] text-foreground">
              <FileText className="h-3 w-3 text-primary shrink-0" />
              <span className="font-medium truncate">
                {trip.metrics.notesCount} Local Tips
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto flex min-w-0 items-center border-t border-border/60 pt-3">
          {trip.author.username ? (
            <Link
              href={`/u/${trip.author.username}`}
              className="group/author flex min-w-0 items-center gap-2.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Avatar className="h-7 w-7 shrink-0 border border-border transition-colors group-hover/author:border-primary">
                {trip.author.avatarUrl ? (
                  <AvatarImage src={trip.author.avatarUrl} alt={trip.author.fullName || ""} />
                ) : null}
                <AvatarFallback className="bg-muted text-[10px] font-bold text-foreground">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 truncate text-xs font-semibold text-foreground transition-colors group-hover/author:text-primary">
                {trip.author.fullName || trip.author.username}
              </span>
            </Link>
          ) : (
            <>
              <Avatar className="h-7 w-7 shrink-0 border border-border">
                {trip.author.avatarUrl ? (
                  <AvatarImage src={trip.author.avatarUrl} alt={trip.author.fullName || ""} />
                ) : null}
                <AvatarFallback className="bg-muted text-[10px] font-bold text-foreground">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <span className="ml-2.5 min-w-0 truncate text-xs font-semibold text-foreground">
                {trip.author.fullName || "Prava Traveler"}
              </span>
            </>
          )}
        </div>
      </CardContent>

      {/* Card Footer Actions */}
      <CardFooter className="border-t border-border/60 p-3 flex items-center gap-2 bg-muted/10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPreview(trip)}
          className={`h-8 text-xs cursor-pointer border-border hover:border-primary/50 ${
            trip.isOwn ? "w-full" : "flex-1"
          }`}
        >
          Preview Itinerary
        </Button>

        {!trip.isOwn &&
          (trip.isCloned ? (
            <Button
              size="sm"
              disabled={true}
              variant="secondary"
              className="flex-1 h-8 text-xs gap-1.5 opacity-90 cursor-not-allowed bg-muted text-muted-foreground border border-border"
            >
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Already Cloned</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleQuickClone}
              disabled={isCloning}
              className="dashboard-btn-primary flex-1 h-8 text-xs gap-1.5 shadow-xs"
            >
              {isCloning ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>Clone Plan</span>
            </Button>
          ))}
      </CardFooter>
    </Card>
  );
}
