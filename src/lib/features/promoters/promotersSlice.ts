import { createSlice } from "@reduxjs/toolkit";
import { promotersApi, Promoter } from "./promotersApi";

interface PromotersMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface PromotersState {
  items: Promoter[];
  meta: PromotersMeta | null;
  loading: boolean;
  error: string | null;
}

const initialState: PromotersState = {
  items: [],
  meta: null,
  loading: true,
  error: null,
};

const promotersSlice = createSlice({
  name: "promoters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(promotersApi.getPromoters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(promotersApi.getPromoters.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(promotersApi.getPromoters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch promoters";
      });
  },
});

export default promotersSlice.reducer;