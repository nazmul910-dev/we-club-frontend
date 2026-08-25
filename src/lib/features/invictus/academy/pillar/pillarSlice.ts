import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { pillarApi } from "./pillarApi";

interface PillarState {
  pillars: any[];

  selectedPillar: any | null;

  loading: boolean;

  error: string | null;
}

const initialState: PillarState = {
  pillars: [],

  selectedPillar: null,

  loading: false,

  error: null,
};

// GET ALL

export const fetchPillars = createAsyncThunk(
  "pillar/getAll",

  async () => {
    return await pillarApi.getAll();
  },
);

// GET SINGLE

export const fetchSinglePillar = createAsyncThunk(
  "pillar/getSingle",

  async (id: string) => {
    return await pillarApi.getById(id);
  },
);

// CREATE

export const createPillar = createAsyncThunk(
  "pillar/create",

  async (data: any) => {
    return await pillarApi.create(data);
  },
);

// UPDATE

export const updatePillar = createAsyncThunk(
  "pillar/update",

  async ({ id, data }: { id: string; data: any }) => {
    return await pillarApi.update(id, data);
  },
);

// PUBLISH

export const publishPillar = createAsyncThunk(
  "pillar/publish",

  async (id: string) => {
    return await pillarApi.publish(id);
  },
);

// DRAFT

export const draftPillar = createAsyncThunk(
  "pillar/draft",

  async (id: string) => {
    return await pillarApi.draft(id);
  },
);

// ARCHIVE

export const archivePillar = createAsyncThunk(
  "pillar/archive",

  async (id: string) => {
    return await pillarApi.archive(id);
  },
);

// DELETE

export const deletePillar = createAsyncThunk(
  "pillar/delete",

  async (id: string) => {
    await pillarApi.delete(id);

    return id;
  },
);

const pillarSlice = createSlice({
  name: "pillar",

  initialState,

  reducers: {
    clearSelectedPillar: (state) => {
      state.selectedPillar = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchPillars.pending,

        (state) => {
          state.loading = true;
        },
      )

      .addCase(
        fetchPillars.fulfilled,

        (state, action) => {
          state.loading = false;

          state.pillars = action.payload.data || action.payload;
        },
      )

      .addCase(
        fetchPillars.rejected,

        (state) => {
          state.loading = false;

          state.error = "Failed loading pillars";
        },
      )

      .addCase(
        fetchSinglePillar.fulfilled,

        (state, action) => {
          state.selectedPillar = action.payload.data || action.payload;
        },
      )

      .addCase(
        createPillar.fulfilled,

        (state, action) => {
          state.pillars.push(action.payload.data || action.payload);
        },
      )

      .addCase(
        updatePillar.fulfilled,

        (state, action) => {
          const updated = action.payload.data || action.payload;

          const index = state.pillars.findIndex(
            (item) => item._id === updated._id,
          );

          if (index !== -1) {
            state.pillars[index] = updated;
          }
        },
      )

      .addCase(
        publishPillar.fulfilled,

        (state, action) => {
          const id = action.meta.arg;

          const pillar = state.pillars.find((item) => item._id === id);

          if (pillar) {
            pillar.status = "published";
          }
        },
      )

      .addCase(
        draftPillar.fulfilled,

        (state, action) => {
          const id = action.meta.arg;

          const pillar = state.pillars.find((item) => item._id === id);

          if (pillar) {
            pillar.status = "draft";
          }
        },
      )

      .addCase(
        archivePillar.fulfilled,

        (state, action) => {
          const id = action.meta.arg;

          const pillar = state.pillars.find((item) => item._id === id);

          if (pillar) {
            pillar.status = "archived";
          }
        },
      )

      .addCase(
        deletePillar.fulfilled,

        (state, action) => {
          state.pillars = state.pillars.filter(
            (item) => item._id !== action.payload,
          );
        },
      );
  },
});

export const { clearSelectedPillar } = pillarSlice.actions;

export default pillarSlice.reducer;
