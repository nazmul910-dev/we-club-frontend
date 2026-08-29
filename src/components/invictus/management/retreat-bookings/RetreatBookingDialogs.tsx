"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import type { RetreatBooking } from "@/lib/features/retreat/retreatTypes";
import {
  formatEmergencyContact,
  formatMoney,
  getBookingBatch,
  getBookingLocation,
  getBookingMember,
} from "./retreatBookingHelpers";
import RetreatBookingStatusBadge from "./RetreatBookingStatusBadge";

type DialogMode = "invite" | "confirm" | "cancel" | "refund" | "details";

interface Props {
  booking: RetreatBooking | null;
  mode: DialogMode | null;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onInvite: (payload: { invitationExpiresInHours: number; notes?: string }) => void;
  onConfirm: (payload: { amountPaid?: number; notes?: string }) => void;
  onCancel: (reason: string) => void;
  onRefund: (payload: { refundAmount?: number; reason?: string }) => void;
}

const fieldClass =
  "mt-2 w-full rounded-xl border border-[#E7DDCC] bg-white p-3 text-sm text-[#1C1A17] outline-none focus:border-[#B08A3E]";

export default function RetreatBookingDialogs({
  booking,
  mode,
  loading = false,
  error,
  onClose,
  onInvite,
  onConfirm,
  onCancel,
  onRefund,
}: Props) {
  const [inviteHours, setInviteHours] = useState(72);
  const [inviteNotes, setInviteNotes] = useState("");
  const [confirmAmount, setConfirmAmount] = useState("");
  const [confirmNotes, setConfirmNotes] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  const open = Boolean(booking && mode);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setInviteHours(72);
      setInviteNotes("");
      setConfirmAmount("");
      setConfirmNotes("");
      setCancelReason("");
      setRefundAmount("");
      setRefundReason("");
      onClose();
    }
  };

  const member = booking ? getBookingMember(booking.user) : null;
  const batch = booking ? getBookingBatch(booking.retreatBatch) : null;
  const location = booking ? getBookingLocation(booking.retreatLocation) : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        {mode === "invite" && booking && (
          <>
            <DialogHeader>
              <DialogTitle className="font-playfair text-2xl text-[#1C1A17]">
                Invite member
              </DialogTitle>
              <DialogDescription className="text-[#8A8175]">
                Send {member?.fullName || "this member"} an invitation to complete
                their retreat booking.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Invitation expires in (hours)</Label>
                <input
                  type="number"
                  min={1}
                  max={720}
                  value={inviteHours}
                  onChange={(e) => setInviteHours(Number(e.target.value))}
                  className={fieldClass}
                />
              </div>
              <div>
                <Label>Notes (optional)</Label>
                <textarea
                  rows={3}
                  value={inviteNotes}
                  onChange={(e) => setInviteNotes(e.target.value)}
                  className={fieldClass}
                  placeholder="Internal or member-facing notes"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <DialogFooter>
              <Button
                variant="outline"
                className="cursor-pointer border-[#E7DDCC]"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer bg-[#B08A3E] text-white hover:bg-[#B08A3E]/90"
                disabled={loading || inviteHours < 1}
                onClick={() =>
                  onInvite({
                    invitationExpiresInHours: inviteHours,
                    notes: inviteNotes.trim() || undefined,
                  })
                }
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send invitation
              </Button>
            </DialogFooter>
          </>
        )}

        {mode === "confirm" && booking && (
          <>
            <DialogHeader>
              <DialogTitle className="font-playfair text-2xl text-[#1C1A17]">
                Approve booking
              </DialogTitle>
              <DialogDescription className="text-[#8A8175]">
                Confirm this seat for {member?.fullName || "the member"} without
                waiting for checkout.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Amount paid (optional)</Label>
                <input
                  type="number"
                  min={0}
                  value={confirmAmount}
                  onChange={(e) => setConfirmAmount(e.target.value)}
                  className={fieldClass}
                  placeholder={String(booking.amount)}
                />
              </div>
              <div>
                <Label>Notes (optional)</Label>
                <textarea
                  rows={3}
                  value={confirmNotes}
                  onChange={(e) => setConfirmNotes(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <DialogFooter>
              <Button
                variant="outline"
                className="cursor-pointer border-[#E7DDCC]"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer bg-green-600 text-white hover:bg-green-700"
                disabled={loading}
                onClick={() =>
                  onConfirm({
                    amountPaid: confirmAmount
                      ? Number(confirmAmount)
                      : undefined,
                    notes: confirmNotes.trim() || undefined,
                  })
                }
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm seat
              </Button>
            </DialogFooter>
          </>
        )}

        {mode === "cancel" && booking && (
          <>
            <DialogHeader>
              <DialogTitle className="font-playfair text-2xl text-[#1C1A17]">
                Cancel booking
              </DialogTitle>
              <DialogDescription className="text-[#8A8175]">
                The member will be notified with this reason.
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label>Reason</Label>
              <textarea
                rows={4}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className={fieldClass}
                placeholder="Minimum 3 characters"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <DialogFooter>
              <Button
                variant="outline"
                className="cursor-pointer border-[#E7DDCC]"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Keep booking
              </Button>
              <Button
                className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
                disabled={loading || cancelReason.trim().length < 3}
                onClick={() => onCancel(cancelReason.trim())}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cancel booking
              </Button>
            </DialogFooter>
          </>
        )}

        {mode === "refund" && booking && (
          <>
            <DialogHeader>
              <DialogTitle className="font-playfair text-2xl text-[#1C1A17]">
                Mark as refunded
              </DialogTitle>
              <DialogDescription className="text-[#8A8175]">
                This frees the confirmed seat on the batch.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Refund amount (optional)</Label>
                <input
                  type="number"
                  min={0}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className={fieldClass}
                  placeholder={String(booking.amountPaid ?? booking.amount)}
                />
              </div>
              <div>
                <Label>Reason (optional)</Label>
                <textarea
                  rows={3}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <DialogFooter>
              <Button
                variant="outline"
                className="cursor-pointer border-[#E7DDCC]"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
                disabled={loading}
                onClick={() =>
                  onRefund({
                    refundAmount: refundAmount
                      ? Number(refundAmount)
                      : undefined,
                    reason: refundReason.trim() || undefined,
                  })
                }
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Refund
              </Button>
            </DialogFooter>
          </>
        )}

        {mode === "details" && booking && (
          <>
            <DialogHeader>
              <DialogTitle className="font-playfair text-2xl text-[#1C1A17]">
                Booking details
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-[#8A8175]">
                <RetreatBookingStatusBadge status={booking.status} />
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm text-[#5C5348]">
              <DetailRow label="Member" value={member?.fullName || "—"} />
              <DetailRow label="Email" value={member?.email || "—"} />
              <DetailRow
                label="Retreat"
                value={location?.title || "—"}
              />
              <DetailRow
                label="Batch"
                value={batch?.batchName || "—"}
              />
              <DetailRow
                label="Amount"
                value={formatMoney(booking.amount, booking.currency)}
              />
              <DetailRow
                label="Paid"
                value={
                  booking.amountPaid != null
                    ? formatMoney(booking.amountPaid, booking.currency)
                    : "—"
                }
              />
              <DetailRow
                label="Invitation expires"
                value={
                  booking.invitationExpiresAt
                    ? new Date(booking.invitationExpiresAt).toLocaleString()
                    : "—"
                }
              />
              <DetailRow label="Notes" value={booking.notes || "—"} />
              <DetailRow
                label="Special requests"
                value={booking.specialRequests || "—"}
              />
              <DetailRow
                label="Dietary"
                value={booking.dietaryRequirements || "—"}
              />
              <DetailRow
                label="Emergency contact"
                value={formatEmergencyContact(booking.emergencyContact)}
              />
              <DetailRow
                label="Cancellation"
                value={booking.cancellationReason || "—"}
              />
            </div>
            <DialogFooter>
              <Button
                className="cursor-pointer bg-[#B08A3E] text-white hover:bg-[#B08A3E]/90"
                onClick={() => handleOpenChange(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#F0E8D8] bg-[#FAF8F4] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A69B89]">
        {label}
      </p>
      <p className="mt-1 text-[#1C1A17]">{value}</p>
    </div>
  );
}
