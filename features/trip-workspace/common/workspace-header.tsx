"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Copy,
  Globe,
  Loader2,
  Lock,
  MapPin,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/app-shell";
import { CoverImage } from "@/components/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditTripDialog } from "@/features/trips";
import { AddToCalendarDialog } from "./add-to-calendar-dialog";

import { useWorkspaceAi } from "../context/workspace-ai-context";

import {
  deleteTrip,
  duplicateTrip,
  toggleTripPublicStatus,
  updateTrip,
} from "@/features/trips";
import { formatDateRange, isTripDatesPassed } from "@/lib/utils";

import type { Trip, TripStatus } from "@/features/trips";

const TRIP_STATUS_OPTIONS: { value: TripStatus; label: string }[] = [
  { value: "PLANNING", label: "Planning" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
];

interface WorkspaceHeaderProps {
  trip: Trip & { isPublic?: boolean };
}

export function WorkspaceHeader({ trip }: WorkspaceHeaderProps) {
  const router = useRouter();
  const { isAiOpen, toggleAi, userQuota } = useWorkspaceAi();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isPublic, setIsPublic] = useState(Boolean(trip.isPublic));
  const [tripStatus, setTripStatus] = useState<TripStatus>(trip.status);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [isPublishing, startPublishing] = useTransition();
  const [isDuplicating, startDuplicating] = useTransition();
  const [isStatusChanging, startStatusChange] = useTransition();

  const isPastDates = isTripDatesPassed(trip.startDate, trip.endDate);
  const isPastPlanning = tripStatus === "PLANNING" && isPastDates;

  const handleTogglePublish = () => {
    startPublishing(async () => {
      const res = await toggleTripPublicStatus(trip.id);
      if (res.success && res.data) {
        setIsPublic(Boolean(res.data.isPublic));
        if (res.data.isPublic) {
          toast.success("Trip published to Community Hub!");
        } else {
          toast.info("Trip visibility changed to Private.");
        }
      } else {
        toast.error(res.error || "Failed to update trip visibility.");
      }
    });
  };

  const handleDuplicate = () => {
    startDuplicating(async () => {
      try {
        const res = await duplicateTrip(trip.id);
        if (res.success && res.data) {
          toast.success(`Duplicated workspace as "${res.data.title}"`);
          router.push(`/trips/${res.data.id}`);
        } else {
          toast.error(res.error || "Failed to duplicate trip");
        }
      } catch {
        toast.error("Failed to duplicate trip");
      }
    });
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Workspace URL copied to clipboard!");
    }
  };

  const handleStatusChange = (newStatus: TripStatus) => {
    setTripStatus(newStatus);
    startStatusChange(async () => {
      const res = await updateTrip({
        id: trip.id,
        title: trip.title,
        destination: trip.destination,
        description: trip.description,
        startDate: trip.startDate ? new Date(trip.startDate).toISOString().split("T")[0] : null,
        endDate: trip.endDate ? new Date(trip.endDate).toISOString().split("T")[0] : null,
        status: newStatus,
      });

      if (res.success) {
        toast.success(`Trip status set to ${newStatus.toLowerCase()}`);
        router.refresh();
      } else {
        setTripStatus(trip.status);
        toast.error(res.error || "Failed to update trip status");
      }
    });
  };

  const getCountdownLabel = (start?: Date | string | null, end?: Date | string | null) => {
    if (!start) return null;
    const now = new Date();
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
    const diffDays = Math.round((startMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

    if (endDate) {
      const endMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
      if (todayMidnight >= startMidnight && todayMidnight <= endMidnight) {
        return (
          <span className="inline-flex items-center gap-1.5 font-sans text-[10px] font-semibold tracking-wide uppercase text-white bg-emerald-600/90 border border-emerald-400/40 px-2 py-0.5 rounded-xs shadow-2xs backdrop-blur-xs">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            Happening now
          </span>
        );
      }
    }

    if (diffDays === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 font-sans text-[10px] font-semibold tracking-wide uppercase text-white bg-emerald-600/90 border border-emerald-400/40 px-2 py-0.5 rounded-xs shadow-2xs backdrop-blur-xs">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
          </span>
          Starts today
        </span>
      );
    }

    if (diffDays > 0) {
      if (diffDays === 1) {
        return (
          <span className="inline-flex items-center gap-1 font-sans text-[10px] font-medium text-white bg-sky-600/90 border border-sky-400/40 px-2 py-0.5 rounded-xs shadow-2xs backdrop-blur-xs">
            <Clock className="h-3 w-3 text-white shrink-0" />
            Starts tomorrow
          </span>
        );
      }
      if (diffDays <= 30) {
        return (
          <span className="inline-flex items-center gap-1 font-sans text-[10px] font-medium text-white bg-sky-600/90 border border-sky-400/40 px-2 py-0.5 rounded-xs shadow-2xs tabular-nums backdrop-blur-xs">
            <Clock className="h-3 w-3 text-white shrink-0" />
            {diffDays} days left
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 font-sans text-[10px] font-medium text-white/90 bg-black/50 border border-white/20 px-2 py-0.5 rounded-xs shadow-2xs tabular-nums backdrop-blur-xs">
          <Clock className="h-3 w-3 text-white/80 shrink-0" />
          In {Math.round(diffDays / 30)} months
        </span>
      );
    }

    if (tripStatus === "PLANNING" && isTripDatesPassed(start, end)) {
      return (
        <span className="inline-flex items-center gap-1 font-sans text-[10px] font-semibold text-amber-200 bg-amber-950/80 border border-amber-500/50 px-2 py-0.5 rounded-xs shadow-2xs backdrop-blur-xs">
          <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
          Planned dates passed
        </span>
      );
    }

    return null;
  };

  const isLongDescription = (trip.description?.length || 0) > 130 || (trip.description?.split("\n").length || 0) > 2;

  return (
    <>
      <div className="space-y-3 pb-1">
        {/* 1. Top Link: Back to Trips (Above the banner image) */}
        <div className="flex items-center justify-between">
          <Link
            href="/trips"
            className="inline-flex items-center font-sans text-xs font-medium text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-100 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Trips</span>
          </Link>
        </div>

        {/* 2. Cover Banner: Clean Destination & Title ONLY (No icons, no long descriptions) */}
        <CoverImage
          tripId={trip.id}
          coverImageUrl={trip.coverImageUrl}
          title={trip.title}
          destination={trip.destination}
          isEditable={true}
        >
          <div className="space-y-1.5">
            {/* Destination Pill & Countdown */}
            <div className="flex items-center gap-2 flex-wrap">
              {trip.destination && (
                <span className="inline-flex items-center gap-1 font-sans text-xs font-medium text-white/95 bg-black/50 backdrop-blur-xs border border-white/15 px-2.5 py-0.5 rounded-xs shadow-2xs">
                  <MapPin className="w-3 h-3 text-primary shrink-0" />
                  {trip.destination}
                </span>
              )}
              {getCountdownLabel(trip.startDate, trip.endDate)}
            </div>

            {/* Clean Trip Title: Pure typography, no icon beside title */}
            <h1 className="font-sans text-2xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
              {trip.title}
            </h1>
          </div>
        </CoverImage>

        {/* Interactive Banner: Trip Passed Planned Dates in Planning Mode */}
        {isPastPlanning && !isBannerDismissed && (
          <div className="relative overflow-hidden rounded-md border border-amber-500/35 bg-amber-500/10 dark:bg-amber-950/30 dark:border-amber-700/50 p-3 sm:p-3.5 text-amber-950 dark:text-amber-100 shadow-2xs transition-all animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="p-1.5 rounded-xs bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 md:mt-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-sans text-xs sm:text-sm font-semibold text-amber-950 dark:text-amber-100">
                      This trip has passed its planned dates
                    </h4>
                    <span className="font-sans text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.2 rounded-2xs bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                      Still in Planning
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                    Scheduled for {formatDateRange(trip.startDate, trip.endDate)}, which is now in the past. Update its status, choose new dates, or delete this trip.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap shrink-0 pl-7 md:pl-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("ACTIVE")}
                  disabled={isStatusChanging}
                  className="h-7 px-2.5 text-[11px] font-medium border-amber-500/40 hover:bg-amber-500/20 text-amber-950 dark:text-amber-100 cursor-pointer rounded-xs"
                >
                  Set to Active
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("COMPLETED")}
                  disabled={isStatusChanging}
                  className="h-7 px-2.5 text-[11px] font-medium border-amber-500/40 hover:bg-amber-500/20 text-amber-950 dark:text-amber-100 cursor-pointer rounded-xs"
                >
                  Mark Completed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditOpen(true)}
                  className="h-7 px-2.5 text-[11px] font-medium border-amber-500/40 hover:bg-amber-500/20 text-amber-950 dark:text-amber-100 cursor-pointer rounded-xs gap-1"
                >
                  <Pencil className="w-3 h-3" />
                  Edit Dates
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsDeleteOpen(true)}
                  className="h-7 px-2 text-[11px] font-medium border-destructive/30 text-destructive hover:bg-destructive/10 cursor-pointer rounded-xs gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsBannerDismissed(true)}
                  aria-label="Dismiss banner"
                  className="h-7 w-7 p-0 text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-100 hover:bg-amber-500/20 cursor-pointer rounded-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Action Control Strip & Metadata Below the Banner */}
        <div className="space-y-2 pt-0.5">
          {/* Main Controls Row: Kept strictly in ONE single row across all screen sizes */}
          <div className="flex items-center justify-between gap-2 w-full flex-nowrap">
            {/* Left: Workspace Eyebrow */}
            <div className="flex items-center gap-1.5 min-w-0">
              <Compass className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-sans text-[11px] font-semibold tracking-widest text-primary uppercase truncate">
                Trip Workspace
              </span>
            </div>

            {/* Right: Actions Row (Public badge, Status, AI Assistant, Menu) */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap shrink-0">
              {/* Public Community Trip Badge */}
              {isPublic && (
                <Badge
                  variant="outline"
                  className="gap-1 font-sans text-[10px] sm:text-[11px] font-semibold tracking-wide border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-2xs h-7 sm:h-8 px-2 sm:px-2.5 rounded-xs shrink-0"
                >
                  <Globe className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="hidden xs:inline">Public</span>
                </Badge>
              )}

              {/* Status Select */}
              <Select
                value={tripStatus}
                onValueChange={(val) => handleStatusChange(val as TripStatus)}
                disabled={isStatusChanging}
              >
                <SelectTrigger className="h-7 sm:h-8 font-sans text-xs font-medium w-[105px] sm:w-[120px] rounded-xs cursor-pointer shrink-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-sm">
                  {TRIP_STATUS_OPTIONS.map((status) => (
                    <SelectItem
                      key={status.value}
                      value={status.value}
                      className="font-sans text-xs font-medium cursor-pointer"
                    >
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* AI Assistant Button (Ichinose - Prava AI Assistant) */}
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isAiOpen ? "default" : "outline"}
                      size="sm"
                      className={`h-7 sm:h-8 px-2 sm:px-3 gap-1.5 font-sans text-xs font-medium cursor-pointer transition-all rounded-xs shrink-0 ${
                        isAiOpen
                          ? "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                          : "border-primary/40 hover:border-primary hover:bg-primary/10 text-primary"
                      }`}
                      onClick={toggleAi}
                      aria-label="Ichinose — Prava Travel Assistant"
                    >
                      <div className="relative h-4 w-4 shrink-0 rounded-full overflow-hidden ring-1 ring-primary/40 shadow-2xs bg-white">
                        <Image
                          src="/avatars/ichinose.png"
                          alt="Ichinose"
                          width={16}
                          height={16}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span>Ichinose</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="end"
                    className="w-64 p-3 space-y-2 border border-border/80 dark:border-zinc-800 bg-popover dark:bg-[#0F131C] text-popover-foreground dark:text-zinc-100 shadow-lg rounded-md z-50 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative h-6 w-6 shrink-0 rounded-full overflow-hidden ring-1 ring-primary/50 shadow-2xs">
                        <Image
                          src="/avatars/ichinose.png"
                          alt="Ichinose"
                          width={24}
                          height={24}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground dark:text-zinc-100 flex items-center gap-1.5">
                          Ichinose AI
                          <span className="text-[10px] font-normal text-muted-foreground dark:text-zinc-400">· Travel Copilot</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground dark:text-zinc-400">Prava Workspace Assistant</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground dark:text-zinc-400 leading-snug">
                      Interactive travel assistant for multi-day itineraries, stays, live travel data, and structured trip updates.
                    </p>
                    {userQuota && (
                      <div className="pt-1.5 border-t border-border/60 dark:border-zinc-800 flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground dark:text-zinc-400 font-medium">Monthly AI Credits:</span>
                        <span
                          className={`font-semibold tabular-nums ${
                            userQuota.remaining > 0 ? "text-primary" : "text-destructive"
                          }`}
                        >
                          {userQuota.remaining} / {userQuota.quota} remaining
                        </span>
                      </div>
                    )}
                    <p className="text-[9px] text-muted-foreground/80 dark:text-zinc-500 text-right pt-0.5">
                      Click to {isAiOpen ? "close" : "open"} assistant
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* 3-Dot Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 sm:h-8 w-7 sm:w-8 text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-100 cursor-pointer rounded-xs shrink-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Trip Settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-sm">
                  <DropdownMenuItem onClick={handleCopyLink} className="font-sans text-xs font-medium cursor-pointer">
                    <Share2 className="h-3.5 w-3.5 mr-2" />
                    Copy Trip Link
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setIsCalendarOpen(true)}
                    className="font-sans text-xs font-medium cursor-pointer"
                  >
                    <Calendar className="h-3.5 w-3.5 mr-2 text-primary" />
                    Add to Calendar
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="font-sans text-xs font-medium cursor-pointer">
                    <Pencil className="h-3.5 w-3.5 mr-2" />
                    Edit Details & Cover
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleDuplicate}
                    disabled={isDuplicating}
                    className="font-sans text-xs font-medium cursor-pointer"
                  >
                    {isDuplicating ? (
                      <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 mr-2" />
                    )}
                    Duplicate Workspace
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleTogglePublish}
                    disabled={isPublishing}
                    className="font-sans text-xs font-medium cursor-pointer"
                  >
                    {isPublishing ? (
                      <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    ) : isPublic ? (
                      <Lock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    ) : (
                      <Globe className="h-3.5 w-3.5 mr-2 text-primary" />
                    )}
                    {isPublic ? "Make Private" : "Share to Community"}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setIsDeleteOpen(true)}
                    className="font-sans text-xs font-medium text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete Trip
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Sub-row: Date Range & Description with Show More/Less */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pt-1 border-t border-border/50 text-xs">
            {/* Description (max 2 lines with Show more) */}
            <div className="flex-1 min-w-0 pr-4">
              {trip.description ? (
                <div>
                  <p className={`font-serif italic text-muted-foreground leading-relaxed ${!isDescExpanded ? "line-clamp-2" : ""}`}>
                    {trip.description}
                  </p>
                  {isLongDescription && (
                    <button
                      type="button"
                      onClick={() => setIsDescExpanded(!isDescExpanded)}
                      className="text-[11px] text-primary hover:underline font-sans font-medium mt-0.5 cursor-pointer inline-flex items-center gap-0.5"
                    >
                      <span>{isDescExpanded ? "Show less" : "Show more"}</span>
                      {isDescExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              ) : (
                <span className="text-[11px] text-muted-foreground/60 italic">No trip description provided</span>
              )}
            </div>

            {/* Date Range on the right below the controls */}
            <div className="shrink-0 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground tabular-nums bg-muted/30 px-2 py-0.5 rounded-xs border border-border/50">
                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <AddToCalendarDialog
        trip={trip}
        open={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
      />

      <EditTripDialog
        trip={trip}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <ConfirmDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Trip"
        description={`Are you sure you want to delete "${trip.title}"? This will permanently remove all associated itineraries, notes, and workspace data.`}
        onConfirm={async () => {
          const res = await deleteTrip({ id: trip.id });
          if (res.success) {
            toast.success(`Deleted "${trip.title}"`);
            router.push("/trips");
            router.refresh();
          } else {
            toast.error(res.error || "Failed to delete trip");
          }
        }}
      />
    </>
  );
}

export default WorkspaceHeader;
