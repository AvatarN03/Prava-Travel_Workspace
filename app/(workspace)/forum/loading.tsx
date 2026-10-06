export default function ForumLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-pulse">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="h-3 w-36 bg-primary/30 rounded-xs" />
          <div className="h-8 w-52 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="h-9 w-48 sm:w-64 bg-background dark:bg-card border border-border dark:border-zinc-800 rounded-sm" />
          <div className="h-9 w-32 bg-primary/40 rounded-sm" />
        </div>
      </div>

      {/* Filter Controls: Category Select + Bookmark Button */}
      <div className="flex items-center gap-2 w-full">
        <div className="h-9 w-full sm:w-64 bg-card dark:bg-[#0F131C] border border-border dark:border-zinc-800 rounded-sm" />
        <div className="h-9 w-32 bg-card dark:bg-[#0F131C] border border-border dark:border-zinc-800 rounded-sm shrink-0" />
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-40 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
      </div>

      {/* Discussions Grid Layout (3 Columns on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-md border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            {/* Visual Thumbnail Cover */}
            <div className="h-32 w-full bg-muted/50 dark:bg-zinc-900/60 border-b border-border dark:border-zinc-800" />

            {/* Content Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                {/* Header Row: Category Badge & Bookmark */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-20 bg-muted/60 dark:bg-zinc-800 rounded-sm" />
                    <div className="h-4 w-16 bg-muted/40 dark:bg-zinc-800/60 rounded-xs" />
                  </div>
                  <div className="h-5 w-5 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
                </div>

                {/* Post Title & Description Excerpt */}
                <div className="space-y-1.5 pt-1">
                  <div className="h-4.5 w-4/5 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                  <div className="h-3 w-full bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                  <div className="h-3 w-3/4 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                </div>
              </div>

              {/* Author & Activity Metrics Footer */}
              <div className="pt-3 border-t border-border/60 dark:border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted/60 dark:bg-zinc-800" />
                  <div className="h-3 w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-10 bg-muted/40 dark:bg-zinc-800/50 rounded-xs" />
                  <div className="h-3 w-10 bg-muted/40 dark:bg-zinc-800/50 rounded-xs" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
