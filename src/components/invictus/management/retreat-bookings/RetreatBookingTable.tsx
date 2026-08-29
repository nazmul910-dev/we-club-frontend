"use client";

import { Check, Eye, Mail, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import type { RetreatBooking } from "@/lib/features/retreat/retreatTypes";
import {
  formatDate,
  formatDateRange,
  formatMoney,
  getBookingBatch,
  getBookingLocation,
  getBookingMember,
} from "./retreatBookingHelpers";
import RetreatBookingStatusBadge from "./RetreatBookingStatusBadge";

export type RetreatBookingDialogMode =
  | "invite"
  | "confirm"
  | "cancel"
  | "refund"
  | "details";

interface Props {
  data: RetreatBooking[];
  onAction: (booking: RetreatBooking, mode: RetreatBookingDialogMode) => void;
}

export default function RetreatBookingTable({ data, onAction }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-[#E7DDCC] bg-white text-[#8A8175]">
        <p className="font-medium text-[#1C1A17]">No bookings in this view</p>
        <p className="mt-1 text-sm">Try another status or retreat location.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E7DDCC] bg-white p-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Retreat</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((booking) => {
            const member = getBookingMember(booking.user);
            const batch = getBookingBatch(booking.retreatBatch);
            const location = getBookingLocation(booking.retreatLocation);
            const canInvite =
              booking.status === "waitlisted" || booking.status === "invited";
            const canConfirm =
              booking.status === "waitlisted" ||
              booking.status === "invited" ||
              booking.status === "payment_pending";
            const canCancel =
              booking.status !== "cancelled" && booking.status !== "refunded";
            const canRefund = booking.status === "confirmed";

            return (
              <TableRow key={booking._id}>
                <TableCell className="max-w-[200px]">
                  <p className="truncate font-medium text-[#1C1A17]">
                    {member?.fullName || "Member"}
                  </p>
                  <p className="truncate text-xs text-[#8A8175]">
                    {member?.email || "—"}
                  </p>
                </TableCell>
                <TableCell className="max-w-[180px]">
                  <p className="truncate text-[#1C1A17]">
                    {location?.title || "—"}
                  </p>
                  <p className="truncate text-xs text-[#8A8175]">
                    {[location?.city, location?.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-[#1C1A17]">{batch?.batchName || "—"}</p>
                  <p className="text-xs text-[#8A8175]">
                    {formatDateRange(batch?.startDate, batch?.endDate)}
                  </p>
                </TableCell>
                <TableCell className="text-[#8A8175]">
                  {formatMoney(booking.amount, booking.currency)}
                </TableCell>
                <TableCell>
                  <RetreatBookingStatusBadge status={booking.status} />
                </TableCell>
                <TableCell className="text-[#8A8175]">
                  {formatDate(booking.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="cursor-pointer"
                      title="View details"
                      onClick={() => onAction(booking, "details")}
                    >
                      <Eye size={15} />
                    </Button>
                    {canInvite && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer text-[#B08A3E]"
                        title="Invite"
                        onClick={() => onAction(booking, "invite")}
                      >
                        <Mail size={15} />
                      </Button>
                    )}
                    {canConfirm && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer text-green-600"
                        title="Approve / confirm"
                        onClick={() => onAction(booking, "confirm")}
                      >
                        <Check size={15} />
                      </Button>
                    )}
                    {canRefund && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer text-rose-600"
                        title="Refund"
                        onClick={() => onAction(booking, "refund")}
                      >
                        <RotateCcw size={15} />
                      </Button>
                    )}
                    {canCancel && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer text-red-500"
                        title="Cancel"
                        onClick={() => onAction(booking, "cancel")}
                      >
                        <X size={15} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
