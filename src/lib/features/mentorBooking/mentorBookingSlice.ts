import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ICancelMentorBookingPayload, ICompleteMentorBookingPayload, IConfirmMentorBookingPayload, ICreateMentorBookingPayload, IMentorBooking, IMentorBookingQuery, IMyMentorResponse, INoShowMentorBookingPayload, IPaginatedBookings, ISelectCoMentorPayload, IUpdateMentorBookingPayload } from "./mentorBookingTypes";
import { RootState } from "@/lib/redux/store/store";
import { mentorBookingApi } from "./mentorBookingApi";





type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface MentorBookingState {
  bookings: IMentorBooking[];
  completedBookings: IMentorBooking[];
  bookingsMeta: IPaginatedBookings["meta"] | null;
  selectedBooking: IMentorBooking | null;
  myMentor: IMyMentorResponse | null;

  // Single source of truth for whichever booking an admin/mentor is
  // currently viewing — kept in sync by every admin action below, so any
  // component reading it re-renders immediately on status changes.
  adminSelectedBooking: IMentorBooking | null;

  listStatus: RequestStatus;
  createStatus: RequestStatus;
  singleStatus: RequestStatus;
  updateStatus: RequestStatus;
  cancelStatus: RequestStatus;
  myMentorStatus: RequestStatus;
  selectCoMentorStatus: RequestStatus;
  completeStatus: RequestStatus;

  adminFetchSingleStatus: RequestStatus;
  adminConfirmStatus: RequestStatus;
  adminCancelStatus: RequestStatus;
  adminNoShowStatus: RequestStatus;
  adminCompleteStatus: RequestStatus;

  adminBookings: IMentorBooking[];
  adminBookingsMeta: IPaginatedBookings["meta"] | null;
  adminListStatus: RequestStatus;

  error: string | null;
}

const initialState: MentorBookingState = {
  bookings: [],
  bookingsMeta: null,
  selectedBooking: null,
  myMentor: null,
  completedBookings: [],
  adminSelectedBooking: null,
  listStatus: "idle",
  createStatus: "idle",
  singleStatus: "idle",
  updateStatus: "idle",
  cancelStatus: "idle",
  myMentorStatus: "idle",
  selectCoMentorStatus: "idle",
  completeStatus: "idle",

  adminFetchSingleStatus: "idle",
  adminConfirmStatus: "idle",
  adminCancelStatus: "idle",
  adminNoShowStatus: "idle",
  adminCompleteStatus: "idle",

  adminBookings: [],
  adminBookingsMeta: null,
  adminListStatus: "idle",

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


export const fetchAdminMentorBookings = createAsyncThunk<
  IPaginatedBookings,
  IMentorBookingQuery | undefined,
  { state: RootState; rejectValue: string }
>("mentorBooking/fetchAdminBookings", async (query, { rejectWithValue }) => {
  try {
    return await mentorBookingApi.fetchAdminBookings(query);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});


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

// Mentor/admin marks a booking complete — requires a session recording +
// title (multipart upload, handled inside mentorBookingApi.completeBooking)
export const completeMentorBooking = createAsyncThunk<
  IMentorBooking,
  { id: string; payload: ICompleteMentorBookingPayload },
  { state: RootState; rejectValue: string }
>(
  "mentorBooking/completeBooking",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await mentorBookingApi.completeBooking(id, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------- Admin / mentor-facing thunks ----------------
// These all write to `adminSelectedBooking`, which is the single source of
// truth an admin booking-details view should render from — so the status
// badge, buttons, etc. update immediately after any action succeeds.

export const fetchSingleMentorBookingAdmin = createAsyncThunk<
  IMentorBooking,
  string,
  { state: RootState; rejectValue: string }
>(
  "mentorBooking/fetchSingleAdmin",
  async (id, { rejectWithValue }) => {
    try {
      return await mentorBookingApi.fetchSingleBookingAdmin(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const confirmAdminMentorBooking = createAsyncThunk<
  IMentorBooking,
  { id: string; payload: IConfirmMentorBookingPayload },
  { state: RootState; rejectValue: string }
>(
  "mentorBooking/confirmAdmin",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await mentorBookingApi.confirmBooking(id, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const cancelAdminMentorBooking = createAsyncThunk<
  IMentorBooking,
  { id: string; payload: ICancelMentorBookingPayload },
  { state: RootState; rejectValue: string }
>(
  "mentorBooking/cancelAdmin",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await mentorBookingApi.cancelBooking(id, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const markAdminMentorBookingNoShow = createAsyncThunk<
  IMentorBooking,
  { id: string; payload: INoShowMentorBookingPayload },
  { state: RootState; rejectValue: string }
>(
  "mentorBooking/markNoShowAdmin",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await mentorBookingApi.markNoShow(id, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const completeAdminMentorBooking = createAsyncThunk<
  IMentorBooking,
  { id: string; payload: ICompleteMentorBookingPayload },
  { state: RootState; rejectValue: string }
>(
  "mentorBooking/completeAdmin",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await mentorBookingApi.completeBooking(id, payload);
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
    clearAdminSelectedBooking(state) {
      state.adminSelectedBooking = null;
      state.adminFetchSingleStatus = "idle";
    },
    clearMentorBookingError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminMentorBookings.pending, (state) => {
        state.adminListStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAdminMentorBookings.fulfilled, (state, action) => {
        state.adminListStatus = "succeeded";
        state.adminBookings = action.payload.data;
        state.adminBookingsMeta = action.payload.meta;
      })
      .addCase(fetchAdminMentorBookings.rejected, (state, action) => {
        state.adminListStatus = "failed";
        state.error = action.payload ?? "Failed to load bookings";
      })
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

      // complete (mentor/admin, with recording) — booking moves out of the
      // active "bookings" list and into "completedBookings"
      .addCase(completeMentorBooking.pending, (state) => {
        state.completeStatus = "loading";
        state.error = null;
      })
      .addCase(
        completeMentorBooking.fulfilled,
        (state, action: PayloadAction<IMentorBooking>) => {
          state.completeStatus = "succeeded";

          state.bookings = state.bookings.filter(
            (booking) => booking._id !== action.payload._id,
          );

          const alreadyInCompleted = state.completedBookings.some(
            (booking) => booking._id === action.payload._id,
          );

          state.completedBookings = alreadyInCompleted
            ? state.completedBookings.map((booking) =>
              booking._id === action.payload._id ? action.payload : booking,
            )
            : [action.payload, ...state.completedBookings];

          if (state.selectedBooking?._id === action.payload._id) {
            state.selectedBooking = action.payload;
          }
        },
      )
      .addCase(completeMentorBooking.rejected, (state, action) => {
        state.completeStatus = "failed";
        state.error = action.payload ?? "Failed to complete booking";
      })

      // ---- admin/mentor actions: all sync adminSelectedBooking ----

      .addCase(fetchSingleMentorBookingAdmin.pending, (state) => {
        state.adminFetchSingleStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchSingleMentorBookingAdmin.fulfilled,
        (state, action: PayloadAction<IMentorBooking>) => {
          state.adminFetchSingleStatus = "succeeded";
          state.adminSelectedBooking = action.payload;
        },
      )
      .addCase(fetchSingleMentorBookingAdmin.rejected, (state, action) => {
        state.adminFetchSingleStatus = "failed";
        state.error = action.payload ?? "Failed to load booking";
      })

      .addCase(confirmAdminMentorBooking.pending, (state) => {
        state.adminConfirmStatus = "loading";
        state.error = null;
      })
      .addCase(
        confirmAdminMentorBooking.fulfilled,
        (state, action: PayloadAction<IMentorBooking>) => {
          state.adminConfirmStatus = "succeeded";
          state.adminSelectedBooking = action.payload;
        },
      )
      .addCase(confirmAdminMentorBooking.rejected, (state, action) => {
        state.adminConfirmStatus = "failed";
        state.error = action.payload ?? "Failed to confirm booking";
      })

      .addCase(cancelAdminMentorBooking.pending, (state) => {
        state.adminCancelStatus = "loading";
        state.error = null;
      })
      .addCase(
        cancelAdminMentorBooking.fulfilled,
        (state, action: PayloadAction<IMentorBooking>) => {
          state.adminCancelStatus = "succeeded";
          state.adminSelectedBooking = action.payload;
        },
      )
      .addCase(cancelAdminMentorBooking.rejected, (state, action) => {
        state.adminCancelStatus = "failed";
        state.error = action.payload ?? "Failed to cancel booking";
      })

      .addCase(markAdminMentorBookingNoShow.pending, (state) => {
        state.adminNoShowStatus = "loading";
        state.error = null;
      })
      .addCase(
        markAdminMentorBookingNoShow.fulfilled,
        (state, action: PayloadAction<IMentorBooking>) => {
          state.adminNoShowStatus = "succeeded";
          state.adminSelectedBooking = action.payload;
        },
      )
      .addCase(markAdminMentorBookingNoShow.rejected, (state, action) => {
        state.adminNoShowStatus = "failed";
        state.error = action.payload ?? "Failed to mark booking as no-show";
      })

      .addCase(completeAdminMentorBooking.pending, (state) => {
        state.adminCompleteStatus = "loading";
        state.error = null;
      })
      .addCase(
        completeAdminMentorBooking.fulfilled,
        (state, action: PayloadAction<IMentorBooking>) => {
          state.adminCompleteStatus = "succeeded";
          state.adminSelectedBooking = action.payload;
        },
      )
      .addCase(completeAdminMentorBooking.rejected, (state, action) => {
        state.adminCompleteStatus = "failed";
        state.error = action.payload ?? "Failed to complete booking";
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

export const { clearSelectedMentorBooking, clearAdminSelectedBooking, clearMentorBookingError } =
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

export const selectAdminSelectedBooking = (state: RootState) =>
  state.mentorBooking.adminSelectedBooking;

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

export const selectAdminMentorBookings = (state: RootState) =>
  state.mentorBooking.adminBookings;

export const selectAdminMentorBookingsMeta = (state: RootState) =>
  state.mentorBooking.adminBookingsMeta;


export const selectMentorBookingStatus = createSelector(
  [
    (state: RootState) => state.mentorBooking.listStatus,
    (state: RootState) => state.mentorBooking.createStatus,
    (state: RootState) => state.mentorBooking.singleStatus,
    (state: RootState) => state.mentorBooking.updateStatus,
    (state: RootState) => state.mentorBooking.cancelStatus,
    (state: RootState) => state.mentorBooking.myMentorStatus,
    (state: RootState) => state.mentorBooking.selectCoMentorStatus,
    (state: RootState) => state.mentorBooking.completeStatus,
    (state: RootState) => state.mentorBooking.adminListStatus,
    (state: RootState) => state.mentorBooking.adminFetchSingleStatus,
    (state: RootState) => state.mentorBooking.adminConfirmStatus,
    (state: RootState) => state.mentorBooking.adminCancelStatus,
    (state: RootState) => state.mentorBooking.adminNoShowStatus,
    (state: RootState) => state.mentorBooking.adminCompleteStatus,
  ],
  (
    list,
    create,
    single,
    update,
    cancel,
    myMentor,
    selectCoMentor,
    complete,
    adminList,
    adminFetchSingle,
    adminConfirm,
    adminCancel,
    adminNoShow,
    adminComplete,
  ) => ({
    list,
    create,
    single,
    update,
    cancel,
    myMentor,
    selectCoMentor,
    complete,
    adminList,
    adminFetchSingle,
    adminConfirm,
    adminCancel,
    adminNoShow,
    adminComplete,
  }),
);

export default mentorBookingSlice.reducer;