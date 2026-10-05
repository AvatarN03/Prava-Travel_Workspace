export default function TemplatesLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-pulse">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="h-3 w-28 bg-primary/30 rounded-xs" />
          <div className="h-8 w-60 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        <div className="w-full sm:w-80 shrink-0">
          <div className="h-9 w-full bg-card border border-border dark:border-zinc-800 rounded-sm" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-1">
        <div className="h-4 w-44 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="h-8 w-36 bg-background dark:bg-card border border-border dark:border-zinc-800 rounded-sm" />
          <div className="h-8 w-32 bg-background dark:bg-card border border-border dark:border-zinc-800 rounded-sm" />
          <div className="h-8 w-32 bg-background dark:bg-card border border-border dark:border-zinc-800 rounded-sm" />
        </div>
      </div>

      {/* 3-Column Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-md border border-border/80 dark:border-zinc-800 bg-card overflow-hidden shadow-2xs space-y-0"
          >
            {/* Aspect Video Cover with Badges */}
            <div className="h-44 sm:h-48 bg-muted/60 dark:bg-zinc-800/60 p-3 flex justify-between items-start">
              <div className="h-5 w-24 bg-black/40 rounded-full" />
              <div className="h-5 w-16 bg-black/40 rounded-full" />
            </div>

            {/* Author info & Details */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-muted/60 dark:bg-zinc-800" />
                <div className="h-3.5 w-28 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              </div>

              <div className="space-y-1.5">
                <div className="h-5 w-5/6 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                <div className="h-3.5 w-full bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>

              {/* Counters & Clone CTA */}
              <div className="pt-3 border-t border-border/60 dark:border-zinc-800/60 flex items-center justify-between">
                <div className="h-4 w-28 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                <div className="h-8 w-24 bg-primary/30 rounded-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
