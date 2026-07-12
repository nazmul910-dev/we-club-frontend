import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#090909] px-6 py-10">
      <div className="mx-auto max-w-6xl animate-pulse">

        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-3 w-36 bg-[#252525]" />
          <Skeleton className="mt-4 h-10 w-64 bg-[#252525]" />
          <Skeleton className="mt-3 h-4 w-72 bg-[#252525]" />
        </div>

        {/* Profile Header Card */}
        <div className="rounded-xl border border-[#302718] bg-[#111] p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-5">

              <Skeleton className="h-20 w-20 rounded-full bg-[#252525]" />

              <div>
                <Skeleton className="h-8 w-56 bg-[#252525]" />
                <Skeleton className="mt-3 h-4 w-24 bg-[#252525]" />
              </div>

            </div>

            <Skeleton className="h-11 w-44 rounded-lg bg-[#252525]" />

          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">

          {/* Left */}
          <div>

            {/* Particulars */}
            <div className="rounded-xl border border-[#302718] bg-[#111] p-6">

              <Skeleton className="mb-6 h-4 w-28 bg-[#252525]" />

              <div className="grid gap-6 md:grid-cols-2">

                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="mb-2 h-3 w-20 bg-[#252525]" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-40 bg-[#252525]" />
                      <Skeleton className="h-5 w-5 rounded-full bg-[#252525]" />
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Biography */}

            <div className="mt-6 rounded-xl border border-[#302718] bg-[#111] p-6">

              <div className="mb-5 flex items-center justify-between">

                <Skeleton className="h-4 w-28 bg-[#252525]" />

                <Skeleton className="h-5 w-5 rounded-full bg-[#252525]" />

              </div>

              <div className="rounded-md border border-[#302718] bg-[#0d0d0d] p-4">

                <Skeleton className="h-4 w-full bg-[#252525]" />
                <Skeleton className="mt-3 h-4 w-full bg-[#252525]" />
                <Skeleton className="mt-3 h-4 w-5/6 bg-[#252525]" />
                <Skeleton className="mt-3 h-4 w-2/3 bg-[#252525]" />

              </div>

            </div>

          </div>

          {/* Right Sidebar */}

          <div className="h-fit rounded-xl border border-[#302718] bg-[#111] p-6">

            <Skeleton className="mb-6 h-4 w-24 bg-[#252525]" />

            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-[#302718] py-5"
              >
                <Skeleton className="h-3 w-24 bg-[#252525]" />
                <Skeleton className="h-5 w-20 bg-[#252525]" />
              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
}