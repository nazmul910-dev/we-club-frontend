"use client";

import { statusBadge } from "@/components/Listings/StatusBadge";
import { formatDate } from "@/lib/utils/Helpers";
import {
  CheckCircle2,
  Clock3,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  RowAction,
  RowActionsMenu,
} from "./RowActionMenu";

import RowSkeleton from "../ui/row-skeleton";
import PromoteRequestDetailsModal from "./UserDetailsModal";

interface PromoteRequestsReceivedSectionProps {
  promoteRequests: any[];
  promoteRequestsLoading: boolean;
  promoteRequestsError: string | null;

  canApproveRejectRequest: (
    request: any,
  ) => boolean;

  canDeleteRequest: (
    request: any,
  ) => boolean;

  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PromoteRequestsReceivedSection({
  promoteRequests,
  promoteRequestsLoading,
  promoteRequestsError,
  canApproveRejectRequest,
  canDeleteRequest,
  onApprove,
  onReject,
  onDelete,
}: PromoteRequestsReceivedSectionProps) {
  if (promoteRequestsLoading) {
    return <RowSkeleton />;
  }

  if (promoteRequestsError) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {promoteRequestsError}
      </div>
    );
  }

  if (promoteRequests.length === 0) {
    return (
      <div className="text-muted-foreground">
        No promote requests received.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/5">
        <thead className="bg-[#0b0b0b]">
          <tr className="text-left">
            <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
              Listing
            </th>

            <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
              Requester
            </th>

            <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
              Request Status
            </th>

            <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
              Promoter Response
            </th>

            <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
              Tier
            </th>

            <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
              Commission
            </th>

            <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
              Requested
            </th>

            <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5 bg-transparent">
          {promoteRequests.map((request: any) => {
            const actions: RowAction[] = [];

            /*
             * Listing owner শুধু pending request
             * approve অথবা reject করতে পারবে।
             */
            if (
              request.status === "pending" &&
              canApproveRejectRequest(request)
            ) {
              actions.push({
                label: "Approve",
                onClick: () =>
                  onApprove(request._id),
                variant: "success",
              });

              actions.push({
                label: "Reject",
                icon: <XCircle size={14} />,
                onClick: () =>
                  onReject(request._id),
                variant: "danger",
              });
            }

            /*
             * Admin permission থাকলে delete দেখাবে।
             */
            if (canDeleteRequest(request)) {
              actions.push({
                label: "Delete",
                icon: <Trash2 size={14} />,
                onClick: () =>
                  onDelete(request._id),
                variant: "danger",
              });
            }

            return (
              <tr
                key={request._id}
                className="hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3 text-sm text-white">
                  {request.listing_id?.title ||
                    request.listing_id?.ref_code ||
                    "-"}
                </td>

                <td className="px-4 py-3 text-sm text-white">
                  <PromoteRequestDetailsModal
                    request={request}
                  />
                </td>

                <td className="px-4 py-3">
                  {statusBadge(request.status)}
                </td>

                <td className="px-4 py-3">
                  <PromoterResponseStatus
                    request={request}
                  />
                </td>

                <td className="px-4 py-3 text-sm text-white">
                  {request.selected_tier
                    ? formatTier(
                        request.selected_tier,
                      )
                    : "-"}
                </td>

                <td className="px-4 py-3 text-sm text-white">
                  {request.confirmed_commission_pct !==
                    undefined &&
                  request.confirmed_commission_pct !==
                    null
                    ? `${request.confirmed_commission_pct}%`
                    : request.proposed_commission_pct !==
                          undefined &&
                        request.proposed_commission_pct !==
                          null
                      ? `${request.proposed_commission_pct}% proposed`
                      : "-"}
                </td>

                <td className="px-4 py-3 text-sm text-white">
                  {formatDate(
                    request.requested_at,
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end pr-2">
                    <RowActionsMenu
                      actions={actions}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PromoterResponseStatus({
  request,
}: {
  request: any;
}) {
  /*
   * Owner এখনও decision দেয়নি।
   */
  if (request.status === "pending") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-yellow-300">
        <Clock3 size={14} />
        Waiting for your decision
      </span>
    );
  }

  /*
   * Owner approve করেছে।
   * এখন promoter Accept/Reject করবে।
   */
  if (
    request.status === "owner_approved" &&
    request.promoter_agreement_status ===
      "pending"
  ) {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-blue-300">
        <Clock3 size={14} />
        Waiting for promoter response
      </span>
    );
  }

  /*
   * Promoter final Accept করেছে।
   */
  if (
    request.status === "approved" &&
    request.promoter_agreement_status ===
      "accepted"
  ) {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-green-300">
        <CheckCircle2 size={14} />
        Promoter accepted
      </span>
    );
  }

  /*
   * Promoter owner-এর terms Reject করেছে।
   */
  if (
    request.status ===
      "promoter_rejected" ||
    request.promoter_agreement_status ===
      "rejected"
  ) {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-red-300">
        <XCircle size={14} />
        Promoter rejected
      </span>
    );
  }

  /*
   * Listing owner request Reject করেছে।
   */
  if (request.status === "rejected") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-red-300">
        <XCircle size={14} />
        Rejected by owner
      </span>
    );
  }

  /*
   * Requester pending request Cancel করেছে।
   */
  if (request.status === "cancelled") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-zinc-400">
        <XCircle size={14} />
        Cancelled by requester
      </span>
    );
  }

  return (
    <span className="text-sm text-white/40">
      Not available
    </span>
  );
}

function formatTier(tier: string) {
  const labels: Record<string, string> = {
    tier_1: "Tier 1",
    tier_2: "Tier 2",
    tier_3: "Tier 3",
  };

  return labels[tier] ?? tier;
}