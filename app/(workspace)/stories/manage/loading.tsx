export default function StoriesManageLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 py-2 pb-16 animate-pulse">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border dark:border-zinc-800 pb-5">
        <div className="space-y-1.5">
          <div className="h-3 w-32 bg-[#2D9BF0]/30 rounded-xs" />
          <div className="h-8 w-44 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        <div className="h-9 w-28 bg-[#2D9BF0]/50 rounded-sm shrink-0" />
      </div>

      {/* Filter Tabs Strip */}
      <div className="flex items-center gap-2 border-b border-border/60 dark:border-zinc-800/60 pb-3">
        <div className="h-7 w-16 bg-primary/40 rounded-sm" />
        <div className="h-7 w-24 bg-muted/40 dark:bg-card-subtle rounded-sm" />
        <div className="h-7 w-20 bg-muted/40 dark:bg-card-subtle rounded-sm" />
      </div>

      {/* Stories Management List */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-16 w-24 rounded-xs bg-muted/60 dark:bg-zinc-800 shrink-0" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-18 bg-muted/50 dark:bg-zinc-800 rounded-full" />
                  <div className="h-3.5 w-24 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
                </div>
                <div className="h-5 w-64 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <div className="h-8 w-16 bg-muted/40 dark:bg-zinc-800 rounded-sm" />
              <div className="h-8 w-20 bg-muted/40 dark:bg-zinc-800 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
