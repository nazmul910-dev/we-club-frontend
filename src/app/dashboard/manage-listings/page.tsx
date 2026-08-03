"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { listingsApi } from "@/lib/features/listings/listingsApi";

import {
  promoteRequestApi,
  RespondToOwnerTermsPayload,
} from "@/lib/features/PromoteRequest/promoteRequestApi";

import {
  AppDispatch,
  RootState,
} from "@/lib/redux/store/store";

import { MyListingsSection } from "@/components/Listings/MyListingsSection";
import { AllListingsAdminSection } from "@/components/Listings/AllListingsAddmin";

import { PromoteRequestsReceivedSection } from "@/components/Listings/PromoteRequestRecived";

import { MyPromoteRequestsSection } from "@/components/Listings/MyPromoteRequest";

import { TierSelectionDialog } from "@/components/Listings/TierSelectionDialog";

import {
  canApproveRejectRequest as canApproveRejectRequestFn,
  canDeleteRequest as canDeleteRequestFn,
} from "@/lib/utils/Helpers";

import { PaginationControl } from "@/components/ui/PaginationControll";

export default function ManageListingsPage() {
  const dispatch = useDispatch<AppDispatch>();

  /*
   * Owner approval modal states
   */
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedRequestId, setSelectedRequestId] =
    useState<string | null>(null);

  const [selectedTier, setSelectedTier] = useState<
    "tier_1" | "tier_2" | "tier_3"
  >("tier_1");

  const [
    confirmedCommissionPct,
    setConfirmedCommissionPct,
  ] = useState(0);

  const [isConfirming, setIsConfirming] =
    useState(false);

  /*
   * Pagination states
   */
  const [page, setPage] = useState(1);

  const [
    myListingsPage,
    setMyListingsPage,
  ] = useState(1);

  const [
    receivedRequestsPage,
    setReceivedRequestsPage,
  ] = useState(1);

  const [
    sentRequestsPage,
    setSentRequestsPage,
  ] = useState(1);

  const [limit] = useState(10);

  /*
   * Listing slice data
   *
   * এখানে শুধু listing-related data থাকবে।
   */
  const {
    myListings,
    myListingsLoading,
    myListingsError,

    currentUserId,
    userRole,

    adminListings,
    adminListingsError,
    adminListingsLoading,

    managingListingId,
    deletingListingId,

    adminListingsMeta,
    myListingsMeta,
  } = useSelector((state: RootState) => {
    return {
      myListings:
        (state as any).listings?.myListings ??
        [],

      myListingsLoading:
        (state as any).listings
          ?.myListingsLoading ?? false,

      myListingsError:
        (state as any).listings
          ?.myListingsError ?? null,

      currentUserId:
        (state as any).authUser?.user?.id ??
        null,

      userRole:
        (state as any).authUser?.user?.role ??
        null,

      adminListings:
        (state as any).listings
          ?.adminListings ?? [],

      adminListingsLoading:
        (state as any).listings
          ?.adminListingsLoading ?? false,

      adminListingsError:
        (state as any).listings
          ?.adminListingsError ?? null,

      managingListingId:
        (state as any).listings
          ?.managingListingId ?? null,

      deletingListingId:
        (state as any).listings
          ?.deletingListingId ?? null,

      adminListingsMeta:
        (state as any).listings
          ?.adminListingsMeta ?? null,

      myListingsMeta:
        (state as any).listings
          ?.myListingsMeta ?? null,
    };
  });

  /*
   * নতুন promoteRequests slice data
   *
   * Received requests:
   * state.promoteRequests.received
   *
   * Sent requests:
   * state.promoteRequests.mine
   */
  const {
    receivedPromoteRequests,
    receivedPromoteRequestsLoading,
    receivedPromoteRequestsError,
    receivedPromoteRequestsMeta,

    mySentPromoteRequests,
    mySentPromoteRequestsLoading,
    mySentPromoteRequestsError,
    myPromoteRequestsMeta,

    respondingId,
  } = useSelector((state: RootState) => {
    return {
      receivedPromoteRequests:
        state.promoteRequests.received.items,

      receivedPromoteRequestsLoading:
        state.promoteRequests.received.loading,

      receivedPromoteRequestsError:
        state.promoteRequests.received.error
          ?.message ?? null,

      receivedPromoteRequestsMeta:
        state.promoteRequests.received.meta,

      mySentPromoteRequests:
        state.promoteRequests.mine.items,

      mySentPromoteRequestsLoading:
        state.promoteRequests.mine.loading,

      mySentPromoteRequestsError:
        state.promoteRequests.mine.error
          ?.message ?? null,

      myPromoteRequestsMeta:
        state.promoteRequests.mine.meta,

      respondingId:
        state.promoteRequests.respondingId,
    };
  });

  const isAdmin =
    userRole === "admin";

  const isAdminOrManager =
    userRole === "admin" ||
    userRole === "manager";


  const canManageRequest = (
    request: any,
  ): boolean => {
    return request.status === "pending";
  };

  /*
   * Listing owner অথবা authorized user
   * pending request approve/reject করতে পারবে।
   */
  const canApproveRejectRequest = (
    request: any,
  ): boolean => {
    if (request.status !== "pending") {
      return false;
    }

    return canApproveRejectRequestFn(
      request,
      currentUserId,
    );
  };

  const canDeleteRequest = (
    request: any,
  ): boolean => {
    return canDeleteRequestFn(
      request,
      currentUserId,
    );
  };

  /*
   * Refresh received promote requests
   */
  const refreshReceivedRequests = async () => {
    await dispatch(
      promoteRequestApi.getReceivedPromoteRequests({
        page: receivedRequestsPage,
        limit,
      }),
    ).unwrap();
  };

  /*
   * Refresh promoter-এর sent requests
   */
  const refreshSentRequests = async () => {
    await dispatch(
      promoteRequestApi.getMyPromoteRequests({
        page: sentRequestsPage,
        limit,
      }),
    ).unwrap();
  };

  /*
   * Promoter pending request cancel করবে।
   *
   * Cancel API এখনো listingsApi-তে থাকলে
   * সেটাই ব্যবহার করা হচ্ছে।
   */
  const handleCancelRequest = async (
    id: string,
  ) => {
    await dispatch(
      listingsApi.cancelPromoteRequest(id),
    ).unwrap();

    await Promise.allSettled([
      refreshSentRequests(),
      refreshReceivedRequests(),
    ]);
  };

  /*
   * Admin promote request delete করবে।
   */
  const handleDeleteRequest = async (
    id: string,
  ) => {
    const confirmed = window.confirm(
      "Delete this promote request?",
    );

    if (!confirmed) return;

    await dispatch(
      listingsApi.deletePromoteRequest(id),
    ).unwrap();

    await Promise.allSettled([
      refreshReceivedRequests(),
      refreshSentRequests(),
    ]);
  };

  /*
   * Owner approve button click।
   *
   * Modal open হবে এবং proposed commission
   * default confirmed commission হিসেবে বসবে।
   */
  const handleApproveRequest = (
    id: string,
  ) => {
    const request =
      receivedPromoteRequests.find(
        (item) => item._id === id,
      );

    const proposedCommission =
      Number(
        request?.proposed_commission_pct ??
          request?.listing_id
            ?.referral_commission
            ?.offered_amount ??
          0,
      );

    setSelectedRequestId(id);
    setSelectedTier("tier_1");

    setConfirmedCommissionPct(
      Number.isFinite(proposedCommission)
        ? proposedCommission
        : 0,
    );

    setIsModalOpen(true);
  };

  /*
   * Owner final approve করবে।
   *
   * Backend-এ এর পরে status হবে:
   * owner_approved
   *
   * এখনো promotion final active হবে না।
   */
  const handleConfirmApprove = async () => {
    if (!selectedRequestId) return;

    if (
      confirmedCommissionPct < 0 ||
      confirmedCommissionPct > 100
    ) {
      window.alert(
        "Confirmed commission must be between 0 and 100.",
      );

      return;
    }

    setIsConfirming(true);

    try {
      await dispatch(
        listingsApi.managePromoteRequest({
          id: selectedRequestId,
          status: "approved",
          selected_tier: selectedTier,
        }) as any,
      ).unwrap();

      await Promise.allSettled([
        refreshReceivedRequests(),
        refreshSentRequests(),
      ]);

      setIsModalOpen(false);
      setSelectedRequestId(null);
    } catch (error) {
      console.error(
        "Failed to approve promote request:",
        error,
      );
    } finally {
      setIsConfirming(false);
    }
  };

  /*
   * Listing owner request reject করবে।
   */
  const handleRejectRequest = async (
    id: string,
  ) => {
    const confirmed = window.confirm(
      "Reject this promote request?",
    );

    if (!confirmed) return;

    await dispatch(
      listingsApi.managePromoteRequest({
        id,
        status: "rejected",
      }) as any,
    ).unwrap();

    await Promise.allSettled([
      refreshReceivedRequests(),
      refreshSentRequests(),
    ]);
  };

  /*
   * Owner approve করার পরে original requester
   * Accept অথবা Reject করবে।
   *
   * এই জায়গায় নতুন respondToOwnerTerms API call হচ্ছে।
   */
  const handleRespondToOwnerTerms = async (
    payload: RespondToOwnerTermsPayload,
  ) => {
    await dispatch(
      promoteRequestApi.respondToOwnerTerms(
        payload,
      ),
    ).unwrap();

    await Promise.allSettled([
      refreshSentRequests(),
      refreshReceivedRequests(),
    ]);
  };

  /*
   * Listing-related handlers
   */
  const handleCancelPendingListings = async (
    id: string,
  ) => {
    await dispatch(
      listingsApi.cencelPendingListing(id),
    ).unwrap();

    dispatch(
      listingsApi.getMyListings({
        page: myListingsPage,
        limit,
      }),
    );
  };

  const handleDeletePendingListings = async (
    id: string,
  ) => {
    await dispatch(
      listingsApi.deletePendingListing(id),
    ).unwrap();

    dispatch(
      listingsApi.getMyListings({
        page: myListingsPage,
        limit,
      }),
    );
  };

  const handleManageListingStatus = async (
    id: string,
    status: "active" | "rejected",
  ) => {
    await dispatch(
      listingsApi.manageListingStatus({
        id,
        status,
      }),
    ).unwrap();
  };

  const handleHardDeleteListing = async (
    id: string,
  ) => {
    await dispatch(
      listingsApi.deleteListing(id),
    ).unwrap();
  };

  /*
   * Initial data fetching
   */
  useEffect(() => {
    /*
     * Listing data
     */
    dispatch(
      listingsApi.getMyListings({
        page: myListingsPage,
        limit,
      }),
    );

    /*
     * নতুন promoteRequestApi:
     * Owner-এর received requests
     */
    dispatch(
      promoteRequestApi.getReceivedPromoteRequests({
        page: receivedRequestsPage,
        limit,
      }),
    );

    /*
     * নতুন promoteRequestApi:
     * Promoter-এর sent requests
     */
    dispatch(
      promoteRequestApi.getMyPromoteRequests({
        page: sentRequestsPage,
        limit,
      }),
    );

    if (isAdminOrManager) {
      dispatch(
        listingsApi.getAllListingsForAdmin({
          page,
          limit,
        }),
      );
    }
  }, [
    dispatch,
    isAdminOrManager,
    page,
    myListingsPage,
    receivedRequestsPage,
    sentRequestsPage,
    limit,
  ]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-1 flex-col gap-8 bg-[#0a0a0a] px-4 py-6 md:px-8">
      <div className="flex w-full flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-eyebrow mb-2">
            Listings
          </div>

          <h1 className="font-playfair text-3xl text-white md:text-4xl">
            Manage Listings
          </h1>
        </div>
      </div>

      <div className="scrollbar-hide w-full overflow-x-auto">
        <Tabs
          defaultValue="my-listings"
          className="w-full"
        >
          <TabsList className="flex w-full items-center justify-start gap-2 overflow-x-auto rounded-xl border border-gold-soft/30 bg-[#0f0f0f]/60 px-2 py-1">
            <TabsTrigger
              value="my-listings"
              className="rounded-xl text-white/70 hover:text-gold/80"
            >
              My Listings
            </TabsTrigger>

            {isAdminOrManager && (
              <TabsTrigger
                value="all-listings"
                className="rounded-xl text-white/70 hover:text-gold/80"
              >
                All Listings

                <span className="ml-1.5 text-gold">
                  Admin
                </span>
              </TabsTrigger>
            )}

            <TabsTrigger
              value="received"
              className="rounded-xl text-white/70 hover:text-gold/80"
            >
              Promote Requests Received
            </TabsTrigger>

            <TabsTrigger
              value="sent"
              className="rounded-xl text-white/70 hover:text-gold/80"
            >
              My Promote Requests
            </TabsTrigger>
          </TabsList>

          {/* My Listings */}
          <TabsContent
            value="my-listings"
            className="w-full"
          >
            <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
              <h2 className="mb-4 font-playfair text-xl font-semibold text-white">
                My Listings
              </h2>

              <MyListingsSection
                myListings={myListings}
                myListingsLoading={
                  myListingsLoading
                }
                myListingsError={
                  myListingsError
                }
                isAdmin={isAdmin}
                canApproveRejectRequest={
                  canApproveRejectRequest
                }
                onCancelPending={
                  handleCancelPendingListings
                }
                onDeletePending={
                  handleDeletePendingListings
                }
                onApproveRequest={
                  handleApproveRequest
                }
                onRejectRequest={
                  handleRejectRequest
                }
              />

              <div className="mt-8">
                <PaginationControl
                  currentPage={
                    myListingsMeta?.page ?? 1
                  }
                  totalPages={
                    myListingsMeta?.totalPage ??
                    1
                  }
                  onPageChange={
                    setMyListingsPage
                  }
                />
              </div>
            </section>
          </TabsContent>

          {/* All Listings Admin */}
          {isAdminOrManager && (
            <TabsContent value="all-listings">
              <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-playfair text-xl font-semibold text-white">
                    All Listings

                    <span className="ml-2 align-middle text-sm text-gold">
                      Admin
                    </span>
                  </h2>
                </div>

                <AllListingsAdminSection
                  adminListings={
                    adminListings
                  }
                  adminListingsLoading={
                    adminListingsLoading
                  }
                  adminListingsError={
                    adminListingsError
                  }
                  managingListingId={
                    managingListingId
                  }
                  deletingListingId={
                    deletingListingId
                  }
                  onManageStatus={
                    handleManageListingStatus
                  }
                  onHardDelete={
                    handleHardDeleteListing
                  }
                />

                <div className="mt-8">
                  <PaginationControl
                    currentPage={
                      adminListingsMeta?.page ??
                      1
                    }
                    totalPages={
                      adminListingsMeta
                        ?.totalPage ?? 1
                    }
                    onPageChange={setPage}
                  />
                </div>
              </section>
            </TabsContent>
          )}

          {/* Received Promote Requests */}
          <TabsContent value="received">
            <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
              <h2 className="mb-4 font-playfair text-xl font-semibold text-white">
                Promote Requests Received
              </h2>

              <PromoteRequestsReceivedSection
                promoteRequests={
                  receivedPromoteRequests
                }
                promoteRequestsLoading={
                  receivedPromoteRequestsLoading
                }
                promoteRequestsError={
                  receivedPromoteRequestsError
                }
                canApproveRejectRequest={
                  canApproveRejectRequest
                }
                canDeleteRequest={
                  canDeleteRequest
                }
                onApprove={
                  handleApproveRequest
                }
                onReject={
                  handleRejectRequest
                }
                onDelete={
                  handleDeleteRequest
                }
              />

              <div className="mt-8">
                <PaginationControl
                  currentPage={
                    receivedPromoteRequestsMeta
                      ?.page ?? 1
                  }
                  totalPages={
                    receivedPromoteRequestsMeta
                      ?.totalPage ?? 1
                  }
                  onPageChange={
                    setReceivedRequestsPage
                  }
                />
              </div>
            </section>
          </TabsContent>

          {/* My Sent Promote Requests */}
          <TabsContent value="sent">
            <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
              <h2 className="mb-4 font-playfair text-xl font-semibold text-white">
                My Promote Requests
              </h2>

              <MyPromoteRequestsSection
                mySentPromoteRequests={
                  mySentPromoteRequests
                }
                mySentPromoteRequestsLoading={
                  mySentPromoteRequestsLoading
                }
                mySentPromoteRequestsError={
                  mySentPromoteRequestsError
                }
                canManageRequest={
                  canManageRequest
                }
                onCancel={
                  handleCancelRequest
                }
                onRespondToOwnerTerms={
                  handleRespondToOwnerTerms
                }
                respondingId={
                  respondingId
                }
              />

              <div className="mt-8">
                <PaginationControl
                  currentPage={
                    myPromoteRequestsMeta?.page ??
                    1
                  }
                  totalPages={
                    myPromoteRequestsMeta
                      ?.totalPage ?? 1
                  }
                  onPageChange={
                    setSentRequestsPage
                  }
                />
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>

      {/* Owner tier selection modal */}
      <TierSelectionDialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);

          if (!open) {
            setSelectedRequestId(null);
          }
        }}
        selectedTier={selectedTier}
        onSelectTier={setSelectedTier}
        onConfirm={
          handleConfirmApprove
        }
        isConfirming={
          isConfirming
        }
      />
    </div>
  );
}