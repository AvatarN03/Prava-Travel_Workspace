export default function CreatorProfileLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-pulse w-full">
      {/* Creator Identity Hero (Compact on Mobile, Spacious on Desktop) */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Avatar Skeleton */}
          <div className="h-14 w-14 sm:h-24 sm:w-24 rounded-full bg-muted/60 dark:bg-zinc-800 shrink-0 border-2 border-border/80 dark:border-zinc-800" />

          {/* Identity & Bio */}
          <div className="space-y-2 sm:space-y-3 flex-1 min-w-0 w-full">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="h-6 sm:h-8 w-44 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
              <div className="h-5 w-24 bg-primary/20 rounded-sm" />
            </div>

            <div className="space-y-1.5 max-w-xl">
              <div className="h-3.5 w-full bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              <div className="h-3.5 w-3/4 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
            </div>

            {/* Metrics Bar */}
            <div className="flex items-center gap-4 sm:gap-6 pt-1">
              <div className="h-4 w-16 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-px bg-border dark:bg-zinc-800" />
              <div className="h-4 w-16 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-px bg-border dark:bg-zinc-800" />
              <div className="h-4 w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Skeleton */}
      <div className="space-y-6">
        {/* Mobile View: Select Dropdown Skeleton (< sm) */}
        <div className="sm:hidden w-full pb-1">
          <div className="h-10 w-full bg-card border border-border rounded-sm shadow-xs" />
        </div>

        {/* Tablet & Desktop: Tabs Strip (sm and up) */}
        <div className="hidden sm:flex justify-center border-b border-border dark:border-zinc-800 pb-px gap-6">
          <div className="h-11 w-28 border-b-2 border-primary bg-primary/10 rounded-t-xs" />
          <div className="h-11 w-24 bg-muted/20 dark:bg-zinc-850/30 rounded-t-xs" />
          <div className="h-11 w-28 bg-muted/20 dark:bg-zinc-850/30 rounded-t-xs" />
          <div className="h-11 w-24 bg-muted/20 dark:bg-zinc-850/30 rounded-t-xs" />
        </div>

        {/* 3-Column Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md border border-border bg-card overflow-hidden shadow-2xs"
            >
              <div className="h-44 sm:h-48 bg-muted/50 dark:bg-zinc-900/60 border-b border-border dark:border-zinc-800" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                <div className="h-3.5 w-1/2 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                <div className="pt-3 border-t border-border/60 dark:border-zinc-800/60 flex items-center justify-between">
                  <div className="h-4 w-20 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
                  <div className="h-7 w-24 bg-muted/50 dark:bg-zinc-800 rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
