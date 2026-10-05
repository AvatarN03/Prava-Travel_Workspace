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

export const metadata: Metadata = {
  title: "Prava Dashboard",
  description: "Cross-trip overview, upcoming schedules, and departure readiness.",
};

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const { user, metrics, upcomingTrip, recentTrips, urgentTasks, generalExpenses } = summary;

  const displayName =
    user?.fullName || (user?.email ? user.email.split("@")[0] : "Traveler");
  const firstName = displayName.split(" ")[0];

  // Dynamic time-aware greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Dynamic journey subtitle
  let subGreeting = "Ready for your next journey? Start planning your first travel experience.";

  if (upcomingTrip) {
    if (upcomingTrip.isOngoing) {
      subGreeting = `Your journey to ${upcomingTrip.destination || upcomingTrip.title} is currently underway. Have a wonderful trip!`;
    } else if (upcomingTrip.isPastTrip) {
      const daysText =
        upcomingTrip.daysSinceEnd !== null && upcomingTrip.daysSinceEnd !== undefined
          ? upcomingTrip.daysSinceEnd === 0
            ? "today"
            : `${upcomingTrip.daysSinceEnd} ${upcomingTrip.daysSinceEnd === 1 ? "day" : "days"} ago`
          : "recently";
      subGreeting = `Your previous journey to ${upcomingTrip.destination || upcomingTrip.title} concluded ${daysText}. Ready for what's next? Plan a new trip!`;
    } else if (upcomingTrip.countdownDays !== null) {
      if (upcomingTrip.countdownDays > 0) {
        subGreeting = `Ready for your next journey? 1 trip starting in ${upcomingTrip.countdownDays} ${upcomingTrip.countdownDays === 1 ? "day" : "days"
          }.`;
      } else if (upcomingTrip.countdownDays === 0) {
        subGreeting = "Ready for your next journey? 1 trip starting today.";
      } else {
        subGreeting = "Ready for your next journey? Start planning your next travel experience.";
      }
    } else {
      subGreeting = `Ready for your next journey? You have ${metrics.totalTrips} ${metrics.totalTrips === 1 ? "trip" : "trips"
        } saved in your workspace.`;
    }
  } else if (metrics.totalTrips > 0) {
    subGreeting = `Ready for your next journey? You have ${metrics.totalTrips} ${metrics.totalTrips === 1 ? "trip" : "trips"
      } saved in your workspace.`;
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Workspace Header with Editorial Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-sans text-[11px] font-semibold tracking-widest text-primary uppercase block select-none">
            Travel Workspace
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
              <Button className=" h-9 px-4 py-1.5 gap-1.5">
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

          {/* Quick Actions & Travel Utilities */}
          <DashboardQuickActions />

          {/* Bottom Section: Cross-Trip Metrics Overview */}
          <div className="pt-2">
            <div className="dashboard-section-eyebrow mb-3">
              Cross-Trip Workspace Overview
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
