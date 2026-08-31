"use client";

import { useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

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
    markAdminMentorBookingNoShow,
    selectMentorBookingStatus,
} from "@/lib/features/mentorBooking/mentorBookingSlice";
import type {
    IMentorBooking,
    NoShowParty,
} from "@/lib/features/mentorBooking/mentorBookingTypes";

import {
    dangerFilledButtonClass,
    dialogContentClass,
    dialogDescriptionClass,
    dialogTitleClass,
    outlineButtonClass,
    sectionLabelClass,
    textareaClass,
} from "./bookingDesignTokens";

interface NoShowBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: IMentorBooking;
}

const NO_SHOW_OPTIONS: { value: NoShowParty; label: string }[] = [
    { value: "member", label: "Member didn't show" },
    { value: "mentor", label: "Mentor didn't show" },
    { value: "both", label: "Neither showed up" },
];

export default function NoShowBookingDialog({
    open,
    onOpenChange,
    booking,
}: NoShowBookingDialogProps) {
    const dispatch = useAppDispatch();
    const { adminNoShow } = useAppSelector(selectMentorBookingStatus);
    const isSubmitting = adminNoShow === "loading";

    const [noShowBy, setNoShowBy] = useState<NoShowParty>("member");
    const [reason, setReason] = useState("");

    const handleSubmit = async () => {
        if (isSubmitting) return;

        const result = await dispatch(
            markAdminMentorBookingNoShow({
                id: booking._id,
                payload: {
                    noShowBy,
                    ...(reason.trim() ? { reason: reason.trim() } : {}),
                },
            }),
        );

        if (markAdminMentorBookingNoShow.fulfilled.match(result)) {
            onOpenChange(false);
            setReason("");
            setNoShowBy("member");
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                onOpenChange(nextOpen);
                if (!nextOpen) {
                    setReason("");
                    setNoShowBy("member");
                }
            }}
        >
            <DialogContent className={dialogContentClass}>
                <DialogHeader className="space-y-2">
                    <DialogTitle className={dialogTitleClass}>
                        Mark as no-show
                    </DialogTitle>

                    <DialogDescription className={dialogDescriptionClass}>
                        Record who didn't attend this session.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    <div className="space-y-2">
                        <p className={sectionLabelClass}>
                            Who missed the session?
                        </p>

                        <div className="flex flex-col gap-2">
                            {NO_SHOW_OPTIONS.map((option) => (
                                <label
                                    key={option.value}
                                    className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-colors ${
                                        noShowBy === option.value
                                            ? "border-[#C6A34A] bg-[#F7EFD9] text-[#8A6E22]"
                                            : "border-[#E9E2D2] bg-white text-[#4A4539] hover:border-[#C6A34A]"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="no-show-by"
                                        value={option.value}
                                        checked={noShowBy === option.value}
                                        onChange={() =>
                                            setNoShowBy(option.value)
                                        }
                                        className="accent-[#C6A34A]"
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="no-show-reason"
                            className={sectionLabelClass}
                        >
                            Notes{" "}
                            <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                                (optional)
                            </span>
                        </label>

                        <textarea
                            id="no-show-reason"
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder="Any additional context..."
                            className={textareaClass}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className={outlineButtonClass}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={dangerFilledButtonClass}
                    >
                        {isSubmitting ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Mark no-show
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
