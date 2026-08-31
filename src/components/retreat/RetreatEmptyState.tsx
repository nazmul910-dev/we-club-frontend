
import { CalendarDays } from "lucide-react";

interface RetreatEmptyStateProps {
    title?: string;
    description?: string;
}

export function RetreatEmptyState({
    title = "No upcoming retreats",
    description = "There are currently no upcoming retreats available. Please check back soon for the next gathering.",
}: RetreatEmptyStateProps) {
    return (
        <section className="rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] px-6 py-16 text-center md:px-10 md:py-20">
            <div className="mx-auto flex max-w-xl flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#DECDB0] bg-[#FBF9F4]">
                    <CalendarDays className="h-7 w-7 text-gold-deep" />
                </div>

                <span className="mb-3 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold-deep">
                    Upcoming Retreats
                </span>

                <h2 className="mb-3 font-display text-3xl font-medium text-ink md:text-4xl">
                    {title}
                </h2>

                <p className="max-w-lg text-sm leading-7 text-ink-soft">
                    {description}
                </p>
            </div>
        </section>
    );
}

