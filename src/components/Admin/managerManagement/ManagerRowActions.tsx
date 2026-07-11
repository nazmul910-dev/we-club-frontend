
"use client";

import { useState } from "react";
import { MoreVertical, Ban, CheckCircle2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import {
  activateManager,
  suspendManager,
  deleteManager,
} from "@/lib/features/addManager/ManagerApi";
import { Manager } from "@/lib/features/addManager/managerTypes";
import ConfirmActionModal from "./ConfirmActionModal";
import { useAppDispatch } from "@/lib/redux/store/hook";

type PendingAction = "activate" | "suspend" | "delete" | null;

export default function ManagerRowActions({ manager }: { manager: Manager }) {
  const dispatch = useAppDispatch();

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [loading, setLoading] = useState(false);

  const isActive = manager.accountStatus === "active";

  const closeConfirm = () => {
    if (!loading) setPendingAction(null);
  };

  const runAction = async () => {
    if (!pendingAction) return;

    setLoading(true);

    if (pendingAction === "activate") {
      await dispatch(activateManager(manager._id));
    } else if (pendingAction === "suspend") {
      await dispatch(suspendManager(manager._id));
    } else if (pendingAction === "delete") {
      await dispatch(deleteManager(manager._id));
    }

    setLoading(false);
    setPendingAction(null);
  };

  const confirmCopy: Record<
    Exclude<PendingAction, null>,
    { title: string; description: string; confirmLabel: string; destructive: boolean }
  > = {
    activate: {
      title: "Activate manager?",
      description: `${manager.fullName} will regain access immediately.`,
      confirmLabel: "Activate",
      destructive: false,
    },
    suspend: {
      title: "Suspend manager?",
      description: `${manager.fullName} will lose access until reactivated.`,
      confirmLabel: "Suspend",
      destructive: false,
    },
    delete: {
      title: "Delete manager?",
      description: `This permanently removes ${manager.fullName}'s account. This can't be undone.`,
      confirmLabel: "Delete",
      destructive: true,
    },
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger >
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-400 hover:text-amber-400"
          >
            <MoreVertical className="h-4 w-4" />
          </Button> */}

          <div

            className="h-8 w-8 text-neutral-400 hover:text-amber-400"
          >
            <MoreVertical className="h-4 w-4" />
          </div>          
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isActive ? (
            <DropdownMenuItem onClick={() => setPendingAction("suspend")}>
              <Ban className="mr-2 h-4 w-4" />
              Suspend
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setPendingAction("activate")}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Activate
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => setPendingAction("delete")}
            className="text-red-500 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {pendingAction && (
        <ConfirmActionModal
          open={!!pendingAction}
          onOpenChange={closeConfirm}
          loading={loading}
          onConfirm={runAction}
          {...confirmCopy[pendingAction]}
        />
      )}
    </>
  );
}