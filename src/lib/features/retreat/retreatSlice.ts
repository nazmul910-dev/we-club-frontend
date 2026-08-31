
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
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
import { retreatBatchApi, retreatLocationApi } from "./retreatApi";

import type {
  CancelRetreatBookingPayload,
  ConfirmRetreatBookingPayload,
  InviteRetreatBookingPayload,
  PaginatedRetreatBookings,
  RefundRetreatBookingPayload,
  RetreatBooking,
  RetreatBookingQuery,
  RetreatBookingStatusCounts,
  ICreateRetreatBatchPayload,
  ICreateRetreatLocationPayload,
  IPaginatedRetreatBatches,
  IPaginatedRetreatLocations,
  IPaginationMeta,
  IRetreatBatch,
  IRetreatBatchQuery,
  IRetreatLocation,
  IRetreatLocationQuery,
  IUpdateRetreatBatchPayload,
  IUpdateRetreatLocationPayload,
  LocationFormSubmitPayload,
} from "./retreatTypes";
import { RootState } from "@/lib/redux/store/store";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

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

  locations: IRetreatLocation[];
  locationsMeta: IPaginationMeta | null;
  selectedLocation: IRetreatLocation | null;

  batches: IRetreatBatch[];
  batchesMeta: IPaginationMeta | null;
  selectedBatch: IRetreatBatch | null;

  locationsListStatus: RequestStatus;
  locationCreateStatus: RequestStatus;
  locationUpdateStatus: RequestStatus;
  locationDeleteStatus: RequestStatus;

  batchesListStatus: RequestStatus;
  batchCreateStatus: RequestStatus;
  batchUpdateStatus: RequestStatus;
  batchDeleteStatus: RequestStatus;


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
  locations: [],
  locationsMeta: null,
  selectedLocation: null,

  batches: [],
  batchesMeta: null,
  selectedBatch: null,

  locationsListStatus: "idle",
  locationCreateStatus: "idle",
  locationUpdateStatus: "idle",
  locationDeleteStatus: "idle",

  batchesListStatus: "idle",
  batchCreateStatus: "idle",
  batchUpdateStatus: "idle",
  batchDeleteStatus: "idle",
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
  fallback = "Something went wrong. Please try again.",
): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const message = (
      error as { response?: { data?: { message?: unknown } } }
    ).response?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    // Zod / validation arrays from your API
    if (Array.isArray(message) && message.length > 0) {
      const first = message[0];
      if (typeof first === "string") return first;
      if (
        typeof first === "object" &&
        first !== null &&
        "message" in first &&
        typeof (first as { message: unknown }).message === "string"
      ) {
        return (first as { message: string }).message;
      }
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
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


export const fetchRetreatLocations = createAsyncThunk<
  IPaginatedRetreatLocations,
  IRetreatLocationQuery | undefined,
  { state: RootState; rejectValue: string }
>("retreat/fetchLocations", async (query, { rejectWithValue }) => {
  try {
    return await retreatLocationApi.fetchAll(query);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});


export const createRetreatLocation = createAsyncThunk<
  IRetreatLocation,
  LocationFormSubmitPayload,
  { state: RootState; rejectValue: string }
>("retreat/createLocation", async (payload, { rejectWithValue }) => {
  try {
    return await retreatLocationApi.create(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateRetreatLocation = createAsyncThunk<
  IRetreatLocation,
  { id: string; payload: IUpdateRetreatLocationPayload },
  { state: RootState; rejectValue: string }
>("retreat/updateLocation", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await retreatLocationApi.update(id, payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});


export const deleteRetreatLocation = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("retreat/deleteLocation", async (id, { rejectWithValue }) => {
  try {
    await retreatLocationApi.remove(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});


export const fetchRetreatBatches = createAsyncThunk<
  IPaginatedRetreatBatches,
  IRetreatBatchQuery | undefined,
  { state: RootState; rejectValue: string }
>("retreat/fetchBatches", async (query, { rejectWithValue }) => {
  try {
    return await retreatBatchApi.fetchAll(query);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});


export const createRetreatBatch = createAsyncThunk<
  IRetreatBatch,
  ICreateRetreatBatchPayload,
  { state: RootState; rejectValue: string }
>("retreat/createBatch", async (payload, { rejectWithValue }) => {
  try {
    return await retreatBatchApi.create(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});



export const updateRetreatBatch = createAsyncThunk<
  IRetreatBatch,
  { id: string; payload: IUpdateRetreatBatchPayload },
  { state: RootState; rejectValue: string }
>("retreat/updateBatch", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await retreatBatchApi.update(id, payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});


export const deleteRetreatBatch = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("retreat/deleteBatch", async (id, { rejectWithValue }) => {
  try {
    await retreatBatchApi.remove(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});



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
    console.log("booking details", bookingId, payload)

    try {
      return await refundRetreatBookingAdmin(bookingId, payload);
    } catch (error) {

      console.log("error on return ", error)
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
    clearSelectedRetreatLocation(state) {
      state.selectedLocation = null;
    },
    clearSelectedRetreatBatch(state) {
      state.selectedBatch = null;
    },
    clearRetreatError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ------------------------- Retreat Overview ------------------------ */


      // locations: list
      .addCase(fetchRetreatLocations.pending, (state) => {
        state.locationsListStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchRetreatLocations.fulfilled,
        (
          state,
          action: PayloadAction<IPaginatedRetreatLocations>,
        ) => {
          state.locationsListStatus = "succeeded";
          state.locations = action.payload.data;
          state.locationsMeta = action.payload.meta;
        },
      )
      .addCase(fetchRetreatLocations.rejected, (state, action) => {
        state.locationsListStatus = "failed";
        state.error =
          action.payload ?? "Failed to load retreat locations";
      })

      // locations: create
      .addCase(createRetreatLocation.pending, (state) => {
        state.locationCreateStatus = "loading";
        state.error = null;
      })
      .addCase(
        createRetreatLocation.fulfilled,
        (state, action: PayloadAction<IRetreatLocation>) => {
          state.locationCreateStatus = "succeeded";
          state.locations.unshift(action.payload);
        },
      )
      .addCase(createRetreatLocation.rejected, (state, action) => {
        state.locationCreateStatus = "failed";
        state.error =
          action.payload ?? "Failed to create retreat location";
      })

      // locations: update
      .addCase(updateRetreatLocation.pending, (state) => {
        state.locationUpdateStatus = "loading";
        state.error = null;
      })
      .addCase(
        updateRetreatLocation.fulfilled,
        (state, action: PayloadAction<IRetreatLocation>) => {
          state.locationUpdateStatus = "succeeded";
          state.locations = state.locations.map((location) =>
            location._id === action.payload._id
              ? action.payload
              : location,
          );
          if (state.selectedLocation?._id === action.payload._id) {
            state.selectedLocation = action.payload;
          }
        },
      )
      .addCase(updateRetreatLocation.rejected, (state, action) => {
        state.locationUpdateStatus = "failed";
        state.error =
          action.payload ?? "Failed to update retreat location";
      })

      // locations: delete
      .addCase(deleteRetreatLocation.pending, (state) => {
        state.locationDeleteStatus = "loading";
        state.error = null;
      })
      .addCase(
        deleteRetreatLocation.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.locationDeleteStatus = "succeeded";
          state.locations = state.locations.filter(
            (location) => location._id !== action.payload,
          );
          if (state.selectedLocation?._id === action.payload) {
            state.selectedLocation = null;
          }
        },
      )
      .addCase(deleteRetreatLocation.rejected, (state, action) => {
        state.locationDeleteStatus = "failed";
        state.error =
          action.payload ?? "Failed to delete retreat location";
      })

      // batches: list
      .addCase(fetchRetreatBatches.pending, (state) => {
        state.batchesListStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchRetreatBatches.fulfilled,
        (
          state,
          action: PayloadAction<IPaginatedRetreatBatches>,
        ) => {
          state.batchesListStatus = "succeeded";
          state.batches = action.payload.data;
          state.batchesMeta = action.payload.meta;
        },
      )
      .addCase(fetchRetreatBatches.rejected, (state, action) => {
        state.batchesListStatus = "failed";
        state.error =
          action.payload ?? "Failed to load retreat batches";
      })

      // batches: create
      .addCase(createRetreatBatch.pending, (state) => {
        state.batchCreateStatus = "loading";
        state.error = null;
      })
      .addCase(
        createRetreatBatch.fulfilled,
        (state, action: PayloadAction<IRetreatBatch>) => {
          state.batchCreateStatus = "succeeded";
          state.batches.unshift(action.payload);
        },
      )
      .addCase(createRetreatBatch.rejected, (state, action) => {
        state.batchCreateStatus = "failed";
        state.error =
          action.payload ?? "Failed to create retreat batch";
      })

      // batches: update
      .addCase(updateRetreatBatch.pending, (state) => {
        state.batchUpdateStatus = "loading";
        state.error = null;
      })
      .addCase(
        updateRetreatBatch.fulfilled,
        (state, action: PayloadAction<IRetreatBatch>) => {
          state.batchUpdateStatus = "succeeded";
          state.batches = state.batches.map((batch) =>
            batch._id === action.payload._id
              ? action.payload
              : batch,
          );
          if (state.selectedBatch?._id === action.payload._id) {
            state.selectedBatch = action.payload;
          }
        },
      )
      .addCase(updateRetreatBatch.rejected, (state, action) => {
        state.batchUpdateStatus = "failed";
        state.error =
          action.payload ?? "Failed to update retreat batch";
      })

      // batches: delete
      .addCase(deleteRetreatBatch.pending, (state) => {
        state.batchDeleteStatus = "loading";
        state.error = null;
      })
      .addCase(
        deleteRetreatBatch.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.batchDeleteStatus = "succeeded";
          state.batches = state.batches.filter(
            (batch) => batch._id !== action.payload,
          );
          if (state.selectedBatch?._id === action.payload) {
            state.selectedBatch = null;
          }
        },
      )
      .addCase(deleteRetreatBatch.rejected, (state, action) => {
        state.batchDeleteStatus = "failed";
        state.error =
          action.payload ?? "Failed to delete retreat batch"
      })


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

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export const selectRetreatLocations = (state: RootState) =>
  state.retreat.locations;

export const selectRetreatLocationsMeta = (state: RootState) =>
  state.retreat.locationsMeta;

export const selectRetreatBatches = (state: RootState) =>
  state.retreat.batches;

export const selectRetreatBatchesMeta = (state: RootState) =>
  state.retreat.batchesMeta;

export const selectRetreatError = (state: RootState) =>
  state.retreat.error;

/** Status map used by management page + form dialogs */
export const selectRetreatStatus = (state: RootState) => ({
  locationsList: state.retreat.locationsListStatus,
  locationCreate: state.retreat.locationCreateStatus,
  locationUpdate: state.retreat.locationUpdateStatus,
  locationDelete: state.retreat.locationDeleteStatus,
  batchesList: state.retreat.batchesListStatus,
  batchCreate: state.retreat.batchCreateStatus,
  batchUpdate: state.retreat.batchUpdateStatus,
  batchDelete: state.retreat.batchDeleteStatus,
});

// Optional but useful
export const selectSelectedRetreatLocation = (state: RootState) =>
  state.retreat.selectedLocation;

export const selectSelectedRetreatBatch = (state: RootState) =>
  state.retreat.selectedBatch;

export default retreatSlice.reducer;

