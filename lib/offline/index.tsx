"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { type IDBPDatabase, openDB } from "idb";
import { Database, Languages, WifiOff, X } from "lucide-react";

import { OfflineTravelEssentialsDialog } from "@/features/travel-essentials";

import { fetchTripsForOfflineSync } from "./actions";
import { cn } from "@/lib/utils";

import type {
  OfflineAccommodation,
  OfflineChecklistItem,
  OfflineExpense,
  OfflineItineraryItem,
  OfflineLink,
  OfflineNote,
  OfflineTripPayload,
} from "./actions";

export type {
  OfflineTripPayload,
  OfflineItineraryItem,
  OfflineAccommodation,
  OfflineChecklistItem,
  OfflineNote,
  OfflineExpense,
  OfflineLink,
};

export type OfflineTrip = OfflineTripPayload;

// ─── Constants & Types ────────────────────────────────────────────────────────

const DB_NAME = "prava-offline-db";
const DB_VERSION = 1;
const SYNC_DELAY_MS = 3 * 60 * 1000; // Wait 3m after mount
const STALE_THRESHOLD_MS = 30 * 60 * 1000; // 30m stale threshold

export interface OfflineSyncState {
  isSyncing: boolean;
  lastSyncLabel: string;
  enabled: boolean;
  triggerSync: () => Promise<{ success: boolean; count?: number; error?: string } | void>;
}

export interface OfflineSyncContextValue extends OfflineSyncState {
  isOnline: boolean;
  setOfflineMode: (enabled: boolean) => void;
}

// ─── IndexedDB Storage Engine ─────────────────────────────────────────────────

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is only available in browser"));
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("trips")) {
          db.createObjectStore("trips", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("sync_meta")) {
          db.createObjectStore("sync_meta", { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

export async function getOfflineTrips(): Promise<OfflineTrip[]> {
  try {
    const db = await getDb();
    return await db.getAll("trips");
  } catch (err) {
    console.warn("[OfflineDB] Failed to read cached trips:", err);
    return [];
  }
}

export async function getOfflineTripById(id: string): Promise<OfflineTrip | null> {
  try {
    const db = await getDb();
    return (await db.get("trips", id)) || null;
  } catch {
    return null;
  }
}

export async function clearOfflineDb(): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction(["trips", "sync_meta"], "readwrite");
    await tx.objectStore("trips").clear();
    await tx.objectStore("sync_meta").clear();
    await tx.done;
  } catch (err) {
    console.warn("[OfflineDB] Failed to clear database:", err);
  }
}

export const clearOfflineData = clearOfflineDb;

export async function getLastSyncInfo(): Promise<{
  synced: boolean;
  timestamp: number;
  label: string;
  userId?: string;
}> {
  try {
    const db = await getDb();
    const meta = await db.get("sync_meta", "last_sync");
    if (!meta || !meta.timestamp) {
      return { synced: false, timestamp: 0, label: "Not synced" };
    }

    const diffMs = Date.now() - meta.timestamp;
    const diffMins = Math.floor(diffMs / 60000);

    let label: string;
    if (diffMins < 1) label = "Just now";
    else if (diffMins < 60) label = `${diffMins}m ago`;
    else {
      const diffHours = Math.floor(diffMins / 60);
      label = diffHours < 24 ? `${diffHours}h ago` : new Date(meta.timestamp).toLocaleDateString();
    }

    return {
      synced: true,
      timestamp: meta.timestamp,
      label,
      userId: meta.userId,
    };
  } catch {
    return { synced: false, timestamp: 0, label: "Not synced" };
  }
}

export async function syncTripsToIndexedDB(
  trips: OfflineTrip[],
  userId: string
): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(["trips", "sync_meta"], "readwrite");
  const tripStore = tx.objectStore("trips");
  const metaStore = tx.objectStore("sync_meta");

  await tripStore.clear();
  for (const trip of trips) {
    await tripStore.put(trip);
  }

  await metaStore.put({
    key: "last_sync",
    timestamp: Date.now(),
    userId,
    count: trips.length,
  });

  await tx.done;
}

// ─── Network Status Hook ──────────────────────────────────────────────────────

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
    }
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

// ─── Offline Banner Component ─────────────────────────────────────────────────

export function OfflineBanner({
  lastSyncLabel,
  itemCount,
}: {
  lastSyncLabel?: string;
  itemCount?: number;
}) {
  const context = useContext(OfflineSyncContext);
  const isOnline = context ? context.isOnline : useOnlineStatus();
  const syncLabel = lastSyncLabel ?? context?.lastSyncLabel ?? "Cached data";
  const [dismissed, setDismissed] = useState(false);
  const [isEssentialsOpen, setIsEssentialsOpen] = useState(false);

  useEffect(() => {
    if (isOnline) {
      setDismissed(false);
    }
  }, [isOnline]);

  if (isOnline || dismissed) {
    return null;
  }

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "absolute bottom-3 inset-x-3 sm:inset-x-auto sm:right-4 sm:bottom-4 z-30 max-w-md",
          "flex items-center justify-between gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5",
          "rounded-sm border border-amber-500/40 bg-card text-card-foreground shadow-lg",
          "border-l-4 border-l-amber-500",
          "animate-in fade-in slide-in-from-bottom-2 duration-200"
        )}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <WifiOff className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="font-semibold text-xs text-foreground">Offline</span>
          </div>

          <span className="text-muted-foreground/60 text-xs shrink-0">•</span>

          <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
            Showing cached data <span className="hidden sm:inline">(Read-Only)</span>
          </p>

          {syncLabel && (
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded-xs border border-border/50 shrink-0">
              <Database className="h-2.5 w-2.5 text-amber-500" />
              <span className="truncate max-w-[120px]">{syncLabel}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsEssentialsOpen(true)}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
            title="Open Offline Travel Essentials (Phrasebook, Emergency numbers, Visa facts)"
          >
            <Languages className="h-3 w-3" />
            <span>Essentials</span>
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="h-6 w-6 shrink-0 inline-flex items-center justify-center rounded-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Dismiss offline notice"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <OfflineTravelEssentialsDialog
        open={isEssentialsOpen}
        onOpenChange={setIsEssentialsOpen}
      />
    </>
  );
}

// ─── Offline Sync Hook ────────────────────────────────────────────────────────

export function useOfflineSync(
  offlineModeEnabled: boolean,
  userId: string
): OfflineSyncState {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncLabel, setLastSyncLabel] = useState("Not synced");
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasScheduledRef = useRef(false);

  const performSync = useCallback(
    async (force = false): Promise<{ success: boolean; count?: number; error?: string }> => {
      if (!userId) return { success: false, error: "User not authenticated" };

      setIsSyncing(true);
      try {
        const syncInfo = await getLastSyncInfo();
        if (syncInfo.userId && syncInfo.userId !== userId) {
          await clearOfflineDb();
        }

        if (!force) {
          const isStale =
            !syncInfo.synced || Date.now() - syncInfo.timestamp > STALE_THRESHOLD_MS;

          if (!isStale) {
            setLastSyncLabel(syncInfo.label);
            setIsSyncing(false);
            return { success: true, count: 0 };
          }
        }

        const res = await fetchTripsForOfflineSync();
        if (res.success && res.trips) {
          await syncTripsToIndexedDB(res.trips, userId);
          const info = await getLastSyncInfo();
          setLastSyncLabel(info.label);
          return { success: true, count: res.trips.length };
        } else {
          return { success: false, error: res.error || "Failed to fetch trips" };
        }
      } catch (err) {
        console.error("[OfflineSync] Sync failed:", err);
        return { success: false, error: "Sync failed" };
      } finally {
        setIsSyncing(false);
      }
    },
    [userId]
  );

  const triggerSync = useCallback(async () => {
    return await performSync(true);
  }, [performSync]);

  const prevEnabledRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (offlineModeEnabled) {
      getLastSyncInfo().then((info) => setLastSyncLabel(info.label));

      if (!hasScheduledRef.current) {
        hasScheduledRef.current = true;
        delayTimerRef.current = setTimeout(() => {
          performSync();
        }, SYNC_DELAY_MS);
      }
    } else if (prevEnabledRef.current === true) {
      clearOfflineDb().then(() => {
        setLastSyncLabel("Not synced");
      });
      hasScheduledRef.current = false;
    } else {
      getLastSyncInfo().then((info) => setLastSyncLabel(info.label));
    }
    prevEnabledRef.current = offlineModeEnabled;

    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
    };
  }, [offlineModeEnabled, performSync]);

  return {
    isSyncing,
    lastSyncLabel,
    enabled: offlineModeEnabled,
    triggerSync,
  };
}

// ─── React Context & Provider ─────────────────────────────────────────────────

const OfflineSyncContext = createContext<OfflineSyncContextValue | null>(null);

export function useOfflineSyncContext(): OfflineSyncContextValue {
  const context = useContext(OfflineSyncContext);
  if (!context) {
    return {
      isSyncing: false,
      lastSyncLabel: "Not synced",
      enabled: false,
      isOnline: true,
      triggerSync: async () => {},
      setOfflineMode: () => {},
    };
  }
  return context;
}

export function OfflineSyncProvider({
  children,
  userId,
  initialOfflineMode,
}: {
  children: React.ReactNode;
  userId: string;
  initialOfflineMode: boolean;
}) {
  const [offlineMode, setOfflineMode] = useState(initialOfflineMode);
  const isOnline = useOnlineStatus();
  const syncState = useOfflineSync(offlineMode, userId);

  useEffect(() => {
    setOfflineMode(initialOfflineMode);
  }, [initialOfflineMode]);

  return (
    <OfflineSyncContext.Provider
      value={{
        ...syncState,
        enabled: offlineMode,
        isOnline,
        setOfflineMode,
      }}
    >
      {children}
    </OfflineSyncContext.Provider>
  );
}
