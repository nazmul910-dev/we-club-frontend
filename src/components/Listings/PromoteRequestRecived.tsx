"use client";

import { statusBadge } from "@/components/Listings/StatusBadge";
import { formatDate } from "@/lib/utils/Helpers";
import { XCircle, Trash2 } from "lucide-react";


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
    return <div className="text-muted-foreground">Loading promote requests…</div>;
  }

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
                {r.requester?.email || r.requester?.user_id}
              </td>
              <td className="px-4 py-3">{statusBadge(r.status)}</td>
              <td className="px-4 py-3 text-sm text-white">
                {formatDate(r.requested_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  {canManageRequest(r) && isRequester(r) && (
                    <button
                      type="button"
                      onClick={() => onCancel(r._id)}
                      className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-yellow-300 transition hover:bg-yellow-500/20"
                    >
                      <XCircle size={12} />
                      Cancel
                    </button>
                  )}
                  {canApproveRejectRequest(r) && (
                    <>
                      <button
                        type="button"
                        onClick={() => onApprove(r._id)}
                        className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-green-300 transition hover:bg-green-500/20"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject(r._id)}
                        className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {canDeleteRequest(r) && (
                    <button
                      type="button"
                      onClick={() => onDelete(r._id)}
                      className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  )}
                  {!canManageRequest(r) &&
                    !canApproveRejectRequest(r) &&
                    !canDeleteRequest(r) && (
                      <span className="text-xs text-muted-foreground">No actions</span>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}