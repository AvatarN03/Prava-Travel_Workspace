export default function SubscriptionLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 w-full pb-16 animate-pulse">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-zinc-800 pb-5">
        <div className="space-y-1.5">
          <div className="h-3 w-32 bg-primary/30 rounded-xs" />
          <div className="h-8 w-64 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="h-8 w-28 bg-card dark:bg-[#0F131C] border border-border/80 dark:border-zinc-800 rounded-sm" />
          <div className="h-8 w-36 bg-primary/40 rounded-sm" />
        </div>
      </div>

      {/* ── Current Active Tier Summary Card ── */}
      <div className="rounded-md border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-5 w-28 bg-primary/20 rounded-xs" />
              <div className="h-5 w-20 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
            </div>

            <div className="h-7 w-60 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-3.5 w-full max-w-xl bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />

            {/* Quota Metric Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="h-7 w-28 bg-muted/50 dark:bg-[#121622] border border-border/70 dark:border-zinc-800 rounded-xs" />
              <div className="h-7 w-44 bg-muted/50 dark:bg-[#121622] border border-border/70 dark:border-zinc-800 rounded-xs" />
            </div>
          </div>

          <div className="shrink-0 self-start md:self-center">
            <div className="h-8 w-28 bg-card dark:bg-[#121622] border border-border/80 dark:border-zinc-800 rounded-sm" />
          </div>
        </div>
      </div>

      {/* ── Plan Comparison Header & Segmented Billing Cycle Switcher ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="h-3 w-20 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
            <div className="h-6 w-56 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-3.5 w-64 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
          </div>

          {/* Segmented Billing Switcher (50/50 on mobile, inline on desktop) */}
          <div className="w-full sm:w-auto h-9 bg-muted/60 dark:bg-[#121622] rounded-sm border border-border/80 dark:border-zinc-800 p-1 flex gap-1">
            <div className="flex-1 sm:w-28 bg-card dark:bg-[#0F131C] rounded-xs shadow-2xs" />
            <div className="flex-1 sm:w-24 rounded-xs" />
          </div>
        </div>

        {/* 2-Column Plan Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Free Tier Card */}
          <div className="rounded-md border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-6 space-y-5 shadow-2xs">
            <div className="space-y-2">
              <div className="h-5 w-28 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
              <div className="h-8 w-24 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
              <div className="h-3.5 w-48 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
            </div>
            <div className="space-y-2.5 pt-2 border-t border-border/60 dark:border-zinc-800/60">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 rounded-full bg-muted/60 dark:bg-zinc-800" />
                  <div className="h-3.5 w-48 bg-muted/60 dark:bg-zinc-800/60 rounded-xs" />
                </div>
              ))}
            </div>
            <div className="h-8 w-full bg-muted/40 dark:bg-[#121622] border border-border dark:border-zinc-800 rounded-sm" />
          </div>

          {/* Pro Tier Card */}
          <div className="rounded-md border-2 border-primary/40 bg-card dark:bg-[#0F131C] p-6 space-y-5 shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-5 w-28 bg-primary/60 rounded-xs" />
                <div className="h-5 w-18 bg-primary/20 rounded-full" />
              </div>
              <div className="h-8 w-28 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
              <div className="h-3.5 w-52 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
            </div>
            <div className="space-y-2.5 pt-2 border-t border-border/60 dark:border-zinc-800/60">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 rounded-full bg-primary/40" />
                  <div className="h-3.5 w-48 bg-muted/60 dark:bg-zinc-800/60 rounded-xs" />
                </div>
              ))}
            </div>
            <div className="h-8 w-full bg-primary/40 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
