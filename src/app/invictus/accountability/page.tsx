"use client";

import { useEffect, useMemo, useState } from "react";
import ProgressBar from "@/components/accountability/ProgressBar";
import StatusDot from "@/components/accountability/statusDot";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionHeader from "@/components/common/SectionHeader";
import SectionCard from "@/components/common/SectionCard";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import {
    createMentorBooking,
    fetchMyMentor,
    fetchMyMentorBookings,
    selectCompletedMentorBookings,
    selectMentorBookingError,
    selectMentorBookingStatus,
    selectMyMentor,
    selectUpcomingConfirmedBooking,
} from "@/lib/features/mentorBooking/mentorBookingSlice";
import type { IMentorBooking } from "@/lib/features/mentorBooking/mentorBookingTypes";

import {
    CalendarDays,
    Check,
    Clock,
    Loader2,
    PlayCircle,
    Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import SessionHistorySkeleton from "@/components/invictus/academy/accountibility/SessionHistorySkeleton";
import MentorSectionSkeleton from "@/components/invictus/academy/accountibility/MentorSectionSkeleton";
import NextSessionSkeleton from "@/components/invictus/academy/accountibility/NextSessionSkeleton";
/* -------------------------------------------------------------------------- */
/*  Mock data — replace with real data fetched from your backend               */
/* -------------------------------------------------------------------------- */

const SLOT_INTERVAL_MINUTES = 30;

function getDayName(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
    })
        .format(date)
        .toLowerCase();
}

function parseTime(time: string) {
    const [hours, minutes] = time.split(":").map(Number);

    return {
        hours,
        minutes,
    };
}

function setTimeOnDate(date: Date, time: string) {
    const { hours, minutes } = parseTime(time);

    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);

    return result;
}

function generateTimeSlots(
    date: Date,
    startTime: string,
    endTime: string,
    durationMinutes: number,
) {
    const start = setTimeOnDate(date, startTime);
    const end = setTimeOnDate(date, endTime);

    const slots: Date[] = [];

    let cursor = new Date(start);

    while (cursor.getTime() + durationMinutes * 60 * 1000 <= end.getTime()) {
        slots.push(new Date(cursor));

        cursor = new Date(cursor.getTime() + SLOT_INTERVAL_MINUTES * 60 * 1000);
    }

    return slots;
}

const pillars = [
    {
        name: "Fearless Pillar",
        active: true,
        progress: 78,
        modules: [
            { label: "Module 1", status: "Complete", meta: "Watch time: 45m" },
            { label: "Module 2", status: "Available", meta: "Watch time: 32m" },
            { label: "Module 3", status: "Locked", meta: "" },
        ],
    },
    {
        name: "Limitless Pillar",
        active: false,
        progress: 0,
        modules: [],
    },
    {
        name: "Borderless Pillar",
        active: false,
        progress: 0,
        modules: [],
    },
];

const overallProgress = 35;

export default function MyAccountabilityPage() {
    const [journalEntry, setJournalEntry] = useState("");
    const [bookingOpen, setBookingOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState<Date | undefined>();
    const [recordingOpen, setRecordingOpen] = useState(false);
    const [activeRecordingBooking, setActiveRecordingBooking] =
        useState<IMentorBooking | null>(null);
    const dispatch = useAppDispatch();
    const myMentor = useAppSelector(selectMyMentor);
    const completedBookings = useAppSelector(selectCompletedMentorBookings);
    const {
        myMentor: myMentorStatus,
        list: bookingListStatus,
        create: createBookingStatus,
    } = useAppSelector(selectMentorBookingStatus);
    const error = useAppSelector(selectMentorBookingError);
    const upcomingBooking = useAppSelector(selectUpcomingConfirmedBooking);
    const isMentorLoading = myMentorStatus === "loading";
    const isBookingsLoading = bookingListStatus === "loading";
    const isBooking = createBookingStatus === "loading";
    const isError =
        myMentorStatus === "failed" || bookingListStatus === "failed";
    const primaryMentorProfile = myMentor?.primaryMentor?.mentorProfile;
    const primaryMentor = myMentor?.primaryMentor?.mentor;
    const coMentor = myMentor?.coMentor?.mentor;

    const availability = primaryMentorProfile?.availability ?? [];

    const availableDays = useMemo(() => {
        if (!availability.length) return [];

        const days: Date[] = [];

        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const dayName = getDayName(date);

            const hasAvailability = availability.some(
                (item) => item.day.toLowerCase() === dayName,
            );

            if (hasAvailability) {
                days.push(date);
            }
        }

        return days;
    }, [availability]);

    const selectedAvailability = useMemo(() => {
        if (!selectedDate) return null;

        const dayName = getDayName(selectedDate);

        return (
            availability.find((item) => item.day.toLowerCase() === dayName) ??
            null
        );
    }, [availability, selectedDate]);

    const timeSlots = useMemo(() => {
        if (!selectedDate || !selectedAvailability) {
            return [];
        }

        return generateTimeSlots(
            selectedDate,
            selectedAvailability.startTime,
            selectedAvailability.endTime,
            primaryMentorProfile?.sessionDurationMinutes ?? 60,
        );
    }, [
        selectedDate,
        selectedAvailability,
        primaryMentorProfile?.sessionDurationMinutes,
    ]);

    const isDateAvailable = (date: Date) => {
        return availableDays.some(
            (availableDate) =>
                availableDate.toDateString() === date.toDateString(),
        );
    };

    const handleBooking = async () => {
        if (!selectedTime || !primaryMentor) return;

        try {
            await dispatch(
                createMentorBooking({
                    leadMentor: primaryMentor._id,
                    coMentor: coMentor?._id,
                    scheduledStartTime: selectedTime.toISOString(),
                    timezone:
                        selectedAvailability?.timezone ?? "America/New_York",
                }),
            ).unwrap();

            setBookingOpen(false);
            setSelectedDate(undefined);
            setSelectedTime(undefined);

            await dispatch(fetchMyMentorBookings());
            await dispatch(fetchMyMentor());
        } catch (error) {
            console.error("Booking failed:", error);
        }
    };

    const handleWatchRecap = (booking: IMentorBooking) => {
        setActiveRecordingBooking(booking);
        setRecordingOpen(true);
    };

    useEffect(() => {
        dispatch(fetchMyMentor());
        dispatch(fetchMyMentorBookings());
        dispatch(fetchMyMentorBookings({ status: "completed" }));
    }, [dispatch]);

    return (
        <div className="">
            <PageContainer variant="invictus" as="main">
                {/* Header */}
                <div className="mb-10">
                    <PageHeader
                        variant="invictus"
                        eyebrow="My Accountability"
                        title={
                            <>
                                Your challenge. Your mentors.
                                <br />
                                Your progress.
                            </>
                        }
                        titleClassName="text-[28px] sm:text-[34px] leading-[1.25]"
                    />
                </div>

                {/* Active challenge */}
                <SectionCard variant="light" className="mb-6">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9C9284]">
                        Active Challenge
                    </p>
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#B8923D]">
                            Fearless
                        </h2>
                        <span className="whitespace-nowrap text-sm font-medium text-[#8A8375]">
                            42% complete
                        </span>
                    </div>
                    <ProgressBar value={42} className="mt-3" />
                </SectionCard>

                {isMentorLoading ? (
                    <MentorSectionSkeleton />
                ) : (
                    <SectionCard variant="invictus" className="mb-6">
                        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A88A3F]">
                            Your Mentorship Team
                        </p>

                        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-lg border border-[#EFE6CE] bg-white px-5 py-3 min-h-25">
                                {primaryMentor?.profileImage ? (
                                    <img
                                        src={primaryMentor.profileImage}
                                        alt={primaryMentor.fullName}
                                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFE1BD] font-[family-name:var(--font-display)] text-sm font-semibold text-[#8A6E22]">
                                        {primaryMentor?.fullName
                                            ?.split(" ")
                                            .map((name) => name[0])
                                            .slice(0, 2)
                                            .join("")}
                                    </div>
                                )}

                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9C9284]">
                                        Lead Mentor
                                    </p>

                                    <p className="text-md font-semibold text-[#1C1A16]">
                                        {primaryMentor?.fullName ?? "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-lg border border-[#EFE6CE] bg-white px-5 py-3 min-h-25">
                                {myMentor?.coMentor?.mentor?.profileImage ? (
                                    <img
                                        src={
                                            myMentor.coMentor.mentor
                                                .profileImage
                                        }
                                        alt={myMentor.coMentor.mentor.fullName}
                                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFE1BD] font-[family-name:var(--font-display)] text-sm font-semibold text-[#8A6E22]">
                                        {myMentor?.coMentor?.mentor?.fullName
                                            ?.split(" ")
                                            .map((name) => name[0])
                                            .slice(0, 2)
                                            .join("") ?? "CM"}
                                    </div>
                                )}

                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9C9284]">
                                        Co-Mentor
                                    </p>

                                    <p className="text-md font-semibold text-[#1C1A16]">
                                        {myMentor?.coMentor?.mentor?.fullName ??
                                            "Not assigned"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled={
                                !primaryMentorProfile || !!upcomingBooking
                            }
                            onClick={() => setBookingOpen(true)}
                            className="w-full rounded-md bg-[#C6A34A] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#B8923D] disabled:cursor-not-allowed disabled:bg-[#E9E2D2] disabled:text-[#B0A996]"
                        >
                            {upcomingBooking
                                ? "You already have an upcoming session"
                                : "Book your accountability session — with both mentors"}
                        </button>
                    </SectionCard>
                )}

                {/* Next session */}
                {isBookingsLoading ? (
                    <NextSessionSkeleton />
                ) : (
                    <SectionCard
                        variant="invictus"
                        className="mb-10 flex items-center justify-between gap-4"
                    >
                        <div>
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9C9284]">
                                Next Session
                            </p>

                            {upcomingBooking ? (
                                <>
                                    <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1C1A16]">
                                        {new Date(
                                            upcomingBooking.scheduledStartTime,
                                        ).toLocaleString(undefined, {
                                            weekday: "long",
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                        })}
                                    </p>

                                    <p className="text-sm text-[#8A8375]">
                                        Accountability session with{" "}
                                        {primaryMentor?.fullName}
                                        {myMentor?.coMentor?.mentor?.fullName
                                            ? ` and ${myMentor.coMentor.mentor.fullName}`
                                            : ""}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1C1A16]">
                                        No upcoming session
                                    </p>

                                    <p className="text-sm text-[#8A8375]">
                                        Book your next accountability session
                                        with your mentors.
                                    </p>
                                </>
                            )}
                        </div>

                        {upcomingBooking && (
                            <button
                                type="button"
                                className="flex shrink-0 items-center gap-2 rounded-md bg-[#C6A34A] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#B8923D]"
                            >
                                <Video size={14} />
                                Join
                            </button>
                        )}
                    </SectionCard>
                )}

                {/* Member progress report */}
                <SectionHeader
                    variant="invictus"
                    title="Member Progress Report"
                />
                <SectionCard variant="invictus" className="mb-4">
                    <div className="divide-y divide-[#F0EBDE]">
                        {pillars.map((pillar) => (
                            <div
                                key={pillar.name}
                                className="py-4 first:pt-0 last:pb-0"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <p
                                        className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
                                            pillar.active
                                                ? "text-[#1C1A16]"
                                                : "text-[#C7C0B0]"
                                        }`}
                                    >
                                        {pillar.name}
                                    </p>
                                    {pillar.active && (
                                        <span className="text-sm font-medium text-[#8A8375]">
                                            {pillar.progress}%
                                        </span>
                                    )}
                                </div>

                                {pillar.active ? (
                                    <>
                                        <ul className="space-y-2">
                                            {pillar.modules.map((mod) => (
                                                <li
                                                    key={mod.label}
                                                    className="flex items-center justify-between text-sm"
                                                >
                                                    <span className="flex items-center gap-2 text-[#4A4539]">
                                                        <StatusDot
                                                            status={mod.status}
                                                        />
                                                        {mod.label} —{" "}
                                                        {mod.status}
                                                    </span>
                                                    {mod.meta && (
                                                        <span className="text-xs text-[#B0A996]">
                                                            {mod.meta}
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                        <ProgressBar
                                            value={pillar.progress}
                                            className="mt-4"
                                        />
                                    </>
                                ) : (
                                    <p className="text-sm text-[#C7C0B0]">
                                        Unlocks after Fearless is complete
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-[#F0EBDE] pt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9C9284]">
                            Overall Success Rate
                        </p>
                        <span className="text-sm font-medium text-[#8A8375]">
                            {overallProgress}%
                        </span>
                    </div>
                    <ProgressBar value={overallProgress} className="mt-2" />
                </SectionCard>

                <button
                    type="button"
                    className="mb-10 w-full rounded-md border border-[#DECDB0] cursor-pointer bg-[#FAF6EE] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#A88A3F] transition-colors hover:bg-[#FBF3DC]"
                >
                    Download my progress report
                </button>

                {/* Session history — real completed bookings, with recap playback */}
                <SectionHeader variant="invictus" title="Session History" />
                <section className="mb-10 space-y-3">
                    {isBookingsLoading ? (
                        <SessionHistorySkeleton />
                    ) : completedBookings.length === 0 ? (
                        <div className="rounded-xl border border-[#E9E2D2] bg-white p-5 text-center text-sm text-[#8A8375]">
                            No completed sessions yet.
                        </div>
                    ) : (
                        completedBookings.map((booking) => {
                            const hasRecording = Boolean(
                                booking.recording?.secureUrl,
                            );

                            const sessionDate = booking.completedAt
                                ? new Date(booking.completedAt)
                                : new Date(booking.scheduledStartTime);

                            const mentorNames = [
                                booking.leadMentor?.fullName,
                                booking.coMentor?.fullName,
                            ]
                                .filter(Boolean)
                                .join(" & ");

                            return (
                                <div
                                    key={booking._id}
                                    className="flex items-center justify-between gap-4 rounded-xl border border-[#E9E2D2] bg-white p-5"
                                >
                                    <div className="min-w-0">
                                        <p className="mb-1 text-sm font-semibold text-[#1C1A16]">
                                            {sessionDate.toLocaleDateString(
                                                undefined,
                                                {
                                                    month: "short",
                                                    day: "numeric",
                                                },
                                            )}{" "}
                                            <span className="font-normal text-[#B0A996]">
                                                · {booking.durationMinutes} min
                                            </span>
                                        </p>
                                        <p className="truncate text-sm text-[#8A8375]">
                                            {booking.recordingTitle ??
                                                booking.sessionTopic ??
                                                (mentorNames
                                                    ? `Session with ${mentorNames}`
                                                    : "Accountability session")}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={!hasRecording}
                                        onClick={() =>
                                            handleWatchRecap(booking)
                                        }
                                        className="cursor-pointer flex shrink-0 items-center gap-1.5 rounded-md border border-[#E9E2D2] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#8A8375] transition-colors hover:border-[#DDBB6E] hover:text-[#A88A3F] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#E9E2D2] disabled:hover:text-[#8A8375]"
                                    >
                                        <PlayCircle size={13} />
                                        {hasRecording
                                            ? "Watch session recap"
                                            : "Recording unavailable"}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </section>

                <SectionHeader
                    variant="invictus"
                    title="Progress Journal"
                    description="Private to you and your mentors."
                />
                <SectionCard variant="invictus" className="p-5">
                    <textarea
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                        placeholder="What did you commit to this week? What did you actually do?"
                        rows={4}
                        className="w-full resize-none rounded-md border border-[#E9E2D2] bg-[#FDFCF9] p-3 text-sm text-[#1C1A16] outline-none placeholder:text-[#B0A996] focus:border-[#C6A34A]"
                    />
                    <div className="mt-3 flex justify-end">
                        <button
                            type="button"
                            disabled={!journalEntry.trim()}
                            className="rounded-md bg-[#C6A34A] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white cursor-pointer transition-colors hover:bg-[#B8923D] disabled:cursor-not-allowed disabled:bg-[#E9E2D2] disabled:text-[#B0A996]"
                        >
                            Save entry
                        </button>
                    </div>
                </SectionCard>

                {/* Booking dialog */}
                <Dialog
                    open={bookingOpen}
                    onOpenChange={(open) => {
                        setBookingOpen(open);

                        if (!open) {
                            setSelectedDate(undefined);
                            setSelectedTime(undefined);
                        }
                    }}
                >
                    <DialogContent
                        className="
            w-[calc(100%-2rem)]
            max-w-[760px]
            overflow-hidden
            border-[#E9E2D2]
            bg-[#FBF9F4]
            p-5
            text-[#1C1A16]
            sm:p-6
        "
                    >
                        <DialogHeader className="space-y-2">
                            <DialogTitle className="font-[family-name:var(--font-display)] text-xl sm:text-2xl">
                                Book your accountability session
                            </DialogTitle>

                            <DialogDescription className="max-w-[620px] text-sm leading-relaxed text-[#8A8375]">
                                Choose a time based on {primaryMentor?.fullName}
                                &apos;s availability. Your session will be with
                                your primary mentor and co-mentor.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Main booking area */}
                        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
                            {/* =========================
                Calendar
            ========================== */}
                            <div className="min-w-0 rounded-xl border border-[#E9E2D2] bg-white p-3 sm:p-4">
                                <div className="mb-3 flex items-start gap-2 px-1">
                                    <CalendarDays
                                        size={16}
                                        className="mt-0.5 shrink-0 text-[#A88A3F]"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9C9284]">
                                            Choose a date
                                        </p>

                                        <p className="text-xs leading-relaxed text-[#B0A996]">
                                            Based on your primary mentor&apos;s
                                            availability
                                        </p>
                                    </div>
                                </div>

                                {/* Calendar wrapper */}
                                <div className="flex w-full justify-center overflow-hidden">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => {
                                            setSelectedDate(date);
                                            setSelectedTime(undefined);
                                        }}
                                        disabled={(date) => {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);

                                            return (
                                                date < today ||
                                                !isDateAvailable(date)
                                            );
                                        }}
                                        className="w-full max-w-[300px]"
                                    />
                                </div>
                            </div>

                            <div className="min-w-0 rounded-xl border border-[#E9E2D2] bg-white p-4 sm:p-5">
                                <div className="mb-4 flex items-start gap-2">
                                    <Clock
                                        size={16}
                                        className="mt-0.5 shrink-0 text-[#A88A3F]"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9C9284]">
                                            Available times
                                        </p>

                                        {selectedDate && (
                                            <p className="mt-0.5 truncate text-sm font-medium text-[#1C1A16]">
                                                {selectedDate.toLocaleDateString(
                                                    undefined,
                                                    {
                                                        weekday: "long",
                                                        month: "short",
                                                        day: "numeric",
                                                    },
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {!selectedDate ? (
                                    <div className="flex min-h-[260px] items-center justify-center px-4 text-center">
                                        <div>
                                            <CalendarDays
                                                size={24}
                                                className="mx-auto mb-3 text-[#C8BFAE]"
                                            />

                                            <p className="text-sm font-medium text-[#8A8375]">
                                                Select a date first
                                            </p>

                                            <p className="mt-1 max-w-[180px] text-xs leading-relaxed text-[#B0A996]">
                                                Available days are highlighted
                                                in the calendar.
                                            </p>
                                        </div>
                                    </div>
                                ) : timeSlots.length === 0 ? (
                                    <div className="flex min-h-[260px] items-center justify-center px-4 text-center">
                                        <p className="text-sm text-[#8A8375]">
                                            No available times for this date.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid max-h-[260px] grid-cols-2 gap-2 overflow-y-auto pr-1">
                                        {timeSlots.map((slot) => {
                                            const selected =
                                                selectedTime?.getTime() ===
                                                slot.getTime();

                                            return (
                                                <button
                                                    key={slot.toISOString()}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedTime(slot)
                                                    }
                                                    className={`
                                        min-w-0
                                        rounded-lg
                                        border
                                        px-2
                                        py-2.5
                                        text-sm
                                        font-medium
                                        transition-colors
                                        sm:px-3
                                        ${
                                            selected
                                                ? "border-[#C6A34A] bg-[#F7EFD9] text-[#8A6E22]"
                                                : "border-[#E9E2D2] bg-[#FDFCF9] text-[#4A4539] hover:border-[#C6A34A] hover:bg-[#FBF3DC]"
                                        }
                                    `}
                                                >
                                                    {slot.toLocaleTimeString(
                                                        undefined,
                                                        {
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                        },
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedTime && (
                            <div className="rounded-lg border border-[#EFE6CE] bg-[#FAF6EE] p-3 sm:p-4">
                                <div className="flex items-start gap-3">
                                    <Check
                                        size={18}
                                        className="mt-0.5 shrink-0 text-[#A88A3F]"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#1C1A16]">
                                            {selectedTime.toLocaleDateString(
                                                undefined,
                                                {
                                                    weekday: "long",
                                                    month: "long",
                                                    day: "numeric",
                                                },
                                            )}
                                        </p>

                                        <p className="mt-1 text-sm text-[#8A8375]">
                                            {selectedTime.toLocaleTimeString(
                                                undefined,
                                                {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                },
                                            )}{" "}
                                            ·{" "}
                                            {primaryMentorProfile?.sessionDurationMinutes ??
                                                60}{" "}
                                            min
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* =========================
            Footer
        ========================== */}
                        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setBookingOpen(false)}
                                className="w-full border-[#E9E2D2] bg-white sm:w-auto"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                disabled={!selectedTime || isBooking}
                                onClick={handleBooking}
                                className="w-full bg-[#C6A34A] text-white hover:bg-[#B8923D] sm:w-auto"
                            >
                                {isBooking ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Booking...
                                    </>
                                ) : (
                                    "Confirm session"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Recording playback dialog */}
                <Dialog
                    open={recordingOpen}
                    onOpenChange={(open) => {
                        setRecordingOpen(open);
                        if (!open) {
                            setActiveRecordingBooking(null);
                        }
                    }}
                >
                    <DialogContent
                        className="
       w-full
   
    max-h-[90vh]
    overflow-hidden
    border-[#E9E2D2]
    bg-[#0B0A08]
    p-0
    mx-auto
    text-white
 
  "
                    >
                        {/* Header */}
                        <div className="w-full max-w-[625px] flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 pr-12">
                            <div className="min-w-0 flex-1">
                                <h2 className="truncate font-[family-name:var(--font-display)] text-lg font-semibold text-white">
                                    {activeRecordingBooking?.recordingTitle ??
                                        "Session recap"}
                                </h2>

                                <p className="mt-1 text-sm text-[#B0A996]">
                                    {activeRecordingBooking
                                        ? new Date(
                                              activeRecordingBooking.completedAt ??
                                                  activeRecordingBooking.scheduledStartTime,
                                          ).toLocaleDateString(undefined, {
                                              weekday: "long",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : ""}
                                </p>
                            </div>
                        </div>

                        {/* Video */}
                        <div className="p-5 pt-4">
                            {activeRecordingBooking?.recording?.secureUrl ? (
                                <video
                                    key={activeRecordingBooking._id}
                                    controls
                                    autoPlay
                                    playsInline
                                    poster={
                                        activeRecordingBooking.recording
                                            .thumbnailUrl
                                    }
                                    className="aspect-video w-full rounded-lg bg-black object-contain"
                                >
                                    <source
                                        src={
                                            activeRecordingBooking.recording
                                                .secureUrl
                                        }
                                        type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <p className="text-sm text-[#B0A996]">
                                    Recording unavailable.
                                </p>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </PageContainer>
        </div>
    );
};