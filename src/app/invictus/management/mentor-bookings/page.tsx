"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



import { cancelAdminMentorBooking, clearSelectedMentorBooking, confirmAdminMentorBooking, fetchAdminMentorBooking, fetchAllMentorBookings, selectAdminMentorBookings, selectAdminMentorBookingsMeta, selectMentorBookingError, selectMentorBookingStatus, selectSelectedMentorBooking } from "@/lib/features/mentorBooking/mentorBookingSlice";
import { IMentorBooking, MentorBookingStatus } from "@/lib/features/mentorBooking/mentorBookingTypes";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import StatCard from "@/components/mentorBooking/StatCard";
import BookingSkeleton from "@/components/mentorBooking/BookingSkeleton";
import StatusBadge from "@/components/mentorBooking/StatusBadge";
import BookingDetails from "@/components/mentorBooking/BookingDetails";

const STATUS_LABELS: Record<MentorBookingStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

function formatDate(date: string, timezone?: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone || undefined,
  }).format(new Date(date));
}






export default function MentorSessionBookingPage() {
  const dispatch = useAppDispatch();

  const bookings = useAppSelector(selectAdminMentorBookings);
  const meta = useAppSelector(selectAdminMentorBookingsMeta);
  const selectedBooking = useAppSelector(selectSelectedMentorBooking);
  const error = useAppSelector(selectMentorBookingError);
  const status = useAppSelector(selectMentorBookingStatus);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    MentorBookingStatus | "all"
  >("all");

  const [page, setPage] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const loadBookings = () => {
    dispatch(
      fetchAllMentorBookings({
        page,
        limit: 20,
        ...(statusFilter !== "all"
          ? { status: statusFilter }
          : {}),
      }),
    );
  };

  useEffect(() => {
    loadBookings();
  }, [page, statusFilter]);

  const filteredBookings = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return bookings;
    }

    return bookings.filter((booking) => {
      const memberName =
        booking.member?.fullName?.toLowerCase() ?? "";

      const memberEmail =
        booking.member?.email?.toLowerCase() ?? "";

      const leadMentor =
        booking.leadMentor?.fullName?.toLowerCase() ?? "";

      const leadMentorEmail =
        booking.leadMentor?.email?.toLowerCase() ?? "";

      const coMentor =
        booking.coMentor?.fullName?.toLowerCase() ?? "";

      return (
        memberName.includes(value) ||
        memberEmail.includes(value) ||
        leadMentor.includes(value) ||
        leadMentorEmail.includes(value) ||
        coMentor.includes(value)
      );
    });
  }, [bookings, search]);

  const stats = useMemo(() => {
    return {
      total: meta?.total ?? bookings.length,

      requested: bookings.filter(
        (booking) => booking.status === "requested",
      ).length,

      confirmed: bookings.filter(
        (booking) => booking.status === "confirmed",
      ).length,

      completed: bookings.filter(
        (booking) => booking.status === "completed",
      ).length,

      cancelled: bookings.filter(
        (booking) => booking.status === "cancelled",
      ).length,
    };
  }, [bookings, meta]);

  const openBooking = (booking: IMentorBooking) => {
    setDetailsOpen(true);

    dispatch(fetchAdminMentorBooking(booking._id));
  };

  return (
    <main className="min-h-screen bg-[#FBF9F4] px-6 py-8">
      <div className="mx-auto max-w-[1600px] space-y-8">
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
            variant="outline"
            onClick={loadBookings}
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

            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total"
            value={stats.total}
            icon={Users}
          />

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
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search member or mentor..."
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

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
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
                    <th className="px-6 py-4">Lead mentor</th>
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
                      (_, index) => (
                        <BookingSkeleton key={index} />
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
                            {booking.member?.fullName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {booking.member?.email}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {booking.leadMentor?.fullName}
                          </p>

                          {booking.coMentor && (
                            <p className="text-xs text-gray-500">
                              Co:{" "}
                              {booking.coMentor.fullName}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {booking.sessionTopic ||
                              "Accountability session"}
                          </p>

                          <p className="text-xs text-gray-500">
                            {formatDate(
                              booking.scheduledStartTime,
                              booking.timezone,
                            )}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {booking.durationMinutes} min
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge
                            status={booking.status}
                          />
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              openBooking(booking)
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
              <div className="flex items-center justify-between border-t px-6 py-4">
                <p className="text-sm text-gray-500">
                  Page {meta.page} of {meta.totalPages}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() =>
                      setPage((current) =>
                        Math.max(1, current - 1),
                      )
                    }
                  >
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      page >= meta.totalPages
                    }
                    onClick={() =>
                      setPage((current) =>
                        Math.min(
                          meta.totalPages,
                          current + 1,
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

      {/* Booking Details */}
      <Sheet
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);

          if (!open) {
            dispatch(clearSelectedMentorBooking());
          }
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Booking details</SheetTitle>

            <SheetDescription>
              Review and manage this mentor session.
            </SheetDescription>
          </SheetHeader>

          {status.adminSingle === "loading" ? (
            <div className="mt-8 space-y-4">
              <div className="h-6 w-24 animate-pulse rounded bg-gray-100" />
              <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
            </div>
          ) : selectedBooking ? (
            <BookingDetails booking={selectedBooking} />
          ) : (
            <div className="mt-8 text-sm text-gray-500">
              Unable to load booking details.
            </div>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}

