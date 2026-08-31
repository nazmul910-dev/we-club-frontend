"use client";

import { useState } from "react";
import { RefreshCw, XCircle } from "lucide-react";

import { Button } from "../ui/button";
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
    cancelAdminMentorBooking,
    selectMentorBookingStatus,
} from "@/lib/features/mentorBooking/mentorBookingSlice";
import type { IMentorBooking } from "@/lib/features/mentorBooking/mentorBookingTypes";

import {
    dangerFilledButtonClass,
    dialogContentClass,
    dialogDescriptionClass,
    dialogTitleClass,
    outlineButtonClass,
    sectionLabelClass,
    textareaClass,
} from "./bookingDesignTokens";

interface CancelBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: IMentorBooking;
}

export default function CancelBookingDialog({
    open,
    onOpenChange,
    booking,
}: CancelBookingDialogProps) {
    const dispatch = useAppDispatch();
    const { adminCancel } = useAppSelector(selectMentorBookingStatus);
    const isCancelling = adminCancel === "loading";

    const [reason, setReason] = useState("");

    const canSubmit = reason.trim().length > 0 && !isCancelling;

    const handleCancel = async () => {
        if (!canSubmit) return;

        const result = await dispatch(
            cancelAdminMentorBooking({
                id: booking._id,
                payload: { reason: reason.trim() },
            }),
        );

        if (cancelAdminMentorBooking.fulfilled.match(result)) {
            onOpenChange(false);
            setReason("");
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                onOpenChange(nextOpen);
                if (!nextOpen) setReason("");
            }}
        >
            <DialogContent className={dialogContentClass}>
                <DialogHeader className="space-y-2">
                    <DialogTitle className={dialogTitleClass}>
                        Cancel this booking?
                    </DialogTitle>

                    <DialogDescription className={dialogDescriptionClass}>
                        The member will be notified with the reason you
                        provide below. This cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 py-2">
                    <label
                        htmlFor="cancel-reason"
                        className={sectionLabelClass}
                    >
                        Cancellation reason
                    </label>

                    <textarea
                        id="cancel-reason"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="Enter the reason for cancellation..."
                        className={textareaClass}
                    />
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isCancelling}
                        className={outlineButtonClass}
                    >
                        Back
                    </Button>

                    <Button
                        type="button"
                        onClick={handleCancel}
                        disabled={!canSubmit}
                        className={dangerFilledButtonClass}
                    >
                        {isCancelling ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Cancelling...
                            </>
                        ) : (
                            <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Confirm cancellation
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
