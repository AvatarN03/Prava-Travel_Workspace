import type { Metadata } from "next";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ActiveTripWorkspaceCard } from "@/features/dashboard/components/active-trip-workspace-card";
import { AiAssistantCard } from "@/features/dashboard/components/ai-assistant-card";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardMetrics } from "@/features/dashboard/components/dashboard-metrics";
import { DashboardQuickActions } from "@/features/dashboard/components/dashboard-quick-actions";
import { FinancialSnapshotCard } from "@/features/dashboard/components/financial-snapshot-card";
import { RecentTripsList } from "@/features/dashboard/components/recent-trips-list";
import { TravelEssentialsGrid } from "@/features/dashboard/components/travel-essentials-grid";
import { UpcomingTripCard } from "@/features/dashboard/components/upcoming-trip-card";
import { UrgentChecklist } from "@/features/dashboard/components/urgent-checklist";
import { CreateTripDialog } from "@/features/trips";

import { getDashboardSummary } from "@/features/dashboard/queries";
import {
  getDashboardSubGreeting,
  getTimeBasedGreeting,
  getUserFirstName,
} from "@/features/dashboard/utils";

import { DASHBOARD_STRINGS } from "@/features/dashboard/constants";

export const metadata: Metadata = {
  title: "Prava Dashboard",
  description: "Cross-trip overview, upcoming schedules, and departure readiness.",
};

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const { user, metrics, upcomingTrip, recentTrips, urgentTasks, generalExpenses } = summary;

  const firstName = getUserFirstName(user);
  const greeting = getTimeBasedGreeting();
  const subGreeting = getDashboardSubGreeting(upcomingTrip, metrics.totalTrips);

  return (
    <div className="space-y-6 pb-10">
      {/* Workspace Header with Editorial Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-sans text-[11px] font-semibold tracking-widest text-primary uppercase block select-none">
            {DASHBOARD_STRINGS.eyebrow}
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground dark:text-zinc-50">
            {greeting},{" "}
            <span className="font-serif italic font-normal text-foreground dark:text-zinc-200">
              {firstName}
            </span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground dark:text-zinc-400 font-normal leading-relaxed max-w-2xl">
            {subGreeting}
          </p>
        </div>

        <div className="flex items-center justify-end self-end sm:self-auto gap-2.5">
          <CreateTripDialog
            trigger={
              <Button className="dashboard-btn-primary h-9 px-4 py-1.5 gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Create trip</span>
              </Button>
            }
          />
        </div>
      </div>

      {/* Empty State vs Full Workspace */}
      {metrics.totalTrips === 0 ? (
        <div className="space-y-6">
          <DashboardEmptyState />
          <DashboardQuickActions />
        </div>
      ) : (
        <>
          {/* Hero Section: Upcoming or Past Trip Card (Full Width) */}
          {upcomingTrip && <UpcomingTripCard trip={upcomingTrip} />}

          {/* Main 2-Column Grid (Linear / Notion Productivity Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: My Trips & Financials (7 Columns on desktop) */}
            <div className="lg:col-span-7 space-y-6">
              <RecentTripsList trips={recentTrips} />

              {upcomingTrip && <FinancialSnapshotCard trip={upcomingTrip} />}

              {urgentTasks.length > 0 && <UrgentChecklist tasks={urgentTasks} />}
            </div>

            {/* Right Column: Active Trip Context, Essentials & AI Assist (5 Columns on desktop) */}
            <div className="lg:col-span-5 space-y-6">
              {upcomingTrip && <ActiveTripWorkspaceCard trip={upcomingTrip} />}

              <TravelEssentialsGrid />

              <AiAssistantCard />
            </div>
          </div>

          {/* Bottom Section: Cross-Trip Metrics Overview */}
          <div className="pt-2">
            <div className="dashboard-section-eyebrow mb-3">
              {DASHBOARD_STRINGS.overviewSection}
            </div>
            <DashboardMetrics
              metrics={metrics}
              generalExpenses={generalExpenses || []}
              currency={user?.defaultCurrency || "INR"}
            />
          </div>
        </>
      )}
    </div>
  );
}
