"use client";

import { useState } from "react";
import { CheckCircle2, Video } from "lucide-react";

import type { IMentorBooking } from "@/lib/features/mentorBooking/mentorBookingTypes";
import { formatDate2 } from "@/lib/utils/Helpers";

import StatusBadge from "./StatusBadge";
import { Button } from "../ui/button";
import {
    cardSurfaceClass,
    dangerButtonClass,
    outlineButtonClass,
    primaryButtonClass,
    sectionLabelClass,
} from "./bookingDesignTokens";
// import ConfirmBookingDialog from "./ConfirmBookingDialog";
// import CompleteBookingDialog from "./CompleteBookingDialog";
// import CancelBookingDialog from "./CancelBookingDialog";
// import RecordingViewerDialog from "./RecordingViewerDialog";
// import NoShowBookingDialog from "./NoShowBookingDialog";
import dynamic from "next/dynamic";

const ConfirmBookingDialog = dynamic(() => import("./ConfirmBookingDialog"), {
    ssr: false,
});
const CompleteBookingDialog = dynamic(() => import("./CompleteBookingDialog"), {
    ssr: false,
});
const CancelBookingDialog = dynamic(() => import("./CancelBookingDialog"), {
    ssr: false,
});
const RecordingViewerDialog = dynamic(() => import("./RecordingViewerDialog"), {
    ssr: false,
});
const NoShowBookingDialog = dynamic(() => import("./NoShowBookingDialog"), {
    ssr: false,
});

const MEETING_WINDOW_MS = 60 * 60 * 1000; // 60 minutes

export default function BookingDetails({
    booking,
}: {
    booking: IMentorBooking;
}) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [completeOpen, setCompleteOpen] = useState(false);
    const [noShowOpen, setNoShowOpen] = useState(false);
    const [recordingOpen, setRecordingOpen] = useState(false);

    const scheduledTime = formatDate2(
        booking.scheduledStartTime,
        booking.timezone,
    );

    const scheduledStart = new Date(booking.scheduledStartTime);
    const now = new Date();
    const isMeetingTime =
        now >= scheduledStart &&
        now <= new Date(scheduledStart.getTime() + MEETING_WINDOW_MS);

    const hasRecording = Boolean(booking.recording?.secureUrl);

    return (
        <div className="mt-8 space-y-6 px-4">
            <div>
                <StatusBadge status={booking.status} />

                <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-[#1C1A16]">
                    {booking.sessionTopic || "Accountability session"}
                </h2>
            </div>

            {/* Core details */}
            <div className={`space-y-5 ${cardSurfaceClass}`}>
                <div>
                    <p className={sectionLabelClass}>Member</p>
                    <p className="mt-1 font-medium text-[#1C1A16]">
                        {booking.member?.fullName}
                    </p>
                    <p className="text-sm text-[#8A8375]">
                        {booking.member?.email}
                    </p>
                </div>

                <div>
                    <p className={sectionLabelClass}>Lead mentor</p>
                    <p className="mt-1 font-medium text-[#1C1A16]">
                        {booking.leadMentor?.fullName}
                    </p>
                    <p className="text-sm text-[#8A8375]">
                        {booking.leadMentor?.email}
                    </p>
                </div>

                {booking.coMentor && (
                    <div>
                        <p className={sectionLabelClass}>co_mentor</p>
                        <p className="mt-1 font-medium text-[#1C1A16]">
                            {booking.coMentor.fullName}
                        </p>
                        <p className="text-sm text-[#8A8375]">
                            {booking.coMentor.email}
                        </p>
                    </div>
                )}

                <div>
                    <p className={sectionLabelClass}>Scheduled time</p>
                    <p className="mt-1 font-medium text-[#1C1A16]">
                        {scheduledTime}
                    </p>
                    <p className="text-sm text-[#8A8375]">
                        {booking.durationMinutes} minutes · {booking.timezone}
                    </p>
                </div>
            </div>

            {booking.notes && (
                <div>
                    <p className="text-sm font-medium text-[#1C1A16]">Notes</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#8A8375]">
                        {booking.notes}
                    </p>
                </div>
            )}

            {booking.meetingUrl && booking.status !== "completed" && (
                <a
                    href={isMeetingTime ? booking.meetingUrl : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                >
                    <Button
                        disabled={!isMeetingTime}
                        className={`w-full ${primaryButtonClass}`}
                    >
                        <Video className="mr-2 h-4 w-4" />
                        Open meeting
                    </Button>
                </a>
            )}

            {/* Requested */}
            {booking.status === "requested" && (
                <div className="space-y-2">
                    <Button
                        className={`w-full ${primaryButtonClass}`}
                        onClick={() => setConfirmOpen(true)}
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Confirm booking
                    </Button>

                    <Button
                        variant="outline"
                        className={`w-full ${dangerButtonClass}`}
                        onClick={() => setCancelOpen(true)}
                    >
                        Cancel booking
                    </Button>
                </div>
            )}

            {/* Confirmed */}
            {booking.status === "confirmed" && (
                <div className="space-y-2">
                    <Button
                        variant="outline"
                        className={`w-full ${outlineButtonClass}`}
                        onClick={() => setCompleteOpen(true)}
                    >
                        Complete booking
                    </Button>

                    <Button
                        variant="outline"
                        className={`w-full ${outlineButtonClass}`}
                        onClick={() => setNoShowOpen(true)}
                    >
                        Mark no-show
                    </Button>

                    <Button
                        variant="outline"
                        className={`w-full ${dangerButtonClass}`}
                        onClick={() => setCancelOpen(true)}
                    >
                        Cancel booking
                    </Button>
                </div>
            )}

            {/* Completed */}
            {booking.status === "completed" && hasRecording && (
                <Button
                    className={`w-full ${primaryButtonClass}`}
                    onClick={() => setRecordingOpen(true)}
                >
                    Watch recording
                </Button>
            )}

            {booking.status === "no_show" && (
                <div className={cardSurfaceClass}>
                    <p className="text-sm text-[#8A8375]">
                        This booking has been marked as a no-show.
                    </p>
                </div>
            )}

            {booking.status === "cancelled" && (
                <div className="rounded-xl border border-[#F0D3CE] bg-[#FCEEEC] p-4">
                    <p className="text-sm font-medium text-[#B3413E]">
                        Booking cancelled
                    </p>
                    {booking.cancellationReason && (
                        <p className="mt-1 text-sm text-[#B3413E]/80">
                            {booking.cancellationReason}
                        </p>
                    )}
                </div>
            )}

            {/* Dialogs */}
            {confirmOpen && (
                <ConfirmBookingDialog
                    open={confirmOpen}
                    onOpenChange={setConfirmOpen}
                    booking={booking}
                />
            )}

            {completeOpen && (
                <CompleteBookingDialog
                    open={completeOpen}
                    onOpenChange={setCompleteOpen}
                    booking={booking}
                />
            )}

            {cancelOpen && (
                <CancelBookingDialog
                    open={cancelOpen}
                    onOpenChange={setCancelOpen}
                    booking={booking}
                />
            )}

            {noShowOpen && (
                <NoShowBookingDialog
                    open={noShowOpen}
                    onOpenChange={setNoShowOpen}
                    booking={booking}
                />
            )}

            {recordingOpen && (
                <RecordingViewerDialog
                    open={recordingOpen}
                    onOpenChange={setRecordingOpen}
                    booking={booking}
                />
            )}
        </div>
    );
}
