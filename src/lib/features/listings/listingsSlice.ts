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
  meta: ListingsMeta | null; // ← union type, not just null
  loading: boolean;
  error: string | null;
  promoters: Promoter[];
  promotersLoading: boolean;
  promotersError: string | null;
}

const initialState: ListingsState = {
  items: [],
  meta: null,
  loading: false,
  error: null,
  promoters: [],
  promotersLoading: false,
  promotersError: null,
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
        // Real API shape: { success, message, data: { data: Listing[], meta } }
        // Unwrap both levels here so components can just consume `items` as
        // a plain array and `meta` as flat pagination info.
        state.items = action.payload.data.data;
        state.meta = action.payload.data.meta;
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
  },
});

export default listingsSlice.reducer;
