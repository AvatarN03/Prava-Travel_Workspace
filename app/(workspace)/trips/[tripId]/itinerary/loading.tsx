export default function ItineraryLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Editorial Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-24 bg-[#2D9BF0]/30 rounded-xs" />
            <div className="h-4 w-28 bg-[#2D9BF0]/20 rounded-full" />
          </div>
          <div className="h-8 w-56 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="h-8 w-24 bg-muted/50 dark:bg-card-subtle border border-border/80 dark:border-zinc-800 rounded-sm" />
          <div className="h-8 w-24 bg-[#2D9BF0]/20 border border-[#2D9BF0]/30 rounded-sm" />
          <div className="h-8 w-32 bg-muted/50 dark:bg-card-subtle border border-border/80 dark:border-zinc-800 rounded-sm" />
          <div className="h-8 w-28 bg-[#2D9BF0]/50 rounded-sm" />
        </div>
      </div>

      {/* Day Filter Navigation Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border/60 dark:border-zinc-800">
        <div className="h-7 w-20 bg-[#2D9BF0]/40 rounded-sm" />
        {["Day 1", "Day 2", "Day 3", "Day 4"].map((day) => (
          <div
            key={day}
            className="h-7 w-28 bg-muted/40 dark:bg-card-subtle border border-border/60 dark:border-zinc-800/70 rounded-sm"
          />
        ))}
      </div>

      {/* Day Section & Timeline List */}
      <div className="space-y-4">
        {/* Day Header Banner */}
        <div className="flex items-center justify-between p-3 rounded-sm bg-muted/40 dark:bg-card-subtle border border-border/70 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="h-5 w-16 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-4 w-28 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
          </div>
          <div className="h-6 w-20 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        {/* Timeline Activities List */}
        <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-border/60 dark:border-zinc-800 ml-4 sm:ml-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="relative p-4 rounded-sm border border-border/80 dark:border-zinc-800 bg-card space-y-2.5 shadow-2xs"
            >
              {/* Timeline Node on Left */}
              <div className="absolute -left-[25px] sm:-left-[33px] top-4 h-4 w-4 rounded-full bg-[#2D9BF0]/40 border-2 border-background" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-sm bg-muted/60 dark:bg-zinc-800" />
                  <div className="h-5 w-44 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                  <div className="h-4 w-16 bg-muted/50 dark:bg-zinc-800/50 rounded-full" />
                </div>
                <div className="h-5 w-16 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>

              <div className="h-3 w-4/5 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="h-3.5 w-32 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                <div className="h-4 w-14 bg-muted/40 dark:bg-zinc-800/40 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
