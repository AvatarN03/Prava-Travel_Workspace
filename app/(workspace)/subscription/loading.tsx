export default function SubscriptionLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="h-3 w-28 bg-primary/30 rounded-xs" />
          <div className="h-8 w-64 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>
        <div className="h-9 w-28 bg-muted/40 dark:bg-card-subtle border border-border dark:border-zinc-800 rounded-sm" />
      </div>

      {/* Active Subscription Overview Card */}
      <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-3.5 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
            <div className="h-6 w-36 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
          </div>
          <div className="h-6 w-20 bg-emerald-500/20 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-3 rounded-sm bg-muted/30 dark:bg-card-subtle space-y-1 border border-border/40 dark:border-zinc-800/60">
              <div className="h-3 w-16 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              <div className="h-5 w-24 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Plan Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Free Tier Card */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-6 space-y-5 shadow-2xs">
          <div className="space-y-2">
            <div className="h-5 w-28 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-8 w-24 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
            <div className="h-3.5 w-48 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
          </div>
          <div className="space-y-2.5 pt-2 border-t border-border/60 dark:border-zinc-800/60">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-full bg-muted/60 dark:bg-zinc-800" />
                <div className="h-3.5 w-44 bg-muted/60 dark:bg-zinc-800/60 rounded-xs" />
              </div>
            ))}
          </div>
          <div className="h-10 w-full bg-muted/40 dark:bg-card-subtle border border-border dark:border-zinc-800 rounded-sm" />
        </div>

        {/* Pro Tier Card */}
        <div className="rounded-sm border-2 border-primary/40 bg-card p-6 space-y-5 shadow-2xs">
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
          <div className="h-10 w-full bg-primary/60 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
