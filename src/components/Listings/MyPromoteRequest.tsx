"use client";

import { statusBadge } from "@/components/Listings/StatusBadge";
import { formatDate } from "@/lib/utils/Helpers";
import { XCircle } from "lucide-react";


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
                <div className="flex flex-wrap items-center gap-2">
                  {canManageRequest(request) && (
                    <button
                      type="button"
                      onClick={() => onCancel(request._id)}
                      className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-yellow-300 transition hover:bg-yellow-500/20"
                    >
                      <XCircle size={12} />
                      Cancel
                    </button>
                  )}
                  {!canManageRequest(request) && (
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