export default function AccommodationsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Editorial Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-28 bg-[#2D9BF0]/30 rounded-xs" />
            <div className="h-4 w-28 bg-indigo-500/20 rounded-full" />
          </div>
          <h1 className="h-8 w-56 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        <div className="h-8 w-24 bg-[#2D9BF0]/50 rounded-sm shrink-0" />
      </div>

      {/* 4-Stat Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-3.5 rounded-sm border border-border/80 dark:border-zinc-800 bg-card space-y-1 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-3.5 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
            </div>
            <div className="h-7 w-20 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
          </div>
        ))}
      </div>

      {/* Accommodations Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 space-y-3.5 shadow-2xs"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 flex-1">
                <div className="h-5 w-48 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                <div className="h-3.5 w-36 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>
              <div className="h-4 w-4 bg-muted/40 dark:bg-zinc-800 rounded-xs shrink-0" />
            </div>

            <div className="p-2.5 rounded-sm bg-muted/30 dark:bg-card-subtle space-y-2 border border-border/50 dark:border-zinc-800/60">
              <div className="flex items-center justify-between text-xs">
                <div className="h-3.5 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                <div className="h-3.5 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              </div>
              <div className="h-5 w-32 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="h-3.5 w-28 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              <div className="h-5 w-20 bg-muted/70 dark:bg-zinc-800 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
