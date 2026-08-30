"use client";

import { useState } from "react";
import { CheckCircle2, FileVideo, RefreshCw } from "lucide-react";

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
    completeAdminMentorBooking,
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
} from "./bookingDesignTokens";

interface CompleteBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: IMentorBooking;
}

export default function CompleteBookingDialog({
    open,
    onOpenChange,
    booking,
}: CompleteBookingDialogProps) {
    const dispatch = useAppDispatch();
    const { adminComplete } = useAppSelector(selectMentorBookingStatus);
    const isCompleting = adminComplete === "loading";

    const [form, setForm] = useState<{
        recordingFile: File | null;
        recordingTitle: string;
        mentorFeedback: string;
    }>({
        recordingFile: null,
        recordingTitle: "",
        mentorFeedback: "",
    });

    const canSubmit =
        form.recordingTitle.trim().length > 0 &&
        Boolean(form.recordingFile) &&
        !isCompleting;

    const handleComplete = async () => {
        if (!canSubmit || !form.recordingFile) return;

        const result = await dispatch(
            completeAdminMentorBooking({
                id: booking._id,
                payload: {
                    recordingTitle: form.recordingTitle.trim(),
                    recordingFile: form.recordingFile,
                    ...(form.mentorFeedback.trim()
                        ? { mentorFeedback: form.mentorFeedback.trim() }
                        : {}),
                },
            }),
        );

        if (completeAdminMentorBooking.fulfilled.match(result)) {
            onOpenChange(false);
            setForm({
                recordingFile: null,
                recordingTitle: "",
                mentorFeedback: "",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={dialogContentClass}>
                <DialogHeader className="min-w-0 space-y-2">
                    <DialogTitle className={dialogTitleClass}>
                        Add meeting recording
                    </DialogTitle>

                    <DialogDescription className={dialogDescriptionClass}>
                        Upload the recording of this mentor session and give
                        it a title. The recording will be available to the
                        member once saved.
                    </DialogDescription>
                </DialogHeader>

                <div className="min-w-0 space-y-5 py-2">
                    <div className="min-w-0 space-y-2">
                        <Label
                            htmlFor="recording-title"
                            className={sectionLabelClass}
                        >
                            Recording title
                        </Label>

                        <Input
                            id="recording-title"
                            value={form.recordingTitle}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    recordingTitle: event.target.value,
                                }))
                            }
                            placeholder="e.g. Weekly accountability session"
                            className={`h-10 w-full min-w-0 ${inputClass}`}
                        />
                    </div>

                    <div className="min-w-0 space-y-2">
                        <Label
                            htmlFor="meeting-recording"
                            className={sectionLabelClass}
                        >
                            Meeting recording
                        </Label>

                        <div className="relative w-full min-w-0">
                            <Input
                                id="meeting-recording"
                                type="file"
                                accept="video/*"
                                onChange={(event) => {
                                    const file =
                                        event.target.files?.[0] ?? null;

                                    setForm((prev) => ({
                                        ...prev,
                                        recordingFile: file,
                                    }));
                                }}
                                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                            />

                            <div className="flex h-11 w-full min-w-0 items-center overflow-hidden rounded-md border border-[#E9E2D2] bg-white">
                                <div className="flex h-full shrink-0 items-center border-r border-[#E9E2D2] bg-[#FAF6EE] px-4 text-sm font-medium text-[#4A4539]">
                                    Choose file
                                </div>

                                <div className="min-w-0 flex-1 overflow-hidden px-3">
                                    <span
                                        className="block truncate whitespace-nowrap text-sm text-[#8A8375]"
                                        title={form.recordingFile?.name}
                                    >
                                        {form.recordingFile
                                            ? form.recordingFile.name
                                            : "No file chosen"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs leading-4 text-[#B0A996]">
                            Supported formats: MP4, WebM, MOV, and similar.
                        </p>

                        {form.recordingFile && (
                            <div className="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-[#E9E2D2] bg-[#FAF6EE] px-3 py-2.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-[#8A8375]">
                                    <FileVideo size={18} />
                                </div>

                                <div className="min-w-0 flex-1 overflow-hidden">
                                    <p
                                        className="truncate whitespace-nowrap text-sm font-medium text-[#1C1A16]"
                                        title={form.recordingFile.name}
                                    >
                                        {form.recordingFile.name}
                                    </p>

                                    <p className="mt-0.5 text-xs text-[#8A8375]">
                                        {(
                                            form.recordingFile.size /
                                            (1024 * 1024)
                                        ).toFixed(2)}{" "}
                                        MB
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 space-y-2">
                        <Label
                            htmlFor="mentor-feedback"
                            className={sectionLabelClass}
                        >
                            Mentor feedback{" "}
                            <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                                (optional)
                            </span>
                        </Label>

                        <textarea
                            id="mentor-feedback"
                            value={form.mentorFeedback}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    mentorFeedback: event.target.value,
                                }))
                            }
                            placeholder="Notes for this member on how the session went..."
                            className="flex min-h-[90px] w-full resize-none rounded-md border border-[#E9E2D2] bg-white px-3 py-2 text-sm text-[#1C1A16] outline-none placeholder:text-[#B0A996] focus-visible:border-[#C6A34A]"
                        />
                    </div>
                </div>

                <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isCompleting}
                        className={`w-full sm:w-auto ${outlineButtonClass}`}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleComplete}
                        disabled={!canSubmit}
                        className={`w-full sm:w-auto ${primaryButtonClass}`}
                    >
                        {isCompleting ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Add recording
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
