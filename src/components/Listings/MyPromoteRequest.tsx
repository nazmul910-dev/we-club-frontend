"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Download,
  Loader2,
  Pencil,
  Share2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { statusBadge } from "@/components/Listings/StatusBadge";
import { downloadListingAssets } from "@/lib/features/listingAssets/listingAssetsApi";
import { RespondToOwnerTermsPayload } from "@/lib/features/PromoteRequest/promoteRequestApi";
import { useAppDispatch } from "@/lib/redux/store/hook";
import { formatDate } from "@/lib/utils/Helpers";
import { downloadZip } from "@/lib/utils/downloadListingZip";
import { formatCompactNumber } from "@/lib/utils/format-number";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { RowAction, RowActionsMenu } from "./RowActionMenu";
import RowSkeleton from "../ui/row-skeleton";
import ConfirmDialog from "../common/ConfirmDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface MyPromoteRequestsSectionProps {
  mySentPromoteRequests: any[];
  mySentPromoteRequestsLoading: boolean;
  mySentPromoteRequestsError: string | null;

  canManageRequest: (request: any) => boolean;

  onCancel: (id: string) => Promise<void> | void;

  onRespondToOwnerTerms: (
    payload: RespondToOwnerTermsPayload,
  ) => Promise<void> | void;

  respondingId: string | null;
}

export function MyPromoteRequestsSection({
  mySentPromoteRequests,
  mySentPromoteRequestsLoading,
  mySentPromoteRequestsError,
  canManageRequest,
  onCancel,
  onRespondToOwnerTerms,
  respondingId,
}: MyPromoteRequestsSectionProps) {
  const dispatch = useAppDispatch();

  const [cancelId, setCancelId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const [termsRequest, setTermsRequest] = useState<any | null>(null);

  const [promoterWebsiteUrl, setPromoterWebsiteUrl] = useState("");
  const [marketingDocumentUrl, setMarketingDocumentUrl] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const isResponding =
    Boolean(termsRequest?._id) && respondingId === termsRequest?._id;

  const openCancelConfirm = (id: string) => {
    setCancelId(id);
  };

  const closeCancelConfirm = () => {
    if (confirming) return;
    setCancelId(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelId) return;

    setConfirming(true);

    try {
      await onCancel(cancelId);

      toast.success("Promote request cancelled successfully");

      setCancelId(null);
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to cancel promote request");
    } finally {
      setConfirming(false);
    }
  };

  const openTermsDialog = (request: any) => {
    setTermsRequest(request);

    setPromoterWebsiteUrl(request.promoter_website_url ?? "");

    setMarketingDocumentUrl(request.marketing_document_url ?? "");

    setRejectionReason("");
  };

  const resetTermsDialog = () => {
    setTermsRequest(null);
    setPromoterWebsiteUrl("");
    setMarketingDocumentUrl("");
    setRejectionReason("");
  };

  const isValidUrl = (value: string): boolean => {
    if (!value.trim()) return true;

    try {
      new URL(value.trim());
      return true;
    } catch {
      return false;
    }
  };

  const handleTermsDecision = async (decision: "accepted" | "rejected") => {
    if (!termsRequest) return;

    const websiteUrl = promoterWebsiteUrl.trim();
    const documentUrl = marketingDocumentUrl.trim();
    const reason = rejectionReason.trim();

    if (decision === "accepted") {
      if (!isValidUrl(websiteUrl)) {
        toast.error("Please provide a valid website URL");
        return;
      }

      if (!isValidUrl(documentUrl)) {
        toast.error("Please provide a valid marketing document URL");
        return;
      }
    }

    if (decision === "rejected") {
      const confirmed = window.confirm(
        "Rejecting these terms will permanently prevent you from requesting this listing again. Do you want to continue?",
      );

      if (!confirmed) return;
    }

    const payload: RespondToOwnerTermsPayload = {
      id: termsRequest._id,
      decision,
    };

    if (decision === "accepted") {
      if (websiteUrl) {
        payload.promoter_website_url = websiteUrl;
      }

      if (documentUrl) {
        payload.marketing_document_url = documentUrl;
      }
    }

    if (decision === "rejected" && reason) {
      payload.rejection_reason = reason;
    }

    try {
      await onRespondToOwnerTerms(payload);

      if (decision === "accepted") {
        toast.success("Terms accepted. Your promotion is now active.");
      } else {
        toast.success("Owner terms rejected successfully");
      }

      resetTermsDialog();
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to respond to owner terms");
    }
  };

  const handleDownload = async (request: any) => {
    if (request.status !== "approved") {
      toast.error(
        "You must accept the owner's terms before downloading listing assets.",
      );
      return;
    }

    if (!request.listing_id?._id) {
      toast.error("Listing information is unavailable");
      return;
    }

    try {
      await toast.promise(
        dispatch(downloadListingAssets(request.listing_id._id)).unwrap(),
        {
          loading: "Preparing download...",

          success: (blob) => {
            downloadZip(
              blob,
              `${request.listing_id.ref_code ?? "listing"}-assets.zip`,
            );

            return "Download started successfully";
          },

          error: (error) => {
            return typeof error === "string" ? error : "Download failed";
          },
        },
      );
    } catch {
      // toast.promise handles the error
    }
  };

  if (mySentPromoteRequestsLoading) {
    return <RowSkeleton />;
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
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-[#0b0b0b]">
            <tr className="text-left">
              <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                Listing
              </th>

              <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                Price
              </th>

              <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                Status
              </th>

              <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                Owner Permission
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

              <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                Download
              </th>

              <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                Share
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 bg-transparent">
            {mySentPromoteRequests.map((request: any) => {
              const actions: RowAction[] = [];

              /*
               * শুধু owner decision দেওয়ার আগে
               * pending request cancel করা যাবে।
               */
              if (request.status === "pending" && canManageRequest(request)) {
                actions.push({
                  label: "Cancel request",
                  icon: <XCircle size={14} />,
                  onClick: () => openCancelConfirm(request._id),
                  variant: "warning",
                });
              }

              const canRespondToTerms =
                Boolean(request.workflow?.can_accept_owner_terms) ||
                Boolean(request.workflow?.can_reject_owner_terms) ||
                (request.status === "owner_approved" &&
                  request.promoter_agreement_status === "pending");

              const isFinalApproved =
                request.status === "approved" &&
                request.promoter_agreement_status === "accepted";

              return (
                <tr key={request._id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-sm text-white">
                    {request.listing_id?.title ||
                      request.listing_id?.ref_code ||
                      "-"}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                    {formatCompactNumber(request.listing_id?.price?.amount) ??
                      "-"}{" "}
                    {request.listing_id?.price?.currency ?? ""}
                  </td>

                  <td className="px-4 py-3">{statusBadge(request.status)}</td>

                  <td className="px-4 py-3">
                    <OwnerPermissionStatus
                      request={request}
                      canRespond={canRespondToTerms}
                      onEdit={() => openTermsDialog(request)}
                    />
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                    {formatTier(request.selected_tier)}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                    {request.confirmed_commission_pct !== undefined &&
                    request.confirmed_commission_pct !== null
                      ? `${request.confirmed_commission_pct}%`
                      : request.proposed_commission_pct !== undefined &&
                          request.proposed_commission_pct !== null
                        ? `${request.proposed_commission_pct}% proposed`
                        : "-"}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                    {formatDate(request.requested_at)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <RowActionsMenu actions={actions} />
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={!isFinalApproved}
                      onClick={() => handleDownload(request)}
                      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                        isFinalApproved
                          ? "cursor-pointer bg-amber-400 text-black hover:bg-amber-300"
                          : "cursor-not-allowed bg-zinc-700 text-zinc-400 opacity-60"
                      }`}
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    {isFinalApproved ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Link
                              href={
                                request.access_url ||
                                `/promote-request/public/${request._id}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative inline-flex items-center justify-center rounded-lg bg-green-500/10 p-3 text-green-400 transition hover:bg-green-500/20"
                            >
                              <Share2 size={16} />
                            </Link>
                          </TooltipTrigger>

                          <TooltipContent className="max-w-55 border-white/10 bg-[#1a1a1a] text-center text-xs text-white">
                            View Public Page
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex cursor-not-allowed items-center justify-center rounded-lg bg-zinc-700 p-3 text-zinc-500 opacity-60"
                      >
                        <Share2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pending request cancel confirmation */}
      <ConfirmDialog
        open={Boolean(cancelId)}
        onOpenChange={(open) => {
          if (!open) {
            closeCancelConfirm();
          }
        }}
        title="Cancel this promote request?"
        description="This pending promote request will be cancelled. You may submit another request later if allowed."
        confirmText="Cancel Request"
        confirmVariant="danger"
        loading={confirming}
        onConfirm={handleConfirmCancel}
      />

      {/* Owner terms Accept/Reject modal */}
      <Dialog
        open={Boolean(termsRequest)}
        onOpenChange={(open) => {
          if (!open && !isResponding) {
            resetTermsDialog();
          }
        }}
      >
        <DialogContent className="border-white/10 bg-[#141414] text-white sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Respond to Listing Owner Terms
            </DialogTitle>

            <DialogDescription className="text-white/60">
              Review the selected tier and confirmed commission before accepting
              or rejecting the promotion terms.
            </DialogDescription>
          </DialogHeader>

          {termsRequest && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/40">
                    Selected tier
                  </p>

                  <p className="mt-1 font-medium text-white">
                    {formatTier(termsRequest.selected_tier)}
                  </p>
                </div>

                {/* <div>
                  <p className="text-xs uppercase tracking-wide text-white/40">
                    Confirmed commission
                  </p>

                  <p className="mt-1 font-medium text-white">
                    {termsRequest.confirmed_commission_pct ??
                      "-"}
                    %
                  </p>
                </div> */}
              </div>
              {/* 
              <div className="space-y-2">
                <Label htmlFor="promoterWebsiteUrl">
                  New website URL
                </Label>

                <Input
                  id="promoterWebsiteUrl"
                  type="url"
                  value={promoterWebsiteUrl}
                  onChange={(event) =>
                    setPromoterWebsiteUrl(
                      event.target.value,
                    )
                  }
                  placeholder="https://yourwebsite.com/property"
                  disabled={isResponding}
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                />

                <p className="text-xs text-white/40">
                  Optional. Add the URL where you will
                  promote this property.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marketingDocumentUrl">
                  Marketing document URL
                </Label>

                <Input
                  id="marketingDocumentUrl"
                  type="url"
                  value={marketingDocumentUrl}
                  onChange={(event) =>
                    setMarketingDocumentUrl(
                      event.target.value,
                    )
                  }
                  placeholder="https://example.com/property-document.pdf"
                  disabled={isResponding}
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                />

                <p className="text-xs text-white/40">
                  Optional. Add a presentation, brochure
                  or marketing document link.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejectionReason">
                  Rejection reason
                </Label>

                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(event) =>
                    setRejectionReason(
                      event.target.value,
                    )
                  }
                  placeholder="Only required if you want to reject the terms..."
                  disabled={isResponding}
                  className="min-h-24 border-white/10 bg-white/5 text-white placeholder:text-white/30"
                />
              </div> */}

              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs leading-5 text-red-200">
                Important: If you reject these terms, you will permanently lose
                the ability to send another promotion request for this listing.
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 gap-2 sm:gap-2">
            <button
              type="button"
              disabled={isResponding}
              onClick={resetTermsDialog}
              className="rounded-lg border cursor-pointer border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Close
            </button>

            <button
              type="button"
              disabled={isResponding}
              onClick={() => handleTermsDecision("rejected")}
              className="inline-flex items-center cursor-pointer justify-center gap-2 rounded-lg bg-red-500/15 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResponding ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <XCircle size={16} />
              )}
              Reject Terms
            </button>

            <button
              type="button"
              disabled={isResponding}
              onClick={() => handleTermsDecision("accepted")}
              className="inline-flex items-center cursor-pointer justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResponding ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}

              {isResponding ? "Processing..." : "Accept & Activate"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function OwnerPermissionStatus({
  request,
  canRespond,
  onEdit,
}: {
  request: any;
  canRespond: boolean;
  onEdit: () => void;
}) {
  if (request.status === "pending") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-yellow-300">
        <Clock3 size={14} />
        Not approved yet
      </span>
    );
  }

  if (
    request.status === "owner_approved" &&
    request.promoter_agreement_status === "pending"
  ) {
    return (
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="inline-flex items-center gap-2 text-sm text-blue-300">
          <ShieldCheck size={15} />
          Allowed — response required
        </span>

        {canRespond && (
          <button
            type="button"
            onClick={onEdit}
            title="Accept or reject owner terms"
            aria-label="Accept or reject owner terms"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-300 transition hover:bg-blue-500/20 hover:text-blue-200"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>
    );
  }

  if (
    request.status === "approved" &&
    request.promoter_agreement_status === "accepted"
  ) {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-green-300">
        <CheckCircle2 size={15} />
        Accepted — promotion active
      </span>
    );
  }

  if (request.status === "promoter_rejected") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-red-300">
        <XCircle size={15} />
        You rejected — permanently blocked
      </span>
    );
  }

  if (request.status === "rejected") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-red-300">
        <XCircle size={15} />
        Rejected by listing owner
      </span>
    );
  }

  if (request.status === "cancelled") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-zinc-400">
        <XCircle size={15} />
        Request cancelled
      </span>
    );
  }

  return <span className="text-sm text-white/40">Not available</span>;
}

function formatTier(tier?: string | null) {
  const tierLabels: Record<string, string> = {
    tier_1: "Tier 1",
    tier_2: "Tier 2",
    tier_3: "Tier 3",
  };

  if (!tier) return "-";

  return tierLabels[tier] ?? tier;
}
