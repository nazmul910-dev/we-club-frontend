import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ICancelMentorBookingPayload, ICreateMentorBookingPayload, IMentorBooking, IMentorBookingQuery, IMyMentorResponse, IPaginatedBookings, ISelectCoMentorPayload, IUpdateMentorBookingPayload } from "./mentorBookingTypes";
import { RootState } from "@/lib/redux/store/store";
import { mentorBookingApi } from "./mentorBookingApi";





type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface MentorBookingState {
  bookings: IMentorBooking[];
  completedBookings: IMentorBooking[];
  bookingsMeta: IPaginatedBookings["meta"] | null;
  selectedBooking: IMentorBooking | null;
  myMentor: IMyMentorResponse | null;

  listStatus: RequestStatus;
  createStatus: RequestStatus;
  singleStatus: RequestStatus;
  updateStatus: RequestStatus;
  cancelStatus: RequestStatus;
  myMentorStatus: RequestStatus;
  selectCoMentorStatus: RequestStatus;

  error: string | null;
}

const initialState: MentorBookingState = {
  bookings: [],
  bookingsMeta: null,
  selectedBooking: null,
  myMentor: null,
  completedBookings: [],
  listStatus: "idle",
  createStatus: "idle",
  singleStatus: "idle",
  updateStatus: "idle",
  cancelStatus: "idle",
  myMentorStatus: "idle",
  selectCoMentorStatus: "idle",

  error: null,
};

const getErrorMessage = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: unknown } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response
      .data.message;
  }

  if (error instanceof Error) return error.message;

  return "Something went wrong. Please try again.";
};

// ---------------- Thunks ----------------

export const createMentorBooking = createAsyncThunk<
  IMentorBooking,
  ICreateMentorBookingPayload,
  { state: RootState; rejectValue: string }
>("mentorBooking/create", async (payload, { rejectWithValue }) => {
  try {
    return await mentorBookingApi.create(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchMyMentorBookings = createAsyncThunk<
  IPaginatedBookings,
  IMentorBookingQuery | undefined,
  { state: RootState; rejectValue: string }
>("mentorBooking/fetchMyBookings", async (query, { rejectWithValue }) => {
  try {
    return await mentorBookingApi.fetchMyBookings(query);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchMySingleMentorBooking = createAsyncThunk<
  IMentorBooking,
  string,
  { state: RootState; rejectValue: string }
>("mentorBooking/fetchMySingleBooking", async (id, { rejectWithValue }) => {
  try {
    return await mentorBookingApi.fetchMySingleBooking(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateMyMentorBooking = createAsyncThunk<
  IMentorBooking,
  { id: string; payload: IUpdateMentorBookingPayload },
  { state: RootState; rejectValue: string }
>(
  "mentorBooking/updateMyBooking",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await mentorBookingApi.updateMyBooking(id, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const cancelMyMentorBooking = createAsyncThunk<
  IMentorBooking,
  { id: string; payload: ICancelMentorBookingPayload },
  { state: RootState; rejectValue: string }
>(
  "mentorBooking/cancelMyBooking",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await mentorBookingApi.cancelMyBooking(id, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// The new endpoint: resolves the member's primary mentor + selected
// co-mentor + next session
export const fetchMyMentor = createAsyncThunk<
  IMyMentorResponse,
  void,
  { state: RootState; rejectValue: string }
>("mentorBooking/fetchMyMentor", async (_, { rejectWithValue }) => {
  try {
    return await mentorBookingApi.fetchMyMentor();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Member picks their co-mentor from the available (non-primary) profiles.
// After this succeeds, dispatch fetchMyMentor() again to refresh the pairing.
export const selectCoMentor = createAsyncThunk<
  void,
  ISelectCoMentorPayload,
  { state: RootState; rejectValue: string }
>("mentorBooking/selectCoMentor", async (payload, { rejectWithValue }) => {
  try {
    await mentorBookingApi.selectCoMentor(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// ---------------- Slice ----------------

const mentorBookingSlice = createSlice({
  name: "mentorBooking",
  initialState,
  reducers: {
    clearSelectedMentorBooking(state) {
      state.selectedBooking = null;
      state.singleStatus = "idle";
    },
    clearMentorBookingError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create
      .addCase(createMentorBooking.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(
        createMentorBooking.fulfilled,
        (state, action: PayloadAction<IMentorBooking>) => {
          state.createStatus = "succeeded";
          state.bookings.unshift(action.payload);
        },
      )
      .addCase(createMentorBooking.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload ?? "Failed to create booking";
      })

      // list
      .addCase(fetchMyMentorBookings.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchMyMentorBookings.fulfilled,
        (state, action) => {
          state.listStatus = "succeeded";

          if (action.meta.arg?.status === "completed") {
            state.completedBookings = action.payload.data;
          } else {
            state.bookings = action.payload.data;
            state.bookingsMeta = action.payload.meta;
          }
        },
      )
      .addCase(fetchMyMentorBookings.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload ?? "Failed to load bookings";
      })

      // single
      .addCase(fetchMySingleMentorBooking.pending, (state) => {
        state.singleStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchMySingleMentorBooking.fulfilled,
        (state, action: PayloadAction<IMentorBooking>) => {
          state.singleStatus = "succeeded";
          state.selectedBooking = action.payload;
        },
      )
      .addCase(fetchMySingleMentorBooking.rejected, (state, action) => {
        state.singleStatus = "failed";
        state.error = action.payload ?? "Failed to load booking";
      })

      // update
      .addCase(updateMyMentorBooking.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(
        updateMyMentorBooking.fulfilled,
        (state, action: PayloadAction<IMentorBooking>) => {
          state.updateStatus = "succeeded";
          state.selectedBooking = action.payload;
          state.bookings = state.bookings.map((booking) =>
            booking._id === action.payload._id ? action.payload : booking,
          );
        },
      )
      .addCase(updateMyMentorBooking.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload ?? "Failed to update booking";
      })

      // cancel
      .addCase(cancelMyMentorBooking.pending, (state) => {
        state.cancelStatus = "loading";
        state.error = null;
      })
      .addCase(
        cancelMyMentorBooking.fulfilled,
        (state, action: PayloadAction<IMentorBooking>) => {
          state.cancelStatus = "succeeded";
          state.bookings = state.bookings.map((booking) =>
            booking._id === action.payload._id ? action.payload : booking,
          );
          if (state.selectedBooking?._id === action.payload._id) {
            state.selectedBooking = action.payload;
          }
        },
      )
      .addCase(cancelMyMentorBooking.rejected, (state, action) => {
        state.cancelStatus = "failed";
        state.error = action.payload ?? "Failed to cancel booking";
      })

      // my mentor
      .addCase(fetchMyMentor.pending, (state) => {
        state.myMentorStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchMyMentor.fulfilled,
        (state, action: PayloadAction<IMyMentorResponse>) => {
          state.myMentorStatus = "succeeded";
          state.myMentor = action.payload;
        },
      )
      .addCase(fetchMyMentor.rejected, (state, action) => {
        state.myMentorStatus = "failed";
        state.error = action.payload ?? "Failed to load mentor";
      })

      // select co-mentor
      .addCase(selectCoMentor.pending, (state) => {
        state.selectCoMentorStatus = "loading";
        state.error = null;
      })
      .addCase(selectCoMentor.fulfilled, (state) => {
        state.selectCoMentorStatus = "succeeded";
      })
      .addCase(selectCoMentor.rejected, (state, action) => {
        state.selectCoMentorStatus = "failed";
        state.error = action.payload ?? "Failed to select co-mentor";
      });
  },
});

export const { clearSelectedMentorBooking, clearMentorBookingError } =
  mentorBookingSlice.actions;

// ---------------- Selectors ----------------

export const selectCompletedMentorBookings = (state: RootState) =>
  state.mentorBooking.completedBookings;

export const selectMentorBookings = (state: RootState) =>
  state.mentorBooking.bookings;

export const selectMentorBookingsMeta = (state: RootState) =>
  state.mentorBooking.bookingsMeta;

export const selectSelectedMentorBooking = (state: RootState) =>
  state.mentorBooking.selectedBooking;

export const selectMyMentor = (state: RootState) =>
  state.mentorBooking.myMentor;

// Convenience selectors for the accountability page's two mentor cards
export const selectPrimaryMentor = (state: RootState) =>
  state.mentorBooking.myMentor?.primaryMentor ?? null;

export const selectMyCoMentor = (state: RootState) =>
  state.mentorBooking.myMentor?.coMentor ?? null;

export const selectMyNextSession = (state: RootState) =>
  state.mentorBooking.myMentor?.nextSession ?? null;

export const selectMentorBookingError = (state: RootState) =>
  state.mentorBooking.error;

export const selectMentorBookingStatus = (state: RootState) => ({
  list: state.mentorBooking.listStatus,
  create: state.mentorBooking.createStatus,
  single: state.mentorBooking.singleStatus,
  update: state.mentorBooking.updateStatus,
  cancel: state.mentorBooking.cancelStatus,
  myMentor: state.mentorBooking.myMentorStatus,
  selectCoMentor: state.mentorBooking.selectCoMentorStatus,
});

// Convenience selector for the "upcoming session" card on the
// accountability page: the soonest confirmed, not-yet-started booking.
export const selectUpcomingConfirmedBooking = (
  state: RootState,
): IMentorBooking | null => {
  const now = Date.now();

  const upcoming = state.mentorBooking.bookings
    .filter(
      (booking) =>
        booking.status === "confirmed" &&
        new Date(booking.scheduledStartTime).getTime() >= now,
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledStartTime).getTime() -
        new Date(b.scheduledStartTime).getTime(),
    );

  return upcoming[0] ?? null;
};

export default mentorBookingSlice.reducer;
