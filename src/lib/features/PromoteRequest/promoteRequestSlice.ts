import { createSlice } from "@reduxjs/toolkit";
import { promoteRequestApi, PromoteRequest, ApiError } from "./promoteRequestApi";

interface PromoteRequestsMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface ListState {
  items: PromoteRequest[];
  meta: PromoteRequestsMeta | null;
  loading: boolean;
  error: ApiError | null;
}

interface PromoteRequestsState {
  mine: ListState;
  received: ListState;
  creating: boolean;
  createError: ApiError | null;
}

const emptyList: ListState = {
  items: [],
  meta: null,
  loading: false,
  error: null,
};

const initialState: PromoteRequestsState = {
  mine: { ...emptyList },
  received: { ...emptyList },
  creating: false,
  createError: null,
};

const fallbackError = (message: string): ApiError => ({ message });

const promoteRequestSlice = createSlice({
  name: "promoteRequests",
  initialState,
  reducers: {
    clearCreateError: (state) => {
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(promoteRequestApi.createPromoteRequest.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(promoteRequestApi.createPromoteRequest.fulfilled, (state, action) => {
        state.creating = false;
        state.mine.items.unshift(action.payload);
      })
      .addCase(promoteRequestApi.createPromoteRequest.rejected, (state, action) => {
        state.creating = false;
        state.createError =
          action.payload ?? fallbackError("Failed to send promote request");
      })

      // Mine
    //   .addCase(promoteRequestApi.getMyPromoteRequests.pending, (state) => {
    //     state.mine.loading = true;
    //     state.mine.error = null;
    //   })
    //   .addCase(promoteRequestApi.getMyPromoteRequests.fulfilled, (state, action) => {
    //     state.mine.loading = false;
    //     state.mine.items = action.payload.data;
    //     state.mine.meta = action.payload.meta;
    //   })
    //   .addCase(promoteRequestApi.getMyPromoteRequests.rejected, (state, action) => {
    //     state.mine.loading = false;
    //     state.mine.error =
    //       action.payload ?? fallbackError("Failed to fetch your promote requests");
    //   })

      // Received
      .addCase(promoteRequestApi.getReceivedPromoteRequests.pending, (state) => {
        state.received.loading = true;
        state.received.error = null;
      })
      .addCase(promoteRequestApi.getReceivedPromoteRequests.fulfilled, (state, action) => {
        state.received.loading = false;
        state.received.items = action.payload.data;
        state.received.meta = action.payload.meta;
      })
      .addCase(promoteRequestApi.getReceivedPromoteRequests.rejected, (state, action) => {
        state.received.loading = false;
        state.received.error =
          action.payload ?? fallbackError("Failed to fetch received promote requests");
      });
  },
});

export const { clearCreateError } = promoteRequestSlice.actions;
export default promoteRequestSlice.reducer;