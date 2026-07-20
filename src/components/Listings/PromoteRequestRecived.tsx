"use client";

import { statusBadge } from "@/components/Listings/StatusBadge";
import { formatDate } from "@/lib/utils/Helpers";
import { XCircle, Trash2 } from "lucide-react";
import { RowAction, RowActionsMenu } from "./RowActionMenu";
import RowSkeleton from "../ui/row-skeleton";
import PromoteRequestDetailsModal from "./UserDetailsModal";


interface PromoteRequestsReceivedSectionProps {
  promoteRequests: any[];
  promoteRequestsLoading: boolean;
  promoteRequestsError: string | null;
  isRequester: (request: any) => boolean;
  canManageRequest: (request: any) => boolean;
  canApproveRejectRequest: (request: any) => boolean;
  canDeleteRequest: (request: any) => boolean;
  onCancel: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PromoteRequestsReceivedSection({
  promoteRequests,
  promoteRequestsLoading,
  promoteRequestsError,
  isRequester,
  canManageRequest, 
  canApproveRejectRequest,
  canDeleteRequest,
  onCancel,
  onApprove,
  onReject,
  onDelete,
}: PromoteRequestsReceivedSectionProps) {
  if (promoteRequestsLoading) {
    return <RowSkeleton/>;
  }


 console.log("promoteRequest1: ",promoteRequests)

  if (promoteRequestsError) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {promoteRequestsError}
      </div>
    );
  }

  if (promoteRequests.length === 0) {
    return <div className="text-muted-foreground">No promote requests received.</div>;
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
              Requester
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
          {promoteRequests.map((r: any) => (
            <tr key={r._id} className="hover:bg-white/2">
              <td className="px-4 py-3 text-sm text-white">
                {r.listing_id?.title || r.listing_id?.ref_code}
              </td>
              <td className="px-4 py-3 text-sm text-white">
                <PromoteRequestDetailsModal request={r}/>
              </td>
              <td className="px-4 py-3">{statusBadge(r.status)}</td>
              <td className="px-4 py-3 text-sm text-white">
                {formatDate(r.requested_at)}
              </td>
                
             <td className="px-4 py-3">
                {(() => {
                  const actions: RowAction[] = [];
 
                  if (canManageRequest(r) && isRequester(r)) {
                    actions.push({
                      label: "Cancel",
                      icon: <XCircle size={14} />,
                      onClick: () => onCancel(r._id),
                      variant: "warning",
                    });
                  }
 
                  if (canApproveRejectRequest(r)) {
                    actions.push({
                      label: "Approve",
                      onClick: () => onApprove(r._id),
                      variant: "success",
                    });
                    actions.push({
                      label: "Reject",
                      onClick: () => onReject(r._id),
                      variant: "danger",
                    });
                  }
 
                  if (canDeleteRequest(r)) {
                    actions.push({
                      label: "Delete",
                      icon: <Trash2 size={14} />,
                      onClick: () => onDelete(r._id),
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