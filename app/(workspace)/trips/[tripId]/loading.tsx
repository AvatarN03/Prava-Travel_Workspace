const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-sm bg-muted/70 dark:bg-card-subtle ${className}`} />
);

export default function TripWorkspaceRootLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl min-w-0 space-y-4">
      <div className="flex items-center gap-2 py-1">
        <Skeleton className="h-3.5 w-3.5" />
        <Skeleton className="h-3.5 w-20" />
      </div>

      <section className="relative h-52 overflow-hidden rounded-md border border-border/80 bg-card-subtle sm:h-60">
        <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-transparent to-muted/30" />
        <div className="absolute inset-x-0 bottom-0 space-y-3 p-5 sm:p-6">
          <div className="flex gap-2"><Skeleton className="h-5 w-32 bg-black/25 dark:bg-black/35" /><Skeleton className="h-5 w-24 bg-black/25 dark:bg-black/35" /></div>
          <Skeleton className="h-9 w-3/4 max-w-120 bg-card/70 dark:bg-card/30" />
        </div>
      </section>

      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2"><Skeleton className="h-7 w-28" /><Skeleton className="h-7 w-20" /></div>
        <div className="flex gap-2"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-8" /></div>
      </div>

      <div className="md:hidden">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-5 pt-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2 rounded-sm border border-border/80 bg-card p-3.5 shadow-2xs">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-2.5 w-12 bg-primary/20" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <section className="space-y-4 rounded-sm border border-border/80 bg-card p-4 shadow-2xs lg:col-span-7 sm:p-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3"><Skeleton className="h-4 w-36" /><Skeleton className="h-3 w-20" /></div>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex gap-3 rounded-sm border border-border/60 p-3">
                <Skeleton className="h-8 w-10 shrink-0" />
                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-1/3" /></div>
              </div>
            ))}
          </section>

          <section className="space-y-4 rounded-sm border border-border/80 bg-card p-4 shadow-2xs lg:col-span-5 sm:p-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-16" /></div>
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-3"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>
            <Skeleton className="h-9 w-full bg-primary/15" />
          </section>
        </div>
      </div>
    </div>
  );
}
