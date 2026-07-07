"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useDispatch } from "react-redux";

import CommissionModal from "./commission-modal";

import { Commission } from "@/lib/features/commissionLedger/types";

interface Props {
  commission: Commission;
}

type ModalType =
  | "confirm"
  | "paid"
  | "dispute"
  | "resolve";

export default function CommissionActionMenu({
  commission,
}: Props) {

  const dispatch = useDispatch<any>();

  const [open, setOpen] = useState(false);

  const [modal, setModal] = useState(false);

  const [type, setType] = useState<ModalType>("confirm");

  const openModal = (
    modalType: ModalType
  ) => {

    setType(modalType);

    setModal(true);

    setOpen(false);

  };

  const closeModal = () => {

    setModal(false);

    setOpen(false);

  };
  return (

<div className="relative">

<button
onClick={() => setOpen((prev) => !prev)}
className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#332b18] bg-[#111] text-[#C9A962] transition hover:border-[#C9A962] hover:bg-[#1a1a1a]"
>

<Pencil size={16} />

</button>

{
open && (

<div className="absolute right-0 top-11 z-50 w-52 overflow-hidden rounded-xl border border-[#332b18] bg-[#111] shadow-2xl">

{
commission.status === "pending" && (

<>

<button
onClick={() => openModal("confirm")}
className="block w-full border-b border-[#222] px-4 py-3 text-left text-sm text-white transition hover:bg-[#1a1a1a]"
>
Confirm Commission
</button>

<button
onClick={() => openModal("dispute")}
className="block w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-[#1a1a1a]"
>
Open Dispute
</button>

</>

)
}

{
commission.status === "confirmed" && (

<button
onClick={() => openModal("paid")}
className="block w-full px-4 py-3 text-left text-sm text-green-400 transition hover:bg-[#1a1a1a]"
>
Mark Paid
</button>

)
}

{
commission.status === "disputed" && (

<button
onClick={() => openModal("resolve")}
className="block w-full px-4 py-3 text-left text-sm text-blue-400 transition hover:bg-[#1a1a1a]"
>
Resolve Dispute
</button>

)
}

{
commission.status === "paid" && (

<div className="px-4 py-3 text-sm text-gray-500">
Commission Completed
</div>

)
}

</div>

)

}
{
modal && (

<CommissionModal
commission={commission}
type={type}
close={closeModal}
/>

)

}

</div>

);

}