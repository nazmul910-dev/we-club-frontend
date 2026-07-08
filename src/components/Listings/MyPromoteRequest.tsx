"use client";

import { statusBadge } from "@/components/Listings/StatusBadge";
import { formatDate } from "@/lib/utils/Helpers";
import { XCircle } from "lucide-react";
import { RowAction, RowActionsMenu } from "./RowActionMenu";

interface MyPromoteRequestsSectionProps {
  mySentPromoteRequests: any[];
  mySentPromoteRequestsLoading: boolean;
  mySentPromoteRequestsError: string | null;
  canManageRequest: (request: any) => boolean;
  onCancel: (id: string) => void;
}

export function MyPromoteRequestsSection({
  mySentPromoteRequests,
  mySentPromoteRequestsLoading,
  mySentPromoteRequestsError,
  canManageRequest,
  onCancel,
}: MyPromoteRequestsSectionProps) {
  if (mySentPromoteRequestsLoading) {
    return <div className="text-muted-foreground">Loading your requests…</div>;
  }

  if (mySentPromoteRequestsError) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {mySentPromoteRequestsError}
      </div>
    );
  }

  if (mySentPromoteRequests.length === 0) {
    return (
      <div className="text-muted-foreground">
        You have not sent any promote requests yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/5">
        <thead className="bg-[#0b0b0b]">
          <tr className="text-left">
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Listing
            </th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Requested
            </th>
            <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-white/6">
          {mySentPromoteRequests.map((request: any) => (
            <tr key={request._id} className="hover:bg-white/2">
              <td className="px-4 py-3 text-sm text-white">
                {request.listing_id?.title || request.listing_id?.ref_code}
              </td>
              <td className="px-4 py-3 text-sm text-white">
                {request.listing_id?.price?.amount ?? "-"}{" "}
                {request.listing_id?.price?.currency ?? ""}
              </td>
              <td className="px-4 py-3">{statusBadge(request.status)}</td>
              <td className="px-4 py-3 text-sm text-white">
                {formatDate(request.requested_at)}
              </td>
               <td className="px-4 py-3">
                {(() => {
                  const actions: RowAction[] = [];
 
                  if (canManageRequest(request)) {
                    actions.push({
                      label: "Cancel",
                      icon: <XCircle size={14} />,
                      onClick: () => onCancel(request._id),
                      variant: "warning",
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
