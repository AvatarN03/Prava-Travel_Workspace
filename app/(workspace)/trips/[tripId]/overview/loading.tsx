export default function OverviewLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Editorial Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border dark:border-zinc-800">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-3 w-24 bg-primary/30 rounded-xs" />
            <div className="h-4 w-28 bg-primary/20 rounded-full" />
          </div>
          <div className="h-8 w-48 sm:w-64 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="space-y-1 pt-0.5">
            <div className="h-3.5 w-full max-w-xl bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
            <div className="h-3.5 w-3/4 max-w-md bg-muted/50 dark:bg-zinc-800/40 rounded-xs sm:hidden" />
          </div>
        </div>

        {/* Header Right: Destination, Date & Sync Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-7 w-24 sm:w-28 bg-muted/60 dark:bg-card-subtle border border-border/80 dark:border-zinc-800 rounded-sm" />
          <div className="h-7 w-28 sm:w-32 bg-muted/60 dark:bg-card-subtle border border-border/80 dark:border-zinc-800 rounded-sm" />
          <div className="h-7 w-28 sm:w-32 bg-card dark:bg-card-subtle border border-primary/30 rounded-sm" />
        </div>
      </div>

      {/* 4-Stat Metric Header Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-3.5 rounded-sm border border-border/80 dark:border-zinc-800 bg-card space-y-2 shadow-2xs min-w-0"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-14 sm:w-16 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-3.5 bg-muted/50 dark:bg-zinc-800 rounded-xs shrink-0" />
            </div>
            <div className="space-y-1">
              <div className="h-6 w-16 sm:w-24 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
              <div className="h-3 w-16 sm:w-20 bg-primary/30 rounded-xs" />
            </div>
          </div>
        ))}
      </div>

      {/* 2x2 Feature Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Today's Route / Active Schedule */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-zinc-800">
              <div className="h-4 w-36 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3 w-20 bg-primary/30 rounded-xs" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-start gap-3">
                  <div className="h-3.5 w-10 bg-muted/50 dark:bg-zinc-800/60 rounded-xs shrink-0 pt-0.5" />
                  <div className="border-l-2 border-primary/40 pl-3 flex-1 min-w-0 space-y-1.5">
                    <div className="h-4 w-40 sm:w-52 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-14 bg-muted/40 dark:bg-zinc-800/40 rounded-xs" />
                      <div className="h-3.5 w-20 bg-muted/40 dark:bg-zinc-800/40 rounded-xs" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-border/60 dark:border-zinc-800 flex items-center justify-between">
            <div className="h-3 w-28 bg-muted/40 dark:bg-zinc-800/40 rounded-xs" />
            <div className="h-3 w-18 bg-primary/30 rounded-xs" />
          </div>
        </div>

        {/* Card 2: Current Stay */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-zinc-800">
              <div className="h-4 w-28 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-20 bg-emerald-500/20 rounded-xs" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-44 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                <div className="h-4 w-12 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>
              <div className="h-3.5 w-48 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              {/* Check-in box */}
              <div className="rounded-xs bg-muted/30 dark:bg-card-subtle p-2.5 border border-border/60 dark:border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-28 bg-muted/70 dark:bg-zinc-800 rounded-xs" />
                  <div className="h-4 w-16 bg-primary/20 rounded-xs" />
                </div>
                <div className="h-3 w-24 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-border/60 dark:border-zinc-800 flex items-center justify-between">
            <div className="h-3 w-24 bg-primary/30 rounded-xs" />
            <div className="h-3 w-20 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
          </div>
        </div>

        {/* Card 3: Expense Ledger & Budget */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-zinc-800">
              <div className="h-4 w-32 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
              <div className="h-4 w-24 bg-muted/80 dark:bg-zinc-800 rounded-xs font-mono" />
            </div>
            {/* Segmented bar */}
            <div className="space-y-2">
              <div className="h-2 w-full bg-muted/50 dark:bg-zinc-800 rounded-full overflow-hidden flex gap-0.5">
                <div className="h-full bg-primary/50 w-2/5" />
                <div className="h-full bg-sky-500/50 w-1/4" />
                <div className="h-full bg-amber-500/50 w-1/5" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-2.5 w-16 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                <div className="h-2.5 w-24 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>
            </div>
            {/* Category chips */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xs bg-muted/30 dark:bg-card-subtle border border-border/60 dark:border-zinc-800 flex justify-between">
                <div className="h-3 w-12 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                <div className="h-3 w-10 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
              </div>
              <div className="p-2 rounded-xs bg-muted/30 dark:bg-card-subtle border border-border/60 dark:border-zinc-800 flex justify-between">
                <div className="h-3 w-12 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                <div className="h-3 w-10 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-border/60 dark:border-zinc-800 flex items-center justify-between">
            <div className="h-3 w-24 bg-primary/30 rounded-xs" />
            <div className="h-3 w-22 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
          </div>
        </div>

        {/* Card 4: Immediate Tasks & Checklist */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-zinc-800">
              <div className="h-4 w-32 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-16 bg-primary/30 rounded-xs" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, k) => (
                <div
                  key={k}
                  className="p-2 rounded-xs bg-muted/20 dark:bg-card-subtle border border-border/50 dark:border-zinc-800 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-3.5 w-3.5 rounded-xs bg-muted/60 dark:bg-zinc-800 shrink-0" />
                    <div className="h-3.5 w-36 sm:w-48 bg-muted/80 dark:bg-zinc-800 rounded-xs truncate" />
                  </div>
                  <div className="h-3.5 w-12 bg-muted/40 dark:bg-zinc-800/40 rounded-xs shrink-0" />
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-border/60 dark:border-zinc-800 flex items-center justify-between">
            <div className="h-3 w-28 bg-emerald-500/30 rounded-xs" />
            <div className="h-3 w-20 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
          </div>
        </div>
      </div>

      {/* Bottom Section: Pinned Notes & Quick Reference Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
        {/* Pinned Notes Shelf */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-zinc-800">
            <div className="h-4 w-28 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-3 w-16 bg-primary/30 rounded-xs" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, n) => (
              <div
                key={n}
                className="p-2.5 rounded-sm border border-border/60 dark:border-zinc-800 bg-muted/30 dark:bg-card-subtle space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-32 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                  <div className="h-3 w-3 bg-amber-500/40 rounded-xs shrink-0" />
                </div>
                <div className="h-3 w-4/5 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Reference Links */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-zinc-800">
            <div className="h-4 w-36 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-3 w-16 bg-primary/30 rounded-xs" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, l) => (
              <div
                key={l}
                className="p-2.5 rounded-sm border border-border/60 dark:border-zinc-800 bg-muted/30 dark:bg-card-subtle space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-36 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                  <div className="h-3 w-3 bg-blue-500/40 rounded-xs shrink-0" />
                </div>
                <div className="h-3 w-2/3 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
