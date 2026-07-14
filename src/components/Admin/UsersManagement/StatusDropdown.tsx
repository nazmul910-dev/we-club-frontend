"use client";

import { useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  onApproval: (status: string) => Promise<any>;
  onLicense: (status: string) => Promise<any>;
  onAccount: (status: string) => Promise<any>;
}

export default function StatusDropdown({
  open,
  onOpenChange,
  onApproval,
  onLicense,
  onAccount,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onOpenChange(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange]);

return (
  <DropdownMenu open={open} onOpenChange={onOpenChange}>
    <DropdownMenuTrigger >
      <button
        type="button"
        className="rounded-lg p-2 text-yellow-400 transition hover:bg-yellow-500/10"
      >
        <MoreVertical size={20} />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      sideOffset={8}
      className="w-56 border border-yellow-500/20 bg-[#111]"
    >
      <DropdownMenuItem
      className="text-green-400 focus:text-green-400"
        onClick={async () => {
          try {
            await onApproval("approved");
            toast.success("User approved successfully.");
          } catch (e: any) {
            toast.error(e?.message || "Failed to approve user.");
          }
        }}
      >
        Approve User
      </DropdownMenuItem>

      <DropdownMenuItem
        className="text-red-400 focus:text-red-400"
        onClick={async () => {
          try {
            await onApproval("rejected");
            toast.success("User rejected successfully.");
          } catch (e: any) {
            toast.error(e?.message || "Failed to reject user.");
          }
        }}
      >
        Reject User
      </DropdownMenuItem>

      <DropdownMenuItem
        className="text-green-400 focus:text-green-400"
        onClick={async () => {
          try {
            await onLicense("verified");
            toast.success("License verified successfully.");
          } catch (e: any) {
            toast.error(e?.message || "Failed to verify license.");
          }
        }}
      >
        Verify License
      </DropdownMenuItem>

      <DropdownMenuItem
        className="text-yellow-400 focus:text-yellow-400"
        onClick={async () => {
          try {
            await onAccount("active");
            toast.success("Account activated successfully.");
          } catch (e: any) {
            toast.error(e?.message || "Failed to activate account.");
          }
        }}
      >
        Activate Account
      </DropdownMenuItem>

      <DropdownMenuItem
        className="text-red-400 focus:text-red-400"
        onClick={async () => {
          try {
            await onAccount("suspended");
            toast.success("Account suspended successfully.");
          } catch (e: any) {
            toast.error(e?.message || "Failed to suspend account.");
          }
        }}
      >
        Suspend Account
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
}
