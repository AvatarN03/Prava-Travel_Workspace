"use client";

import Link from "next/link";
import { ArrowLeft, Compass, Database, RefreshCw, WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground text-center">
      <div className="max-w-md w-full p-8 rounded-lg border border-border bg-card shadow-xs flex flex-col items-center">
        <div className="h-14 w-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-5">
          <WifiOff className="h-7 w-7" />
        </div>

        <span className="text-[11px] uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 mb-2">
          Offline Mode
        </span>

        <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-foreground mb-3">
          No Internet Connection
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-sans">
          You appear to be offline. Any trips you previously synced are safely
          stored locally on this device via IndexedDB.
        </p>

        <div className="w-full space-y-2.5 pt-2 border-t border-border/80">
          <Button
            asChild
            className="w-full h-9 font-sans text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer gap-2"
          >
            <Link href="/trips">
              <Compass className="h-4 w-4" />
              Access Cached Trips
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

        <div className="mt-6 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Database className="h-3 w-3 text-amber-500" />
          <span>Local Storage: Prava IndexedDB Cache</span>
        </div>
      </div>
    </div>
  );
}
