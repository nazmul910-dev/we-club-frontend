"use client";

import { statusBadge } from "@/components/Listings/StatusBadge";
import { listingsApi } from "@/lib/features/listings/listingsApi";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";

export default function ManageListingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [selectedTier, setSelectedTier] = useState<
    "tier_1" | "tier_2" | "tier_3"
  >("tier_1");
  const [isConfirming, setIsConfirming] = useState(false);
  const {
    myListings,
    myListingsLoading,
    myListingsError,
    promoteRequests,
    promoteRequestsLoading,
    promoteRequestsError,
    mySentPromoteRequests,
    mySentPromoteRequestsLoading,
    mySentPromoteRequestsError,
    currentUserId,
    userRole,
    adminListings,
    adminListingsError,
    adminListingsLoading,
    managingListingId,
    deletingListingId
  } = useSelector((s: RootState) => {
    return {
      myListings: (s as any).listings?.myListings ?? [],
      myListingsLoading: (s as any).listings?.myListingsLoading ?? false,
      myListingsError: (s as any).listings?.myListingsError ?? null,
      promoteRequests: (s as any).listings?.promoteRequests ?? [],
      promoteRequestsLoading:
        (s as any).listings?.promoteRequestsLoading ?? false,
      promoteRequestsError: (s as any).listings?.promoteRequestsError ?? null,
      mySentPromoteRequests: (s as any).listings?.mySentPromoteRequests ?? [],
      mySentPromoteRequestsLoading:
        (s as any).listings?.mySentPromoteRequestsLoading ?? false,
      mySentPromoteRequestsError:
        (s as any).listings?.mySentPromoteRequestsError ?? null,
      currentUserId: (s as any).authUser?.user?.id ?? null,
      userRole: (s as any).authUser?.user?.role ?? null,
      adminListings: (s as any).listings?.adminListings ?? [],
      adminListingsLoading: (s as any).listings?.adminListingsLoading ?? false,
      adminListingsError: (s as any).listings?.adminListingsError ?? null,
      managingListingId: (s as any).listings?.managingListingId ?? null,
      deletingListingId: (s as any).listings?.deletingListingId ?? null,
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
    dispatch(listingsApi.getMySentPromoteRequests());
  };

  const handleApproveRequest = async (id: string) => {
    setSelectedRequestId(id);
    setSelectedTier("tier_1");
    setIsModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedRequestId) return;
    setIsConfirming(true);
    try {
      await dispatch(
        listingsApi.managePromoteRequest({
          id: selectedRequestId,
          status: "approved",
          selected_tier: selectedTier,
        }) as any,
      ).unwrap();
      dispatch(listingsApi.getMyListingPromoteRequests());
      dispatch(listingsApi.getMySentPromoteRequests());
      setIsModalOpen(false);
      setSelectedRequestId(null);
    } catch (error) {
      console.error("Failed to approve request:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleRejectRequest = async (id: string) => {
    if (!window.confirm("Reject this promote request?")) return;
    await dispatch(
      listingsApi.managePromoteRequest({ id, status: "rejected" }) as any,
    ).unwrap();
    dispatch(listingsApi.getMyListingPromoteRequests());
    dispatch(listingsApi.getMySentPromoteRequests());
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

  const handleCancelPendingListings = async (id: string) => {
    if (!window.confirm("Cancel this Listing request?")) return;
    await dispatch(listingsApi.cencelPendingListing(id)).unwrap();
    dispatch(listingsApi.getMyListings());
  };

  const handleDeletePendingListings = async (id: string) => {
    if (!window.confirm("Cancel this Listing request?")) return;
    await dispatch(listingsApi.deletePendingListing(id)).unwrap();
    dispatch(listingsApi.getMyListings());
  };

  //   const isListingOwner = (listing : any) => {
  //     console.log(listing.associate_id.toString() === currentUserId.toString())
  //     return listing.associate_id.toString() === currentUserId.toString();
  //   }
  const isAdmin = userRole === "admin";

  const handleListingRequest = async (id: string) => {
    if (!window.confirm("Approve this promote request?")) return;
    await dispatch(
      listingsApi.managePromoteRequest({ id, status: "approved" }) as any,
    ).unwrap();
    dispatch(listingsApi.getMyListingPromoteRequests());
  };

  const isAdminOrManager = userRole === "admin" || userRole === "manager";

  const handleManageListingStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    if (!window.confirm(`${status === "approved" ? "Approve" : "Reject"} this listing?`)) return;
    await dispatch(listingsApi.manageListingStatus({ id, status })).unwrap();
  };
 
  const handleHardDeleteListing = async (id: string) => {
    if (
      !window.confirm(
        "This will PERMANENTLY delete this listing. This cannot be undone. Continue?"
      )
    )
      return;
    await dispatch(listingsApi.deleteListing(id)).unwrap();
  };

  useEffect(() => {
    dispatch(listingsApi.getMyListings());
    dispatch(listingsApi.getMyListingPromoteRequests());
    dispatch(listingsApi.getMySentPromoteRequests());
    if (isAdminOrManager) {
      dispatch(listingsApi.getAllListingsForAdmin());
    }
  }, [dispatch, isAdminOrManager]);

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
                          {l.status === "pending" ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCancelPendingListings(l._id)
                                }
                                className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-yellow-300 transition hover:bg-yellow-500/20"
                              >
                                <XCircle size={12} />
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeletePendingListings(l._id)
                                }
                                className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            </>
                          ) : (
                            <span className="text-white/30 text-xs">
                              No actions
                            </span>
                          )}
                          {canApproveRejectRequest(l) && isAdmin && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveRequest(l._id)}
                                className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-green-300 transition hover:bg-green-500/20"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectRequest(l._id)}
                                className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20"
                              >
                                Reject
                              </button>
                            </>
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


        
{isAdminOrManager && (
  <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-white">
        All Listings <span className="text-gold text-sm align-middle ml-2">Admin</span>
      </h2>
    </div>
 
    {adminListingsLoading ? (
      <div className="text-muted-foreground">Loading all listings…</div>
    ) : adminListingsError ? (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {adminListingsError}
      </div>
    ) : adminListings.length === 0 ? (
      <div className="text-muted-foreground">No listings found.</div>
    ) : (
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
                            onClick={() => handleManageListingStatus(l._id, "approved")}
                            className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-green-300 transition hover:bg-green-500/20 disabled:opacity-40"
                          >
                            {isManaging ? "..." : "Approve"}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleManageListingStatus(l._id, "rejected")}
                            className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20 disabled:opacity-40"
                          >
                            {isManaging ? "..." : "Reject"}
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleHardDeleteListing(l._id)}
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
    )}
  </section>
)}

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

        <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            My Promote Requests
          </h2>
          {mySentPromoteRequestsLoading ? (
            <div className="text-muted-foreground">Loading your requests…</div>
          ) : mySentPromoteRequestsError ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {mySentPromoteRequestsError}
            </div>
          ) : mySentPromoteRequests.length === 0 ? (
            <div className="text-muted-foreground">
              You have not sent any promote requests yet.
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
                        {request.listing_id?.title ||
                          request.listing_id?.ref_code}
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        {request.listing_id?.price?.amount ?? "-"}{" "}
                        {request.listing_id?.price?.currency ?? ""}
                      </td>
                      <td className="px-4 py-3">
                        {statusBadge(request.status)}
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        {formatDate(request.requested_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {canManageRequest(request) && (
                            <button
                              type="button"
                              onClick={() => handleCancelRequest(request._id)}
                              className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-yellow-300 transition hover:bg-yellow-500/20"
                            >
                              <XCircle size={12} />
                              Cancel
                            </button>
                          )}
                          {!canManageRequest(request) && (
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

      {/* Tier Selection Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <h2 className="text-xl font-semibold text-white">
                Assign Sharing Permission
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Determine how this promoter may present the property. Revocable
                at any time.
              </p>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-4 py-6">
              {/* Tier 1 */}
              <button
                type="button"
                onClick={() => setSelectedTier("tier_1")}
                className={`rounded-2xl border p-4 transition ${
                  selectedTier === "tier_1"
                    ? "border-gold-soft bg-gold-soft/10"
                    : "border-gold-soft/30 hover:border-gold-soft/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-ui uppercase tracking-wider text-gold-soft">
                    Option
                  </span>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      selectedTier === "tier_1"
                        ? "border-gold bg-gold"
                        : "border-gold-soft/30"
                    }`}
                  >
                    {selectedTier === "tier_1" && (
                      <div className="h-2 w-2 bg-black rounded-full" />
                    )}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  Full Marketing + Website
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Maximum reach. Full address and visuals exposed.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Full address & geolocation revealed</li>
                  <li>• All photography (interior + exterior)</li>
                  <li>• Promoter may publish to their own website</li>
                  <li>• Listing appears in network newsletter</li>
                </ul>
              </button>

              {/* Tier 2 */}
              <button
                type="button"
                onClick={() => setSelectedTier("tier_2")}
                className={`rounded-2xl border p-4 transition ${
                  selectedTier === "tier_2"
                    ? "border-gold bg-gold/10"
                    : "border-gold-soft/30 hover:border-gold-soft/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-ui uppercase tracking-wider text-gold">
                    Option
                  </span>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      selectedTier === "tier_2"
                        ? "border-gold bg-gold"
                        : "border-gold-soft/30"
                    }`}
                  >
                    {selectedTier === "tier_2" && (
                      <div className="h-2 w-2 bg-black rounded-full" />
                    )}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  Full Marketing
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Distribution to qualified buyers only — no public listing.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Full address shared with vetted prospects</li>
                  <li>• All photography (interior + exterior)</li>
                  <li>• No public web publication permitted</li>
                  <li>• Print collateral & private decks allowed</li>
                </ul>
              </button>

              {/* Tier 3 */}
              <button
                type="button"
                onClick={() => setSelectedTier("tier_3")}
                className={`rounded-2xl border p-4 transition ${
                  selectedTier === "tier_3"
                    ? "border-gold-soft bg-gold-soft/10"
                    : "border-gold-soft/30 hover:border-gold-soft/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-ui uppercase tracking-wider text-gold-soft">
                    Option
                  </span>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      selectedTier === "tier_3"
                        ? "border-gold bg-gold"
                        : "border-gold-soft/30"
                    }`}
                  >
                    {selectedTier === "tier_3" && (
                      <div className="h-2 w-2 bg-black rounded-full" />
                    )}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  Discreet Marketing
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Off-market. Whispered; never broadcast.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Address withheld until NDA signed</li>
                  <li>• Exterior photography only</li>
                  <li>• 1:1 introductions only — no decks</li>
                  <li>• All inquiries routed through Associate</li>
                </ul>
              </button>
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isConfirming}
                className="rounded-full border border-white/20 bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={isConfirming}
                className="rounded-full border border-gold bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-gold/90 disabled:opacity-50"
              >
                {isConfirming
                  ? "Confirming..."
                  : "Confirm Marketing Permission"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
