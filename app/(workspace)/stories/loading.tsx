export default function StoriesLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-pulse">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border dark:border-zinc-800 pb-5">
        <div className="space-y-1.5">
          <div className="h-3 w-36 bg-primary/30 rounded-xs" />
          <div className="h-8 w-52 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-24 bg-card border border-border rounded-sm" />
          <div className="h-9 w-28 bg-primary/40 rounded-sm" />
        </div>
      </div>

      {/* Tags Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="h-4 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs shrink-0 mr-1" />
        {["Japan", "Europe", "Solo Travel", "Food Guides", "Budget"].map((tag) => (
          <div
            key={tag}
            className="h-6 px-3 bg-muted/40 dark:bg-zinc-800/60 border border-border/60 dark:border-zinc-800 rounded-full w-20 shrink-0"
          />
        ))}
      </div>

      {/* 3-Column Stories Grid Matching StoryCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-md border border-border bg-card overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            {/* Visual Thumbnail Image */}
            <div className="h-44 sm:h-48 bg-muted/50 dark:bg-zinc-900/60 border-b border-border dark:border-zinc-800" />

            {/* Content Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-16 bg-muted/50 dark:bg-zinc-800 rounded-full" />
                  <div className="h-3 w-12 bg-muted/40 dark:bg-zinc-800/50 rounded-xs" />
                </div>
                <div className="h-5 w-4/5 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                <div className="space-y-1 pt-0.5">
                  <div className="h-3.5 w-full bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                  <div className="h-3.5 w-3/4 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                </div>
              </div>

              {/* Author Row & Actions */}
              <div className="pt-3 border-t border-border/60 dark:border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted/60 dark:bg-zinc-800" />
                  <div className="h-3 w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                </div>
                <div className="h-6 w-14 bg-muted/40 dark:bg-zinc-800/60 rounded-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
