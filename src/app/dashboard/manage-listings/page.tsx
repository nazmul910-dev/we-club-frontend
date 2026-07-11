"use client";

import { listingsApi } from "@/lib/features/listings/listingsApi";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { MyListingsSection } from "@/components/Listings/MyListingsSection";
import { AllListingsAdminSection } from "@/components/Listings/AllListingsAddmin";
import { PromoteRequestsReceivedSection } from "@/components/Listings/PromoteRequestRecived";

import { TierSelectionDialog } from "@/components/Listings/TierSelectionDialog";
import {
  isRequester as isRequesterFn,
  canManageRequest as canManageRequestFn,
  canApproveRejectRequest as canApproveRejectRequestFn,
  canDeleteRequest as canDeleteRequestFn,
} from "@/lib/utils/Helpers";
import { MyPromoteRequestsSection } from "@/components/Listings/MyPromoteRequest";
import { PaginationControl } from "@/components/ui/PaginationControll";

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

  const [page, setPage] = useState(1);
  const [myListingsPage, setMyListingsPage] = useState(1);
  const [adminListingsPage, setAdminListingsPage] = useState(1);
  const [receivedRequestsPage, setReceivedRequestsPage] = useState(1);
  const [sentRequestsPage, setSentRequestsPage] = useState(1);
  const [limit, setLimit] = useState(10);

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
    deletingListingId,
    adminListingsMeta,
    myListingsMeta,
    promoteRequestsMeta,
    myPromoteRequestsMeta,
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
      adminListingsMeta: (s as any).listings?.adminListingsMeta,
      myListingsMeta: (s as any).listings?.myListingsMeta,
      promoteRequestsMeta: (s as any).listings?.promoteRequestsMeta,
      myPromoteRequestsMeta: (s as any).listings?.myPromoteRequestsMeta,
      adminListingsError: (s as any).listings?.adminListingsError ?? null,
      managingListingId: (s as any).listings?.managingListingId ?? null,
      deletingListingId: (s as any).listings?.deletingListingId ?? null,
    };
  });

  const isAdmin = userRole === "admin";
  const isAdminOrManager = userRole === "admin" || userRole === "manager";


  const [fetchedTabs, setFetchedTabs] = useState<Set<string>>(new Set());

  const fetchTabData = (tab: string) => {
    setFetchedTabs((prev) => {
      if (prev.has(tab)) return prev;

      switch (tab) {
        case "my-listings":
          dispatch(listingsApi.getMyListings());
          break;
        case "all-listings":
          if (isAdminOrManager) dispatch(listingsApi.getAllListingsForAdmin());
          break;
        case "received":
          dispatch(listingsApi.getMyListingPromoteRequests());
          break;
        case "sent":
          dispatch(listingsApi.getMySentPromoteRequests());
          break;
      }

      return new Set(prev).add(tab);
    });
  };

;

  // Bound versions of the shared helpers, so section components stay
  // presentational and don't need to know about currentUserId themselves.
  const isRequester = (request: any) => isRequesterFn(request, currentUserId);
  const canManageRequest = (request: any) => canManageRequestFn(request);
  const canApproveRejectRequest = (request: any) =>
    canApproveRejectRequestFn(request, currentUserId);
  const canDeleteRequest = (request: any) =>
    canDeleteRequestFn(request, currentUserId);

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

  const handleManageListingStatus = async (
    id: string,
    status: "active" | "rejected",
  ) => {
    if (
      !window.confirm(
        `${status === "active" ? "Approve" : "Reject"} this listing?`,
      )
    )
      return;
    await dispatch(listingsApi.manageListingStatus({ id, status })).unwrap();
  };

  const handleHardDeleteListing = async (id: string) => {
    if (
      !window.confirm(
        "This will PERMANENTLY delete this listing. This cannot be undone. Continue?",
      )
    )
      return;
    await dispatch(listingsApi.deleteListing(id)).unwrap();
  };

  useEffect(() => {
    dispatch(
      listingsApi.getMyListings({
        page: myListingsPage,
        limit,
      }),
    );
    dispatch(
      listingsApi.getMyListingPromoteRequests({
        page: receivedRequestsPage,
        limit,
      }),
    );
    dispatch(
      listingsApi.getMySentPromoteRequests({ page: sentRequestsPage, limit }),
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
    <div className="flex-1   px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)] w-full ">
      <div className="flex flex-wrap items-end justify-between gap-4 w-full">
        <div>
          <div className="text-eyebrow mb-2">Listings</div>
          <h1 className="font-playfair text-3xl md:text-4xl text-white">
            Manage Listings
          </h1>
        </div>
      </div>

     <div className="w-full overflow-x-auto scrollbar-hide">

         <Tabs defaultValue="my-listings" className="w-full">
        <TabsList
          className=" overflow-x-auto w-full
      
      gap-2
      rounded-xl
      border
      border-gold-soft/30
      bg-[#0f0f0f]/60
      py-1
      px-2
      flex justify-start items-center
     
      
      "
        >
          <TabsTrigger
            value="my-listings"
            className="text-white/70  hover:text-gold/80 rounded-xl"
          >
            My Listings
          </TabsTrigger>
          {isAdminOrManager && (
            <TabsTrigger
              value="all-listings"
              className="text-white/70 hover:text-gold/80 rounded-xl"
            >
              All Listings <span className="ml-1.5 text-gold">Admin</span>
            </TabsTrigger>
          )}
          <TabsTrigger
            value="received"
            className="text-white/70 hover:text-gold/80 rounded-xl"
          >
            Promote Requests Received
          </TabsTrigger>
          <TabsTrigger
            value="sent"
            className="text-white/70 hover:text-gold/80 rounded-xl"
          >
            My Promote Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-listings" className="w-full ">
          <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
            <h2 className="mb-4 text-xl font-playfair font-semibold text-white">
              My Listings
            </h2>
            <MyListingsSection
              myListings={myListings}
              myListingsLoading={myListingsLoading}
              myListingsError={myListingsError}
              isAdmin={isAdmin}
              canApproveRejectRequest={canApproveRejectRequest}
              onCancelPending={handleCancelPendingListings}
              onDeletePending={handleDeletePendingListings}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
            />
            <div className="mt-8">
              <PaginationControl
                currentPage={myListingsMeta?.page}
                totalPages={myListingsMeta?.totalPage ?? 1}
                onPageChange={setMyListingsPage}
              />
            </div>
          </section>
        </TabsContent>

        {isAdminOrManager && (
          <TabsContent value="all-listings">
            <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-playfair font-semibold text-white">
                  All Listings{" "}
                  <span className="text-gold text-sm align-middle ml-2">
                    Admin
                  </span>
                </h2>
              </div>
              <AllListingsAdminSection
                adminListings={adminListings}
                adminListingsLoading={adminListingsLoading}
                adminListingsError={adminListingsError}
                managingListingId={managingListingId}
                deletingListingId={deletingListingId}
                onManageStatus={handleManageListingStatus}
                onHardDelete={handleHardDeleteListing}
              />

              <div className="mt-8">
                <PaginationControl
                  currentPage={adminListingsMeta?.page}
                  totalPages={adminListingsMeta?.totalPage ?? 1}
                  onPageChange={setPage}
                />
              </div>
            </section>
          </TabsContent>
        )}

        <TabsContent value="received">
          <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
            <h2 className="mb-4 text-xl font-playfair font-semibold text-white">
              Promote Requests Received
            </h2>
            <PromoteRequestsReceivedSection
              promoteRequests={promoteRequests}
              promoteRequestsLoading={promoteRequestsLoading}
              promoteRequestsError={promoteRequestsError}
              isRequester={isRequester}
              canManageRequest={canManageRequest}
              canApproveRejectRequest={canApproveRejectRequest}
              canDeleteRequest={canDeleteRequest}
              onCancel={handleCancelRequest}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              onDelete={handleDeleteRequest}
            />
            <div className="mt-8">
              <PaginationControl
                currentPage={promoteRequestsMeta?.page}
                totalPages={promoteRequestsMeta?.totalPage ?? 1}
                onPageChange={setReceivedRequestsPage}
              />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="sent">
          <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
            <h2 className="mb-4 text-xl font-playfair font-semibold text-white">
              My Promote Requests
            </h2>
            <MyPromoteRequestsSection
              mySentPromoteRequests={mySentPromoteRequests}
              mySentPromoteRequestsLoading={mySentPromoteRequestsLoading}
              mySentPromoteRequestsError={mySentPromoteRequestsError}
              canManageRequest={canManageRequest}
              onCancel={handleCancelRequest}
            />

            <div className="mt-8">
              <PaginationControl
                currentPage={myPromoteRequestsMeta?.page}
                totalPages={myPromoteRequestsMeta?.totalPage ?? 1}
                onPageChange={setSentRequestsPage}
              />
            </div>
          </section>
        </TabsContent>
      </Tabs>
     </div>

      <TierSelectionDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedTier={selectedTier}
        onSelectTier={setSelectedTier}
        onConfirm={handleConfirmApprove}
        isConfirming={isConfirming}
      />
    </div>
  );
}
