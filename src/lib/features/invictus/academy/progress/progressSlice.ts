import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import { progressApi } from "./progressApi";
import type {
  IModuleProgress,
  IModuleProgressAdminQuery,
  IPaginationMeta,
  IUserModuleProgressGroup,
} from "./progressTypes";

interface ProgressState {
  records: IModuleProgress[];
  meta: IPaginationMeta;
  userGroups: IUserModuleProgressGroup[];
  userGroupsMeta: IPaginationMeta;
  selectedProgress: IModuleProgress | null;
  selectedUserGroup: IUserModuleProgressGroup | null;
  myProgress: IModuleProgress[];
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  records: [],
  meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  userGroups: [],
  userGroupsMeta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  selectedProgress: null,
  selectedUserGroup: null,
  myProgress: [],
  loading: false,
  detailLoading: false,
  error: null,
};

export const fetchAllProgress = createAsyncThunk(
  "progress/getAll",
  async (query: IModuleProgressAdminQuery | undefined) => {
    const res = await progressApi.getAll(query ?? {});
    return res.data;
  },
);

// One row per member — used by the admin "Progress Tracking" table.
export const fetchAllProgressByUser = createAsyncThunk(
  "progress/getAllByUser",
  async (query: IModuleProgressAdminQuery | undefined) => {
    const res = await progressApi.getAllByUser(query ?? {});
    return res.data;
  },
);

export const fetchUserModuleProgress = createAsyncThunk(
  "progress/getUserModuleProgress",
  async ({ userId, moduleId }: { userId: string; moduleId: string }) => {
    const res = await progressApi.getUserModuleProgress(userId, moduleId);
    return res.data;
  },
);

export const fetchMyAllProgress = createAsyncThunk(
  "progress/getMyAll",
  async () => {
    const res = await progressApi.getMyAll();
    return res.data;
  },
);

export const fetchMyModuleProgress = createAsyncThunk(
  "progress/getMyModule",
  async (moduleId: string) => {
    const res = await progressApi.getMyModuleProgress(moduleId);
    return res.data;
  },
);

export const recalculateMyModuleProgress = createAsyncThunk(
  "progress/recalculateMine",
  async (moduleId: string) => {
    const res = await progressApi.recalculateMyModuleProgress(moduleId);
    return res.data;
  },
);

const upsertRecord = (state: ProgressState, updated: IModuleProgress) => {
  const index = state.records.findIndex((item) => item._id === updated._id);
  if (index !== -1) {
    state.records[index] = updated;
  } else {
    state.records.unshift(updated);
  }
  if (
    state.selectedProgress?._id === updated._id ||
    (state.selectedProgress?.user?._id === updated.user?._id &&
      state.selectedProgress?.module?._id === updated.module?._id)
  ) {
    state.selectedProgress = updated;
  }
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    clearSelectedProgress: (state) => {
      state.selectedProgress = null;
    },
    clearProgressError: (state) => {
      state.error = null;
    },
    clearSelectedUserGroup: (state) => {
      state.selectedUserGroup = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data || [];
        state.meta = action.payload.meta;
      })
      .addCase(fetchAllProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading progress records";
      })

      .addCase(fetchAllProgressByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProgressByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userGroups = action.payload.data || [];
        state.userGroupsMeta = action.payload.meta;
      })
      .addCase(fetchAllProgressByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading member progress overview";
      })

      .addCase(fetchUserModuleProgress.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserModuleProgress.fulfilled,
        (state, action: PayloadAction<IModuleProgress>) => {
          state.detailLoading = false;
          state.selectedProgress = action.payload;
          upsertRecord(state, action.payload);
        },
      )
      .addCase(fetchUserModuleProgress.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.error.message || "Failed loading member progress";
      })

      .addCase(fetchMyAllProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAllProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.myProgress = action.payload || [];
      })
      .addCase(fetchMyAllProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading your progress";
      })

      .addCase(fetchMyModuleProgress.fulfilled, (state, action) => {
        const index = state.myProgress.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) {
          state.myProgress[index] = action.payload;
        } else {
          state.myProgress.push(action.payload);
        }
      })

      .addCase(recalculateMyModuleProgress.fulfilled, (state, action) => {
        const index = state.myProgress.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) {
          state.myProgress[index] = action.payload;
        } else {
          state.myProgress.push(action.payload);
        }
      });
  },
});

export const { clearSelectedProgress, clearProgressError, clearSelectedUserGroup } =
  progressSlice.actions;
export default progressSlice.reducer;