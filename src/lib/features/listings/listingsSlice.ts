import { createSlice } from "@reduxjs/toolkit";
import { listingsApi, Promoter } from "@/lib/features/listings/listingsApi"; // ← update this to match wherever you saved the file with getListings/listingsApi

export interface Listing {
  id: string;
  [key: string]: any; // replace with your real Listing shape
}

interface ListingsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ListingsState {
  items: Listing[];
  meta: ListingsMeta | null;
  loading: boolean;
  error: string | null;
  promoters: Promoter[];
  promotersLoading: boolean;
  promotersError: string | null;
  myListings: Listing[];
  myListingsLoading: boolean;
  myListingsError: string | null;
  promoteRequests: any[];
  promoteRequestsLoading: boolean;
  promoteRequestsError: string | null;
  mySentPromoteRequests: any[];
  mySentPromoteRequestsLoading: boolean;
  mySentPromoteRequestsError: string | null;
  // ← these six were missing from the interface, which is what caused the
  // "object literal may only specify known properties" error below
  adminListings: any[];
  adminListingsMeta: any;
  myListingsMeta: any;
  promoteRequestsMeta: any;
  myPromoteRequestsMeta: any;
  adminListingsLoading: boolean;
  adminListingsError: string | null;
  managingListingId: string | null;
  deletingListingId: string | null;
  mostViewedListings: any[];
  mostViewedListingsLoading: boolean;
  mostViewedListingsError: string | null;
}

const initialState: ListingsState = {
  items: [],
  meta: null,
  loading: false,
  error: null,
  promoters: [],
  promotersLoading: false,
  promotersError: null,
  myListings: [],
  myListingsLoading: false,
  myListingsError: null,
  promoteRequests: [],
  promoteRequestsLoading: false,
  promoteRequestsError: null,
  mySentPromoteRequests: [],
  mySentPromoteRequestsLoading: false,
  mySentPromoteRequestsError: null,
  adminListings: [],
  adminListingsMeta: null,
  myListingsMeta: null,
  promoteRequestsMeta: null,
  myPromoteRequestsMeta: null,
  adminListingsLoading: false,
  adminListingsError: null,
  managingListingId: null,
  deletingListingId: null,
  mostViewedListings: [],
  mostViewedListingsLoading: false,
  mostViewedListingsError: null,
};

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    // add sync reducers here if you need them later, e.g. clearListings
  },
  extraReducers: (builder) => {
    builder
      .addCase(listingsApi.getListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listingsApi.getListings.fulfilled, (state, action) => {
        state.loading = false;
        const responseMeta = action.payload.data.meta;
        state.items = action.payload.data.data;
        state.meta = {
          page: responseMeta.page,
          limit: responseMeta.limit,
          total: responseMeta.total,
          totalPages: responseMeta.totalPage,
        };
      })
      .addCase(listingsApi.getListings.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to fetch listings";
      })
      .addCase(listingsApi.postListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listingsApi.postListing.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // Add the newly created listing at the beginning
        state.items.unshift(action.payload);
        state.myListings.unshift(action.payload);
      })

      .addCase(listingsApi.postListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create listing";
      })
      .addCase(listingsApi.getMyPromoters.pending, (state) => {
        state.promotersLoading = true; // ← own loading flag
        state.promotersError = null;
      })
      .addCase(listingsApi.getMyPromoters.fulfilled, (state, action) => {
        state.promotersLoading = false;
        state.promoters = action.payload.data; // ← own array, not state.items
      })
      .addCase(listingsApi.getMyPromoters.rejected, (state, action) => {
        state.promotersLoading = false;
        state.promotersError = action.payload as string; // ← own error
      });

    // my listings
    builder
      .addCase(listingsApi.getMyListings.pending, (state) => {
        state.myListingsLoading = true;
        state.myListingsError = null;
      })
      .addCase(listingsApi.getMyListings.fulfilled, (state, action) => {
        state.myListingsLoading = false;
        state.myListingsMeta = action.payload.data.meta;
        state.myListings = action.payload.data.data;
      })
      .addCase(listingsApi.getMyListings.rejected, (state, action) => {
        state.myListingsLoading = false;
        state.myListingsError =
          (action.payload as string) ?? "Failed to fetch my listings";
      })

      // promote requests for my listings
      .addCase(listingsApi.getMyListingPromoteRequests.pending, (state) => {
        state.promoteRequestsLoading = true;
        state.promoteRequestsError = null;
      })
      .addCase(
        listingsApi.getMyListingPromoteRequests.fulfilled,
        (state, action) => {
          state.promoteRequestsLoading = false;
          state.promoteRequestsMeta = action.payload.data.meta;
          state.promoteRequests = action.payload.data.data;
        },
      )
      .addCase(
        listingsApi.getMyListingPromoteRequests.rejected,
        (state, action) => {
          state.promoteRequestsLoading = false;
          state.promoteRequestsError =
            (action.payload as string) ?? "Failed to fetch promote requests";
        },
      )
      .addCase(listingsApi.getMySentPromoteRequests.pending, (state) => {
        state.mySentPromoteRequestsLoading = true;
        state.mySentPromoteRequestsError = null;
      })
      .addCase(
        listingsApi.getMySentPromoteRequests.fulfilled,
        (state, action) => {
          state.mySentPromoteRequestsLoading = false;
          state.mySentPromoteRequests = action.payload.data.data;
          state.myPromoteRequestsMeta = action.payload.data.meta;
        },
      )
      .addCase(
        listingsApi.getMySentPromoteRequests.rejected,
        (state, action) => {
          state.mySentPromoteRequestsLoading = false;
          state.mySentPromoteRequestsError =
            (action.payload as string) ??
            "Failed to fetch sent promote requests";
        },
      )
      .addCase(listingsApi.cancelPromoteRequest.fulfilled, (state, action) => {
        state.promoteRequests = state.promoteRequests.filter(
          (request) => request._id !== action.payload?._id,
        );
        state.mySentPromoteRequests = state.mySentPromoteRequests.filter(
          (request) => request._id !== action.payload?._id,
        );
      })
      .addCase(listingsApi.deletePromoteRequest.fulfilled, (state, action) => {
        state.promoteRequests = state.promoteRequests.filter(
          (request) => request._id !== action.payload?._id,
        );
        state.mySentPromoteRequests = state.mySentPromoteRequests.filter(
          (request) => request._id !== action.payload?._id,
        );
      })
      .addCase(listingsApi.getAllListingsForAdmin.pending, (state) => {
        state.adminListingsLoading = true;
        state.adminListingsError = null;
      })
      .addCase(
        listingsApi.getAllListingsForAdmin.fulfilled,
        (state, action) => {
          state.adminListingsLoading = false;
          state.adminListings = action.payload.data.data;
          state.adminListingsMeta = action.payload.data.meta;
        },
      )
      // ← was `listingsApi.rejected` (invalid — listingsApi is the whole
      // export object, not a thunk itself). Needed the specific thunk's
      // own `.rejected` action.
      .addCase(listingsApi.getAllListingsForAdmin.rejected, (state, action) => {
        state.adminListingsLoading = false;
        state.adminListingsError =
          (action.payload as string) ?? "Failed to fetch listings";
      })

      .addCase(listingsApi.manageListingStatus.pending, (state, action) => {
        state.managingListingId = action.meta.arg.id;
      })
      .addCase(listingsApi.manageListingStatus.fulfilled, (state, action) => {
        state.managingListingId = null;
        // Update the row in place so the table reflects the new status
        // immediately, without waiting for a full refetch.
        const idx = state.adminListings.findIndex(
          (l: any) => l._id === action.payload._id,
        );
        if (idx !== -1) state.adminListings[idx] = action.payload;
      })
      // ← was bare `manageListingStatus` (never imported directly in this
      // file — only `listingsApi` and `Promoter` are imported). Needed the
      // `listingsApi.` prefix, same as every other case here.
      .addCase(listingsApi.manageListingStatus.rejected, (state) => {
        state.managingListingId = null;
      })

      // ← was `listingsApi.deleteListing` — CONFIRM this matches the exact
      // export name in your listingsApi.ts. It was suggested as
      // `deleteListingHard` to avoid clashing with your existing soft-delete
      // `deletePendingListing`. Rename here (all 3 cases below) if you
      // actually called it something else.
      .addCase(listingsApi.deleteListing.pending, (state, action) => {
        state.deletingListingId = action.meta.arg; // the id string itself
      })
      .addCase(listingsApi.deleteListing.fulfilled, (state, action) => {
        state.deletingListingId = null;
        state.adminListings = state.adminListings.filter(
          (l: any) => l._id !== action.payload,
        );
      })
      .addCase(listingsApi.deleteListing.rejected, (state) => {
        state.deletingListingId = null;
      })
      .addCase(listingsApi.getMostViewedListings.pending, (state) => {
        state.mostViewedListingsLoading = true;
        state.mostViewedListingsError = null;
      })
      .addCase(listingsApi.getMostViewedListings.fulfilled, (state, action) => {
        state.mostViewedListingsLoading = false;
        state.mostViewedListings = action.payload.data.data;
      })
      .addCase(listingsApi.getMostViewedListings.rejected, (state, action) => {
        state.mostViewedListingsLoading = false;
        state.mostViewedListingsError =
          (action.payload as string) ?? "Failed to fetch most viewed listings";
      });
  },
});

export default listingsSlice.reducer;
