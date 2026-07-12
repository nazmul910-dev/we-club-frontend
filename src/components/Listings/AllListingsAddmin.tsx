"use client";

import { statusBadge } from "@/components/Listings/StatusBadge";
import { Ticket, Trash2, XCircle } from "lucide-react";
import { RowAction, RowActionsMenu } from "./RowActionMenu";
import RowSkeleton from "../ui/row-skeleton";

interface AllListingsAdminSectionProps {
  adminListings: any[];
  adminListingsLoading: boolean;
  adminListingsError: string | null;
  managingListingId: string | null;
  deletingListingId: string | null;
  onManageStatus: (id: string, status: "active" | "rejected") => void;
  onHardDelete: (id: string) => void;
}

export function AllListingsAdminSection({
  adminListings,
  adminListingsLoading,
  adminListingsError,
  managingListingId,
  deletingListingId,
  onManageStatus,
  onHardDelete,
}: AllListingsAdminSectionProps) {
  if (adminListingsLoading) {
    return  <RowSkeleton/>;
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



  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/5">
        <thead className="bg-[#0b0b0b]">
          <tr className="text-left">
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Associate
            </th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-white/6">
          {adminListings.map((l: any) => {
            const isManaging = managingListingId === l._id;
            const isDeleting = deletingListingId === l._id;
            const busy = isManaging || isDeleting;

            return (
              <tr key={l._id} className="hover:bg-white/2">
                <td className="px-4 py-3 text-sm text-white">{l.title}</td>
                <td className="px-4 py-3 text-sm text-white/70">
                  {l.associate_id?.email ??
                    l.associate_id?._id ??
                    l.associate_id ??
                    "-"}
                </td>
                <td className="px-4 py-3 text-sm text-white">
                  {l.price?.amount ?? "-"} {l.price?.currency ?? ""}
                </td>
                <td className="px-4 py-3">{statusBadge(l.status)}</td>
                <td className="px-4 py-3">
             
                  <td>
                    {(() => {
                      const actions: RowAction[] = [];

                      if (l.status === "pending" || "draft") {
                        actions.push({
                          label: "Approve",
                          disabled: busy,
                          icon: <Ticket size={14} />,
                          onClick: () => onManageStatus(l._id, "active"),
                          variant: "success",
                        });
                        actions.push({
                          label: "Reject",
                          icon: <Trash2 size={14} />,
                          onClick: () => onManageStatus(l._id, "rejected"),
                          variant: "warning",
                        });
                      }
                      actions.push({
                        label: "Delete",
                          disabled: busy,
                          icon: <Trash2 size={14} />,
                          onClick: () => onHardDelete(l._id),
                          variant: "danger",

                      })

                      return (
                        <div className="flex justify-end pr-2">
                          <RowActionsMenu actions={actions} />
                        </div>
                      );
                    })()}
                  </td>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
