"use client";

import { useMemo } from "react";
import Link from "next/link";

import {
  BedDouble,
  Calendar,
  Compass,
  DollarSign,
  Moon,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AccommodationCard } from "./accommodation-card";
import { AddAccommodationDialog } from "./add-accommodation-dialog";

import type { Accommodation } from "@prisma/client";

interface AccommodationListProps {
  tripId: string;
  items: Accommodation[];
}

export function AccommodationList({ tripId, items }: AccommodationListProps) {
  // Aggregate stats across confirmed stays
  const { totalNights, totalLodgingCost, avgNightlyCost } = useMemo(() => {
    let nights = 0;
    let cost = 0;

    items.forEach((item) => {
      if (item.checkIn && item.checkOut) {
        const diff = new Date(item.checkOut).getTime() - new Date(item.checkIn).getTime();
        const days = Math.round(diff / (1000 * 60 * 60 * 24));
        nights += days > 0 ? days : 1;
      }
      if (item.cost && item.cost > 0) {
        cost += item.cost;
      }
    });

    const avg = nights > 0 && cost > 0 ? Math.round(cost / nights) : 0;
    return { totalNights: nights, totalLodgingCost: cost, avgNightlyCost: avg };
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border">
          <div className="space-y-1.5">
            <span className="font-sans text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase block">
              Accommodations & Stays
            </span>
            <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground">
              Confirmed{" "}
              <span className="font-serif italic font-normal text-foreground">
                Lodgings
              </span>
            </h1>
            <p className="font-sans text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl">
              Keep hotel vouchers, Airbnb lockbox codes, check-in instructions, and concierge contact details in one place.
            </p>
          </div>
        </div>

        {/* Actionable Empty State */}
        <div className="rounded-sm border border-dashed border-border/80 bg-card/60 p-8 sm:p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <BedDouble className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base font-semibold text-foreground">
              No accommodations added yet
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Record your booked stays, check-in windows, confirmation codes, and addresses for offline reference during travel.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <AddAccommodationDialog
              tripId={tripId}
              trigger={
                <Button size="sm" className="w-full sm:w-auto cursor-pointer gap-1.5 bg-[#2D9BF0] hover:bg-[#2087D6] text-white shadow-xs font-semibold">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Stay</span>
                </Button>
              }
            />

            <Link href="/travel-essentials?tab=maps">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto cursor-pointer gap-1.5 border-border hover:bg-muted"
              >
                <Compass className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Explore Stays on Maps</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Editorial Workspace Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase block">
              Accommodations & Stays
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {items.length} Confirmed {items.length === 1 ? "Stay" : "Stays"}
            </span>
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground">
            Confirmed{" "}
            <span className="font-serif italic font-normal text-foreground">
              Lodgings
            </span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl">
            Hotel reservations, apartments, check-in instructions, confirmation codes, and concierge contact details.
          </p>
        </div>

        <AddAccommodationDialog
          tripId={tripId}
          trigger={
            <Button size="sm" className="h-8 gap-1.5 text-xs font-semibold cursor-pointer bg-[#2D9BF0] hover:bg-[#2087D6] text-white shadow-xs shrink-0">
              <Plus className="w-3.5 h-3.5" />
              Add Stay
            </Button>
          }
        />
      </div>

      {/* ── Stays Metric Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 rounded-sm border border-border/80 bg-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Stays</span>
            <BedDouble className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">
            {items.length} <span className="text-xs font-normal text-muted-foreground">properties</span>
          </div>
        </div>

        <div className="p-3.5 rounded-sm border border-border/80 bg-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium uppercase tracking-wider">Nights Booked</span>
            <Moon className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">
            {totalNights} <span className="text-xs font-normal text-muted-foreground">nights</span>
          </div>
        </div>

        <div className="p-3.5 rounded-sm border border-border/80 bg-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium uppercase tracking-wider">Lodging Spend</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-foreground tabular-nums">
            ${totalLodgingCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-3.5 rounded-sm border border-border/80 bg-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium uppercase tracking-wider">Avg Nightly Rate</span>
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono text-foreground tabular-nums">
            {avgNightlyCost > 0 ? `$${avgNightlyCost}/night` : "—"}
          </div>
        </div>
      </div>

      {/* ── Accommodations Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <AccommodationCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
