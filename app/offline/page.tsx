"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowUpRight,
  Compass,
  Database,
  Languages,
  MapPin,
  RefreshCw,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { OfflineTravelEssentialsDialog } from "@/features/travel-essentials";
import { OfflineTripViewerDialog } from "@/features/trips";

import { getOfflineTrips, type OfflineTrip } from "@/lib/offline";

export default function OfflinePage() {
  const [cachedTrips, setCachedTrips] = useState<OfflineTrip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isEssentialsOpen, setIsEssentialsOpen] = useState(false);

  useEffect(() => {
    getOfflineTrips().then((trips) => {
      if (trips && trips.length > 0) {
        setCachedTrips(trips);
      }
    });
  }, []);

  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-background text-foreground text-center">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-lg border border-border bg-card shadow-xs flex flex-col items-center">
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4 sm:mb-5 shrink-0">
          <WifiOff className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>

        <span className="text-[11px] uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 mb-2">
          Offline Mode
        </span>

        <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-foreground mb-2 sm:mb-3">
          No Internet Connection
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5 font-sans">
          You appear to be offline. Any trips you previously synced are safely
          stored locally on this device via IndexedDB.
        </p>

        {/* Cached Trips Quick Access */}
        {cachedTrips.length > 0 && (
          <div className="w-full text-left space-y-2 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Cached Trips ({cachedTrips.length})
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                1-Click Offline View
              </span>
            </div>

            <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
              {cachedTrips.map((trip) => (
                <button
                  key={trip.id}
                  type="button"
                  onClick={() => setSelectedTripId(trip.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-sm border border-border/70 hover:border-primary/50 bg-muted/40 hover:bg-muted/70 text-left transition-colors cursor-pointer group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {trip.title}
                    </p>
                    {trip.destination && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate mt-0.5">
                        <MapPin className="h-3 w-3 text-primary/70 shrink-0" />
                        <span className="truncate">{trip.destination}</span>
                      </p>
                    )}
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="w-full space-y-2 pt-2 border-t border-border/80">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsEssentialsOpen(true)}
            className="w-full h-9 font-sans text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 cursor-pointer gap-2"
          >
            <Languages className="h-4 w-4" />
            Travel Essentials (Phrasebook & Emergency)
          </Button>

          <Button
            asChild
            className="w-full h-9 font-sans text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer gap-2"
          >
            <Link href="/trips">
              <Compass className="h-4 w-4" />
              Open Trips Hub
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleReload}
            className="w-full h-9 font-sans text-xs font-medium border-border hover:bg-accent cursor-pointer gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Check Connection Again
          </Button>

          <Button
            asChild
            variant="ghost"
            className="w-full h-8 font-sans text-xs text-muted-foreground hover:text-foreground cursor-pointer gap-1.5"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Dashboard
            </Link>
          </Button>
        </div>

        <div className="mt-5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Database className="h-3 w-3 text-amber-500" />
          <span>Local Storage: Prava IndexedDB Cache</span>
        </div>
      </div>

      <OfflineTripViewerDialog
        tripId={selectedTripId}
        open={!!selectedTripId}
        onOpenChange={(open) => !open && setSelectedTripId(null)}
      />

      <OfflineTravelEssentialsDialog
        open={isEssentialsOpen}
        onOpenChange={setIsEssentialsOpen}
      />
    </div>
  );
}
