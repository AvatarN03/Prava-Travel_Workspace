export default function ChecklistLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-border/50 dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-32 bg-[#2D9BF0]/30 rounded-xs" />
            <div className="h-3 w-28 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
          </div>
          <div className="h-8 w-72 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap sm:flex-nowrap">
          <div className="h-9 w-32 bg-[#2D9BF0]/20 border border-[#2D9BF0]/30 rounded-sm" />
          <div className="h-9 w-28 bg-muted/50 dark:bg-[#121622] border border-border dark:border-zinc-800 rounded-sm" />
          <div className="h-9 w-28 bg-[#2D9BF0]/50 rounded-sm" />
        </div>
      </div>

      {/* 3-Stat Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4 shadow-2xs space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-4 w-16 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
            </div>
            <div className="h-7 w-20 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
            <div className="h-1.5 w-full bg-muted/50 dark:bg-zinc-800 rounded-xs" />
          </div>
        ))}
      </div>

      {/* Filter and Tasks List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="h-8 w-64 bg-muted/40 dark:bg-[#121622] rounded-sm border border-border/60 dark:border-zinc-800" />
          <div className="flex gap-1.5">
            <div className="h-7 w-16 bg-[#2D9BF0]/20 rounded-xs" />
            <div className="h-7 w-20 bg-muted/40 dark:bg-[#121622] rounded-xs" />
          </div>
        </div>

        {/* Task Category Group */}
        <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4 space-y-3 shadow-2xs">
          <div className="h-4 w-32 bg-muted/80 dark:bg-zinc-800 rounded-xs pb-1" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <div
                key={j}
                className="h-11 bg-muted/30 dark:bg-[#121622] rounded-sm border border-border/40 dark:border-zinc-800/60 flex items-center justify-between px-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-xs bg-muted/70 dark:bg-zinc-800" />
                  <div className="h-4 w-52 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                </div>
                <div className="h-4 w-16 bg-muted/40 dark:bg-zinc-800 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
