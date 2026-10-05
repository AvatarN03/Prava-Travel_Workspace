export default function ExpensesLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-border/50 dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-28 bg-primary/30 rounded-xs" />
            <div className="h-3 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
          </div>
          <div className="h-8 w-64 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="h-9 w-28 bg-muted/50 dark:bg-card-subtle border border-border dark:border-zinc-800 rounded-sm" />
          <div className="h-9 w-32 bg-primary/50 rounded-sm" />
        </div>
      </div>

      {/* 4-Stat Metric Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 space-y-2 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-3.5 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
            </div>
            <div className="h-7 w-24 bg-muted/80 dark:bg-zinc-800 rounded-sm" />
            <div className="h-2.5 w-32 bg-muted/40 dark:bg-zinc-800 rounded-xs" />
          </div>
        ))}
      </div>

      {/* 2-Column Split: Donut / Breakdown + Quick FX Converter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-5 space-y-4 shadow-2xs">
          <div className="h-4 w-36 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            <div className="h-36 w-36 rounded-full border-8 border-muted/50 dark:border-zinc-800 shrink-0" />
            <div className="space-y-2 flex-1 w-full">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="h-3.5 w-24 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                  <div className="h-3.5 w-16 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-5 space-y-3.5 shadow-2xs">
          <div className="h-4 w-40 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
          <div className="h-10 bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/40 dark:border-zinc-800/60" />
          <div className="h-10 bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/40 dark:border-zinc-800/60" />
          <div className="h-12 bg-muted/40 dark:bg-card-subtle rounded-sm border border-border/40 dark:border-zinc-800/60" />
        </div>
      </div>

      {/* Expenses List / Table View */}
      <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60 dark:border-zinc-800">
          <div className="h-8 w-64 bg-muted/40 dark:bg-card-subtle rounded-sm border border-border/60 dark:border-zinc-800" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-muted/40 dark:bg-card-subtle rounded-sm" />
            <div className="h-8 w-24 bg-muted/40 dark:bg-card-subtle rounded-sm" />
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {Array.from({ length: 4 }).map((_, k) => (
            <div key={k} className="h-14 bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/40 dark:border-zinc-800/60 flex items-center justify-between px-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-sm bg-muted/60 dark:bg-zinc-800" />
                <div className="space-y-1">
                  <div className="h-4 w-36 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                  <div className="h-3 w-20 bg-muted/50 dark:bg-zinc-800 rounded-xs" />
                </div>
              </div>
              <div className="h-5 w-20 bg-muted/70 dark:bg-zinc-800 rounded-xs" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
