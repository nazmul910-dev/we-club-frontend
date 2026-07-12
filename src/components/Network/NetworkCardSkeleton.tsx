import { Mail, Phone, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function NetworkCardSkeleton() {
  return (
    <div
      className="
      rounded-[12px]
      border border-[#5c4518]
      bg-[#090909]
      p-5 sm:p-6
      shadow-[0_0_10px_#00000040]
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 sm:gap-4 min-w-0">
          <Skeleton className="h-14 w-14 rounded-full bg-neutral-800" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-36 bg-neutral-800" />
            <Skeleton className="h-3 w-28 bg-neutral-800" />
          </div>
        </div>
      </div>

      {/* Role + Listing Count */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <Skeleton className="h-6 w-24 rounded-full bg-neutral-800" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-20 bg-neutral-800" />
          <Skeleton className="h-3 w-4 bg-neutral-800" />
          <Skeleton className="h-3 w-12 bg-neutral-800" />
        </div>
      </div>

      {/* Latest Listing */}
      <div
        className="
        mt-5
        rounded-xl
        border border-[#3e3014]
        bg-[#0d0d0d]
        p-3 sm:p-4
        "
      >
        <Skeleton className="h-2 w-24 bg-neutral-800" />

        <div className="mt-4 flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-44 bg-neutral-800" />
          <Skeleton className="h-4 w-16 bg-neutral-800" />
        </div>
      </div>

      {/* Contact */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#5c4518]">
          <Mail size={15} className="text-neutral-700" />
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#5c4518]">
          <Phone size={15} className="text-neutral-700" />
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#5c4518]">
          <Eye size={15} className="text-neutral-700" />
        </div>
      </div>
    </div>
  );
}