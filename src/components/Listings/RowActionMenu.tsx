"use client";

import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface RowAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "warning" | "danger" | "success";
  disabled?: boolean;
}

const variantClasses: Record<NonNullable<RowAction["variant"]>, string> = {
  default: "text-white/80 focus:text-white focus:bg-white/10",
  warning: "text-yellow-300 focus:text-yellow-300 focus:bg-yellow-500/10",
  danger: "text-red-300 focus:text-red-300 focus:bg-red-500/10",
  success: "text-green-300 focus:text-green-300 focus:bg-green-500/10",
};

export function RowActionsMenu({ actions }: { actions: RowAction[] }) {
  if (actions.length === 0) {
    return <span className="text-white/30 text-xs">No actions</span>;
  }

  return (
    <DropdownMenu>
      {/* <DropdownMenuTrigger >
        <button
          type="button"
          aria-label="Row actions"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <MoreVertical size={16} />
        </button>
      </DropdownMenuTrigger> */}
      <DropdownMenuTrigger >
        <button
          type="button"
          aria-label="Row actions"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <MoreVertical size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="border-white/10 bg-[#141414] text-white"
      >
        {actions.map((action, i) => (
          <DropdownMenuItem
            key={i}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`gap-2 cursor-pointer ${variantClasses[action.variant ?? "default"]}`}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}