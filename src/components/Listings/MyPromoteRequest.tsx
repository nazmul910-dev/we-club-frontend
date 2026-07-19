"use client";

import { useState } from "react";
import { statusBadge } from "@/components/Listings/StatusBadge";
import { downloadListingAssets } from "@/lib/features/listingAssets/listingAssetsApi";
import { useAppDispatch } from "@/lib/redux/store/hook";
import { formatDate } from "@/lib/utils/Helpers";
import { downloadZip } from "@/lib/utils/downloadListingZip";
import { Download, XCircle } from "lucide-react";
import { toast } from "sonner";
import { RowAction, RowActionsMenu } from "./RowActionMenu";
import RowSkeleton from "../ui/row-skeleton";
import ConfirmDialog from "../common/ConfirmDialog";
import { Share2 } from "lucide-react";
import Link from "next/link";

interface MyPromoteRequestsSectionProps {
  mySentPromoteRequests: any[];
  mySentPromoteRequestsLoading: boolean;
  mySentPromoteRequestsError: string | null;
  canManageRequest: (request: any) => boolean;
  onCancel: (id: string) => Promise<void> | void;
}

export function MyPromoteRequestsSection({
  mySentPromoteRequests,
  mySentPromoteRequestsLoading,
  mySentPromoteRequestsError,
  canManageRequest,
  onCancel,
}: MyPromoteRequestsSectionProps) {
  const dispatch = useAppDispatch();

  const [cancelId, setCancelId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const openCancelConfirm = (id: string) => setCancelId(id);

  const closeCancelConfirm = () => {
    if (confirming) return;
    setCancelId(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelId) return;
    setConfirming(true);
    try {
      await onCancel(cancelId);
      toast.success("Promote request cancelled");
      setCancelId(null);
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setConfirming(false);
    }
  };

  const handleDownload = async (request: any) => {
    if (request.status !== "approved") {
      toast.error("You need approval from Admin or Listing Owner.");
      return;
    }

    try {
      await toast.promise(
        dispatch(downloadListingAssets(request.listing_id._id)).unwrap(),
        {
          loading: "Preparing download...",

          success: (blob) => {
            downloadZip(blob, `${request.listing_id.ref_code}-assets.zip`);
            return "Download started successfully.";
          },

          error: (err) => {
            return typeof err === "string" ? err : "Download failed.";
          },
        },
      );
    } catch {
      // toast.promise handles everything
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

            if (canManageRequest(request)) {
              actions.push({
                label: "Cancel",
                icon: <XCircle size={14} />,
                onClick: () => openCancelConfirm(request._id),
                variant: "warning",
              });
            }

            return (
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
                  <div className="flex items-center justify-center">
                    <RowActionsMenu actions={actions} />
                  </div>
                </td>

                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleDownload(request)}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                      request.status === "approved"
                        ? "cursor-pointer bg-amber-400 text-black hover:bg-amber-300"
                        : "cursor-pointer bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                    }`}
                  >
                    <Download size={16} />
                    Download
                  </button>
                </td>
                <td className="px-4 py-3">
                  {request.status === "approved" ? (
                    <Link
                      href={`/promote-request/public/${request._id}`}
                      className="text-green-400 cursor-pointer"
                    >
                      <Share2 size={14} />

                      <span
                        className="
pointer-events-none
absolute
-bottom-10
hidden
whitespace-nowrap
rounded-md
bg-black
px-3
py-1
text-xs
text-white
group-hover:block
"
                      >
                        View Public Page
                      </span>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="
inline-flex
cursor-not-allowed
items-center
justify-center
rounded-lg
bg-zinc-300
p-3
text-zinc-500
"
                    >
                      <Share2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && closeCancelConfirm()}
        title="Cancel this promote request?"
        description="This promote request will be cancelled and cannot be undone."
        confirmText="Cancel Request"
        confirmVariant="danger"
        loading={confirming}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
