export default function TripsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-pulse">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/80 dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="h-3 w-28 bg-[#2D9BF0]/30 rounded-xs" />
          <div className="h-8 w-40 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>
        <div className="h-9 w-32 bg-[#2D9BF0]/40 rounded-sm self-end sm:self-auto shrink-0" />
      </div>

      {/* Top Metrics Strip (4 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-3.5 space-y-2 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-6 w-6 rounded-sm bg-muted/40 dark:bg-zinc-800" />
            </div>
            <div className="h-7 w-16 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
          </div>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {["All", "Active", "Planning", "Completed", "Archived"].map((label, i) => (
            <div
              key={label}
              className={`h-8 px-3 rounded-xs ${
                i === 0
                  ? "bg-[#2D9BF0]/20 border border-[#2D9BF0]/40 w-14"
                  : "bg-muted/40 dark:bg-card-subtle border border-border/60 dark:border-zinc-800/70 w-20"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="h-8 w-48 bg-muted/50 dark:bg-card border border-border/80 dark:border-zinc-800 rounded-sm" />
          <div className="h-8 w-24 bg-muted/50 dark:bg-card border border-border/80 dark:border-zinc-800 rounded-sm" />
        </div>
      </div>

      {/* Trip Cards Grid (3 columns on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-md border border-border/80 dark:border-zinc-800 bg-card overflow-hidden shadow-2xs space-y-0"
          >
            {/* Aspect Video Cover image placeholder with badges */}
            <div className="relative h-44 sm:h-48 bg-muted/60 dark:bg-zinc-800/60 p-3 flex justify-between items-start">
              <div className="h-5 w-24 bg-black/40 rounded-full" />
              <div className="h-5 w-18 bg-black/40 rounded-full" />
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3">
              <div className="space-y-1.5">
                <div className="h-5 w-3/4 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                <div className="h-3.5 w-1/2 bg-muted/60 dark:bg-zinc-800/60 rounded-xs" />
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-border/60 dark:border-zinc-800/60">
                <div className="h-3.5 w-32 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>

              {/* Card Footer Metrics */}
              <div className="pt-2 flex items-center justify-between border-t border-border/60 dark:border-zinc-800/60 text-xs">
                <div className="h-4 w-16 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                <div className="h-4 w-20 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
