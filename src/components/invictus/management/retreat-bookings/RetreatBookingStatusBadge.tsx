"use client";

import { Badge } from "@/components/ui/Badge";
import type { RetreatBookingStatus } from "@/lib/features/retreat/retreatTypes";
import { STATUS_LABELS } from "./retreatBookingHelpers";

const statusClass: Record<RetreatBookingStatus, string> = {
  waitlisted: "border-transparent bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]",
  invited: "border-transparent bg-sky-100 text-sky-700 hover:bg-sky-100",
  payment_pending:
    "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-100",
  confirmed: "border-transparent bg-green-100 text-green-700 hover:bg-green-100",
  cancelled: "border-transparent bg-gray-200 text-gray-600 hover:bg-gray-200",
  refunded: "border-transparent bg-rose-100 text-rose-700 hover:bg-rose-100",
};

export default function RetreatBookingStatusBadge({
  status,
}: {
  status: RetreatBookingStatus;
}) {
  return <Badge className={statusClass[status]}>{STATUS_LABELS[status]}</Badge>;
}
