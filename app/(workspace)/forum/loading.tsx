export default function ForumLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-pulse">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="h-3 w-36 bg-[#2D9BF0]/30 rounded-xs" />
          <div className="h-8 w-52 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="h-9 w-48 sm:w-64 bg-background dark:bg-card border border-border dark:border-zinc-800 rounded-sm" />
          <div className="h-9 w-32 bg-[#2D9BF0]/50 rounded-sm" />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2 w-full">
        <div className="h-9 w-64 bg-card border border-border dark:border-zinc-800 rounded-sm" />
        <div className="h-9 w-28 bg-card border border-border dark:border-zinc-800 rounded-sm" />
      </div>

      {/* Discussions Feed List */}
      <div className="space-y-3.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 space-y-3 shadow-2xs"
          >
            {/* Author row & category badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-muted/60 dark:bg-zinc-800" />
                <div className="space-y-1">
                  <div className="h-3.5 w-28 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                  <div className="h-3 w-20 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                </div>
              </div>
              <div className="h-5 w-24 bg-muted/40 dark:bg-zinc-800 rounded-full" />
            </div>

            {/* Post Title & Preview */}
            <div className="space-y-1.5">
              <div className="h-5 w-3/4 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-full bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
            </div>

            {/* Tags & Action Row */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60 dark:border-zinc-800/60 text-xs">
              <div className="h-4 w-24 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              <div className="flex items-center gap-3">
                <div className="h-6 w-16 bg-muted/40 dark:bg-zinc-800 rounded-sm" />
                <div className="h-6 w-14 bg-muted/40 dark:bg-zinc-800 rounded-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
