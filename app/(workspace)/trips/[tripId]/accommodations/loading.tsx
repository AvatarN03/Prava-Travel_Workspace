export default function AccommodationsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Editorial Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border dark:border-zinc-800">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-3 w-28 bg-primary/30 rounded-xs" />
            <div className="h-4 w-28 bg-indigo-500/20 rounded-full" />
          </div>
          <div className="h-8 w-48 sm:w-56 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="space-y-1 pt-0.5">
            <div className="h-3.5 w-full max-w-xl bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
            <div className="h-3.5 w-3/4 max-w-md bg-muted/50 dark:bg-zinc-800/40 rounded-xs sm:hidden" />
          </div>
        </div>

        <div className="h-8 w-24 sm:w-26 bg-primary/50 rounded-sm shrink-0 self-start sm:self-auto" />
      </div>

      {/* 4-Stat Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-3.5 rounded-sm border border-border/80 dark:border-zinc-800 bg-card space-y-1 shadow-2xs min-w-0"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 sm:w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-3.5 bg-muted/50 dark:bg-zinc-800 rounded-xs shrink-0" />
            </div>
            <div className="h-7 w-16 sm:w-20 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
          </div>
        ))}
      </div>

      {/* Accommodations Cards Grid (2 columns on md+, matching AccommodationList) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 space-y-4 shadow-2xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header Row: Type Badge, Nights Pill & Actions */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="h-4 w-14 rounded-xs bg-indigo-500/15" />
                    <div className="h-4 w-16 rounded-xs bg-muted/50 dark:bg-zinc-800/50" />
                  </div>
                  <div className="h-5 w-44 sm:w-60 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                  <div className="h-3.5 w-36 sm:w-48 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                </div>
                <div className="h-6 w-6 rounded-sm bg-muted/40 dark:bg-zinc-800/40 shrink-0" />
              </div>

              {/* Check-in / Details Box */}
              <div className="p-3 rounded-xs bg-muted/30 dark:bg-card-subtle space-y-2 border border-border/50 dark:border-zinc-800/60">
                <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                  <div className="h-3.5 w-28 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                  <div className="h-3.5 w-28 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                </div>
                <div className="h-5 w-28 bg-primary/15 rounded-xs" />
              </div>
            </div>

            {/* Footer Row */}
            <div className="flex items-center justify-between pt-1 border-t border-border/60 dark:border-zinc-800">
              <div className="h-5 w-24 bg-muted/70 dark:bg-zinc-800 rounded-sm" />
              <div className="h-3.5 w-24 bg-primary/30 rounded-xs" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
