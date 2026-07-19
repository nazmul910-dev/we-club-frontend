"use client";

import { useState } from "react";
import { PackageCheck } from "lucide-react";
import { useAppSelector } from "@/lib/redux/store/hook";
import CommissionModal from "./commission-modal";
import { Commission } from "@/lib/features/commissionLedger/types";

interface Props {
  commission: Commission;
}

export default function CommissionReceivedCell({ commission }: Props) {
  const [modal, setModal] = useState(false);
  const user = useAppSelector((state) => state.authUser.user);

  console.log("user11:",user)
  console.log("userprormoter:",commission.promoter_id)
  console.log("pame:",commission)

  const isPromoter = Boolean(
    user?.id && commission.promoter_id?._id === user.id
  );

  const sentAt = commission.payment_tracking?.sent_at;
  const receivedAt = commission.payment_tracking?.receiver_confirmed_at;

  console.log("setAt: ",sentAt)
  console.log("resAt: ",receivedAt)

  // Promoter can confirm receipt only after the listing owner has sent
  // payment, and only once.
  const canReceive = isPromoter && Boolean(sentAt) && !receivedAt;

  console.log("rece: ",canReceive)

  return (
    <div className="flex items-center gap-2">
      {receivedAt ? (
        <span className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs uppercase tracking-wider text-green-400">
          Received
        </span>
      ) : (
        <span className="inline-block rounded-full border border-[#332b18] bg-[#2a2a2a] px-3 py-1 text-xs uppercase tracking-wider text-[#888]">
          Not Received
        </span>
      )}

      {canReceive && (
        <button
          onClick={() => setModal(true)}
          title="Confirm Received"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#332b18] bg-[#111] text-[#C9A962] transition hover:border-[#C9A962] hover:bg-[#1a1a1a]"
        >
          <PackageCheck size={13} />
        </button>
      )}

      {modal && (
        <CommissionModal
          commission={commission}
          type="receive"
          close={() => setModal(false)}
        />
      )}
    </div>
  );
}