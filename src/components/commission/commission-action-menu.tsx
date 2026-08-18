"use client";

import { useState } from "react";
import { Pencil, CircleCheck, AlertTriangle, BadgeCheck, ShieldCheck } from "lucide-react";
import { useAppSelector } from "@/lib/redux/store/hook";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CommissionModal from "./commission-modal";

import { Commission } from "@/lib/features/commissionLedger/types";

interface Props {
  commission: Commission;
}

type ModalType = "confirm" | "paid" | "dispute" | "resolve";

const PRIVILEGED_ROLES = ["founder", "manager"];

export default function CommissionActionMenu({ commission }: Props) {
  const [modal, setModal] = useState(false);
  const [type, setType] = useState<ModalType>("confirm");

  const user = useAppSelector((state) => state.authUser.user);

  const isAdminOrManager = Boolean(
    user?.role && PRIVILEGED_ROLES.includes(user.role)
  );

  const receivedAt = commission.payment_tracking?.receiver_confirmed_at;

  const isPaid = commission.status === "paid";

  const openModal = (modalType: ModalType) => {
    setType(modalType);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const hasAnyAction =
    (commission.status === "pending" && isAdminOrManager) ||
    (commission.status === "confirmed" &&
      isAdminOrManager &&
      Boolean(receivedAt)) ||
    (commission.status === "disputed" && isAdminOrManager);

  return (
    <div className="relative inline-block">
      <DropdownMenu>
        <DropdownMenuTrigger disabled={isPaid}>
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[#332b18] bg-[#111] text-[#C9A962] transition ${
              isPaid
                ? "pointer-events-none cursor-not-allowed opacity-40"
                : "cursor-pointer hover:border-[#C9A962] hover:bg-[#1a1a1a]"
            }`}
          >
            <Pencil size={16} />
          </div>
        </DropdownMenuTrigger>

        {!isPaid && (
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-52 border border-[#332b18] bg-[#111]"
          >
            {commission.status === "pending" && isAdminOrManager && (
              <>
                <DropdownMenuItem
                  onClick={() => openModal("confirm")}
                  className="text-green-400 focus:text-green-400"
                >
                  <CircleCheck className="mr-2 h-4 w-4 " />
                  Confirm
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => openModal("dispute")}
                  className="text-red-400 focus:text-red-400"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Dispute
                </DropdownMenuItem>
              </>
            )}

            {commission.status === "confirmed" &&
              isAdminOrManager &&
              receivedAt && (
                <DropdownMenuItem
                  onClick={() => openModal("paid")}
                  className="text-green-400 focus:text-green-400"
                >
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Mark Paid
                </DropdownMenuItem>
              )}

            {commission.status === "disputed" && isAdminOrManager && (
              <DropdownMenuItem
                onClick={() => openModal("resolve")}
                className="text-blue-400 focus:text-blue-400"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Resolve Dispute
              </DropdownMenuItem>
            )}

            {!hasAnyAction && (
              <div className="px-4 py-3 text-sm text-gray-500">
                No action available
              </div>
            )}
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      {modal && (
        <CommissionModal commission={commission} type={type} close={closeModal} />
      )}
    </div>
  );
}