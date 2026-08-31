import { PageContainer } from "../common";
import { Skeleton } from "../ui/skeleton";

export default function RetreatPageSkeleton() {
    return (
        <PageContainer variant="invictus" as="main">
            {/* Hero */}
            <section className="py-10 md:py-16">
                <div className="max-w-3xl space-y-5">
                    <Skeleton className="h-4 w-32" />

                    <Skeleton className="h-12 w-full max-w-2xl md:h-16" />

                    <Skeleton className="h-5 w-full max-w-xl" />
                    <Skeleton className="h-5 w-4/5 max-w-lg" />
                </div>
            </section>

            {/* Meta row */}
            <section className="border-y border-[#DECDB0] py-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-3">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-40" />
                    </div>

                    <div className="space-y-3">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-32" />
                    </div>

                    <div className="space-y-3">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-6 w-28" />
                    </div>
                </div>
            </section>

            {/* Video */}
            <section className="py-12 md:py-16">
                <Skeleton className="aspect-video w-full rounded-2xl" />
            </section>

            {/* Body */}
            <section className="grid gap-10 py-8 md:grid-cols-[1.4fr_1fr] md:gap-20">
                <div className="space-y-5">
                    <Skeleton className="h-8 w-48" />

                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>

                    <div className="space-y-3 pt-5">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-10/12" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>

                <div className="space-y-5">
                    <Skeleton className="h-8 w-48" />

                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3"
                            >
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-4 w-full max-w-xs" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section className="py-12 md:py-16">
                <div className="mb-7 space-y-3">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-9 w-64" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 md:py-16">
                <div className="rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] p-8 md:p-12">
                    <div className="space-y-5">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-10 w-full max-w-md" />
                        <Skeleton className="h-5 w-full max-w-lg" />

                        <div className="pt-4">
                            <Skeleton className="h-12 w-40 rounded-full" />
                        </div>
                    </div>
                </div>
            </section>
        </PageContainer>
    );
}