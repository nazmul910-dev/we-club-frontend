
import PageContainer from "@/components/common/PageContainer";

interface RetreatErrorProps {
    message?: string;
    onRetry?: () => void;
}

export function RetreatError({
    message = "Something went wrong while loading the retreats.",
    onRetry,
}: RetreatErrorProps) {
    return (
        <PageContainer
            variant="invictus"
            as="main"
            className="flex min-h-[60vh] items-center justify-center py-20"
        >
            <div className="w-full max-w-lg rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] px-6 py-10 text-center shadow-2xs sm:px-10">
                {/* Error icon */}
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#DECDB0] bg-[#F3EBDD]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-6 w-6 text-[#9A6B3A]"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m0 3.75h.007M10.29 3.86 2.82 17.25a1.5 1.5 0 0 0 1.3 2.25h15.76a1.5 1.5 0 0 0 1.3-2.25L13.71 3.86a1.5 1.5 0 0 0-2.6 0Z"
                        />
                    </svg>
                </div>

                <p className="mb-2 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold-deep">
                    Something went wrong
                </p>

                <h1 className="mb-3 font-display text-2xl font-medium text-ink">
                    We couldn't load the retreats
                </h1>

                <p className="mx-auto mb-7 max-w-md text-sm leading-6 text-ink-soft">
                    {message}
                </p>

                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        Try again
                    </button>
                )}
            </div>
        </PageContainer>
    );
}

