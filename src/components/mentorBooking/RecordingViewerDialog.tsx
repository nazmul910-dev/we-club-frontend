"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

import type { IMentorBooking } from "@/lib/features/mentorBooking/mentorBookingTypes";

import {
    cardSurfaceClass,
    dialogDescriptionClass,
} from "./bookingDesignTokens";

interface RecordingViewerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: IMentorBooking;
}

export default function RecordingViewerDialog({
    open,
    onOpenChange,
    booking,
}: RecordingViewerDialogProps) {
    const recordingUrl =
        booking.recording?.secureUrl ?? booking.recording?.playbackUrl;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] max-w-3xl min-w-0 overflow-hidden rounded-xl border-[#E9E2D2] bg-[#FBF9F4] p-0">
                <DialogHeader className="min-w-0 space-y-1 border-b border-[#E9E2D2] px-5 py-4">
                    <DialogTitle className="min-w-0 truncate whitespace-nowrap pr-8 font-[family-name:var(--font-display)] text-lg font-semibold text-[#1C1A16]">
                        {booking.recordingTitle || "Meeting recording"}
                    </DialogTitle>

                    <DialogDescription className={dialogDescriptionClass}>
                        Review the recording and mentor feedback from this
                        session.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[75vh] min-w-0 overflow-y-auto">
                    <div className="min-w-0 space-y-5 p-5">
                        <div className="min-w-0 overflow-hidden rounded-lg bg-black">
                            {recordingUrl ? (
                                <video
                                    key={booking._id}
                                    src={recordingUrl}
                                    poster={booking.recording?.thumbnailUrl}
                                    controls
                                    playsInline
                                    className="aspect-video w-full object-contain"
                                >
                                    Your browser does not support the video
                                    player.
                                </video>
                            ) : (
                                <div className="flex aspect-video items-center justify-center text-sm text-[#B0A996]">
                                    Recording unavailable
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 space-y-2">
                            <h3 className="text-sm font-medium text-[#1C1A16]">
                                Recording title
                            </h3>

                            <div
                                className={`min-w-0 overflow-hidden ${cardSurfaceClass} py-2.5`}
                            >
                                <p
                                    className="truncate whitespace-nowrap text-sm text-[#1C1A16]"
                                    title={booking.recordingTitle}
                                >
                                    {booking.recordingTitle ||
                                        "Untitled recording"}
                                </p>
                            </div>
                        </div>

                        <div className="min-w-0 space-y-2">
                            <h3 className="text-sm font-medium text-[#1C1A16]">
                                Mentor feedback
                            </h3>

                            <div
                                className={`min-w-0 overflow-hidden ${cardSurfaceClass}`}
                            >
                                {booking.mentorFeedback ? (
                                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#8A8375]">
                                        {booking.mentorFeedback}
                                    </p>
                                ) : (
                                    <p className="text-sm text-[#8A8375]">
                                        No mentor feedback was provided for this
                                        session.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
