import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { getActiveInvictusLeaderboard } from "./leaderboardApi";
import { InvictusLeaderboardData } from "./leaderboardTypes";

interface LeaderboardState extends Partial<InvictusLeaderboardData> {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: LeaderboardState = {
  leaderboard: undefined,
  entries: undefined,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
};

export const fetchInvictusLeaderboard = createAsyncThunk<
  InvictusLeaderboardData,
  {page? : number ; limit? :  number  } | undefined,
  { rejectValue: string }
>("leaderboard/fetchInvictusLeaderboard", async ({ page = 1, limit } = {}, { rejectWithValue }) => {
  try {
    return await getActiveInvictusLeaderboard(page, limit);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load leaderboard",
      );
    }

    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Failed to load leaderboard");
  }
});

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    clearLeaderboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvictusLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvictusLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaderboard = action.payload.leaderboard;
        state.entries = action.payload.entries;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchInvictusLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to load leaderboard";
      });
  },
});

export const { clearLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
