import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F6F1] px-6 py-10">
      <div className="max-w-6xl mx-auto animate-pulse">
        <Skeleton className="h-3 w-40" />

        <Skeleton className="mt-5 h-12 w-72" />

        <div className="mt-10 bg-white rounded-2xl p-8">
          <div className="flex gap-5 items-center">
            <Skeleton className="w-24 h-24 rounded-full" />

            <div>
              <Skeleton className="h-8 w-52" />

              <Skeleton className="mt-3 h-3 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
