"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface SendLinkConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
  userEmail?: string;
  isSending: boolean;
  onConfirm: () => void;
}

export default function SendLinkConfirmModal({
  open,
  onOpenChange,
  userName,
  userEmail,
  isSending,
  onConfirm,
}: SendLinkConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-neutral-800 bg-[#0B0B0B] text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Send Payment Link
          </DialogTitle>

          <DialogDescription className="text-neutral-400">
            This will email the payment link to{" "}
            <span className="text-yellow-400">{userName}</span>
            {userEmail ? ` (${userEmail})` : ""}. Continue?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
            className="h-11 cursor-pointer rounded-xl border border-neutral-700 px-6 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSending}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending && <Loader2 size={16} className="animate-spin" />}
            {isSending ? "Sending..." : "Yes, Send Link"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}