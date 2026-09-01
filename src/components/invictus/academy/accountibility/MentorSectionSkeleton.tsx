import { SectionCard } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";

export default function MentorSectionSkeleton() {
    return (
        <SectionCard variant="invictus" className="mb-6">
            <Skeleton className="mb-4 h-3 w-28 bg-[#E9E2D2]" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[1, 2].map((item) => (
                    <div
                        key={item}
                        className="flex min-h-25 items-center gap-3 rounded-lg border border-[#EFE6CE] bg-white px-5 py-3"
                    >
                        <Skeleton className="h-11 w-11 shrink-0 rounded-full bg-[#E9E2D2]" />

                        <div className="space-y-2">
                            <Skeleton className="h-3 w-20 bg-[#E9E2D2]" />
                            <Skeleton className="h-4 w-32 bg-[#E9E2D2]" />
                        </div>
                    </div>
                ))}
            </div>

            <Skeleton className="mt-5 h-11 w-full rounded-md bg-[#E9E2D2]" />
        </SectionCard>
    );
}