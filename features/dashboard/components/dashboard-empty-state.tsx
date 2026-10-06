"use client";

import { Compass, Hotel, MapPin, Plus, Sparkles, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { DashboardEmptyVector } from "./dashboard-empty-vector";
import { CreateTripDialog } from "@/features/trips";

export function DashboardEmptyState() {
  return (
    <Card className="dashboard-card overflow-hidden relative">
      {/* Subtle blueprint grid ambient overlay */}
      <div className="absolute inset-0 bg-prava-pattern opacity-40 pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
        {/* Left Content Column */}
        <div className="lg:col-span-7 space-y-5 text-left">
          <div className="dashboard-badge-cerulean inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs font-sans text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Travel Workspace Ready</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl font-light tracking-tight text-foreground dark:text-zinc-50">
              Start Planning Your{" "}
              <span className="font-serif italic font-normal text-zinc-700 dark:text-zinc-200">
                Next Journey
              </span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-muted-foreground dark:text-zinc-400 leading-relaxed max-w-xl font-normal">
              Create your first trip to organize smart daily schedules, track stays &amp; bookings, manage multi-currency expenses in INR, and pack with essential checklists.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-1">
            <div className="flex items-center gap-2 font-sans text-xs text-slate-700 dark:text-zinc-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-xs bg-[#2D9BF0]/15 text-[#2D9BF0] dark:text-[#38BDF8] shrink-0">
                <Sparkles className="w-3 h-3" />
              </span>
              <span>Daily Itinerary &amp; Timeline</span>
            </div>
            <div className="flex items-center gap-2 font-sans text-xs text-slate-700 dark:text-zinc-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Hotel className="w-3 h-3" />
              </span>
              <span>Stays &amp; Confirmation Codes</span>
            </div>
            <div className="flex items-center gap-2 font-sans text-xs text-slate-700 dark:text-zinc-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-xs bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                <Wallet className="w-3 h-3" />
              </span>
              <span>Multi-Currency Budget in INR</span>
            </div>
            <div className="flex items-center gap-2 font-sans text-xs text-slate-700 dark:text-zinc-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-xs bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 shrink-0">
                <MapPin className="w-3 h-3" />
              </span>
              <span>Offline Notes &amp; Essentials</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end sm:justify-start">
            <CreateTripDialog
              trigger={
                <Button className="dashboard-btn-primary h-10 sm:h-9 px-5 sm:px-4 py-2.5 sm:py-1.5 gap-2">
                  <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  <span>Create Your First Trip</span>
                </Button>
              }
            />
          </div>
        </div>

        {/* Right Travel Illustration Column */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square relative flex items-center justify-center">
            {/* Subtle glow background */}
            <div className="absolute inset-4 rounded-full bg-primary/10 dark:bg-primary/15 blur-2xl pointer-events-none" />

            {/* Travel Theme Vector Graphic */}
            <DashboardEmptyVector className="w-full h-full relative z-10 drop-shadow-sm select-none" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default DashboardEmptyState;
