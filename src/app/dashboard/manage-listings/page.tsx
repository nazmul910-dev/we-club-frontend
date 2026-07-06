"use client";

import { statusBadge } from "@/components/Listings/StatusBadge";
import { listingsApi } from "@/lib/features/listings/listingsApi";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XCircle, Trash2 } from "lucide-react";

export default function ManageListingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    myListings,
    myListingsLoading,
    myListingsError,
    promoteRequests,
    promoteRequestsLoading,
    promoteRequestsError,
    currentUserId,
  } = useSelector((s: RootState) => {
    return {
      myListings: (s as any).listings?.myListings ?? [],
      myListingsLoading: (s as any).listings?.myListingsLoading ?? false,
      myListingsError: (s as any).listings?.myListingsError ?? null,
      promoteRequests: (s as any).listings?.promoteRequests ?? [],
      promoteRequestsLoading:
        (s as any).listings?.promoteRequestsLoading ?? false,
      promoteRequestsError: (s as any).listings?.promoteRequestsError ?? null,
      currentUserId: (s as any).authUser?.user?.id ?? null,
    };
  });

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

  const handleCancelRequest = async (id: string) => {
    if (!window.confirm("Cancel this promote request?")) return;
    await dispatch(listingsApi.cancelPromoteRequest(id)).unwrap();
    dispatch(listingsApi.getMyListingPromoteRequests());
  };

  const handleDeleteRequest = async (id: string) => {
    if (!window.confirm("Delete this promote request?")) return;
    await dispatch(listingsApi.deletePromoteRequest(id)).unwrap();
    dispatch(listingsApi.getMyListingPromoteRequests());
  };

  const handleApproveRequest = async (id: string) => {
    if (!window.confirm("Approve this promote request?")) return;
    await dispatch(
      listingsApi.managePromoteRequest({ id, status: "approved" }) as any,
    ).unwrap();
    dispatch(listingsApi.getMyListingPromoteRequests());
  };

  const handleRejectRequest = async (id: string) => {
    if (!window.confirm("Reject this promote request?")) return;
    await dispatch(
      listingsApi.managePromoteRequest({ id, status: "rejected" }) as any,
    ).unwrap();
    dispatch(listingsApi.getMyListingPromoteRequests());
  };

  const isRequester = (request: any) => {
    const requesterId = request?.requester?.user_id;
    const requesterIdString =
      typeof requesterId === "string"
        ? requesterId
        : (requesterId?._id ?? requesterId);

    return (
      Boolean(currentUserId) &&
      String(requesterIdString) === String(currentUserId)
    );
  };

  const canManageRequest = (request: any) => {
    return request?.status === "pending";
  };

  const canApproveRejectRequest = (request: any) => {
    return request?.status === "pending" && !isRequester(request);
  };

  const canDeleteRequest = (request: any) => {
    return request?.status === "pending" && isRequester(request);
  };

  const handleCancelPendingListings =async (id: string) => {

  

   if (!window.confirm("Cancel this Listing request?")) return;
    await dispatch(listingsApi.cencelPendingListing(id)).unwrap();
    dispatch(listingsApi.getMyListings());

  }

  const handleDeletePendingListings = async (id : string) => {
      if (!window.confirm("Cancel this Listing request?")) return;
    await dispatch(listingsApi.deletePendingListing(id)).unwrap();
    dispatch(listingsApi.getMyListings());
  }

  useEffect(() => {
    dispatch(listingsApi.getMyListings());
    dispatch(listingsApi.getMyListingPromoteRequests());
  }, [dispatch]);

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
          ) : myListingsError ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {myListingsError}
            </div>
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
                    <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
                      Actions
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
                      <td>
                        <div className="flex flex-wrap items-center gap-2">
                          {l.status === "pending" ?
                           <>
                           <button
                              type="button"
                              onClick={() => handleCancelPendingListings(l._id)}
                              className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-yellow-300 transition hover:bg-yellow-500/20"
                            >
                              <XCircle size={12} />
                              Cancel
                            </button>
                           <button
                              type="button"
                              onClick={() => handleDeletePendingListings(l._id)}
                              className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                           
                           </> 
                           : <span className="text-white/30 text-xs">No actions</span>
                          }
                          {/* {!canManageRequest(l) &&
                            !canApproveRejectRequest(l) &&
                            !canDeleteRequest(l) && (
                              <span className="text-xs text-muted-foreground">
                                No actions
                              </span>
                            )} */}
                        </div>
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
          ) : promoteRequestsError ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {promoteRequestsError}
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
                              onClick={() => handleCancelRequest(r._id)}
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
                                onClick={() => handleApproveRequest(r._id)}
                                className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-green-300 transition hover:bg-green-500/20"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectRequest(r._id)}
                                className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {canDeleteRequest(r) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteRequest(r._id)}
                              className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          )}
                          {!canManageRequest(r) &&
                            !canApproveRejectRequest(r) &&
                            !canDeleteRequest(r) && (
                              <span className="text-xs text-muted-foreground">
                                No actions
                              </span>
                            )}
                        </div>
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
