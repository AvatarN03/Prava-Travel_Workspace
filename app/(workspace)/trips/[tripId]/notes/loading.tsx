export default function NotesLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-border/50 dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-32 bg-primary/30 rounded-xs" />
            <div className="h-3 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
          </div>
          <div className="h-8 w-64 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        <div className="h-9 w-28 bg-primary/50 rounded-sm shrink-0" />
      </div>

      {/* 3-Stat Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 shadow-2xs space-y-2"
          >
            <div className="h-3.5 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
            <div className="h-7 w-16 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
            <div className="h-3 w-32 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
          </div>
        ))}
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="h-8 w-64 bg-muted/40 dark:bg-card-subtle rounded-sm border border-border/60 dark:border-zinc-800" />
        <div className="flex gap-1.5 overflow-x-auto">
          {["All", "General", "Recommendations", "Tips"].map((cat) => (
            <div
              key={cat}
              className="h-7 px-3 bg-muted/40 dark:bg-card-subtle border border-border/60 dark:border-zinc-800 rounded-xs w-20"
            />
          ))}
        </div>
      </div>

      {/* Notes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
        {Array.from({ length: 6 }).map((_, j) => (
          <div
            key={j}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-16 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-3.5 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
            </div>
            <div className="h-5 w-40 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-full bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              <div className="h-3 w-5/6 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              <div className="h-3 w-3/4 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
            </div>
            <div className="h-3 w-24 bg-muted/40 dark:bg-zinc-800/40 rounded-xs pt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
