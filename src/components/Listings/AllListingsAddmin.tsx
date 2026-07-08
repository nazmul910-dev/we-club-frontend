"use client";

import { statusBadge } from "@/components/Listings/StatusBadge";
import { Trash2 } from "lucide-react";

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
    return <div className="text-muted-foreground">Loading all listings…</div>;
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

  console.log("from admin listing section ", adminListings)


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
                  {l.associate_id?.email ?? l.associate_id?._id ?? l.associate_id ?? "-"}
                </td>
                <td className="px-4 py-3 text-sm text-white">
                  {l.price?.amount ?? "-"} {l.price?.currency ?? ""}
                </td>
                <td className="px-4 py-3">{statusBadge(l.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {l.status === "pending" && (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onManageStatus(l._id, "active")}
                          className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-green-300 transition hover:bg-green-500/20 disabled:opacity-40"
                        >
                          {isManaging ? "..." : "Approve"}
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onManageStatus(l._id, "rejected")}
                          className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20 disabled:opacity-40"
                        >
                          {isManaging ? "..." : "Reject"}
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onHardDelete(l._id)}
                      className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/15 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/25 disabled:opacity-40"
                    >
                      <Trash2 size={12} />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
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