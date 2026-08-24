"use client";

import { useEffect, useMemo } from "react";

import { RetreatBody } from "@/components/retreat/RetreatBody";
import { RetreatCollectionHero } from "@/components/retreat/RetreatCollectionHero";
import { RetreatCta } from "@/components/retreat/RetreatCta";
import { RetreatGallery } from "@/components/retreat/RetreatGallery";
import { RetreatMetaRow } from "@/components/retreat/RetreatMetaRow";
import { RetreatVideo } from "@/components/retreat/RetreatVideo";
import {
    createRetreatBooking,
    fetchMyRetreatBookings,
    fetchRetreatOverview,
} from "@/lib/features/retreat/retreatSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { RetreatBatch } from "@/types/retreat";

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

    useEffect(() => {
        dispatch(fetchRetreatOverview());
        dispatch(fetchMyRetreatBookings());
    }, [dispatch]);

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
                    ["waitlisted", "invited", "payment_pending", "confirmed"].includes(
                        b.status,
                    ),
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


    if (isLoading && retreats.length === 0) {
        return (
            <main className="mx-auto max-w-[1180px] px-5 py-20 text-center text-ink-soft">
                Loading retreats...
            </main>
        );
    }

    if (error) {
        return (
            <main className="mx-auto max-w-[1180px] px-5 py-20 text-center text-red-700">
                {error}
            </main>
        );
    }

    if (!nextRetreat || !nextBatch) {
        return (
            <main className="mx-auto max-w-[1180px] px-5 py-20 text-center text-ink-soft">
                No upcoming retreats are available.
            </main>
        );
    }

    const schedule = getSchedule(nextBatch);
    const bookingMessage = booking
        ? "Your retreat reservation request has been submitted."
        : bookingError;

    return (
        <main className="mx-auto max-w-[1180px] ">
            <RetreatCollectionHero />
            <RetreatMetaRow retreat={nextRetreat} schedule={schedule} />
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
                seatsRemaining={schedule.seatsRemaining}
                isBooking={isBooking}
                bookingMessage={bookingMessage}
                bookingStatus={bookingStatus}
                onReserve={() =>
                    dispatch(
                        createRetreatBooking({ retreatBatch: nextBatch._id }),
                    )
                }
            />

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
                                    className="border-t border-line pt-8"
                                >
                                    <RetreatMetaRow
                                        retreat={location}
                                        schedule={getSchedule(previousBatch)}
                                        isPrevious={true}
                                    />
                                    <h3 className="mb-2 font-display text-xl font-medium text-ink">
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
        </main>
    );
}
