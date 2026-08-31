import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import { actionApi } from "./actionChecklistApi";
import type {
  ICreateModuleAction,
  IModuleAction,
  IUpdateModuleAction,
} from "./actionChecklistTypes";

interface ActionState {
  actions: IModuleAction[];
  selectedAction: IModuleAction | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: ActionState = {
  actions: [],
  selectedAction: null,
  loading: false,
  actionLoading: false,
  error: null,
};

export const fetchModuleActions = createAsyncThunk(
  "moduleAction/getAll",
  async (
    params: { moduleId?: string; includeArchived?: boolean } | undefined,
  ) => {
    const res = await actionApi.getAll(
      params?.moduleId,
      params?.includeArchived ?? true,
    );
    return res.data;
  },
);

export const fetchModuleActionById = createAsyncThunk(
  "moduleAction/getById",
  async (id: string) => {
    const res = await actionApi.getById(id);
    return res.data;
  },
);

export const createModuleAction = createAsyncThunk(
  "moduleAction/create",
  async ({ moduleId, data }: { moduleId: string; data: ICreateModuleAction }) => {
    const res = await actionApi.create(moduleId, data);
    return res.data;
  },
);

export const updateModuleAction = createAsyncThunk(
  "moduleAction/update",
  async ({ id, data }: { id: string; data: IUpdateModuleAction }) => {
    const res = await actionApi.update(id, data);
    return res.data;
  },
);

export const publishModuleAction = createAsyncThunk(
  "moduleAction/publish",
  async (id: string) => {
    const res = await actionApi.publish(id);
    return res.data;
  },
);

export const draftModuleAction = createAsyncThunk(
  "moduleAction/draft",
  async (id: string) => {
    const res = await actionApi.draft(id);
    return res.data;
  },
);

export const archiveModuleAction = createAsyncThunk(
  "moduleAction/archive",
  async (id: string) => {
    const res = await actionApi.archive(id);
    return res.data;
  },
);

const upsertAction = (state: ActionState, updated: IModuleAction) => {
  const index = state.actions.findIndex((item) => item._id === updated._id);
  if (index !== -1) {
    state.actions[index] = updated;
  } else {
    state.actions.push(updated);
  }
  if (state.selectedAction?._id === updated._id) {
    state.selectedAction = updated;
  }
};

const actionSlice = createSlice({
  name: "moduleAction",
  initialState,
  reducers: {
    clearSelectedAction: (state) => {
      state.selectedAction = null;
    },
    clearActionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModuleActions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchModuleActions.fulfilled,
        (state, action: PayloadAction<IModuleAction[]>) => {
          state.loading = false;
          state.actions = action.payload || [];
        },
      )
      .addCase(fetchModuleActions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading actions";
      })

      .addCase(fetchModuleActionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModuleActionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAction = action.payload;
      })
      .addCase(fetchModuleActionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading action";
      })

      .addCase(createModuleAction.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createModuleAction.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actions.push(action.payload);
      })
      .addCase(createModuleAction.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.error.message || "Failed to create action";
      })

      .addCase(updateModuleAction.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateModuleAction.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertAction(state, action.payload);
      })
      .addCase(updateModuleAction.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.error.message || "Failed to update action";
      })

      .addCase(publishModuleAction.fulfilled, (state, action) => {
        upsertAction(state, action.payload);
      })
      .addCase(publishModuleAction.rejected, (state, action) => {
        state.error = action.error.message || "Failed to publish action";
      })

      .addCase(draftModuleAction.fulfilled, (state, action) => {
        upsertAction(state, action.payload);
      })
      .addCase(draftModuleAction.rejected, (state, action) => {
        state.error = action.error.message || "Failed to move action to draft";
      })

      .addCase(archiveModuleAction.fulfilled, (state, action) => {
        upsertAction(state, action.payload);
      })
      .addCase(archiveModuleAction.rejected, (state, action) => {
        state.error = action.error.message || "Failed to archive action";
      });
  },
});

export const { clearSelectedAction, clearActionError } = actionSlice.actions;
export default actionSlice.reducer;