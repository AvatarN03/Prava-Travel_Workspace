export default function ItineraryLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Editorial Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border dark:border-zinc-800">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-3 w-24 bg-primary/30 rounded-xs" />
            <div className="h-4 w-28 bg-primary/20 rounded-full" />
          </div>
          <div className="h-8 w-48 sm:w-56 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="space-y-1 pt-0.5">
            <div className="h-3.5 w-full max-w-xl bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
            <div className="h-3.5 w-3/4 max-w-md bg-muted/50 dark:bg-zinc-800/40 rounded-xs sm:hidden" />
          </div>
        </div>

        {/* Action Triggers (Responsive on Mobile) */}
        <div className="flex items-center gap-2 sm:gap-2.5 self-start sm:self-auto shrink-0">
          {/* Est. Cost (Desktop only) */}
          <div className="hidden sm:inline-flex h-8 w-28 bg-muted/50 dark:bg-card-subtle border border-border/80 dark:border-zinc-800 rounded-sm" />
          {/* Calendar Sync (Icon-only on Mobile, full width on Desktop) */}
          <div className="h-8 w-8 sm:w-32 bg-card dark:bg-card-subtle border border-border dark:border-zinc-800 rounded-sm" />
          {/* Add Activity Button */}
          <div className="h-8 w-26 sm:w-28 bg-primary/50 rounded-sm" />
        </div>
      </div>

      {/* Day Filter Navigation Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border/60 dark:border-zinc-800">
        <div className="h-7 w-20 bg-primary/40 rounded-sm shrink-0" />
        {["Day 1", "Day 2", "Day 3"].map((day) => (
          <div
            key={day}
            className="h-7 w-20 sm:w-24 bg-muted/40 dark:bg-card-subtle border border-border/60 dark:border-zinc-800/70 rounded-sm shrink-0"
          />
        ))}
      </div>

      {/* Day Section & Timeline List */}
      <div className="space-y-4">
        {/* Day Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-border/70 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-sm bg-primary/20" />
            <div className="h-4 w-28 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-muted/40 dark:bg-zinc-800/40 rounded-xs" />
            <div className="h-4 w-20 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
          </div>
        </div>

        {/* Timeline Activities List matching real ItineraryView structure */}
        <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/70 dark:before:bg-zinc-800">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="group relative flex items-start gap-3 sm:gap-4 pl-0"
            >
              {/* Timeline Node on Left */}
              <div className="flex flex-col items-center shrink-0 mt-3.5 z-10">
                <div className="h-6 w-6 rounded-full bg-background dark:bg-card border-2 border-primary/50 flex items-center justify-center shadow-xs">
                  <div className="h-2 w-2 rounded-full bg-primary/40" />
                </div>
              </div>

              {/* Card Body */}
              <div className="flex-1 rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-3.5 sm:p-4 space-y-2.5 shadow-2xs min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="h-4 w-16 rounded-xs bg-muted/60 dark:bg-zinc-800" />
                      <div className="h-4 w-14 rounded-xs bg-muted/50 dark:bg-zinc-800/50" />
                      <div className="h-4 w-12 rounded-xs bg-emerald-500/15" />
                    </div>
                    <div className="h-5 w-40 sm:w-56 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                  </div>
                  <div className="h-6 w-6 rounded-sm bg-muted/40 dark:bg-zinc-800/40 shrink-0" />
                </div>

                <div className="h-3 w-4/5 bg-muted/40 dark:bg-zinc-800/40 rounded-xs" />

                <div className="flex items-center justify-between pt-1">
                  <div className="h-3.5 w-28 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                  <div className="h-4 w-12 bg-muted/30 dark:bg-zinc-800/30 rounded-xs" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
