"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    CalendarDays,
    CheckCircle2,
    Clock,
    Eye,
    RefreshCw,
    Search,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import type { AppDispatch } from "@/lib/redux/store/store";
import {
    clearAdminSelectedBooking,
    fetchAdminMentorBookings,
    fetchSingleMentorBookingAdmin,
    selectAdminMentorBookings,
    selectAdminMentorBookingsMeta,
    selectAdminSelectedBooking,
    selectMentorBookingError,
    selectMentorBookingStatus,
} from "@/lib/features/mentorBooking/mentorBookingSlice";
import {
    IMentorBooking,
    MentorBookingStatus,
} from "@/lib/features/mentorBooking/mentorBookingTypes";

import StatCard from "@/components/mentorBooking/StatCard";

import BookingSkeleton from "@/components/mentorBooking/BookingSkeleton";
import { formatDate2 } from "@/lib/utils/Helpers";
import StatusBadge from "@/components/mentorBooking/StatusBadge";
import BookingDetails from "@/components/mentorBooking/BookingDetails";
import { PageContainer } from "@/components/common";

const STATUS_LABELS = {
    requested: "Requested",
    confirmed: "Confirmed",
    completed: "Completed",
    no_show: "Mark No Show",
} as const;

export default function AdminMentorBookingsPage() {
    const dispatch = useDispatch<AppDispatch>();

    const bookings = useSelector(selectAdminMentorBookings);
    const meta = useSelector(selectAdminMentorBookingsMeta);
    const status = useSelector(selectMentorBookingStatus);
    const selectedBooking = useSelector(selectAdminSelectedBooking);
    const error = useSelector(selectMentorBookingError);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        MentorBookingStatus | "all"
    >("all");
    const [page, setPage] = useState(1);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [requestedBookingId, setRequestedBookingId] = useState<string | null>(
        null,
    );

    // Prevents any possibility of double-fetching the same booking
    const isFetchingRef = useRef(false);

    // ---- Load list ----
    const loadBookings = useCallback(() => {
        dispatch(
            fetchAdminMentorBookings({
                page,
                limit: 20,
                status: statusFilter === "all" ? undefined : statusFilter,
            }),
        );
    }, [dispatch, page, statusFilter]);

    useEffect(() => {
        loadBookings();
    }, [loadBookings]);

    const handleRefresh = () => {
        loadBookings();
    };

    // ---- Open details (safe – can never loop) ----
    const openBooking = useCallback(
        (booking: IMentorBooking) => {
            setDetailsOpen(true);
            setRequestedBookingId(booking._id);

            // Hard guard
            if (isFetchingRef.current) return;
            if (selectedBooking?._id === booking._id) return;

            isFetchingRef.current = true;

            dispatch(fetchSingleMentorBookingAdmin(booking._id)).finally(() => {
                isFetchingRef.current = false;
            });
        },
        [dispatch, selectedBooking?._id],
    );

    const handleDetailsOpenChange = useCallback(
        (open: boolean) => {
            setDetailsOpen(open);
            if (!open) {
                setRequestedBookingId(null);
                isFetchingRef.current = false;
                dispatch(clearAdminSelectedBooking());
            }
        },
        [dispatch],
    );

    // ---- Client-side search ----
    const filteredBookings = useMemo(() => {
        if (!search.trim()) return bookings;

        const q = search.toLowerCase();
        return bookings.filter((b) => {
            const member = b.member?.fullName?.toLowerCase() || "";
            const memberEmail = b.member?.email?.toLowerCase() || "";
            const mentor = b.leadMentor?.fullName?.toLowerCase() || "";
            const topic = b.sessionTopic?.toLowerCase() || "";

            return (
                member.includes(q) ||
                memberEmail.includes(q) ||
                mentor.includes(q) ||
                topic.includes(q)
            );
        });
    }, [bookings, search]);

    // ---- Stats (page-level) ----
    const stats = useMemo(() => {
        const base = {
            total: meta?.total ?? bookings.length,
            requested: 0,
            confirmed: 0,
            completed: 0,
            cancelled: 0,
        };

        bookings.forEach((b) => {
            if (b.status === "requested") base.requested += 1;
            if (b.status === "confirmed") base.confirmed += 1;
            if (b.status === "completed") base.completed += 1;
            if (b.status === "cancelled") base.cancelled += 1;
        });

        return base;
    }, [bookings, meta]);

    return (
        <PageContainer className="min-h-screen bg-[#FBF9F4] px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-[1600px] space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-[#1C1C1C]">
                            Mentor Session Bookings
                        </h1>
                        <p className="mt-1 text-sm text-[#6B6B6B]">
                            Manage, review and coordinate all mentor
                            accountability sessions.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={status.adminList === "loading"}
                        className="w-fit"
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${
                                status.adminList === "loading"
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />
                        {status.adminList === "loading"
                            ? "Refreshing..."
                            : "Refresh"}
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard title="Total" value={stats.total} icon={Users} />
                    <StatCard
                        title="Requested"
                        value={stats.requested}
                        icon={Clock}
                    />
                    <StatCard
                        title="Confirmed"
                        value={stats.confirmed}
                        icon={CheckCircle2}
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completed}
                        icon={CheckCircle2}
                    />
                    <StatCard
                        title="Cancelled"
                        value={stats.cancelled}
                        icon={CalendarDays}
                    />
                </div>

                {/* Filters */}
                <Card className="border-[#E9E2D2] bg-white">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-3 lg:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search member, mentor or session..."
                                    className="pl-9"
                                />
                            </div>

                            <Select
                                value={statusFilter}
                                onValueChange={(value) => {
                                    setStatusFilter(
                                        value as MentorBookingStatus | "all",
                                    );
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-full lg:w-[190px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All statuses
                                    </SelectItem>
                                    {Object.entries(STATUS_LABELS).map(
                                        ([value, label]) => (
                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* List Error */}
                {error && status.adminList === "failed" && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Bookings Table */}
                <Card className="overflow-hidden border-[#E9E2D2] bg-white">
                    <CardHeader className="border-b border-[#E9E2D2]">
                        <CardTitle className="text-base">
                            Mentor session bookings
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px]">
                                <thead>
                                    <tr className="border-b bg-gray-50/70 text-left text-xs uppercase tracking-wide text-gray-500">
                                        <th className="px-6 py-4">Member</th>
                                        <th className="px-6 py-4">
                                            Lead mentor
                                        </th>
                                        <th className="px-6 py-4">Session</th>
                                        <th className="px-6 py-4">Duration</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {status.adminList === "loading" ? (
                                        Array.from({ length: 6 }).map(
                                            (_, i) => (
                                                <BookingSkeleton key={i} />
                                            ),
                                        )
                                    ) : filteredBookings.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-16 text-center"
                                            >
                                                <CalendarDays className="mx-auto h-10 w-10 text-gray-300" />
                                                <p className="mt-3 font-medium text-gray-700">
                                                    No mentor bookings found
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Try changing your search or
                                                    status filter.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBookings.map((booking) => (
                                            <tr
                                                key={booking._id}
                                                className="border-b last:border-0 hover:bg-gray-50/50"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900">
                                                        {booking.member
                                                            ?.fullName ||
                                                            "Unknown member"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {booking.member
                                                            ?.email || "—"}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900">
                                                        {booking.leadMentor
                                                            ?.fullName ||
                                                            "Unknown mentor"}
                                                    </p>
                                                    {booking.coMentor && (
                                                        <p className="text-xs text-gray-500">
                                                            Co:{" "}
                                                            {
                                                                booking.coMentor
                                                                    .fullName
                                                            }
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <p className="max-w-[300px] truncate font-medium text-gray-900">
                                                        {booking.sessionTopic ||
                                                            "Accountability session"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate2(
                                                            booking.scheduledStartTime,
                                                            booking.timezone,
                                                        )}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {booking.durationMinutes}{" "}
                                                    min
                                                </td>

                                                <td className="px-6 py-4">
                                                    <StatusBadge
                                                        status={booking.status}
                                                    />
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            openBooking(booking)
                                                        }
                                                        disabled={
                                                            status.adminFetchSingle ===
                                                            "loading"
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {meta && meta.totalPages > 1 && (
                            <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-gray-500">
                                    Page {meta.page} of {meta.totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            page <= 1 ||
                                            status.adminList === "loading"
                                        }
                                        onClick={() =>
                                            setPage((p) => Math.max(1, p - 1))
                                        }
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            page >= meta.totalPages ||
                                            status.adminList === "loading"
                                        }
                                        onClick={() =>
                                            setPage((p) =>
                                                Math.min(
                                                    meta.totalPages,
                                                    p + 1,
                                                ),
                                            )
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Booking Details Sheet */}
            <Sheet open={detailsOpen} onOpenChange={handleDetailsOpenChange}>
                <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>Booking details</SheetTitle>
                        <SheetDescription>
                            Review and manage this mentor session.
                        </SheetDescription>
                    </SheetHeader>

                    {status.adminFetchSingle === "loading" && (
                        <div className="mt-8 space-y-4">
                            <div className="h-6 w-32 animate-pulse rounded bg-gray-100" />
                            <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
                            <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
                            <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
                        </div>
                    )}

                    {status.adminFetchSingle === "failed" && (
                        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-4">
                            <p className="text-sm font-medium text-red-700">
                                Unable to load booking details.
                            </p>
                            {error && (
                                <p className="mt-1 text-sm text-red-600">
                                    {error}
                                </p>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={() => {
                                    if (requestedBookingId) {
                                        isFetchingRef.current = true;
                                        dispatch(
                                            fetchSingleMentorBookingAdmin(
                                                requestedBookingId,
                                            ),
                                        ).finally(() => {
                                            isFetchingRef.current = false;
                                        });
                                    }
                                }}
                            >
                                Try again
                            </Button>
                        </div>
                    )}

                    {status.adminFetchSingle === "succeeded" &&
                        selectedBooking && (
                            <div className="mt-6">
                                <BookingDetails booking={selectedBooking} />
                            </div>
                        )}
                </SheetContent>
            </Sheet>
        </PageContainer>
    );
}
