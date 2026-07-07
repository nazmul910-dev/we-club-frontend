"use client";

import { statusBadge } from "@/components/Listings/StatusBadge";
import { XCircle, Trash2 } from "lucide-react";

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
                <div className="flex flex-wrap items-center gap-2">
                  {l.status === "pending" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onCancelPending(l._id)}
                        className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-yellow-300 transition hover:bg-yellow-500/20"
                      >
                        <XCircle size={12} />
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeletePending(l._id)}
                        className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className="text-white/30 text-xs">No actions</span>
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