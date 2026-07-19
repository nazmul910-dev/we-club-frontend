"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useAppSelector } from "@/lib/redux/store/hook";
import CommissionModal from "./commission-modal";
import { Commission } from "@/lib/features/commissionLedger/types";

interface Props {
  commission: Commission;
}

export default function CommissionSentCell({ commission }: Props) {
  const [modal, setModal] = useState(false);
  const user = useAppSelector((state) => state.authUser.user);

  const isListingOwner = Boolean(
    user?.id && commission.listing_owner_id?._id === user.id
  );

  const sentAt = commission.payment_tracking?.sent_at;

  // Listing owner can send payment once the commission is confirmed and
  // hasn't already been sent.
  const canSend =
    isListingOwner && commission.status === "confirmed" && !sentAt;

    console.log("set: ",canSend)

  return (
    <div className="flex items-center gap-2">
      {sentAt ? (
        <span className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs uppercase tracking-wider text-yellow-400">
          Sent
        </span>
      ) : (
        <span className="inline-block rounded-full border border-[#332b18] bg-[#2a2a2a] px-3 py-1 text-xs uppercase tracking-wider text-[#888]">
          Not Sent
        </span>
      )}

      {canSend && (
        <button
          onClick={() => setModal(true)}
          title="Send Payment"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#332b18] bg-[#111] text-[#C9A962] transition hover:border-[#C9A962] hover:bg-[#1a1a1a]"
        >
          <Send size={13} />
        </button>
      )}

      {modal && (
        <CommissionModal
          commission={commission}
          type="send"
          close={() => setModal(false)}
        />
      )}
    </div>
  );
}