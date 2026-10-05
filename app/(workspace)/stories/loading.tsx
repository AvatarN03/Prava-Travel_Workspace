export default function StoriesLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-pulse">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border dark:border-zinc-800 pb-5">
        <div className="space-y-1.5">
          <div className="h-3 w-36 bg-[#2D9BF0]/30 rounded-xs" />
          <div className="h-8 w-52 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-24 bg-muted/50 dark:bg-card-subtle border border-border dark:border-zinc-800 rounded-sm" />
          <div className="h-9 w-28 bg-[#2D9BF0]/50 rounded-sm" />
        </div>
      </div>

      {/* Tags Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["All", "Japan", "Europe", "Solo Travel", "Food Guides", "Budget"].map((tag) => (
          <div
            key={tag}
            className="h-7 px-3.5 bg-muted/40 dark:bg-card-subtle border border-border/60 dark:border-zinc-800 rounded-full w-20 shrink-0"
          />
        ))}
      </div>

      {/* Featured Story Hero Card */}
      <div className="rounded-lg border border-border/80 dark:border-zinc-800 bg-card overflow-hidden shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 h-64 lg:h-80 bg-muted/60 dark:bg-zinc-800/60" />
          <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-5 w-24 bg-[#2D9BF0]/20 rounded-full" />
              <div className="h-7 w-4/5 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
              <div className="space-y-1.5 pt-1">
                <div className="h-3.5 w-full bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                <div className="h-3.5 w-4/5 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/60 dark:border-zinc-800/60">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-muted/60 dark:bg-zinc-800" />
                <div className="h-3.5 w-24 bg-muted/70 dark:bg-zinc-800 rounded-xs" />
              </div>
              <div className="h-4 w-16 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-md border border-border/80 dark:border-zinc-800 bg-card overflow-hidden shadow-2xs space-y-0"
          >
            <div className="h-44 sm:h-48 bg-muted/60 dark:bg-zinc-800/60" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-16 bg-muted/40 dark:bg-zinc-800 rounded-full" />
              <div className="space-y-1.5">
                <div className="h-5 w-5/6 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                <div className="h-3.5 w-full bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>
              <div className="pt-3 border-t border-border/60 dark:border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted/60 dark:bg-zinc-800" />
                  <div className="h-3 w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                </div>
                <div className="h-3.5 w-14 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
