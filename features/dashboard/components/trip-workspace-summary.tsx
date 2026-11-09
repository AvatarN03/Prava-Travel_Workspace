import Link from "next/link";

import { CheckSquare, FileText, Square, TrendingUp, Wallet } from "lucide-react";

import { Progress } from "@/components/ui/progress";

import { formatRelativeTime } from "@/lib/utils";
import { getCurrencyConfig } from "@/lib/utils/currency";

import type { UpcomingTripDetails } from "../queries";

interface TripWorkspaceSummaryProps {
  trip: UpcomingTripDetails;
}

export function TripWorkspaceSummary({ trip }: TripWorkspaceSummaryProps) {
  const { financials } = trip;
  const { symbol, locale } = getCurrencyConfig(financials.currency);
  const pendingTasks = trip.checklistItems.filter((item) => !item.isCompleted).slice(0, 3);
  const notes = trip.notes.slice(0, 2);

  const formatAmount = (amount: number) =>
    `${symbol}${amount.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  return (
    <section className="border-t border-border/60 px-6 py-5 sm:px-7">
      <div className="mb-4">
        <div>
          <span className="dashboard-section-eyebrow">Trip workspace</span>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Budget, preparation, and notes for this journey.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <section className="xl:col-span-4 xl:border-r xl:border-border/60 xl:pr-5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <Wallet className="h-3.5 w-3.5 text-primary" /> Trip expenses
            </span>
            <Link href={`/trips/${trip.id}/expenses`} className="text-primary hover:underline">
              Ledger
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 rounded-sm dashboard-surface-subtle p-3">
            <div>
              <p className="text-[10px] text-muted-foreground">Spent</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">{formatAmount(financials.totalSpent)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Budget</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums text-muted-foreground">{formatAmount(financials.allocatedBudget)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Left</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums text-primary">{formatAmount(financials.remainingBudget)}</p>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Budget used</span><span className="tabular-nums">{financials.percentUtilized}%</span>
            </div>
            <Progress value={financials.percentUtilized} className="h-1.5 bg-muted" />
            {financials.categoryBreakdown.length === 0 && (
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-primary" /> No expenses logged yet.
              </p>
            )}
          </div>
        </section>

        <section className="xl:col-span-4 xl:border-r xl:border-border/60 xl:pr-5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-foreground"><CheckSquare className="h-3.5 w-3.5 text-primary" /> Checklist</span>
            <Link href={`/trips/${trip.id}/checklist`} className="text-primary hover:underline">
              {trip.checklistItems.filter((item) => !item.isCompleted).length} left
            </Link>
          </div>
          <div className="mt-3 space-y-1.5">
            {pendingTasks.length === 0 ? (
              <p className="rounded-xs border border-dashed border-border p-2 text-center text-[11px] text-muted-foreground">No pending tasks.</p>
            ) : pendingTasks.map((task) => (
              <Link key={task.id} href={`/trips/${trip.id}/checklist`} className="dashboard-interactive-row flex items-start gap-2 p-2 text-xs">
                <Square className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="line-clamp-1 font-medium text-foreground">{task.title}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="xl:col-span-4">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-foreground"><FileText className="h-3.5 w-3.5 text-primary" /> Notes</span>
            <Link href={`/trips/${trip.id}/notes`} className="text-primary hover:underline">{trip.notes.length} saved</Link>
          </div>
          <div className="mt-3 space-y-1.5">
            {notes.length === 0 ? (
              <p className="rounded-xs border border-dashed border-border p-2 text-center text-[11px] text-muted-foreground">No notes yet.</p>
            ) : notes.map((note) => (
              <Link key={note.id} href={`/trips/${trip.id}/notes`} className="dashboard-interactive-row block p-2 text-xs">
                <p className="truncate font-medium text-foreground">{note.title}</p>
                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">Updated {formatRelativeTime(note.updatedAt)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
