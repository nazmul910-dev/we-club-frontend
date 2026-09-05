"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type BookingStatus =
    | "waitlisted"
    | "invited"
    | "payment_pending"
    | "confirmed"
    | null;

export type RetreatCtaProps = {
    city: string;
    country: string;
    seatsRemaining?: number;
    onReserve?: () => void;
    onProceedToCheckout?: () => void;
    isBooking?: boolean;
    isCheckingOut?: boolean;
    bookingMessage?: string | null;
    bookingStatus?: BookingStatus;
};

const ACTIONABLE_STATUSES: BookingStatus[] = ["invited", "payment_pending"];

const STATUS_COPY: Record<
    Exclude<BookingStatus, null>,
    { label: string; icon: "check" | "clock" }
> = {
    confirmed: { label: "You're confirmed for this retreat", icon: "check" },
    waitlisted: { label: "You're on the waiting list", icon: "clock" },
    invited: { label: "You're invited to this retreat", icon: "check" },
    payment_pending: { label: "Payment pending", icon: "clock" },
};

function StatusIcon({ icon }: { icon: "check" | "clock" }) {
    if (icon === "check") {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                className="h-4 w-4"
            >
                <path d="M4 12l5 5L20 6" />
            </svg>
        );
    }
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" />
        </svg>
    );
}

export function RetreatCta({
    city,
    country,
    seatsRemaining,
    onReserve,
    onProceedToCheckout,
    isBooking = false,
    isCheckingOut = false,
    bookingMessage,
    bookingStatus = null,
}: RetreatCtaProps) {
    const [open, setOpen] = useState(false);
    const [wasBooking, setWasBooking] = useState(false);

    const status = bookingStatus ? STATUS_COPY[bookingStatus] : null;
    const isActionable = ACTIONABLE_STATUSES.includes(bookingStatus);

    function handleConfirm() {
        onReserve?.();
    }

    // Close the dialog once the dispatch settles (isBooking flips true -> false).
    if (isBooking && !wasBooking) setWasBooking(true);
    if (!isBooking && wasBooking && open) {
        setWasBooking(false);
        setOpen(false);
    }

    // const status = bookingStatus ? STATUS_COPY[bookingStatus] : null;

    // console.log("Status", status, "booking status", bookingStatus)

    return (
        <div className="relative overflow-hidden border border-[#2a251c] bg-[radial-gradient(ellipse_600px_300px_at_50%_-30%,rgba(201,154,68,.14),transparent_65%)] bg-dark sm:px-8 py-12 text-center shadow-2xs border-[#DECDB0] rounded-2xl mt-14">
            <div className="mb-3 text-[0.64rem] font-bold uppercase tracking-[0.24em] text-gold-bright">
                By Invitation · Waiting List
            </div>
            <h3 className="mb-3 font-display text-2xl  font-bold sm:text-3xl">
                Reserve your seat for {city}
            </h3>
            <p className="mx-auto mb-7 max-w-[440px] text-[0.85rem] leading-relaxed text-[#a89f89]">
                {typeof seatsRemaining === "number"
                    ? `Only ${seatsRemaining} seats remain. `
                    : ""}
                Seats are released to active INVICTUS members first. Join the
                waiting list to be contacted when your spot opens in {country}.
            </p>

            {isActionable ? (
                <button
                    type="button"
                    onClick={onProceedToCheckout}
                    disabled={isCheckingOut}
                    className="border rounded-xl cursor-pointer border-gold-bright/70 bg-gold-bright/10 px-7 py-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-gold-bright transition-colors duration-300 hover:bg-gold-bright/20 disabled:opacity-60"
                >
                    {isCheckingOut
                        ? "Redirecting to checkout..."
                        : bookingStatus === "invited"
                          ? "Complete your booking →"
                          : "Resume payment →"}
                </button>
            ) : status ? (
                <button className="inline-flex items-center gap-2 border border-gold-bright/40 bg-gold-bright/10 px-7 py-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-gold-bright cursor-not-allowed">
                    <StatusIcon icon={status.icon} />
                    {status.label}
                </button>
            ) : (
                <AlertDialog
                    open={open}
                    onOpenChange={(next) => !isBooking && setOpen(next)}
                >
                    <AlertDialogTrigger>
                        <button
                            type="button"
                            disabled={isBooking}
                            className="border  rounded-lg cursor-pointer border-gold-bright/70 bg-gold-bright/10 px-4 sm:px-7 py-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-gold-bright transition-colors duration-300 hover:bg-gold-bright/20 disabled:opacity-60"
                        >
                            {status === "waitlisted"
                                ? "Wishlisted"
                                : status === "confirmed"
                                  ? "Seat Confirmed"
                                  : "Reserve a spot on the waiting list"}
                        </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Join the waiting list for {city}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                You&apos;ll be added to the waiting list for the{" "}
                                {city}, {country} retreat. Seats go to active
                                INVICTUS members first — we&apos;ll reach out if
                                a spot opens up for you.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isBooking}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault(); // stay open until the dispatch settles, handled above
                                    handleConfirm();
                                }}
                                disabled={isBooking}
                                className="border  rounded-xl cursor-pointer border-gold-bright/70 bg-gold/90  px-7 py-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-gold-bright/90 disabled:opacity-60"
                            >
                                {isBooking
                                    ? "Reserving..."
                                    : "Confirm reservation"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {bookingMessage && (
                <p className="mt-4 text-xs text-gold-bright">
                    {bookingMessage}
                </p>
            )}
        </div>
    );
}
