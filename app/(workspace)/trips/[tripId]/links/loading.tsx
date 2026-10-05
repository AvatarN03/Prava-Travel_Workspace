export default function LinksLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-border/50 dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-32 bg-[#2D9BF0]/30 rounded-xs" />
            <div className="h-3 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
          </div>
          <div className="h-8 w-72 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="h-9 w-32 bg-muted/50 dark:bg-[#121622] border border-border dark:border-zinc-800 rounded-sm" />
          <div className="h-9 w-28 bg-[#2D9BF0]/50 rounded-sm" />
        </div>
      </div>

      {/* 3-Stat Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4 shadow-2xs space-y-2"
          >
            <div className="h-3.5 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
            <div className="h-7 w-16 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
            <div className="h-3 w-32 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
          </div>
        ))}
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="h-8 w-64 bg-muted/40 dark:bg-[#121622] rounded-sm border border-border/60 dark:border-zinc-800" />
        <div className="flex gap-1.5 overflow-x-auto">
          {["All", "Stay", "Activity", "Transit", "Restaurant"].map((cat) => (
            <div
              key={cat}
              className="h-7 px-3 bg-muted/40 dark:bg-[#121622] border border-border/60 dark:border-zinc-800 rounded-xs w-20"
            />
          ))}
        </div>
      </div>

      {/* Links Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
        {Array.from({ length: 6 }).map((_, j) => (
          <div
            key={j}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-xs bg-muted/60 dark:bg-zinc-800" />
                <div className="h-3.5 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              </div>
              <div className="h-4 w-4 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
            </div>
            <div className="h-5 w-44 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="space-y-1">
              <div className="h-3 w-full bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              <div className="h-3 w-2/3 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/60 dark:border-zinc-800/60">
              <div className="h-4 w-16 bg-muted/50 dark:bg-zinc-800/50 rounded-full" />
              <div className="h-4 w-12 bg-muted/40 dark:bg-zinc-800/40 rounded-xs" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
