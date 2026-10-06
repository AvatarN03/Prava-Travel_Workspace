export default function ExpensesLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-border/50 dark:border-zinc-800">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-3 w-28 bg-primary/30 rounded-xs" />
            <div className="h-3 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
          </div>
          <div className="h-8 w-56 sm:w-72 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="space-y-1 pt-0.5">
            <div className="h-3.5 w-full max-w-xl bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
            <div className="h-3.5 w-3/4 max-w-md bg-muted/50 dark:bg-zinc-800/40 rounded-xs sm:hidden" />
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap sm:flex-nowrap">
          <div className="hidden sm:inline-flex h-9 w-28 bg-muted/50 dark:bg-card-subtle border border-border dark:border-zinc-800 rounded-sm" />
          <div className="h-9 w-32 bg-primary/50 rounded-sm" />
        </div>
      </div>

      {/* 4-Stat Metric Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 space-y-2 shadow-2xs min-w-0"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 sm:w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-3.5 bg-muted/50 dark:bg-zinc-800 rounded-xs shrink-0" />
            </div>
            <div className="h-7 w-20 sm:w-24 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
            <div className="h-2.5 w-24 sm:w-28 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
          </div>
        ))}
      </div>

      {/* Multi-Category Segmented Bar Showcase (Linear Style) */}
      <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="h-4 w-44 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
          <div className="h-3 w-16 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
        </div>

        {/* Segmented Color Bar */}
        <div className="h-3 w-full bg-muted/50 dark:bg-zinc-800 rounded-xs overflow-hidden flex gap-0.5">
          <div className="h-full bg-primary/50 w-2/5" />
          <div className="h-full bg-sky-500/50 w-1/4" />
          <div className="h-full bg-amber-500/50 w-1/6" />
          <div className="h-full bg-emerald-500/50 w-1/6" />
        </div>

        {/* Category Chips Bar */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {Array.from({ length: 4 }).map((_, c) => (
            <div
              key={c}
              className="h-6 w-20 sm:w-24 rounded-xs border border-border/60 dark:border-zinc-800 bg-muted/30 dark:bg-card-subtle"
            />
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input: full width on mobile, max-w-sm on desktop */}
        <div className="w-full sm:max-w-sm h-9 bg-card dark:bg-card-subtle rounded-sm border border-border dark:border-zinc-800" />
        {/* Category Dropdown */}
        <div className="w-full sm:w-[180px] h-9 bg-card dark:bg-card-subtle rounded-sm border border-border dark:border-zinc-800" />
      </div>

      {/* Expenses List / Table View */}
      <div className="space-y-2 pt-1">
        {Array.from({ length: 4 }).map((_, k) => (
          <div
            key={k}
            className="h-14 bg-card rounded-sm border border-border/60 dark:border-zinc-800 flex items-center justify-between px-3 sm:px-4 shadow-2xs gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-sm bg-muted/60 dark:bg-zinc-800 shrink-0" />
              <div className="space-y-1 min-w-0">
                <div className="h-4 w-32 sm:w-48 bg-muted/80 dark:bg-zinc-800 rounded-xs truncate" />
                <div className="h-3 w-20 sm:w-28 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
              </div>
            </div>
            <div className="h-5 w-16 sm:w-20 bg-muted/70 dark:bg-zinc-800 rounded-xs shrink-0 font-mono" />
          </div>
        ))}
      </div>
    </div>
  );
}
