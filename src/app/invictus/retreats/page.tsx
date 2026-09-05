"use client";

import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import { RetreatBody } from "@/components/retreat/RetreatBody";
import { RetreatCollectionHero } from "@/components/retreat/RetreatCollectionHero";
import { RetreatCta } from "@/components/retreat/RetreatCta";
import { RetreatGallery } from "@/components/retreat/RetreatGallery";
import { RetreatMetaRow } from "@/components/retreat/RetreatMetaRow";
import { RetreatVideo } from "@/components/retreat/RetreatVideo";
import PageContainer from "@/components/common/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import {
    createRetreatBooking,
    fetchMyRetreatBookings,
    fetchRetreatOverview,
} from "@/lib/features/retreat/retreatSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { RetreatBatch } from "@/types/retreat";
import RetreatPageSkeleton from "@/components/retreat/RetreatPageSkeleton";
import { RetreatEmptyState } from "@/components/retreat/RetreatEmptyState";
import { createRetreatCheckoutSession } from "@/lib/features/retreat/retreatSlice";

const getDateLabel = (batch: RetreatBatch) => {
    const start = new Date(batch.startDate);
    const end = new Date(batch.endDate);

    const startLabel = start.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
    });

    const endLabel = end.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return `${startLabel}-${endLabel}`;
};

const getSchedule = (batch?: RetreatBatch) => {
    if (!batch) return {};

    return {
        dateLabel: getDateLabel(batch),
        seatsRemaining: Math.max(
            0,
            batch.capacity - batch.confirmedBookingsCount,
        ),
        seatsTotal: batch.capacity,
    };
};

export default function RetreatPage() {
    const dispatch = useAppDispatch();

    const retreats = useAppSelector((state) => state.retreat.retreats);
    const isLoading = useAppSelector((state) => state.retreat.isLoading);
    const error = useAppSelector((state) => state.retreat.error);
    const isBooking = useAppSelector((state) => state.retreat.isBooking);
    const booking = useAppSelector((state) => state.retreat.booking);
    const bookingError = useAppSelector((state) => state.retreat.bookingError);
    const myBookings = useAppSelector((state) => state.retreat.myBookings);
    const isCheckingOut = useAppSelector(
        (state) => state.retreat.isCheckingOut,
    );
    const checkoutError = useAppSelector(
        (state) => state.retreat.checkoutError,
    );

    const handleProceedToCheckout = async () => {
        if (!existingBooking) return;
        const result = await dispatch(
            createRetreatCheckoutSession({ bookingId: existingBooking._id }),
        );
        if (createRetreatCheckoutSession.fulfilled.match(result)) {
            window.location.href = result.payload.checkoutUrl;
        }
    };

    useEffect(() => {
        dispatch(fetchRetreatOverview());
        dispatch(fetchMyRetreatBookings());
    }, [dispatch]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    useEffect(() => {
        if (bookingError) toast.error(bookingError);
    }, [bookingError]);

    useEffect(() => {
        if (checkoutError) toast.error(checkoutError);
    }, [checkoutError]);

    const { nextRetreat, nextBatch, previousRetreats } = useMemo(() => {
        const now = Date.now();

        const upcoming = retreats
            .flatMap(({ location, batches }) =>
                batches
                    .filter(
                        (batch) =>
                            new Date(batch.startDate).getTime() >= now &&
                            ["upcoming", "open"].includes(batch.status),
                    )
                    .map((batch) => ({ location, batch })),
            )
            .sort(
                (left, right) =>
                    new Date(left.batch.startDate).getTime() -
                    new Date(right.batch.startDate).getTime(),
            );

        const previous = retreats.filter(({ batches }) =>
            batches.some(
                (batch) =>
                    new Date(batch.endDate).getTime() < now ||
                    batch.status === "completed",
            ),
        );

        return {
            nextRetreat: upcoming[0]?.location ?? null,
            nextBatch: upcoming[0]?.batch,
            previousRetreats: previous,
        };
    }, [retreats]);

    const existingBooking = useMemo(
        () =>
            myBookings.find(
                (b) =>
                    (typeof b.retreatBatch === "string"
                        ? b.retreatBatch
                        : b.retreatBatch._id) === nextBatch?._id &&
                    [
                        "waitlisted",
                        "invited",
                        "payment_pending",
                        "confirmed",
                    ].includes(b.status),
            ) ?? null,
        [myBookings, nextBatch],
    );

    const bookingStatus =
        existingBooking?.status === "waitlisted" ||
        existingBooking?.status === "invited" ||
        existingBooking?.status === "payment_pending" ||
        existingBooking?.status === "confirmed"
            ? existingBooking.status
            : null;

    // Skeleton loading state
    if (isLoading && retreats.length === 0) {
        return <RetreatPageSkeleton />;
    }


    if (!nextRetreat || !nextBatch) {
        return (
            <PageContainer
                variant="invictus"
                as="main"
                className="py-20 text-center text-ink-soft"
            >
                No upcoming retreats are available.
            </PageContainer>
        );
    }

    // const schedule = getSchedule(nextBatch);

    const bookingMessage = booking
        ? "Your retreat reservation request has been submitted."
        : bookingError;

    return (
        <PageContainer variant="invictus" as="main">
            <RetreatCollectionHero />

            {/* Upcoming Retreat */}
            {nextRetreat && nextBatch ? (
                <>
                    <RetreatMetaRow
                        retreat={nextRetreat}
                        schedule={getSchedule(nextBatch)}
                    />

                    <RetreatVideo
                        title={nextRetreat.title}
                        promoVideoUrl={nextRetreat.promoVideoUrl}
                        coverImage={nextRetreat.coverImage}
                    />

                    <RetreatBody
                        description={nextRetreat.description}
                        whatsIncluded={nextRetreat.whatsIncluded}
                    />

                    <RetreatGallery
                        title={nextRetreat.title}
                        images={nextRetreat.galleryImages}
                    />

                    <RetreatCta
                        city={nextRetreat.city}
                        country={nextRetreat.country}
                        seatsRemaining={getSchedule(nextBatch).seatsRemaining}
                        isBooking={isBooking}
                        isCheckingOut={isCheckingOut}
                        bookingMessage={
                            booking
                                ? "Your retreat reservation request has been submitted."
                                : undefined
                        }
                        bookingStatus={bookingStatus}
                        onReserve={() =>
                            dispatch(
                                createRetreatBooking({
                                    retreatBatch: nextBatch._id,
                                }),
                            )
                        }
                        onProceedToCheckout={handleProceedToCheckout}
                    />
                </>
            ) : (
                <RetreatEmptyState />
            )}

            {/* Previous Retreats */}
            {previousRetreats.length > 0 && (
                <section className="mt-16">
                    <div className="mb-7">
                        <div className="mb-2 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold-deep">
                            Previous Retreats
                        </div>

                        <h2 className="font-display text-2xl font-medium text-ink">
                            Moments from past gatherings
                        </h2>
                    </div>

                    <div className="space-y-12">
                        {previousRetreats.map(({ location, batches }) => {
                            const previousBatch = [...batches].sort(
                                (left, right) =>
                                    new Date(right.endDate).getTime() -
                                    new Date(left.endDate).getTime(),
                            )[0];

                            return (
                                <article
                                    key={location._id}
                                    className="border-line rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] p-8 shadow-2xs"
                                >
                                    <RetreatMetaRow
                                        retreat={location}
                                        schedule={getSchedule(previousBatch)}
                                        isPrevious={true}
                                    />

                                    <h3 className="mb-2 font-display text-3xl font-medium text-ink">
                                        {location.title}
                                    </h3>

                                    <p className="mb-6 max-w-[700px] text-sm leading-7 text-ink-soft">
                                        {location.tagline ||
                                            location.description}
                                    </p>

                                    <RetreatGallery
                                        title={location.title}
                                        images={location.galleryImages}
                                    />
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}
        </PageContainer>
    );
}
