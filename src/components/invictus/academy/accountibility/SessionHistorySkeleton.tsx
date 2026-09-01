import { Skeleton } from "@/components/ui/skeleton";

export default function SessionHistorySkeleton() {
    return (
        <>
            {[1, 2].map((item) => (
                <div
                    key={item}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[#E9E2D2] bg-white p-5"
                >
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-[#E9E2D2]" />
                        <Skeleton className="h-3 w-56 max-w-full bg-[#E9E2D2]" />
                    </div>

                    <Skeleton className="h-9 w-32 shrink-0 rounded-md bg-[#E9E2D2]" />
                </div>
            ))}
        </>
    );
}