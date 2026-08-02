import { createSlice } from "@reduxjs/toolkit";
import {
  promoteRequestApi,
  PromoteRequest,
  ApiError,
} from "./promoteRequestApi";

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

  respondingId: string | null;
  respondError: ApiError | null;
}

const emptyList = (): ListState => ({
  items: [],
  meta: null,
  loading: false,
  error: null,
});

const initialState: PromoteRequestsState = {
  mine: emptyList(),
  received: emptyList(),

  creating: false,
  createError: null,

  respondingId: null,
  respondError: null,
};

const fallbackError = (message: string): ApiError => ({
  message,
});

const promoteRequestSlice = createSlice({
  name: "promoteRequests",

  initialState,

  reducers: {
    clearCreateError: (state) => {
      state.createError = null;
    },

    clearRespondError: (state) => {
      state.respondError = null;
    },

    clearMineError: (state) => {
      state.mine.error = null;
    },

    clearReceivedError: (state) => {
      state.received.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /*
       * Create promote request
       */
      .addCase(promoteRequestApi.createPromoteRequest.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })

      .addCase(
        promoteRequestApi.createPromoteRequest.fulfilled,
        (state, action) => {
          state.creating = false;
          state.createError = null;

          /*
           * একই request duplicate যেন না হয়।
           */
          const alreadyExists = state.mine.items.some(
            (item) => item._id === action.payload._id,
          );

          if (!alreadyExists) {
            state.mine.items.unshift(action.payload);
          }
        },
      )

      .addCase(
        promoteRequestApi.createPromoteRequest.rejected,
        (state, action) => {
          state.creating = false;

          state.createError =
            action.payload ?? fallbackError("Failed to send promote request");
        },
      )

      /*
       * Received promote requests
       */
      .addCase(
        promoteRequestApi.getReceivedPromoteRequests.pending,
        (state) => {
          state.received.loading = true;
          state.received.error = null;
        },
      )

      .addCase(
        promoteRequestApi.getReceivedPromoteRequests.fulfilled,
        (state, action) => {
          state.received.loading = false;
          state.received.error = null;

          state.received.items = action.payload.data;
          state.received.meta = action.payload.meta;
        },
      )

      .addCase(
        promoteRequestApi.getReceivedPromoteRequests.rejected,
        (state, action) => {
          state.received.loading = false;

          state.received.error =
            action.payload ??
            fallbackError("Failed to fetch received promote requests");
        },
      )

      /*
       * My sent promote requests
       */
      .addCase(promoteRequestApi.getMyPromoteRequests.pending, (state) => {
        state.mine.loading = true;
        state.mine.error = null;
      })

      .addCase(
        promoteRequestApi.getMyPromoteRequests.fulfilled,
        (state, action) => {
          state.mine.loading = false;
          state.mine.error = null;

          state.mine.items = action.payload.data;
          state.mine.meta = action.payload.meta;
        },
      )

      .addCase(
        promoteRequestApi.getMyPromoteRequests.rejected,
        (state, action) => {
          state.mine.loading = false;

          state.mine.error =
            action.payload ??
            fallbackError("Failed to fetch your promote requests");
        },
      )

      /*
       * Promoter accepts or rejects owner terms
       */
      .addCase(
        promoteRequestApi.respondToOwnerTerms.pending,
        (state, action) => {
          state.respondingId = action.meta.arg.id;
          state.respondError = null;
        },
      )

      .addCase(
        promoteRequestApi.respondToOwnerTerms.fulfilled,
        (state, action) => {
          state.respondingId = null;
          state.respondError = null;

          const index = state.mine.items.findIndex(
            (item) => item._id === action.payload._id,
          );

          if (index === -1) {
            return;
          }

          const previousItem = state.mine.items[index];

          const isAccepted = action.payload.status === "approved";

          const isRejected = action.payload.status === "promoter_rejected";

          state.mine.items[index] = {
            ...previousItem,
            ...action.payload,

            workflow: {
              ...previousItem.workflow,

              waiting_for_owner: false,

              waiting_for_promoter_decision: false,

              can_accept_owner_terms: false,

              can_reject_owner_terms: false,

              promoter_accepted: isAccepted,

              promoter_rejected: isRejected,

              permanently_blocked_from_requesting_again: isRejected,
            },
          };
        },
      )

      .addCase(
        promoteRequestApi.respondToOwnerTerms.rejected,
        (state, action) => {
          state.respondingId = null;

          state.respondError =
            action.payload ?? fallbackError("Failed to respond to owner terms");
        },
      );
  },
});

export const {
  clearCreateError,
  clearRespondError,
  clearMineError,
  clearReceivedError,
} = promoteRequestSlice.actions;

export default promoteRequestSlice.reducer;
