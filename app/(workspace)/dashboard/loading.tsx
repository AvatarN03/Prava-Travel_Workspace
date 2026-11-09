const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-sm bg-muted/70 dark:bg-card-subtle ${className}`} />
);

export default function DashboardLoading() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28 bg-primary/25" />
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-9 w-28 self-end sm:self-auto" />
      </div>

      <div className="overflow-hidden rounded-md border border-border/80 bg-card shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="space-y-5 p-6 sm:p-7 lg:col-span-7">
            <div className="flex gap-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-5 w-28" /></div>
            <div className="space-y-2"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-48" /></div>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex gap-2"><Skeleton className="h-7 w-24" /><Skeleton className="h-7 w-28" /><Skeleton className="h-7 w-24" /></div>
            <div className="flex justify-between border-t border-border/60 pt-4"><Skeleton className="h-9 w-40" /><Skeleton className="h-9 w-28" /></div>
          </div>
          <div className="min-h-64 border-t border-border/60 p-5 lg:col-span-5 lg:border-t-0 lg:border-l">
            <Skeleton className="h-full min-h-54 w-full" />
          </div>
        </div>

        <div className="border-t border-border/60 p-6 sm:p-7">
          <Skeleton className="mb-4 h-3 w-32" />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3 xl:border-r xl:border-border/60 xl:pr-5 last:border-0">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-md border border-border/80 bg-card p-5 shadow-2xs"><Skeleton className="mb-3 h-4 w-36" /><Skeleton className="h-40 w-full" /></div>
        <div className="rounded-md border border-border/80 bg-card p-5 shadow-2xs"><Skeleton className="mx-auto h-32 w-32 rounded-full bg-primary/15" /><Skeleton className="mt-4 h-4 w-3/4" /><Skeleton className="mt-2 h-9 w-full" /></div>
      </div>

      <div className="space-y-3 pt-2">
        <Skeleton className="h-3 w-48" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2 rounded-sm border border-border/80 bg-card p-4 shadow-2xs"><Skeleton className="h-3 w-20" /><Skeleton className="h-7 w-24" /><Skeleton className="h-2.5 w-32" /></div>
          ))}
        </div>
      </div>
    </div>
  );
}
