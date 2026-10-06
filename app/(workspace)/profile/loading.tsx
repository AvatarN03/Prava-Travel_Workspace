export default function ProfileLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16 animate-pulse">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="h-3 w-28 bg-primary/30 rounded-xs" />
          <div className="h-8 w-52 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>
        <div className="h-9 w-36 bg-muted/40 dark:bg-card-subtle border border-border dark:border-zinc-800 rounded-sm shrink-0" />
      </div>

      {/* ── DESKTOP / TABLET: VERTICAL SIDEBAR LAYOUT (hidden on mobile) ── */}
      <div className="hidden md:flex items-start gap-8">
        {/* Left Sidebar Navigation */}
        <aside className="w-56 shrink-0 space-y-2">
          <div className="h-3 w-16 bg-primary/30 rounded-xs px-1" />
          <div className="space-y-1">
            {["Overview", "Preferences", "Security"].map((tab, i) => (
              <div
                key={tab}
                className={`h-9 px-3 rounded-sm flex items-center gap-2.5 ${
                  i === 0
                    ? "bg-primary/10 border-l-2 border-primary"
                    : "bg-muted/20 dark:bg-zinc-900/30"
                }`}
              >
                <div className="h-4 w-4 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                <div className="h-3.5 w-20 bg-muted/70 dark:bg-zinc-800 rounded-xs" />
              </div>
            ))}
          </div>
        </aside>

        {/* Right Content Panel */}
        <div className="flex-1 min-w-0">
          <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-6 space-y-6 shadow-2xs">
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
              <div className="h-9 w-28 bg-primary/40 rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: STACKED SECTIONS WITHOUT SIDEBAR MENU (md:hidden) ── */}
      <div className="md:hidden space-y-8">
        {/* Section 1: Overview */}
        <div className="space-y-4">
          <div className="pb-2 border-b border-border dark:border-zinc-800 space-y-1">
            <div className="h-4 w-28 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-3 w-48 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
          </div>

          <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4 space-y-5 shadow-2xs">
            <div className="flex items-center gap-4 pb-4 border-b border-border/60 dark:border-zinc-800">
              <div className="h-16 w-16 rounded-full bg-muted/70 dark:bg-zinc-800 shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-4 w-32 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
                <div className="h-3 w-40 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="h-3 w-16 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                <div className="h-9 w-full bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/60 dark:border-zinc-800" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-12 bg-muted/60 dark:bg-zinc-800 rounded-xs" />
                <div className="h-20 w-full bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/60 dark:border-zinc-800" />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <div className="h-9 w-28 bg-primary/40 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Section 2: General Preferences */}
        <div className="space-y-4">
          <div className="pb-2 border-b border-border dark:border-zinc-800 space-y-1">
            <div className="h-4 w-36 bg-muted/80 dark:bg-zinc-800 rounded-xs" />
            <div className="h-3 w-56 bg-muted/50 dark:bg-zinc-800/50 rounded-xs" />
          </div>

          <div className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4 space-y-4 shadow-2xs">
            <div className="h-9 w-full bg-muted/30 dark:bg-card-subtle rounded-sm border border-border/60 dark:border-zinc-800" />
            <div className="h-16 w-full bg-muted/20 dark:bg-zinc-900/30 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
