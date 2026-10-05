export default function TripWorkspaceRootLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto min-w-0 space-y-4 animate-pulse">
      {/* Workspace Header Skeleton */}
      <div className="space-y-4">
        {/* Cover Banner Skeleton */}
        <div className="h-40 sm:h-52 w-full rounded-md bg-muted/60 dark:bg-zinc-800/60" />

        {/* Header Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border dark:border-zinc-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-20 bg-primary/20 rounded-full" />
              <div className="h-5 w-28 bg-muted/50 dark:bg-zinc-800/50 rounded-full" />
            </div>
            <div className="h-8 w-64 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
            <div className="flex items-center gap-3">
              <div className="h-4 w-32 bg-muted/60 dark:bg-zinc-800/60 rounded-xs" />
              <div className="h-4 w-40 bg-muted/60 dark:bg-zinc-800/60 rounded-xs" />
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="h-8 w-20 bg-muted/50 dark:bg-zinc-800/50 rounded-sm" />
            <div className="h-8 w-24 bg-muted/50 dark:bg-zinc-800/50 rounded-sm" />
          </div>
        </div>
      </div>

      {/* Workspace Nav 7 Tabs Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border/60 dark:border-zinc-800">
        {["Overview", "Itinerary", "Accommodations", "Expenses", "Notes", "Checklist", "Links"].map((tab, i) => (
          <div
            key={tab}
            className={`h-9 px-3.5 rounded-sm flex items-center gap-1.5 shrink-0 ${
              i === 0
                ? "bg-primary/20 border-b-2 border-primary w-24"
                : "bg-muted/40 dark:bg-card-subtle border border-border/50 dark:border-zinc-800/60 w-28"
            }`}
          />
        ))}
      </div>

      {/* Tab Content Loading Area */}
      <div className="pt-2 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-3.5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-48 rounded-sm border border-border/80 dark:border-zinc-800 bg-card" />
          <div className="h-48 rounded-sm border border-border/80 dark:border-zinc-800 bg-card" />
        </div>
      </div>
    </div>
  );
}
