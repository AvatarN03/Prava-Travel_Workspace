export default function UsageLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Editorial Header */}
      <div className="space-y-1.5 pb-5 border-b border-border dark:border-zinc-800">
        <div className="h-3 w-28 bg-primary/30 rounded-xs" />
        <div className="h-8 w-60 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
        <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
      </div>

      {/* 2 Big Capacity Meter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Meter 1: AI Credits */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="h-4 w-36 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-5 w-20 bg-primary/20 rounded-full" />
          </div>
          <div className="space-y-1">
            <div className="h-9 w-28 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
            <div className="h-3.5 w-44 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
          </div>
          <div className="h-2.5 w-full bg-muted/50 dark:bg-zinc-800 rounded-full" />
          <div className="h-3 w-40 bg-muted/40 dark:bg-zinc-800/40 rounded-xs" />
        </div>

        {/* Meter 2: Trip Slots */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="h-4 w-36 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-5 w-20 bg-emerald-500/20 rounded-full" />
          </div>
          <div className="space-y-1">
            <div className="h-9 w-28 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
            <div className="h-3.5 w-44 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
          </div>
          <div className="h-2.5 w-full bg-muted/50 dark:bg-zinc-800 rounded-full" />
          <div className="h-3 w-40 bg-muted/40 dark:bg-zinc-800/40 rounded-xs" />
        </div>
      </div>

      {/* 6-Month Usage Chart Card */}
      <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-6 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-border/60 dark:border-zinc-800">
          <div className="space-y-1">
            <div className="h-4 w-44 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-3 w-56 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
          </div>
          <div className="h-7 w-28 bg-muted/40 dark:bg-card-subtle rounded-sm" />
        </div>
        <div className="h-48 bg-muted/20 dark:bg-card-subtle rounded-sm border border-border/40 dark:border-zinc-800/50 flex items-end justify-around p-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-12 bg-muted/60 dark:bg-zinc-800 rounded-t-sm" style={{ height: `${25 + (i * 12)}%` }} />
          ))}
        </div>
      </div>

      {/* Trip-by-Trip Usage Breakdown Table */}
      <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-5 space-y-4 shadow-2xs">
        <div className="h-4 w-48 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="h-12 bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/40 dark:border-zinc-800/60 flex items-center justify-between px-4">
              <div className="h-4 w-48 bg-muted/70 dark:bg-zinc-800 rounded-xs" />
              <div className="h-4 w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
