import { createSlice } from "@reduxjs/toolkit";
import {
  getDashboardStats,
  fetchTopPromoters,
  getLisitngViewsAnalytics,
} from "./dashboardApi";
import {
  DashboardStats,
  ITopPromoter,
} from "./dashboardTypes";

interface DashboardState {
  loading: boolean;
  error: string | null;

  stats: DashboardStats;

  listingViewsAnalytics:any;
  listingViewsAnalyticsLoading: boolean;
  listingViewsAnalyticsError: string | null;
  topPromoters: ITopPromoter[];
  topPromotersLoading: boolean;
  topPromotersError: string | null;
}

const initialState: DashboardState = {
  loading: false,
  error: null,

  stats: {
    total_listings: 0,
    listing_value: 0,
    listing_views: 0,
    total_promoters: 0,
    properties_shared_with_me: 0,
    commission_pipeline: 0,
  },

  listingViewsAnalytics:[],
  listingViewsAnalyticsLoading:true,
  listingViewsAnalyticsError:null,
  topPromoters: [],
  topPromotersLoading: false,
  topPromotersError: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder


      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })

      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(fetchTopPromoters.pending, (state) => {
        state.topPromotersLoading = true;
        state.topPromotersError = null;
      })

      .addCase(fetchTopPromoters.fulfilled, (state, action) => {
        state.topPromotersLoading = false;
        state.topPromoters = action.payload;
      })

      .addCase(fetchTopPromoters.rejected, (state, action) => {
        state.topPromotersLoading = false;
        state.topPromotersError = action.payload as string;
      })

      .addCase(getLisitngViewsAnalytics.pending, (state) => {
        state.listingViewsAnalyticsLoading = true;
        state.listingViewsAnalyticsError = null;
      })

      .addCase(getLisitngViewsAnalytics.fulfilled, (state, action) => {
        state.listingViewsAnalyticsLoading = false;
        state.listingViewsAnalytics = action.payload;
      })

      .addCase(getLisitngViewsAnalytics.rejected, (state, action) => {
        state.listingViewsAnalyticsLoading = false;
        state.listingViewsAnalyticsError = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;