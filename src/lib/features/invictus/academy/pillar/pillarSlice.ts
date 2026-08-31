import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import { pillarApi } from "./pillarApi";

import type {
  ChallengePillar,
  CreatePillarPayload,
  UpdatePillarPayload,
} from "./pillarTypes";

interface PillarState {
  pillars: ChallengePillar[];
  selectedPillar: ChallengePillar | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: PillarState = {
  pillars: [],
  selectedPillar: null,
  loading: false,
  actionLoading: false,
  error: null,
};

export const fetchPillars = createAsyncThunk(
  "pillar/getAll",
  async (includeArchived: boolean = true) => {
    const res = await pillarApi.getAll(includeArchived);
    return res.data;
  },
);

export const fetchPillarBySlug = createAsyncThunk(
  "pillar/getBySlug",
  async (slug: string) => {
    const res = await pillarApi.getBySlug(slug);
    return res.data;
  },
);

export const createPillar = createAsyncThunk(
  "pillar/create",
  async (data: CreatePillarPayload) => {
    const res = await pillarApi.create(data);
    return res.data;
  },
);

export const updatePillar = createAsyncThunk(
  "pillar/update",
  async ({ id, data }: { id: string; data: UpdatePillarPayload }) => {
    const res = await pillarApi.update(id, data);
    return res.data;
  },
);

export const publishPillar = createAsyncThunk(
  "pillar/publish",
  async (id: string) => {
    const res = await pillarApi.publish(id);
    return res.data;
  },
);

export const draftPillar = createAsyncThunk(
  "pillar/draft",
  async (id: string) => {
    const res = await pillarApi.draft(id);
    return res.data;
  },
);

export const archivePillar = createAsyncThunk(
  "pillar/archive",
  async (id: string) => {
    const res = await pillarApi.archive(id);
    return res.data;
  },
);

export const seedDefaultPillars = createAsyncThunk(
  "pillar/seedDefaults",
  async () => {
    const res = await pillarApi.seedDefaults();
    return res.data;
  },
);

const upsertPillar = (state: PillarState, updated: ChallengePillar) => {
  const index = state.pillars.findIndex((item) => item._id === updated._id);
  if (index !== -1) {
    state.pillars[index] = updated;
  } else {
    state.pillars.push(updated);
  }
  if (state.selectedPillar?._id === updated._id) {
    state.selectedPillar = updated;
  }
};

const pillarSlice = createSlice({
  name: "pillar",
  initialState,
  reducers: {
    clearSelectedPillar: (state) => {
      state.selectedPillar = null;
    },
    clearPillarError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPillars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPillars.fulfilled,
        (state, action: PayloadAction<ChallengePillar[]>) => {
          state.loading = false;
          state.pillars = action.payload || [];
        },
      )
      .addCase(fetchPillars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading pillars";
      })
      .addCase(fetchPillarBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedPillar = null;
      })
      .addCase(fetchPillarBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPillar = action.payload;
      })
      .addCase(fetchPillarBySlug.rejected, (state, action) => {
        state.loading = false;
        state.selectedPillar = null;
        state.error = action.error.message || "Pillar not found or unavailable";
      })
      .addCase(createPillar.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createPillar.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.pillars.push(action.payload);
      })
      .addCase(createPillar.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.error.message || "Failed to create pillar";
      })
      .addCase(updatePillar.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updatePillar.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertPillar(state, action.payload);
      })
      .addCase(updatePillar.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.error.message || "Failed to update pillar";
      })
      .addCase(publishPillar.fulfilled, (state, action) => {
        upsertPillar(state, action.payload);
      })
      .addCase(draftPillar.fulfilled, (state, action) => {
        upsertPillar(state, action.payload);
      })
      .addCase(archivePillar.fulfilled, (state, action) => {
        upsertPillar(state, action.payload);
      })
      .addCase(archivePillar.rejected, (state, action) => {
        state.error = action.error.message || "Failed to archive pillar";
      })
      .addCase(seedDefaultPillars.fulfilled, (state, action) => {
        state.pillars = action.payload || [];
      });
  },
});

export const { clearSelectedPillar, clearPillarError } = pillarSlice.actions;
export default pillarSlice.reducer;