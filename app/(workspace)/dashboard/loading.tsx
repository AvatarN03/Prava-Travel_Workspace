export default function DashboardLoading() {
  return (
    <div className="space-y-6 pb-10 animate-pulse">
      {/* Workspace Header with Editorial Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-[#2D9BF0]/30 rounded-xs" />
          <div className="h-8 w-64 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>
        <div className="h-9 w-28 bg-[#2D9BF0]/40 rounded-sm self-end sm:self-auto shrink-0" />
      </div>

      {/* Hero Section: Upcoming Trip Card (Full Width) */}
      <div className="rounded-lg border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-24 bg-emerald-500/20 rounded-full" />
            <div className="h-5 w-32 bg-[#2D9BF0]/20 rounded-full" />
          </div>
          <div className="h-7 w-20 bg-muted/50 dark:bg-zinc-800/50 rounded-sm" />
        </div>
        <div className="space-y-2">
          <div className="h-7 w-72 max-w-full bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="flex items-center gap-3">
            <div className="h-4 w-36 bg-muted/60 dark:bg-zinc-800/60 rounded-xs" />
            <div className="h-4 w-44 bg-muted/60 dark:bg-zinc-800/60 rounded-xs" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="h-14 bg-muted/40 dark:bg-[#121622] rounded-sm border border-border/50 dark:border-zinc-800/60" />
          <div className="h-14 bg-muted/40 dark:bg-[#121622] rounded-sm border border-border/50 dark:border-zinc-800/60" />
          <div className="h-14 bg-muted/40 dark:bg-[#121622] rounded-sm border border-border/50 dark:border-zinc-800/60" />
        </div>
      </div>

      {/* Main 2-Column Grid (7 cols / 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recent Trips List */}
          <div className="rounded-lg border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-zinc-800">
              <div className="h-4 w-28 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3 w-16 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-sm bg-muted/30 dark:bg-[#121622] border border-border/40 dark:border-zinc-800/60">
                  <div className="h-12 w-16 bg-muted/70 dark:bg-zinc-800 rounded-xs shrink-0" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="h-4 w-40 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                    <div className="h-3 w-28 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
                  </div>
                  <div className="h-5 w-16 bg-muted/50 dark:bg-zinc-800/50 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Financial Snapshot Card */}
          <div className="rounded-lg border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="h-4 w-36 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
              <div className="h-6 w-24 bg-muted/50 dark:bg-zinc-800 rounded-sm" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 bg-muted/40 dark:bg-[#121622] rounded-sm" />
              <div className="h-16 bg-muted/40 dark:bg-[#121622] rounded-sm" />
              <div className="h-16 bg-muted/40 dark:bg-[#121622] rounded-sm" />
            </div>
            <div className="h-2 w-full bg-muted/60 dark:bg-zinc-800 rounded-full" />
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Trip Workspace Card */}
          <div className="rounded-lg border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-5 space-y-3 shadow-2xs">
            <div className="h-4 w-44 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted/30 dark:bg-[#121622] rounded-sm border border-border/40 dark:border-zinc-800/60" />
              ))}
            </div>
          </div>

          {/* Travel Essentials 2x3 Grid */}
          <div className="rounded-lg border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-5 space-y-3 shadow-2xs">
            <div className="h-4 w-36 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="grid grid-cols-3 gap-2.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted/30 dark:bg-[#121622] rounded-sm border border-border/40 dark:border-zinc-800/60" />
              ))}
            </div>
          </div>

          {/* AI Assistant Card */}
          <div className="rounded-lg border border-[#2D9BF0]/20 bg-card dark:bg-[#0F131C] p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#2D9BF0]/20" />
              <div className="h-4 w-32 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            </div>
            <div className="h-12 bg-muted/30 dark:bg-[#121622] rounded-sm border border-border/40 dark:border-zinc-800/60" />
          </div>
        </div>
      </div>

      {/* Bottom Section: Cross-Trip Metrics Overview */}
      <div className="pt-2 space-y-3">
        <div className="h-3 w-48 bg-muted/70 dark:bg-zinc-800 rounded-xs" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                <div className="h-4 w-4 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
              </div>
              <div className="h-7 w-24 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
              <div className="h-2.5 w-32 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
