"use client";

import { statusBadge } from "@/components/Listings/StatusBadge";
import { listingsApi } from "@/lib/features/listings/listingsApi";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ManageListingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    myListings,
    myListingsLoading,
    myListingsError,
    promoteRequests,
    promoteRequestsLoading,
    promoteRequestsError,
  } = useSelector((s: RootState) => {
    return {
      myListings: (s as any).listings?.myListings ?? [],
      myListingsLoading: (s as any).listings?.myListingsLoading ?? false,
      myListingsError: (s as any).listings?.myListingsError ?? null,
      promoteRequests: (s as any).listings?.promoteRequests ?? [],
      promoteRequestsLoading:
        (s as any).listings?.promoteRequestsLoading ?? false,
      promoteRequestsError: (s as any).listings?.promoteRequestsError ?? null,
    };
  });

  useEffect(() => {
    dispatch(listingsApi.getMyListings());
    dispatch(listingsApi.getMyListingPromoteRequests());
  }, [dispatch]);

  const formatDate = (d: string | undefined) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      return dt.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (e) {
      return d;
    }
  };


  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-eyebrow mb-2">Listings</div>
          <h1 className="font-display text-3xl md:text-4xl text-white">
            Manage Listings
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">My Listings</h2>
          {myListingsLoading ? (
            <div className="text-muted-foreground">Loading listings…</div>
          ) : myListings.length === 0 ? (
            <div className="text-muted-foreground">
              You have no listings yet.
            </div>
          ) : (
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
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-white/6">
                  {myListings.map((l: any) => (
                    <tr key={l._id} className="hover:bg-white/2">
                      <td className="px-4 py-3 text-sm text-white">
                        {l.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        {l.price?.amount ?? "-"} {l.price?.currency ?? ""}
                      </td>
                      <td className="px-4 py-3">{statusBadge(l.status)}</td>
                      <td className="px-4 py-3 text-sm text-white">
                        {(l.promoters || []).length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Promote Requests Received
          </h2>
          {promoteRequestsLoading ? (
            <div className="text-muted-foreground">
              Loading promote requests…
            </div>
          ) : promoteRequests.length === 0 ? (
            <div className="text-muted-foreground">
              No promote requests received.
            </div>
          ) : (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
