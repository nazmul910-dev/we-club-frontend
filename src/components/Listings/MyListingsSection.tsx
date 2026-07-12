"use client";

import { useState } from "react";
import { toast } from "sonner";
import { statusBadge } from "@/components/Listings/StatusBadge";
import { XCircle, Trash2 } from "lucide-react";
import { RowAction, RowActionsMenu } from "./RowActionMenu";
import { Skeleton } from "../ui/skeleton";
import RowSkeleton from "../ui/row-skeleton";
import ConfirmDialog from "../common/ConfirmDialog";

interface MyListingsSectionProps {
  myListings: any[];
  myListingsLoading: boolean;
  myListingsError: string | null;
  isAdmin: boolean;
  canApproveRejectRequest: (listing: any) => boolean;
  onCancelPending: (id: string) => Promise<void> | void;
  onDeletePending: (id: string) => Promise<void> | void;
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
}

type PendingAction = {
  type: "cancel" | "delete";
  id: string;
} | null;

export function MyListingsSection({
  myListings,
  myListingsLoading,
  myListingsError,
  isAdmin,
  canApproveRejectRequest,
  onCancelPending,
  onDeletePending,
  onApproveRequest,
  onRejectRequest,
}: MyListingsSectionProps) {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [confirming, setConfirming] = useState(false);

  const openConfirm = (type: "cancel" | "delete", id: string) => {
    setPendingAction({ type, id });
  };

  const closeConfirm = () => {
    if (confirming) return;
    setPendingAction(null);
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;
    setConfirming(true);
    try {
      if (pendingAction.type === "cancel") {
        await onCancelPending(pendingAction.id);
        toast.success("Listing request cancelled");
      } else if (pendingAction.type === "delete") {
        await onDeletePending(pendingAction.id);
        toast.success("Listing deleted");
      }
      setPendingAction(null);
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setConfirming(false);
    }
  };

  if (myListingsLoading) {
    return (
     <RowSkeleton />
    );
  }

  if (myListingsError) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {myListingsError}
      </div>
    );
  }

  if (myListings.length === 0) {
    return (
      <div className="text-muted-foreground">You have no listings yet.</div>
    );
  }

  const dialogContent = (() => {
    if (!pendingAction) return null;
    switch (pendingAction.type) {
      case "cancel":
        return {
          title: "Cancel this listing request?",
          description: "This pending listing request will be cancelled.",
          confirmText: "Cancel Request",
          confirmVariant: "danger" as const,
        };
      case "delete":
        return {
          title: "Delete this listing?",
          description: "This action cannot be undone.",
          confirmText: "Delete",
          confirmVariant: "danger" as const,
        };
    }
  })();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/5">
        <thead className="bg-[#0b0b0b]">
          <tr className="text-left">
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Promoters
            </th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-white/6">
          {myListings.map((l: any) => {
            const actions: RowAction[] = [];

            if (l.status === "pending") {
              actions.push({
                label: "Cancel",
                icon: <XCircle size={14} />,
                onClick: () => openConfirm("cancel", l._id),
                variant: "warning",
              });
              actions.push({
                label: "Delete",
                icon: <Trash2 size={14} />,
                onClick: () => openConfirm("delete", l._id),
                variant: "danger",
              });
            }

            return (
              <tr key={l._id} className="hover:bg-white/2">
                <td className="px-4 py-3 text-sm text-white">{l.title}</td>
                <td className="px-4 py-3 text-sm text-white">
                  {l.price?.amount ?? "-"} {l.price?.currency ?? ""}
                </td>
                <td className="px-4 py-3">{statusBadge(l.status)}</td>
                <td className="px-4 py-3 text-sm text-white">
                  {(l.promoters || []).length}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end pr-2">
                    <RowActionsMenu actions={actions} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {dialogContent && (
        <ConfirmDialog
          open={!!pendingAction}
          onOpenChange={(open) => !open && closeConfirm()}
          title={dialogContent.title}
          description={dialogContent.description}
          confirmText={dialogContent.confirmText}
          confirmVariant={dialogContent.confirmVariant}
          loading={confirming}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
