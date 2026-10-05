export default function OverviewLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Editorial Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-24 bg-primary/30 rounded-xs" />
            <div className="h-4 w-28 bg-primary/20 rounded-full" />
          </div>
          <div className="h-8 w-56 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        {/* Header Right: Destination, Date & Action Badges */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="h-7 w-28 bg-muted/60 dark:bg-card-subtle border border-border/80 dark:border-zinc-800 rounded-sm" />
          <div className="h-7 w-36 bg-muted/60 dark:bg-card-subtle border border-border/80 dark:border-zinc-800 rounded-sm" />
          <div className="h-7 w-32 bg-primary/20 border border-primary/30 rounded-sm" />
        </div>
      </div>

      {/* 4-Stat Metric Header Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-3.5 rounded-sm border border-border/80 dark:border-zinc-800 bg-card space-y-2 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-3.5 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
            </div>
            <div className="space-y-1">
              <div className="h-6 w-24 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
              <div className="h-3 w-20 bg-primary/30 rounded-xs" />
            </div>
          </div>
        ))}
      </div>

      {/* 2x2 Feature Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Route / Schedule */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-zinc-800">
            <div className="h-4 w-36 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-3 w-16 bg-primary/30 rounded-xs" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-12 bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/40 dark:border-zinc-800/60" />
            ))}
          </div>
        </div>

        {/* Card 2: Lodging & Stays */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-zinc-800">
            <div className="h-4 w-32 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-3 w-16 bg-primary/30 rounded-xs" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-12 bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/40 dark:border-zinc-800/60" />
            ))}
          </div>
        </div>

        {/* Card 3: Financial Snapshot */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-zinc-800">
            <div className="h-4 w-40 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-3 w-16 bg-primary/30 rounded-xs" />
          </div>
          <div className="h-20 bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/40 dark:border-zinc-800/60" />
        </div>

        {/* Card 4: Preparation Checklist */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-zinc-800">
            <div className="h-4 w-36 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-3 w-16 bg-primary/30 rounded-xs" />
          </div>
          <div className="space-y-2.5">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-9 bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/40 dark:border-zinc-800/60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
