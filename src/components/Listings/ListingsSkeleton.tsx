import { Skeleton } from "@/components/ui/skeleton";

function ListingCardSkeleton() {
  return (
    <article className="card-luxe flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />

        {/* Badges row */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <Skeleton className="h-5 w-20 rounded-sm bg-white/10" />
          <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
        </div>

        {/* Asking price overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 pt-12">
          <Skeleton className="h-3 w-14 mb-2 bg-white/10" />
          <Skeleton className="h-6 w-32 bg-white/10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Skeleton className="h-6 w-3/4" />

        <div className="mt-2 flex items-center gap-1.5">
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>

        {/* Specs */}
        <div className="mt-4 flex items-center gap-5">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-14" />
        </div>

        {/* Commission box */}
        <div className="mt-5 rounded-md border border-white/10 px-3 py-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-10" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex items-center gap-2 pt-1">
          <Skeleton className="h-9 flex-1 rounded-full" />
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export function ListingsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}