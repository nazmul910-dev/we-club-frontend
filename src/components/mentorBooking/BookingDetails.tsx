import {
    cancelAdminMentorBooking,
    confirmAdminMentorBooking,
    selectMentorBookingStatus,
} from "@/lib/features/mentorBooking/mentorBookingSlice";
import { IMentorBooking } from "@/lib/features/mentorBooking/mentorBookingTypes";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { formatDate2 } from "@/lib/utils/Helpers";
import { Button } from "../ui/button";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";

export default function BookingDetails({
    booking,
}: {
    booking: IMentorBooking;
}) {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectMentorBookingStatus);
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmForm, setConfirmForm] = useState({
        sessionTopic: booking.sessionTopic || "",
        meetingUrl: booking.meetingUrl || "",
        notes: booking.notes || "",
    });

    const handleCancel = async () => {
        if (!cancelReason.trim()) return;

        const result = await dispatch(
            cancelAdminMentorBooking({
                id: booking._id,
                payload: {
                    reason: cancelReason.trim(),
                },
            }),
        );

        if (cancelAdminMentorBooking.fulfilled.match(result)) {
            setShowCancelForm(false);
            setCancelReason("");
        }
    };

    const handleConfirm = async () => {
        if (
            !confirmForm.sessionTopic.trim() ||
            !confirmForm.meetingUrl.trim()
        ) {
            return;
        }

        const result = await dispatch(
            confirmAdminMentorBooking({
                id: booking._id,
                payload: {
                    sessionTopic: confirmForm.sessionTopic.trim(),
                    meetingUrl: confirmForm.meetingUrl.trim(),
                    ...(confirmForm.notes.trim()
                        ? {
                              notes: confirmForm.notes.trim(),
                          }
                        : {}),
                },
            }),
        );

        if (confirmAdminMentorBooking.fulfilled.match(result)) {
            setConfirmDialogOpen(false);
        }
    };

    const handleNoShow = async () => {
        await dispatch(
            // @ts-expect-error
            markAdminMentorBookingNoShow({
                id: booking._id,
                payload: {
                    noShowBy: "member",
                },
            }),
        );
    };

    return (
        <div className="mt-8 space-y-6">
            <div>
                <StatusBadge status={booking.status} />

                <h2 className="mt-3 text-xl font-semibold text-gray-900">
                    {booking.sessionTopic || "Accountability session"}
                </h2>
            </div>

            <div className="space-y-5 rounded-xl border border-[#E9E2D2] bg-gray-50 p-5">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Member
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                        {booking.member?.fullName}
                    </p>

                    <p className="text-sm text-gray-500">
                        {booking.member?.email}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Lead mentor
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                        {booking.leadMentor?.fullName}
                    </p>

                    <p className="text-sm text-gray-500">
                        {booking.leadMentor?.email}
                    </p>
                </div>

                {booking.coMentor && (
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Co-mentor
                        </p>

                        <p className="mt-1 font-medium text-gray-900">
                            {booking.coMentor.fullName}
                        </p>

                        <p className="text-sm text-gray-500">
                            {booking.coMentor.email}
                        </p>
                    </div>
                )}

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Scheduled time
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                        {formatDate2(
                            booking.scheduledStartTime,
                            booking.timezone,
                        )}
                    </p>

                    <p className="text-sm text-gray-500">
                        {booking.durationMinutes} minutes · {booking.timezone}
                    </p>
                </div>
            </div>

            {booking.notes && (
                <div>
                    <p className="text-sm font-medium text-gray-900">Notes</p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {booking.notes}
                    </p>
                </div>
            )}

            {booking.meetingUrl && (
                <Button className="w-full">
                    <a
                        href={booking.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open meeting
                    </a>
                </Button>
            )}

            {/* Requested */}
            {booking.status === "requested" && (
                <div className="space-y-2">
                    {/* This button ONLY opens the dialog */}
                    <Button
                        className="w-full"
                        onClick={() => setConfirmDialogOpen(true)}
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Confirm booking
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700"
                        onClick={() => setShowCancelForm(true)}
                    >
                        Cancel booking
                    </Button>
                </div>
            )}

            <Dialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Confirm mentor session</DialogTitle>

                        <DialogDescription>
                            Add the session details before confirming this
                            booking. The member will receive the confirmed
                            session information.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-4">
                        {/* Session Topic */}
                        <div className="space-y-2">
                            <Label htmlFor="session-topic">Session topic</Label>

                            <Input
                                id="session-topic"
                                value={confirmForm.sessionTopic}
                                onChange={(event) =>
                                    setConfirmForm((prev) => ({
                                        ...prev,
                                        sessionTopic: event.target.value,
                                    }))
                                }
                                placeholder="e.g. Weekly accountability session"
                            />
                        </div>

                        {/* Meeting URL */}
                        <div className="space-y-2">
                            <Label htmlFor="meeting-url">Meeting URL</Label>

                            <Input
                                id="meeting-url"
                                type="url"
                                value={confirmForm.meetingUrl}
                                onChange={(event) =>
                                    setConfirmForm((prev) => ({
                                        ...prev,
                                        meetingUrl: event.target.value,
                                    }))
                                }
                                placeholder="https://zoom.us/..."
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="booking-notes">
                                Notes{" "}
                                <span className="font-normal text-muted-foreground">
                                    (optional)
                                </span>
                            </Label>

                            <textarea
                                id="booking-notes"
                                value={confirmForm.notes}
                                onChange={(event) =>
                                    setConfirmForm((prev) => ({
                                        ...prev,
                                        notes: event.target.value,
                                    }))
                                }
                                placeholder="Add any additional information..."
                                className="flex min-h-[110px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirmDialogOpen(false)}
                            disabled={status.adminConfirm === "loading"}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            onClick={handleConfirm}
                            disabled={
                                !confirmForm.sessionTopic.trim() ||
                                !confirmForm.meetingUrl.trim() ||
                                status.adminConfirm === "loading"
                            }
                        >
                            {status.adminConfirm === "loading" ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Confirming...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Confirm booking
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmed */}
            {booking.status === "confirmed" && (
                <div className="space-y-2">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            // Connect your edit dialog here.
                        }}
                    >
                        Edit booking
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleNoShow}
                        disabled={status.adminNoShow === "loading"}
                    >
                        {status.adminNoShow === "loading"
                            ? "Updating..."
                            : "Mark no-show"}
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700"
                        onClick={() => setShowCancelForm(true)}
                    >
                        Cancel booking
                    </Button>
                </div>
            )}

            {/* Cancel form */}
            {showCancelForm && (
                <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">
                        Cancellation reason
                    </p>

                    <textarea
                        value={cancelReason}
                        onChange={(event) =>
                            setCancelReason(event.target.value)
                        }
                        placeholder="Enter the reason for cancellation..."
                        className="min-h-[100px] w-full resize-none rounded-lg border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200"
                    />

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setShowCancelForm(false);
                                setCancelReason("");
                            }}
                        >
                            Back
                        </Button>

                        <Button
                            className="flex-1 bg-red-600 text-white hover:bg-red-700"
                            onClick={handleCancel}
                            disabled={
                                !cancelReason.trim() ||
                                status.adminCancel === "loading"
                            }
                        >
                            {status.adminCancel === "loading"
                                ? "Cancelling..."
                                : "Confirm cancellation"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Completed */}
            {booking.status === "completed" && booking.recording?.secureUrl && (
                <Button className="w-full">
                    <a
                        href={booking.recording.secureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Watch recording
                    </a>
                </Button>
            )}

            {booking.status === "no_show" && (
                <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-600">
                    This booking has been marked as a no-show.
                </div>
            )}

            {booking.status === "cancelled" && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">
                        Booking cancelled
                    </p>

                    {booking.cancellationReason && (
                        <p className="mt-1 text-sm text-red-700">
                            {booking.cancellationReason}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
