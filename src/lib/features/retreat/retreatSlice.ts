
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import api from "@/lib/api/api";
import {
  Retreat,
  RetreatBatch,
} from "@/types/retreat";
import {
  cancelRetreatBookingAdmin,
  confirmRetreatBookingAdmin,
  getAdminRetreatBooking,
  getAdminRetreatBookings,
  inviteRetreatBooking,
  refundRetreatBookingAdmin,
} from "./retreatApi";
import type {
  CancelRetreatBookingPayload,
  ConfirmRetreatBookingPayload,
  InviteRetreatBookingPayload,
  PaginatedRetreatBookings,
  RefundRetreatBookingPayload,
  RetreatBooking,
  RetreatBookingQuery,
  RetreatBookingStatusCounts,
} from "./retreatTypes";

interface RetreatWithBatches {
  location: Retreat;
  batches: RetreatBatch[];
}

interface CheckoutSessionResponse {
  bookingId: string;
  stripeCheckoutSessionId: string;
  checkoutUrl: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  paid: boolean;
  data: RetreatBooking | null;
}

interface RetreatState {
  retreats: RetreatWithBatches[];
  selected: RetreatWithBatches | null;
  booking: RetreatBooking | null;
  myBookings: RetreatBooking[];

  isLoading: boolean;
  isLoadingBookings: boolean;
  isBooking: boolean;

  error: string | null;
  bookingError: string | null;

  isCheckingOut: boolean;
  checkoutError: string | null;
  checkoutUrl: string | null;

  isVerifyingPayment: boolean;
  verifyPaymentError: string | null;

  isCancellingBooking: boolean;
  cancelBookingError: string | null;

  adminBookings: RetreatBooking[];
  adminBookingsMeta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  adminBookingCounts: RetreatBookingStatusCounts;
  isLoadingAdminBookings: boolean;
  adminBookingsError: string | null;
  isAdminActing: boolean;
  adminActionError: string | null;
}

const initialState: RetreatState = {
  retreats: [],
  selected: null,
  booking: null,
  myBookings: [],

  isLoading: false,
  isLoadingBookings: false,
  isBooking: false,

  error: null,
  bookingError: null,

  isCheckingOut: false,
  checkoutError: null,
  checkoutUrl: null,

  isVerifyingPayment: false,
  verifyPaymentError: null,

  isCancellingBooking: false,
  cancelBookingError: null,

  adminBookings: [],
  adminBookingsMeta: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  adminBookingCounts: {
    waitlisted: 0,
    invited: 0,
    payment_pending: 0,
    confirmed: 0,
  },
  isLoadingAdminBookings: false,
  adminBookingsError: null,
  isAdminActing: false,
  adminActionError: null,
};

const upsertAdminBooking = (
  bookings: RetreatBooking[],
  booking: RetreatBooking,
) => {
  const index = bookings.findIndex((item) => item._id === booking._id);
  if (index >= 0) {
    bookings[index] = booking;
  }
};

const getErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

/* -------------------------------------------------------------------------- */
/* Fetch Retreat Overview                                                     */
/* -------------------------------------------------------------------------- */

export const fetchRetreatOverview = createAsyncThunk<
  RetreatWithBatches[],
  void,
  { rejectValue: string }
>(
  "retreat/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const locationsResponse = await api.get<{
        data: {
          data: Retreat[];
        };
      }>("/invictus/retreat-locations", {
        params: {
          status: "published",
          isActive: true,
          limit: 100,
        },
      });

      const locations = locationsResponse.data.data.data;

      if (locations.length === 0) {
        return [];
      }

      const batchesResponse = await api.get<{
        data: {
          data: RetreatBatch[];
        };
      }>("/invictus/retreat-batches", {
        params: {
          locationIds: locations
            .map((location) => location._id)
            .join(","),
          isActive: true,
          includePast: true,
          limit: 20 * locations.length,
        },
      });

      const batchesByLocation = new Map<
        string,
        RetreatBatch[]
      >();

      for (const batch of batchesResponse.data.data.data) {
        const locId =
          typeof batch.retreatLocation === "string"
            ? batch.retreatLocation
            : batch.retreatLocation._id;

        if (!batchesByLocation.has(locId)) {
          batchesByLocation.set(locId, []);
        }

        batchesByLocation.get(locId)!.push(batch);
      }

      return locations.map((location) => ({
        location,
        batches:
          batchesByLocation.get(location._id) ?? [],
      }));
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to load retreats",
        ),
      );
    }
  },
);

/* -------------------------------------------------------------------------- */
/* Fetch My Retreat Bookings                                                  */
/* -------------------------------------------------------------------------- */

export const fetchMyRetreatBookings = createAsyncThunk<
  RetreatBooking[],
  void,
  { rejectValue: string }
>(
  "retreat/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<{
        data: {
          data: RetreatBooking[];
        };
      }>("/invictus/retreat-bookings/me");

      return response.data.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to load your bookings",
        ),
      );
    }
  },
);

/* -------------------------------------------------------------------------- */
/* Create Retreat Booking                                                     */
/* -------------------------------------------------------------------------- */

export const createRetreatBooking = createAsyncThunk<
  RetreatBooking,
  { retreatBatch: string },
  { rejectValue: string }
>(
  "retreat/createBooking",
  async (
    payload,
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post<{
        data: RetreatBooking;
      }>(
        "/invictus/retreat-bookings/me",
        payload,
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to reserve your retreat seat",
        ),
      );
    }
  },
);

/* -------------------------------------------------------------------------- */
/* Create Checkout Session                                                    */
/* -------------------------------------------------------------------------- */

export const createRetreatCheckoutSession = createAsyncThunk<
  CheckoutSessionResponse,
  {
    bookingId: string;
    successUrl?: string;
    cancelUrl?: string;
  },
  { rejectValue: string }
>(
  "retreat/createCheckoutSession",
  async (
    {
      bookingId,
      successUrl,
      cancelUrl,
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post<{
        data: CheckoutSessionResponse;
      }>(
        `/invictus/retreat-bookings/me/${bookingId}/checkout`,
        {
          successUrl,
          cancelUrl,
        },
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to start checkout",
        ),
      );
    }
  },
);

/* -------------------------------------------------------------------------- */
/* Verify Retreat Payment                                                     */
/* -------------------------------------------------------------------------- */

export const verifyRetreatPayment = createAsyncThunk<
  RetreatBooking,
  { sessionId: string },
  { rejectValue: string }
>(
  "retreat/verifyPayment",
  async (
    { sessionId },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post<VerifyPaymentResponse>(
        "/invictus/retreat-bookings/verify-payment",
        {
          sessionId,
        },
      );



      // console.log("verify response", response);

      const result = response.data;
      // console.log("fleg", result)
      // console.log("verify result", result, result.paid, result.booking);
      if (!result.paid || !result.data) {
        return rejectWithValue(
          result.message ??
          "Payment not completed"
        );
      }

      return result.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to verify payment",
        ),
      );
    }
  },
);

/* -------------------------------------------------------------------------- */
/* Cancel My Retreat Booking                                                  */
/* -------------------------------------------------------------------------- */

export const cancelMyRetreatBooking = createAsyncThunk<
  RetreatBooking,
  {
    bookingId: string;
    reason: string;
  },
  { rejectValue: string }
>(
  "retreat/cancelBooking",
  async (
    {
      bookingId,
      reason,
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch<{
        data: RetreatBooking;
      }>(
        `/invictus/retreat-bookings/me/${bookingId}/cancel`,
        {
          reason,
        },
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to cancel booking",
        ),
      );
    }
  },
);

/* -------------------------------------------------------------------------- */
/* Get Single Retreat Booking                                                 */
/* -------------------------------------------------------------------------- */

export const getMySingleRetreatBooking =
  createAsyncThunk<
    RetreatBooking,
    { bookingId: string },
    { rejectValue: string }
  >(
    "retreat/getMySingleBooking",
    async (
      { bookingId },
      { rejectWithValue },
    ) => {
      try {
        const response = await api.get<{
          data: RetreatBooking;
        }>(
          `/invictus/retreat-bookings/me/${bookingId}`,
        );

        return response.data.data;
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to load booking",
          ),
        );
      }
    },
  );

/* -------------------------------------------------------------------------- */
/* Admin: list retreat bookings                                               */
/* -------------------------------------------------------------------------- */

export const fetchAdminRetreatBookings = createAsyncThunk<
  PaginatedRetreatBookings,
  RetreatBookingQuery | undefined,
  { rejectValue: string }
>(
  "retreat/fetchAdminBookings",
  async (query, { rejectWithValue }) => {
    try {
      return await getAdminRetreatBookings(query);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load retreat bookings"),
      );
    }
  },
);

export const fetchAdminRetreatBookingCounts = createAsyncThunk<
  RetreatBookingStatusCounts,
  void,
  { rejectValue: string }
>(
  "retreat/fetchAdminBookingCounts",
  async (_, { rejectWithValue }) => {
    try {
      const [waitlisted, invited, paymentPending, confirmed] =
        await Promise.all([
          getAdminRetreatBookings({ status: "waitlisted", page: 1, limit: 1 }),
          getAdminRetreatBookings({ status: "invited", page: 1, limit: 1 }),
          getAdminRetreatBookings({
            status: "payment_pending",
            page: 1,
            limit: 1,
          }),
          getAdminRetreatBookings({ status: "confirmed", page: 1, limit: 1 }),
        ]);

      return {
        waitlisted: waitlisted.meta.total,
        invited: invited.meta.total,
        payment_pending: paymentPending.meta.total,
        confirmed: confirmed.meta.total,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load booking counts"),
      );
    }
  },
);

export const fetchAdminRetreatBooking = createAsyncThunk<
  RetreatBooking,
  { bookingId: string },
  { rejectValue: string }
>(
  "retreat/fetchAdminBooking",
  async ({ bookingId }, { rejectWithValue }) => {
    try {
      return await getAdminRetreatBooking(bookingId);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load booking"),
      );
    }
  },
);

export const inviteRetreatBookingAdmin = createAsyncThunk<
  RetreatBooking,
  { bookingId: string } & InviteRetreatBookingPayload,
  { rejectValue: string }
>(
  "retreat/inviteAdminBooking",
  async ({ bookingId, ...payload }, { rejectWithValue }) => {
    try {
      return await inviteRetreatBooking(bookingId, payload);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to invite member"),
      );
    }
  },
);

export const confirmRetreatBookingByAdmin = createAsyncThunk<
  RetreatBooking,
  { bookingId: string } & ConfirmRetreatBookingPayload,
  { rejectValue: string }
>(
  "retreat/confirmAdminBooking",
  async ({ bookingId, ...payload }, { rejectWithValue }) => {
    try {
      return await confirmRetreatBookingAdmin(bookingId, payload);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to confirm booking"),
      );
    }
  },
);

export const cancelRetreatBookingByAdmin = createAsyncThunk<
  RetreatBooking,
  { bookingId: string } & CancelRetreatBookingPayload,
  { rejectValue: string }
>(
  "retreat/cancelAdminBooking",
  async ({ bookingId, reason }, { rejectWithValue }) => {
    try {
      return await cancelRetreatBookingAdmin(bookingId, { reason });
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to cancel booking"),
      );
    }
  },
);

export const refundRetreatBookingByAdmin = createAsyncThunk<
  RetreatBooking,
  { bookingId: string } & RefundRetreatBookingPayload,
  { rejectValue: string }
>(
  "retreat/refundAdminBooking",
  async ({ bookingId, ...payload }, { rejectWithValue }) => {
    try {
      return await refundRetreatBookingAdmin(bookingId, payload);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to refund booking"),
      );
    }
  },
);

/* -------------------------------------------------------------------------- */
/* Slice                                                                      */
/* -------------------------------------------------------------------------- */

const retreatSlice = createSlice({
  name: "retreat",
  initialState,

  reducers: {
    clearRetreats: () => initialState,
    clearAdminActionError: (state) => {
      state.adminActionError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ------------------------- Retreat Overview ------------------------ */

      .addCase(
        fetchRetreatOverview.pending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchRetreatOverview.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.retreats = action.payload;
          state.selected =
            action.payload[0] ?? null;
        },
      )

      .addCase(
        fetchRetreatOverview.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.payload ??
            "Failed to load retreats";
        },
      )

      /* -------------------------- My Bookings ---------------------------- */

      .addCase(
        fetchMyRetreatBookings.pending,
        (state) => {
          state.isLoadingBookings = true;
        },
      )

      .addCase(
        fetchMyRetreatBookings.fulfilled,
        (state, action) => {
          state.isLoadingBookings = false;
          state.myBookings = action.payload;
        },
      )

      .addCase(
        fetchMyRetreatBookings.rejected,
        (state) => {
          state.isLoadingBookings = false;
        },
      )

      /* ----------------------- Create Booking ---------------------------- */

      .addCase(
        createRetreatBooking.pending,
        (state) => {
          state.isBooking = true;
          state.bookingError = null;
        },
      )

      .addCase(
        createRetreatBooking.fulfilled,
        (state, action) => {
          state.isBooking = false;
          state.booking = action.payload;

          state.myBookings.push(
            action.payload,
          );
        },
      )

      .addCase(
        createRetreatBooking.rejected,
        (state, action) => {
          state.isBooking = false;
          state.bookingError =
            action.payload ??
            "Failed to reserve your retreat seat";
        },
      )

      /* ----------------------- Checkout Session ------------------------- */

      .addCase(
        createRetreatCheckoutSession.pending,
        (state) => {
          state.isCheckingOut = true;
          state.checkoutError = null;
          state.checkoutUrl = null;
        },
      )

      .addCase(
        createRetreatCheckoutSession.fulfilled,
        (state, action) => {
          state.isCheckingOut = false;
          state.checkoutUrl =
            action.payload.checkoutUrl;
        },
      )

      .addCase(
        createRetreatCheckoutSession.rejected,
        (state, action) => {
          state.isCheckingOut = false;
          state.checkoutError =
            action.payload ??
            "Failed to start checkout";
        },
      )

      /* ------------------------- Verify Payment -------------------------- */

      .addCase(
        verifyRetreatPayment.pending,
        (state) => {
          state.isVerifyingPayment = true;
          state.verifyPaymentError = null;
        },
      )

      .addCase(
        verifyRetreatPayment.fulfilled,
        (state, action) => {
          state.isVerifyingPayment = false;

          const index =
            state.myBookings.findIndex(
              (booking) =>
                booking._id ===
                action.payload._id,
            );

          if (index >= 0) {
            state.myBookings[index] =
              action.payload;
          } else {
            state.myBookings.push(
              action.payload,
            );
          }
        },
      )

      .addCase(
        verifyRetreatPayment.rejected,
        (state, action) => {
          state.isVerifyingPayment = false;
          state.verifyPaymentError =
            action.payload ??
            "Failed to verify payment";
        },
      )

      /* -------------------------- Cancel Booking ------------------------ */

      .addCase(
        cancelMyRetreatBooking.pending,
        (state) => {
          state.isCancellingBooking = true;
          state.cancelBookingError = null;
        },
      )

      .addCase(
        cancelMyRetreatBooking.fulfilled,
        (state, action) => {
          state.isCancellingBooking = false;

          const index =
            state.myBookings.findIndex(
              (booking) =>
                booking._id ===
                action.payload._id,
            );

          if (index >= 0) {
            state.myBookings[index] =
              action.payload;
          }
        },
      )

      .addCase(
        cancelMyRetreatBooking.rejected,
        (state, action) => {
          state.isCancellingBooking = false;
          state.cancelBookingError =
            action.payload ??
            "Failed to cancel booking";
        },
      )

      /* ----------------------- Single Booking ---------------------------- */

      .addCase(
        getMySingleRetreatBooking.fulfilled,
        (state, action) => {
          const index =
            state.myBookings.findIndex(
              (booking) =>
                booking._id ===
                action.payload._id,
            );

          if (index >= 0) {
            state.myBookings[index] =
              action.payload;
          } else {
            state.myBookings.push(
              action.payload,
            );
          }
        },
      )

      /* ----------------------- Admin bookings ---------------------------- */

      .addCase(
        fetchAdminRetreatBookings.pending,
        (state) => {
          state.isLoadingAdminBookings = true;
          state.adminBookingsError = null;
        },
      )

      .addCase(
        fetchAdminRetreatBookings.fulfilled,
        (state, action) => {
          state.isLoadingAdminBookings = false;
          state.adminBookings = action.payload.data;
          state.adminBookingsMeta = action.payload.meta;
        },
      )

      .addCase(
        fetchAdminRetreatBookings.rejected,
        (state, action) => {
          state.isLoadingAdminBookings = false;
          state.adminBookingsError =
            action.payload ?? "Failed to load retreat bookings";
        },
      )

      .addCase(
        fetchAdminRetreatBookingCounts.fulfilled,
        (state, action) => {
          state.adminBookingCounts = action.payload;
        },
      )

      .addCase(
        fetchAdminRetreatBooking.fulfilled,
        (state, action) => {
          upsertAdminBooking(state.adminBookings, action.payload);
        },
      )

      .addCase(
        inviteRetreatBookingAdmin.pending,
        (state) => {
          state.isAdminActing = true;
          state.adminActionError = null;
        },
      )

      .addCase(
        inviteRetreatBookingAdmin.fulfilled,
        (state, action) => {
          state.isAdminActing = false;
          upsertAdminBooking(state.adminBookings, action.payload);
        },
      )

      .addCase(
        inviteRetreatBookingAdmin.rejected,
        (state, action) => {
          state.isAdminActing = false;
          state.adminActionError =
            action.payload ?? "Failed to invite member";
        },
      )

      .addCase(
        confirmRetreatBookingByAdmin.pending,
        (state) => {
          state.isAdminActing = true;
          state.adminActionError = null;
        },
      )

      .addCase(
        confirmRetreatBookingByAdmin.fulfilled,
        (state, action) => {
          state.isAdminActing = false;
          upsertAdminBooking(state.adminBookings, action.payload);
        },
      )

      .addCase(
        confirmRetreatBookingByAdmin.rejected,
        (state, action) => {
          state.isAdminActing = false;
          state.adminActionError =
            action.payload ?? "Failed to confirm booking";
        },
      )

      .addCase(
        cancelRetreatBookingByAdmin.pending,
        (state) => {
          state.isAdminActing = true;
          state.adminActionError = null;
        },
      )

      .addCase(
        cancelRetreatBookingByAdmin.fulfilled,
        (state, action) => {
          state.isAdminActing = false;
          upsertAdminBooking(state.adminBookings, action.payload);
        },
      )

      .addCase(
        cancelRetreatBookingByAdmin.rejected,
        (state, action) => {
          state.isAdminActing = false;
          state.adminActionError =
            action.payload ?? "Failed to cancel booking";
        },
      )

      .addCase(
        refundRetreatBookingByAdmin.pending,
        (state) => {
          state.isAdminActing = true;
          state.adminActionError = null;
        },
      )

      .addCase(
        refundRetreatBookingByAdmin.fulfilled,
        (state, action) => {
          state.isAdminActing = false;
          upsertAdminBooking(state.adminBookings, action.payload);
        },
      )

      .addCase(
        refundRetreatBookingByAdmin.rejected,
        (state, action) => {
          state.isAdminActing = false;
          state.adminActionError =
            action.payload ?? "Failed to refund booking";
        },
      );
  },
});

export const { clearRetreats, clearAdminActionError } =
  retreatSlice.actions;

export default retreatSlice.reducer;

