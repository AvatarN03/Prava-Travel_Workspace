export default function ForumLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-pulse">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1.5">
          <div className="h-3 w-36 bg-primary/30 rounded-xs" />
          <div className="h-8 w-52 bg-muted/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 rounded-xs" />
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="h-9 w-48 sm:w-64 bg-background border border-border rounded-sm" />
          <div className="h-9 w-32 bg-primary/40 rounded-sm" />
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex items-center gap-2 w-full">
        <div className="h-9 w-full sm:w-64 bg-card border border-border rounded-sm" />
        <div className="h-9 w-20 bg-card border border-border rounded-sm shrink-0" />
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-40 bg-muted/60 rounded-xs" />
      </div>

      {/* Stacked discussion cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[420px] sm:h-[400px] rounded-md border border-border bg-card overflow-hidden shadow-2xs flex flex-col"
          >
            {/* 50% visual cover, including the category badge */}
            <div className="relative h-1/2 w-full shrink-0 bg-muted/50 border-b border-border">
              <div className="absolute right-3 top-3 h-5 w-20 rounded-sm bg-muted/70" />
            </div>

            {/* 50% content section */}
            <div className="h-1/2 p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                {/* Two-line title, then location and date */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="h-4.5 w-4/5 bg-muted/80 rounded-xs" />
                  <div className="h-4.5 w-3/5 bg-muted/80 rounded-xs" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-24 bg-muted/50 rounded-xs" />
                  <div className="h-3 w-16 bg-muted/40 rounded-xs" />
                </div>
                <div className="h-6 w-4/5 bg-muted/40 border border-border rounded-md" />
                <div className="flex gap-1">
                  <div className="h-4 w-12 bg-muted/50 rounded-sm" />
                  <div className="h-4 w-16 bg-muted/50 rounded-sm" />
                </div>
              </div>

              {/* Author and bookmark footer */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-muted/60" />
                  <div className="space-y-1">
                    <div className="h-3 w-20 bg-muted/60 rounded-xs" />
                    <div className="h-2.5 w-14 bg-muted/40 rounded-xs" />
                  </div>
                </div>
                <div className="h-7 w-7 bg-muted/40 rounded-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

