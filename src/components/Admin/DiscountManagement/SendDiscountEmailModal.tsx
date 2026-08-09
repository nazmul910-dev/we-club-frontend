"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { sendDiscountCodeEmail } from "@/lib/features/discountFounder/discountSlice";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string | null;
}

export default function SendDiscountEmailModal({
  open,
  onOpenChange,
  code,
}: Props) {
  const dispatch = useAppDispatch();

  const sendingId = useAppSelector((state) => state.discount.sendingId);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const isSending = sendingId === code;

  const handleClose = (next: boolean) => {
    if (!next) {
      setEmail("");
      setError("");
    }
    onOpenChange(next);
  };

  const handleSend = async () => {
    if (!code) {
      return;
    }

    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      await dispatch(
        sendDiscountCodeEmail({ email: email.trim(), code })
      ).unwrap();

      toast.success(`Discount code sent to ${email}.`);
      handleClose(false);
    } catch (e: any) {
      setError(e || "Failed to send discount email.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl border border-neutral-800 bg-[#0B0B0B] text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Send Discount Code
          </DialogTitle>

          <DialogDescription className="text-neutral-400">
            Send{" "}
            <span className="text-yellow-400 font-semibold">{code}</span>{" "}
            to a user via email.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/50">
            Recipient Email *
          </label>

          <input
            type="email"
            className="w-full rounded-xl border border-yellow-500/20 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
          />

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="mt-2 gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => handleClose(false)}
            disabled={isSending}
            className="h-11 cursor-pointer rounded-xl border border-neutral-700 px-6 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending && <Loader2 size={16} className="animate-spin" />}
            {isSending ? "Sending..." : "Send Email"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}