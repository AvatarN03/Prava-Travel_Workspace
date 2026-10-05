export default function TravelEssentialsLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Editorial Workspace Header */}
      <div className="flex flex-col gap-1.5 pb-5 border-b border-border dark:border-[#1E293B]/70">
        <div className="flex items-center justify-between gap-2">
          <div className="h-3 w-24 bg-[#2D9BF0]/30 rounded-xs" />
          <div className="hidden md:flex h-6 w-36 bg-[#2D9BF0]/15 rounded-sm" />
        </div>
        <div className="h-8 w-64 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
        <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
      </div>

      {/* Main Currency Converter Tool Layout */}
      <div className="space-y-6">
        {/* Converter Card */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-5 sm:p-6 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-4 w-28 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            {/* Amount input */}
            <div className="md:col-span-3 space-y-1.5">
              <div className="h-3 w-16 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-11 w-full bg-muted/30 dark:bg-[#121622] rounded-sm border border-border/50 dark:border-zinc-800/60" />
            </div>

            {/* Swap button placeholder */}
            <div className="md:col-span-1 flex justify-center pt-4">
              <div className="h-9 w-9 rounded-full bg-muted/50 dark:bg-zinc-800" />
            </div>

            {/* Target currency select */}
            <div className="md:col-span-3 space-y-1.5">
              <div className="h-3 w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-11 w-full bg-muted/30 dark:bg-[#121622] rounded-sm border border-border/50 dark:border-zinc-800/60" />
            </div>
          </div>

          {/* Conversion Output Banner */}
          <div className="p-4 rounded-sm bg-muted/30 dark:bg-[#121622] border border-border/50 dark:border-zinc-800/60 flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-3 w-28 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
              <div className="h-7 w-48 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
            </div>
            <div className="h-6 w-32 bg-muted/50 dark:bg-zinc-800 rounded-sm" />
          </div>
        </div>

        {/* Popular Currencies Quick Watchlist Grid */}
        <div className="space-y-3">
          <div className="h-3.5 w-44 bg-muted/70 dark:bg-zinc-800 rounded-xs" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-sm border border-border/70 dark:border-zinc-800 bg-card dark:bg-[#0F131C] space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-10 bg-muted/70 dark:bg-zinc-800 rounded-xs" />
                  <div className="h-4 w-4 rounded-full bg-muted/40 dark:bg-zinc-800" />
                </div>
                <div className="h-5 w-20 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
                <div className="h-3 w-14 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
