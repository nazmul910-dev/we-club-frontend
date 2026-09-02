import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { leaderboardAdminApi } from "./leaderboardAdminApi";
import type {
  AdminLeaderboard,
  AdminLeaderboardEntry,
  CreateLeaderboardPayload,
  GetAllLeaderboardsParams,
  PaginationMeta,
  UpdateLeaderboardPayload,
  UpsertPointsPayload,
} from "./leaderboardAdminTypes";

interface LeaderboardAdminState {
  leaderboards: AdminLeaderboard[];
  meta: PaginationMeta | null;
  selectedLeaderboard: AdminLeaderboard | null;

  entries: AdminLeaderboardEntry[];
  entriesMeta: PaginationMeta | null;

  loading: boolean;
  actionLoading: boolean;
  entriesLoading: boolean;
  entryActionLoading: boolean;
  error: string | null;
}

const initialState: LeaderboardAdminState = {
  leaderboards: [],
  meta: null,
  selectedLeaderboard: null,

  entries: [],
  entriesMeta: null,

  loading: false,
  actionLoading: false,
  entriesLoading: false,
  entryActionLoading: false,
  error: null,
};

const extractError = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || fallback;
  }
  return fallback;
};

// ---- Leaderboard CRUD ----

export const fetchLeaderboards = createAsyncThunk<
  { leaderboards: AdminLeaderboard[]; meta: PaginationMeta },
  GetAllLeaderboardsParams | void,
  { rejectValue: string }
>("leaderboardAdmin/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await leaderboardAdminApi.getAll(params ?? undefined);
    return { leaderboards: res.data.data, meta: res.data.meta };
  } catch (err) {
    return rejectWithValue(extractError(err, "Failed to load leaderboards"));
  }
});

export const fetchSingleLeaderboard = createAsyncThunk<
  AdminLeaderboard,
  string,
  { rejectValue: string }
>("leaderboardAdmin/fetchSingle", async (id, { rejectWithValue }) => {
  try {
    const res = await leaderboardAdminApi.getSingle(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(extractError(err, "Leaderboard not found"));
  }
});

export const createLeaderboard = createAsyncThunk<
  AdminLeaderboard,
  CreateLeaderboardPayload,
  { rejectValue: string }
>("leaderboardAdmin/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await leaderboardAdminApi.create(payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(extractError(err, "Failed to create leaderboard"));
  }
});

export const updateLeaderboard = createAsyncThunk<
  AdminLeaderboard,
  { id: string; data: UpdateLeaderboardPayload },
  { rejectValue: string }
>("leaderboardAdmin/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await leaderboardAdminApi.update(id, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(extractError(err, "Failed to update leaderboard"));
  }
});

export const activateLeaderboard = createAsyncThunk<
  AdminLeaderboard,
  string,
  { rejectValue: string }
>("leaderboardAdmin/activate", async (id, { rejectWithValue }) => {
  try {
    const res = await leaderboardAdminApi.activate(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(extractError(err, "Failed to activate leaderboard"));
  }
});

export const finalizeLeaderboard = createAsyncThunk<
  AdminLeaderboard,
  string,
  { rejectValue: string }
>("leaderboardAdmin/finalize", async (id, { rejectWithValue }) => {
  try {
    const res = await leaderboardAdminApi.finalize(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(extractError(err, "Failed to finalize leaderboard"));
  }
});

// ---- Entries ----

export const fetchLeaderboardEntries = createAsyncThunk<
  { entries: AdminLeaderboardEntry[]; meta: PaginationMeta },
  { leaderboardId: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "leaderboardAdmin/fetchEntries",
  async ({ leaderboardId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const res = await leaderboardAdminApi.getEntries(leaderboardId, {
        page,
        limit,
      });
      return { entries: res.data.data, meta: res.data.meta };
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to load entries"));
    }
  },
);

export const upsertEntryPoints = createAsyncThunk<
  AdminLeaderboardEntry,
  { leaderboardId: string; payload: UpsertPointsPayload },
  { rejectValue: string }
>(
  "leaderboardAdmin/upsertPoints",
  async ({ leaderboardId, payload }, { rejectWithValue }) => {
    try {
      const res = await leaderboardAdminApi.upsertPoints(leaderboardId, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to update points"));
    }
  },
);

export const removeLeaderboardEntry = createAsyncThunk<
  { userId: string },
  { leaderboardId: string; userId: string },
  { rejectValue: string }
>(
  "leaderboardAdmin/removeEntry",
  async ({ leaderboardId, userId }, { rejectWithValue }) => {
    try {
      await leaderboardAdminApi.removeEntry(leaderboardId, userId);
      return { userId };
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to remove entry"));
    }
  },
);

export const recalculateLeaderboardRanks = createAsyncThunk<
  { updatedEntries: number },
  string,
  { rejectValue: string }
>("leaderboardAdmin/recalculate", async (leaderboardId, { rejectWithValue }) => {
  try {
    const res = await leaderboardAdminApi.recalculateRanks(leaderboardId);
    return res.data;
  } catch (err) {
    return rejectWithValue(extractError(err, "Failed to recalculate ranks"));
  }
});

const upsertLeaderboardInList = (
  state: LeaderboardAdminState,
  updated: AdminLeaderboard,
) => {
  const index = state.leaderboards.findIndex((lb) => lb._id === updated._id);
  if (index !== -1) {
    state.leaderboards[index] = updated;
  } else {
    state.leaderboards.unshift(updated);
  }
  if (state.selectedLeaderboard?._id === updated._id) {
    state.selectedLeaderboard = updated;
  }
};

const leaderboardAdminSlice = createSlice({
  name: "leaderboardAdmin",
  initialState,
  reducers: {
    clearSelectedLeaderboard: (state) => {
      state.selectedLeaderboard = null;
      state.entries = [];
      state.entriesMeta = null;
    },
    clearLeaderboardAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchLeaderboards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboards = action.payload.leaderboards;
        state.meta = action.payload.meta;
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load leaderboards";
      })

      // fetch single
      .addCase(fetchSingleLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLeaderboard = action.payload;
      })
      .addCase(fetchSingleLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Leaderboard not found";
      })

      // create
      .addCase(createLeaderboard.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createLeaderboard.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.leaderboards.unshift(action.payload);
      })
      .addCase(createLeaderboard.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to create leaderboard";
      })

      // update / activate / finalize — same upsert-into-list behavior
      .addCase(updateLeaderboard.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateLeaderboard.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertLeaderboardInList(state, action.payload);
      })
      .addCase(updateLeaderboard.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to update leaderboard";
      })
      .addCase(activateLeaderboard.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(activateLeaderboard.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertLeaderboardInList(state, action.payload);
      })
      .addCase(activateLeaderboard.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to activate leaderboard";
      })
      .addCase(finalizeLeaderboard.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(finalizeLeaderboard.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertLeaderboardInList(state, action.payload);
      })
      .addCase(finalizeLeaderboard.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to finalize leaderboard";
      })

      // entries
      .addCase(fetchLeaderboardEntries.pending, (state) => {
        state.entriesLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboardEntries.fulfilled, (state, action) => {
        state.entriesLoading = false;
        state.entries = action.payload.entries;
        state.entriesMeta = action.payload.meta;
      })
      .addCase(fetchLeaderboardEntries.rejected, (state, action) => {
        state.entriesLoading = false;
        state.error = action.payload ?? "Failed to load entries";
      })

      // upsert points
      .addCase(upsertEntryPoints.pending, (state) => {
        state.entryActionLoading = true;
        state.error = null;
      })
      .addCase(upsertEntryPoints.fulfilled, (state, action) => {
        state.entryActionLoading = false;
        const index = state.entries.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        } else {
          state.entries.push(action.payload);
        }
      })
      .addCase(upsertEntryPoints.rejected, (state, action) => {
        state.entryActionLoading = false;
        state.error = action.payload ?? "Failed to update points";
      })

      // remove entry
      .addCase(removeLeaderboardEntry.pending, (state) => {
        state.entryActionLoading = true;
        state.error = null;
      })
      .addCase(removeLeaderboardEntry.fulfilled, (state, action) => {
        state.entryActionLoading = false;
        state.entries = state.entries.filter(
          (e) => e.user._id !== action.payload.userId,
        );
      })
      .addCase(removeLeaderboardEntry.rejected, (state, action) => {
        state.entryActionLoading = false;
        state.error = action.payload ?? "Failed to remove entry";
      })

      // recalculate ranks — just triggers a re-fetch from the caller;
      // nothing to patch into state directly here.
      .addCase(recalculateLeaderboardRanks.pending, (state) => {
        state.entryActionLoading = true;
        state.error = null;
      })
      .addCase(recalculateLeaderboardRanks.fulfilled, (state) => {
        state.entryActionLoading = false;
      })
      .addCase(recalculateLeaderboardRanks.rejected, (state, action) => {
        state.entryActionLoading = false;
        state.error = action.payload ?? "Failed to recalculate ranks";
      });
  },
});

export const { clearSelectedLeaderboard, clearLeaderboardAdminError } =
  leaderboardAdminSlice.actions;

export default leaderboardAdminSlice.reducer;
