export default function WorkspaceLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/80 dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="h-3 w-28 bg-[#2D9BF0]/30 rounded-xs" />
          <div className="h-8 w-56 bg-muted/80 dark:bg-zinc-800/80 rounded-sm" />
          <div className="h-4 w-80 max-w-full bg-muted/60 dark:bg-zinc-800/50 rounded-xs" />
        </div>
        <div className="h-9 w-28 bg-muted/40 dark:bg-[#121622] border border-border dark:border-zinc-800 rounded-sm" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="h-48 rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4" />
          <div className="h-36 rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4" />
        </div>
        <div className="lg:col-span-5 space-y-4">
          <div className="h-40 rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4" />
          <div className="h-32 rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4" />
        </div>
      </div>
    </div>
  );
}
