"use client";

import { useState } from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
    confirmAdminMentorBooking,
    selectMentorBookingStatus,
} from "@/lib/features/mentorBooking/mentorBookingSlice";
import type { IMentorBooking } from "@/lib/features/mentorBooking/mentorBookingTypes";

import {
    dialogContentClass,
    dialogDescriptionClass,
    dialogTitleClass,
    inputClass,
    outlineButtonClass,
    primaryButtonClass,
    sectionLabelClass,
    textareaClass,
} from "./bookingDesignTokens";

interface ConfirmBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: IMentorBooking;
}

export default function ConfirmBookingDialog({
    open,
    onOpenChange,
    booking,
}: ConfirmBookingDialogProps) {
    const dispatch = useAppDispatch();
    const { adminConfirm } = useAppSelector(selectMentorBookingStatus);
    const isConfirming = adminConfirm === "loading";

    const [form, setForm] = useState({
        sessionTopic: booking.sessionTopic ?? "",
        meetingUrl: booking.meetingUrl ?? "",
        notes: booking.notes ?? "",
    });

    const canSubmit =
        form.sessionTopic.trim().length > 0 &&
        form.meetingUrl.trim().length > 0 &&
        !isConfirming;

    const handleConfirm = async () => {
        if (!canSubmit) return;

        const result = await dispatch(
            confirmAdminMentorBooking({
                id: booking._id,
                payload: {
                    sessionTopic: form.sessionTopic.trim(),
                    meetingUrl: form.meetingUrl.trim(),
                    ...(form.notes.trim()
                        ? { notes: form.notes.trim() }
                        : {}),
                },
            }),
        );

        if (confirmAdminMentorBooking.fulfilled.match(result)) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={dialogContentClass}>
                <DialogHeader className="space-y-2">
                    <DialogTitle className={dialogTitleClass}>
                        Confirm mentor session
                    </DialogTitle>

                    <DialogDescription className={dialogDescriptionClass}>
                        Add the session details before confirming this
                        booking. The member will receive the confirmed
                        session information.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="session-topic" className={sectionLabelClass}>
                            Session topic
                        </Label>

                        <Input
                            id="session-topic"
                            value={form.sessionTopic}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    sessionTopic: event.target.value,
                                }))
                            }
                            placeholder="e.g. Weekly accountability session"
                            className={inputClass}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="meeting-url" className={sectionLabelClass}>
                            Meeting URL
                        </Label>

                        <Input
                            id="meeting-url"
                            type="url"
                            value={form.meetingUrl}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    meetingUrl: event.target.value,
                                }))
                            }
                            placeholder="https://zoom.us/..."
                            className={inputClass}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="booking-notes" className={sectionLabelClass}>
                            Notes{" "}
                            <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                                (optional)
                            </span>
                        </Label>

                        <textarea
                            id="booking-notes"
                            value={form.notes}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    notes: event.target.value,
                                }))
                            }
                            placeholder="Add any additional information..."
                            className={textareaClass}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isConfirming}
                        className={outlineButtonClass}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!canSubmit}
                        className={primaryButtonClass}
                    >
                        {isConfirming ? (
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
    );
}
