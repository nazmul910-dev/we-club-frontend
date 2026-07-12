"use client";

import { useState } from "react";
import { toast } from "sonner";
import { statusBadge } from "@/components/Listings/StatusBadge";
import { Ticket, Trash2 } from "lucide-react";
import { RowAction, RowActionsMenu } from "./RowActionMenu";
import ConfirmDialog from "@/components/common/ConfirmDialog"; // adjust path if needed

interface AllListingsAdminSectionProps {
  adminListings: any[];
  adminListingsLoading: boolean;
  adminListingsError: string | null;
  managingListingId: string | null;
  deletingListingId: string | null;
  onManageStatus: (id: string, status: "active" | "rejected") => Promise<void> | void;
  onHardDelete: (id: string) => Promise<void> | void;
}

type PendingAction = {
  type: "approve" | "reject" | "delete";
  id: string;
} | null;

export function AllListingsAdminSection({
  adminListings,
  adminListingsLoading,
  adminListingsError,
  managingListingId,
  deletingListingId,
  onManageStatus, 
  onHardDelete,
}: AllListingsAdminSectionProps) {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [confirming, setConfirming] = useState(false);

  const openConfirm = (type: PendingAction extends null ? never : NonNullable<PendingAction>["type"], id: string) => {
    setPendingAction({ type, id } as PendingAction);
  };

  const closeConfirm = () => {
    if (confirming) return; // prevent closing mid-request
    setPendingAction(null);
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;
    setConfirming(true);
    try {
      if (pendingAction.type === "approve") {
        await onManageStatus(pendingAction.id, "active");
        toast.success("Listing approved successfully");
      } else if (pendingAction.type === "reject") {
        await onManageStatus(pendingAction.id, "rejected");
        toast.success("Listing rejected");
      } else if (pendingAction.type === "delete") {
        await onHardDelete(pendingAction.id);
        toast.success("Listing deleted permanently");
      }
      setPendingAction(null);
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setConfirming(false);
    }
  };

  if (adminListingsLoading) {
    return <div className="text-muted-foreground">Loading all listings…</div>;
  }

  if (adminListingsError) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {adminListingsError}
      </div>
    );
  }

  if (adminListings.length === 0) {
    return <div className="text-muted-foreground">No listings found.</div>;
  }

  const dialogContent = (() => {
    if (!pendingAction) return null;
    switch (pendingAction.type) {
      case "approve":
        return {
          title: "Approve this listing?",
          description: "This listing will become active and visible to everyone.",
          confirmText: "Approve",
          confirmVariant: "success" as const,
        };
      case "reject":
        return {
          title: "Reject this listing?",
          description: "The associate will be notified that this listing was rejected.",
          confirmText: "Reject",
          confirmVariant: "danger" as const,
        };
      case "delete":
        return {
          title: "Permanently delete this listing?",
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
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Title</th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Associate</th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Price</th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-white/6">
          {adminListings.map((l: any) => {
            const isManaging = managingListingId === l._id;
            const isDeleting = deletingListingId === l._id;
            const busy = isManaging || isDeleting;

            const actions: RowAction[] = [];

            if (l.status === "pending" || l.status === "draft") {
              actions.push({
                label: "Approve",
                disabled: busy,
                icon: <Ticket size={14} />,
                onClick: () => openConfirm("approve", l._id),
                variant: "success",
              });
              actions.push({
                label: "Reject",
                disabled: busy,
                icon: <Trash2 size={14} />,
                onClick: () => openConfirm("reject", l._id),
                variant: "warning",
              });
            }

            actions.push({
              label: "Delete",
              disabled: busy,
              icon: <Trash2 size={14} />,
              onClick: () => openConfirm("delete", l._id),
              variant: "danger",
            });

            return (
              <tr key={l._id} className="hover:bg-white/2">
                <td className="px-4 py-3 text-sm text-white">{l.title}</td>
                <td className="px-4 py-3 text-sm text-white/70">
                  {l.associate_id?.email ?? l.associate_id?._id ?? l.associate_id ?? "-"}
                </td>
                <td className="px-4 py-3 text-sm text-white">
                  {l.price?.amount ?? "-"} {l.price?.currency ?? ""}
                </td>
                <td className="px-4 py-3">{statusBadge(l.status)}</td>
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