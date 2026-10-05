export default function ProfileLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Editorial Header */}
      <div className="space-y-1.5 pb-5 border-b border-border dark:border-zinc-800">
        <div className="h-3 w-28 bg-primary/30 rounded-xs" />
        <div className="h-8 w-52 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
        <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
      </div>

      {/* Main 2-Column Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Nav Pill Column (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          {["Overview", "Preferences", "Security", "Danger Zone"].map((tab, i) => (
            <div
              key={tab}
              className={`h-10 px-3.5 rounded-sm flex items-center gap-2 ${
                i === 0
                  ? "bg-muted/70 dark:bg-card border border-border/80 dark:border-zinc-800"
                  : "bg-muted/30 dark:bg-zinc-900/30"
              }`}
            >
              <div className="h-4 w-4 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-3.5 w-24 bg-muted/70 dark:bg-zinc-800 rounded-xs" />
            </div>
          ))}
        </div>

        {/* Right Content Panel (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card p-6 space-y-6 shadow-2xs">
            {/* Header & Avatar Row */}
            <div className="flex items-center gap-5 pb-5 border-b border-border/60 dark:border-zinc-800">
              <div className="h-20 w-20 rounded-full bg-muted/70 dark:bg-zinc-800 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-40 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                <div className="h-3.5 w-64 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>
            </div>

            {/* Form Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="h-3.5 w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                <div className="h-10 w-full bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/60 dark:border-zinc-800" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3.5 w-20 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                <div className="h-10 w-full bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/60 dark:border-zinc-800" />
              </div>
            </div>

            {/* Bio Textarea */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-16 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
              <div className="h-24 w-full bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/60 dark:border-zinc-800" />
            </div>

            {/* Bottom Save Action */}
            <div className="pt-2 flex justify-end">
              <div className="h-9 w-28 bg-primary/50 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
