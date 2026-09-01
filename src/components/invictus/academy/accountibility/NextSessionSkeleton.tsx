import { SectionCard } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";

export default function NextSessionSkeleton() {
    return (
        <SectionCard
            variant="invictus"
            className="mb-10 flex items-center justify-between gap-4"
        >
            <div className="space-y-2">
                <Skeleton className="h-3 w-24 bg-[#E9E2D2]" />
                <Skeleton className="h-6 w-52 bg-[#E9E2D2]" />
                <Skeleton className="h-4 w-72 max-w-full bg-[#E9E2D2]" />
            </div>

            <Skeleton className="h-10 w-20 rounded-md bg-[#E9E2D2]" />
        </SectionCard>
    );
}