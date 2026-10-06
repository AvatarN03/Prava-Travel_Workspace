export default function ChecklistLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-border/50 dark:border-zinc-800">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-3 w-32 bg-primary/30 rounded-xs" />
            <div className="h-3 w-28 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
          </div>
          <div className="h-8 w-56 sm:w-72 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="space-y-1 pt-0.5">
            <div className="h-3.5 w-full max-w-xl bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
            <div className="h-3.5 w-3/4 max-w-md bg-muted/50 dark:bg-zinc-800/40 rounded-xs sm:hidden" />
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap sm:flex-nowrap">
          <div className="h-9 w-32 bg-primary/20 border border-primary/30 rounded-sm" />
          <div className="h-9 w-28 bg-card dark:bg-card-subtle border border-border dark:border-zinc-800 rounded-sm" />
          <div className="h-9 w-26 sm:w-28 bg-primary/50 rounded-sm" />
        </div>
      </div>

      {/* 3-Stat Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 shadow-2xs space-y-2.5 min-w-0"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-4 w-16 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
            </div>
            <div className="h-7 w-20 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
            <div className="h-1.5 w-full bg-muted/50 dark:bg-zinc-800 rounded-xs" />
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input: full width on mobile, max-w-sm on desktop */}
        <div className="w-full sm:max-w-sm h-9 bg-card dark:bg-card-subtle rounded-sm border border-border dark:border-zinc-800" />
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {["All Tasks", "To Do", "Completed"].map((filter) => (
            <div
              key={filter}
              className="h-8 px-3 bg-card dark:bg-card-subtle border border-border/60 dark:border-zinc-800 rounded-xs w-22 sm:w-24 shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Categorized Tasks Groups */}
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, c) => (
          <div
            key={c}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-border/60 dark:border-zinc-800">
              <div className="h-4 w-32 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-16 bg-muted/40 dark:bg-zinc-800/40 rounded-xs" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="h-11 bg-muted/20 dark:bg-card-subtle rounded-sm border border-border/40 dark:border-zinc-800/60 flex items-center justify-between px-3 gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-4 w-4 rounded-xs bg-muted/70 dark:bg-zinc-800 shrink-0" />
                    <div className="h-4 w-40 sm:w-60 bg-muted/80 dark:bg-zinc-800 rounded-xs truncate" />
                  </div>
                  <div className="h-4 w-16 bg-muted/40 dark:bg-zinc-800/40 rounded-full shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
