"use client";

import { statusBadge } from "@/components/Listings/StatusBadge";
import { XCircle, Trash2 } from "lucide-react";
import { RowAction, RowActionsMenu } from "./RowActionMenu";


interface MyListingsSectionProps {
  myListings: any[];
  myListingsLoading: boolean;
  myListingsError: string | null;
  isAdmin: boolean;
  canApproveRejectRequest: (listing: any) => boolean;
  onCancelPending: (id: string) => void;
  onDeletePending: (id: string) => void;
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
}

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
  if (myListingsLoading) {
    return <div className="text-muted-foreground">Loading listings…</div>;
  }

  if (myListingsError) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {myListingsError}
      </div>
    );
  }

  if (myListings.length === 0) {
    return <div className="text-muted-foreground">You have no listings yet.</div>;
  }

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
          {myListings.map((l: any) => (
            <tr key={l._id} className="hover:bg-white/2">
              <td className="px-4 py-3 text-sm text-white">{l.title}</td>
              <td className="px-4 py-3 text-sm text-white">
                {l.price?.amount ?? "-"} {l.price?.currency ?? ""}
              </td>
              <td className="px-4 py-3">{statusBadge(l.status)}</td>
              <td className="px-4 py-3 text-sm text-white">
                {(l.promoters || []).length}
              </td>
              <td>
                {(() => {
                  const actions: RowAction[] = [];

                  if (l.status === "pending") {
                    actions.push({
                      label: "Cancel",
                      icon: <XCircle size={14} />,
                      onClick: () => onCancelPending(l._id),
                      variant: "warning",
                    });
                    actions.push({
                      label: "Delete",
                      icon: <Trash2 size={14} />,
                      onClick: () => onDeletePending(l._id),
                      variant: "danger",
                    });
                  }

               
                  return (
                    <div className="flex justify-end pr-2">
                      <RowActionsMenu actions={actions} />
                    </div>
                  );
                })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}