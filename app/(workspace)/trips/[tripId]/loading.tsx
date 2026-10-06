export default function TripWorkspaceRootLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto min-w-0 space-y-4 animate-pulse">
      {/* 1. Top Link: Back to Trips */}
      <div className="flex items-center gap-1.5 pb-0.5">
        <div className="h-3.5 w-3.5 bg-muted/60 dark:bg-zinc-800/60 rounded-xs" />
        <div className="h-3.5 w-20 bg-muted/60 dark:bg-zinc-800/60 rounded-xs" />
      </div>

      {/* 2. Cover Banner with Destination & Title Inside */}
      <div className="h-44 sm:h-52 w-full rounded-md bg-muted/60 dark:bg-zinc-800/60 relative overflow-hidden p-4 sm:p-6 flex flex-col justify-end">
        <div className="space-y-2">
          {/* Destination Pill & Countdown */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-5 w-24 rounded-xs bg-black/40 border border-white/10" />
            <div className="h-5 w-20 rounded-xs bg-black/40 border border-white/10" />
          </div>
          {/* Trip Title */}
          <div className="h-8 sm:h-10 w-48 sm:w-80 bg-white/30 dark:bg-white/20 rounded-sm" />
        </div>
      </div>

      {/* 3. Action Control Strip & Metadata Below Banner (Single Row) */}
      <div className="space-y-2 pt-0.5">
        <div className="flex items-center justify-between gap-2 w-full flex-nowrap">
          {/* Left: Workspace Eyebrow */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="h-3.5 w-3.5 rounded-xs bg-primary/40 shrink-0" />
            <div className="h-3.5 w-24 rounded-xs bg-primary/30 truncate" />
          </div>

          {/* Right: Actions Row (Status, AI Assistant, Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap shrink-0">
            <div className="h-7 sm:h-8 w-[105px] sm:w-[120px] rounded-xs bg-card dark:bg-card-subtle border border-border/80 dark:border-zinc-800 shrink-0" />
            <div className="h-7 sm:h-8 w-20 sm:w-24 rounded-xs bg-card dark:bg-card-subtle border border-primary/40 shrink-0" />
            <div className="h-7 sm:h-8 w-7 sm:w-8 rounded-xs bg-card dark:bg-card-subtle border border-border/80 dark:border-zinc-800 shrink-0" />
          </div>
        </div>
      </div>

      {/* 4. Navigation Bar Skeleton (Matches WorkspaceNav Responsive Behavior) */}
      {/* Mobile Phones (< sm): 1-Tap Select Dropdown */}
      <div className="sm:hidden p-2 border-b border-border/80 dark:border-zinc-800">
        <div className="h-10 w-full rounded-sm bg-card dark:bg-card-subtle border border-border/80 dark:border-zinc-800" />
      </div>
      {/* Tablet (sm to md): Scrollable Tab Strip */}
      <div className="hidden sm:flex md:hidden items-center gap-2 overflow-x-auto pb-1 border-b border-border/60 dark:border-zinc-800">
        {["Overview", "Itinerary", "Accommodations", "Expenses", "Notes", "Checklist", "Links"].map((tab, i) => (
          <div
            key={tab}
            className={`h-9 px-3.5 rounded-sm shrink-0 ${
              i === 0
                ? "bg-primary/20 border-b-2 border-primary w-24"
                : "bg-muted/40 dark:bg-card-subtle border border-border/50 dark:border-zinc-800/60 w-24"
            }`}
          />
        ))}
      </div>

      {/* 5. Default Tab Content Skeleton (Overview) */}
      <div className="pt-2 space-y-6">
        {/* Metric Header Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-3.5 rounded-sm border border-border/80 dark:border-zinc-800 bg-card space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                <div className="h-3.5 w-3.5 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
              </div>
              <div className="space-y-1">
                <div className="h-6 w-20 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
                <div className="h-3 w-16 bg-primary/30 rounded-xs" />
              </div>
            </div>
          ))}
        </div>

        {/* 2x2 Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, j) => (
            <div
              key={j}
              className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 sm:p-5 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-zinc-800">
                <div className="h-4 w-32 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                <div className="h-3 w-20 bg-primary/30 rounded-xs" />
              </div>
              <div className="space-y-3">
                <div className="h-12 bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/40 dark:border-zinc-800/60" />
                <div className="h-12 bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/40 dark:border-zinc-800/60" />
              </div>
              <div className="pt-2 border-t border-border/60 dark:border-zinc-800 flex justify-between">
                <div className="h-3 w-24 bg-muted/40 dark:bg-zinc-800/40 rounded-xs" />
                <div className="h-3 w-16 bg-primary/20 rounded-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
