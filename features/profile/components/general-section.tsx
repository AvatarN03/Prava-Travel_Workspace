"use client";

import {
  Bell,
  Compass,
  Globe,
  HardDrive,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { useOfflineSyncContext } from "@/lib/offline";

import type { ProfileWithStats } from "../actions";

interface GeneralSectionProps {
  profile: ProfileWithStats;
  defaultCurrency: string;
  onUpdateCurrency: (currency: string) => void;
  isUpdatingCurrency: boolean;
  aiAutoPropose: boolean;
  setAiAutoPropose: (val: boolean) => void;
  offlineMode: boolean;
  setOfflineMode: (val: boolean) => void;
  travelPreferences: string;
  setTravelPreferences: (val: string) => void;
  onSaveAiPreferences: (data: {
    aiAutoPropose: boolean;
    offlineMode: boolean;
    travelPreferences: string;
  }) => void;
  isSavingAiPreferences: boolean;
  emailNotifications: boolean;
  onUpdateNotification: (checked: boolean) => void;
  isUpdatingNotification: boolean;
}

export function GeneralSection({
  profile,
  defaultCurrency,
  onUpdateCurrency,
  isUpdatingCurrency,
  aiAutoPropose,
  setAiAutoPropose,
  offlineMode,
  setOfflineMode,
  travelPreferences,
  setTravelPreferences,
  onSaveAiPreferences,
  isSavingAiPreferences,
  emailNotifications,
  onUpdateNotification,
  isUpdatingNotification,
}: GeneralSectionProps) {
  const { isSyncing, lastSyncLabel, triggerSync, isOnline } = useOfflineSyncContext();

  const hasPersonaChanges =
    aiAutoPropose !== (profile.aiAutoPropose ?? true) ||
    offlineMode !== (profile.offlineMode ?? false) ||
    travelPreferences.trim() !== (profile.travelPreferences || "").trim();

  return (
    <div className="space-y-6 w-full">
      {/* 1. Regional & Currency Defaults */}
      <Card className="rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] shadow-xs">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#2D9BF0]/10 border border-[#2D9BF0]/20 text-[#2D9BF0]">
              <Globe className="h-3.5 w-3.5" />
            </div>
            <div>
              <CardTitle className="font-sans text-sm font-semibold text-foreground dark:text-zinc-100">Region & Currency Defaults</CardTitle>
              <CardDescription className="font-sans text-xs text-muted-foreground dark:text-zinc-400">
                Configure your preferred currency across trips, expense tracking, and budget calculations.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
            <div>
              <p className="font-sans font-semibold text-foreground dark:text-zinc-200">Default Currency</p>
              <p className="font-sans text-muted-foreground dark:text-zinc-400 text-[11px]">Primary currency for new trips, live exchange rates, and expense allocations</p>
            </div>
            <div className="w-full sm:w-64">
              <Select
                value={defaultCurrency}
                onValueChange={onUpdateCurrency}
                disabled={isUpdatingCurrency}
              >
                <SelectTrigger className="h-8 rounded-sm cursor-pointer font-sans text-xs bg-background dark:bg-[#121622] border-border dark:border-zinc-800 text-foreground dark:text-zinc-100">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="rounded-sm font-sans text-xs max-h-64 bg-card dark:bg-[#0F131C] border-border dark:border-zinc-800">
                  <SelectItem value="USD" className="cursor-pointer text-xs">USD ($) — US Dollar</SelectItem>
                  <SelectItem value="EUR" className="cursor-pointer text-xs">EUR (€) — Euro</SelectItem>
                  <SelectItem value="GBP" className="cursor-pointer text-xs">GBP (£) — British Pound</SelectItem>
                  <SelectItem value="JPY" className="cursor-pointer text-xs">JPY (¥) — Japanese Yen</SelectItem>
                  <SelectItem value="INR" className="cursor-pointer text-xs">INR (₹) — Indian Rupee</SelectItem>
                  <SelectItem value="AUD" className="cursor-pointer text-xs">AUD ($) — Australian Dollar</SelectItem>
                  <SelectItem value="CAD" className="cursor-pointer text-xs">CAD ($) — Canadian Dollar</SelectItem>
                  <SelectItem value="CHF" className="cursor-pointer text-xs">CHF (Fr) — Swiss Franc</SelectItem>
                  <SelectItem value="SGD" className="cursor-pointer text-xs">SGD ($) — Singapore Dollar</SelectItem>
                  <SelectItem value="NZD" className="cursor-pointer text-xs">NZD ($) — New Zealand Dollar</SelectItem>
                  <SelectItem value="AED" className="cursor-pointer text-xs">AED (د.إ) — UAE Dirham</SelectItem>
                  <SelectItem value="THB" className="cursor-pointer text-xs">THB (฿) — Thai Baht</SelectItem>
                  <SelectItem value="KRW" className="cursor-pointer text-xs">KRW (₩) — South Korean Won</SelectItem>
                  <SelectItem value="HKD" className="cursor-pointer text-xs">HKD ($) — Hong Kong Dollar</SelectItem>
                  <SelectItem value="SEK" className="cursor-pointer text-xs">SEK (kr) — Swedish Krona</SelectItem>
                  <SelectItem value="NOK" className="cursor-pointer text-xs">NOK (kr) — Norwegian Krone</SelectItem>
                  <SelectItem value="MXN" className="cursor-pointer text-xs">MXN ($) — Mexican Peso</SelectItem>
                  <SelectItem value="BRL" className="cursor-pointer text-xs">BRL (R$) — Brazilian Real</SelectItem>
                  <SelectItem value="ZAR" className="cursor-pointer text-xs">ZAR (R) — South African Rand</SelectItem>
                  <SelectItem value="MYR" className="cursor-pointer text-xs">MYR (RM) — Malaysian Ringgit</SelectItem>
                  <SelectItem value="IDR" className="cursor-pointer text-xs">IDR (Rp) — Indonesian Rupiah</SelectItem>
                  <SelectItem value="VND" className="cursor-pointer text-xs">VND (₫) — Vietnamese Dong</SelectItem>
                  <SelectItem value="TRY" className="cursor-pointer text-xs">TRY (₺) — Turkish Lira</SelectItem>
                  <SelectItem value="SAR" className="cursor-pointer text-xs">SAR (﷼) — Saudi Riyal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. AI Assistant Features & Travel Persona */}
      <Card className="rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] shadow-xs">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#2D9BF0]/10 border border-[#2D9BF0]/20 text-[#2D9BF0]">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <CardTitle className="font-sans text-sm font-semibold text-foreground dark:text-zinc-100">AI Assistant & Travel Persona</CardTitle>
              <CardDescription className="font-sans text-xs text-muted-foreground dark:text-zinc-400">
                Customize smart itinerary planning, autonomous trip proposals, and travel preferences.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-4 text-xs">
          <div className="flex items-center justify-between py-1">
            <div className="space-y-0.5 pr-4">
              <p className="font-sans font-semibold text-foreground dark:text-zinc-200">Structured AI Proposal Cards</p>
              <p className="font-sans text-muted-foreground dark:text-zinc-400 text-[11px]">
                Allow Prava AI to generate interactive action cards for 1-click workspace additions
              </p>
            </div>
            <Switch
              checked={aiAutoPropose}
              onCheckedChange={setAiAutoPropose}
              className="cursor-pointer"
              disabled={isSavingAiPreferences}
            />
          </div>

          <Separator className="border-border dark:border-zinc-800" />

          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 pr-4">
                <p className="font-sans font-semibold text-foreground dark:text-zinc-200">Offline Travel Cache</p>
                <p className="font-sans text-muted-foreground dark:text-zinc-400 text-[11px]">
                  Pre-fetch trip essentials, emergency contacts, and maps for zero-connectivity access
                </p>
              </div>
              <Switch
                checked={offlineMode}
                onCheckedChange={setOfflineMode}
                className="cursor-pointer"
                disabled={isSavingAiPreferences}
              />
            </div>

            {offlineMode && (
              <div className="flex items-center justify-between rounded-sm border border-border/80 dark:border-zinc-800 bg-muted/40 dark:bg-[#121622] px-3 py-2 text-[11px]">
                <div className="flex items-center gap-2">
                  {isSyncing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2D9BF0] shrink-0" />
                      <span className="font-sans text-foreground dark:text-zinc-200 font-medium">Syncing active & planning trips to device...</span>
                    </>
                  ) : (
                    <>
                      <HardDrive className="h-3.5 w-3.5 text-[#2D9BF0] shrink-0" />
                      <span className="font-sans text-muted-foreground dark:text-zinc-400">
                        Status: <strong className="text-foreground dark:text-zinc-200">{lastSyncLabel}</strong>
                      </span>
                    </>
                  )}
                </div>

                {isOnline && !isSyncing && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => triggerSync()}
                    className="h-6 px-2 font-sans text-[11px] gap-1 text-[#2D9BF0] hover:text-[#2D9BF0] hover:bg-[#2D9BF0]/10 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Sync Now
                  </Button>
                )}
              </div>
            )}
          </div>

          <Separator className="border-border dark:border-zinc-800" />

          <div className="space-y-1.5 py-1">
            <div className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-[#2D9BF0]" />
              <p className="font-sans font-semibold text-foreground dark:text-zinc-200">AI Travel Style & Dietary Guidance</p>
            </div>
            <p className="font-sans text-muted-foreground dark:text-zinc-400 text-[11px]">
              Prava AI uses these preferences (dietary restrictions, relaxed vs fast pacing, preferred hotel vibes) when drafting your itineraries.
            </p>
            <Textarea
              value={travelPreferences}
              onChange={(e) => setTravelPreferences(e.target.value)}
              placeholder="e.g. Vegetarian, love historic architecture and coffee shops, prefer moderate pace with max 3-4 activities per day."
              className="h-20 font-sans text-xs rounded-sm resize-none bg-background dark:bg-[#121622] border-border dark:border-zinc-800 text-foreground dark:text-zinc-100 dark:placeholder:text-zinc-500"
              maxLength={1000}
              disabled={isSavingAiPreferences}
            />
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-3 border-t border-border/60 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            {hasPersonaChanges ? (
              <p className="font-sans text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                You have unsaved changes. Click Save AI Travel Preferences to update.
              </p>
            ) : (
              <p className="font-sans text-[11px] text-muted-foreground dark:text-zinc-400">
                AI persona & offline settings are up to date.
              </p>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              if (!hasPersonaChanges) return;
              onSaveAiPreferences({
                aiAutoPropose,
                offlineMode,
                travelPreferences: travelPreferences.trim() || "",
              });
              if (offlineMode && !profile.offlineMode) {
                setTimeout(() => triggerSync(), 250);
              }
            }}
            disabled={isSavingAiPreferences || !hasPersonaChanges}
            className={`h-9 px-4 rounded-sm font-sans text-xs font-semibold gap-1.5 shadow-xs hover:shadow transition-all active:scale-[0.99] bg-[#2D9BF0] hover:bg-[#2587D3] text-white border border-[#2D9BF0]/30 ${
              isSavingAiPreferences || !hasPersonaChanges
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            }`}
          >
            {isSavingAiPreferences ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <Save className="h-3.5 w-3.5 mr-1.5" />
            )}
            Save AI Travel Preferences
          </Button>
        </CardFooter>
      </Card>

      {/* 3. Notifications & Trip Alerts */}
      <Card className="rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] shadow-xs">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#2D9BF0]/10 border border-[#2D9BF0]/20 text-[#2D9BF0]">
              <Bell className="h-3.5 w-3.5" />
            </div>
            <div>
              <CardTitle className="font-sans text-sm font-semibold text-foreground dark:text-zinc-100">Notifications & Alerts</CardTitle>
              <CardDescription className="font-sans text-xs text-muted-foreground dark:text-zinc-400">
                Manage notifications for upcoming travel departures and task checklists.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-4 text-xs">
          <div className="flex items-center justify-between py-1">
            <div className="space-y-0.5 pr-4">
              <p className="font-sans font-semibold text-foreground dark:text-zinc-200">Trip Departure & Milestone Reminders</p>
              <p className="font-sans text-muted-foreground dark:text-zinc-400 text-[11px]">
                Receive checklist alerts and countdown notices before your scheduled departure
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={onUpdateNotification}
              className="cursor-pointer"
              disabled={isUpdatingNotification}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
