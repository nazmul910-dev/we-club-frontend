import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import api from "@/lib/api/api";
import { Retreat, RetreatBatch, RetreatBooking } from "@/types/retreat";

interface RetreatWithBatches {
  location: Retreat;
  batches: RetreatBatch[];
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
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

export const fetchRetreatOverview = createAsyncThunk<
  RetreatWithBatches[],
  void,
  { rejectValue: string }
>("retreat/fetchOverview", async (_, { rejectWithValue }) => {
  try {
    const locationsResponse = await api.get<{
      data: { data: Retreat[] };
    }>("/invictus/retreat-locations", {
      params: { status: "published", isActive: true, limit: 100 },
    });

    const locations = locationsResponse.data.data.data;
    return await Promise.all(
      locations.map(async (location) => {
        const batchesResponse = await api.get<{
          data: { data: RetreatBatch[] };
        }>("/invictus/retreat-batches", {
          params: {
            locationId: location._id,
            isActive: true,
            includePast: true,
            limit: 20,
          },
        });

        return {
          location,
          batches: batchesResponse.data.data.data,
        };
      }),
    );
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to load retreats"));
  }
});

// NEW — fetch the current user's existing bookings so the CTA can reflect
// pending/waitlisted/confirmed state instead of always showing "Reserve".
export const fetchMyRetreatBookings = createAsyncThunk<
  RetreatBooking[],
  void,
  { rejectValue: string }
>("retreat/fetchMyBookings", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<{ data: { data: RetreatBooking[] } }>(
      "/invictus/retreat-bookings/me",
    );
    return response.data.data.data;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to load your bookings"),
    );
  }
});

export const createRetreatBooking = createAsyncThunk<
  RetreatBooking,
  { retreatBatch: string },
  { rejectValue: string }
>("retreat/createBooking", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/invictus/retreat-bookings/me", payload);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to reserve your retreat seat"),
    );
  }
});

const retreatSlice = createSlice({
  name: "retreat",
  initialState,
  reducers: {
    clearRetreats: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRetreatOverview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRetreatOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.retreats = action.payload;
        state.selected = action.payload[0] ?? null;
      })
      .addCase(fetchRetreatOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to load retreats";
      })
      .addCase(fetchMyRetreatBookings.pending, (state) => {
        state.isLoadingBookings = true;
      })
      .addCase(fetchMyRetreatBookings.fulfilled, (state, action) => {
        state.isLoadingBookings = false;
        state.myBookings = action.payload;
      })
      .addCase(fetchMyRetreatBookings.rejected, (state) => {
        state.isLoadingBookings = false;
        // Not surfacing this as a page-level error — an empty list is a
        // safe fallback, the CTA just won't know about existing bookings.
      })
      .addCase(createRetreatBooking.pending, (state) => {
        state.isBooking = true;
        state.bookingError = null;
      })
      .addCase(createRetreatBooking.fulfilled, (state, action) => {
        state.isBooking = false;
        state.booking = action.payload;
        // Reflect the new booking immediately without waiting on a refetch.
        state.myBookings = [...state.myBookings, action.payload];
      })
      .addCase(createRetreatBooking.rejected, (state, action) => {
        state.isBooking = false;
        state.bookingError = action.payload ?? "Failed to reserve your retreat seat";
      });
  },
});

export const { clearRetreats } = retreatSlice.actions;
export default retreatSlice.reducer;