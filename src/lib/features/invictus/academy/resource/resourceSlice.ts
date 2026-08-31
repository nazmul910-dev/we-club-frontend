import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import { resourceApi } from "./resourceApi";
import type { IModuleResource, IUpdateModuleResource } from "./resourceTypes";

interface ResourceState {
  resources: IModuleResource[];
  selectedResource: IModuleResource | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: ResourceState = {
  resources: [],
  selectedResource: null,
  loading: false,
  actionLoading: false,
  error: null,
};

export const fetchResources = createAsyncThunk(
  "resource/getAll",
  async (
    params: { moduleId?: string; includeArchived?: boolean } | undefined,
  ) => {
    const res = await resourceApi.getAll(
      params?.moduleId,
      params?.includeArchived ?? true,
    );
    return res.data;
  },
);

export const fetchResourceById = createAsyncThunk(
  "resource/getById",
  async (id: string) => {
    const res = await resourceApi.getById(id);
    return res.data;
  },
);

export const createResource = createAsyncThunk(
  "resource/create",
  async ({ moduleId, data }: { moduleId: string; data: FormData }) => {
    const res = await resourceApi.create(moduleId, data);
    return res.data;
  },
);

export const updateResource = createAsyncThunk(
  "resource/update",
  async ({ id, data }: { id: string; data: IUpdateModuleResource }) => {
    const res = await resourceApi.update(id, data);
    return res.data;
  },
);

export const publishResource = createAsyncThunk(
  "resource/publish",
  async (id: string) => {
    const res = await resourceApi.publish(id);
    return res.data;
  },
);

export const draftResource = createAsyncThunk(
  "resource/draft",
  async (id: string) => {
    const res = await resourceApi.draft(id);
    return res.data;
  },
);

export const archiveResource = createAsyncThunk(
  "resource/archive",
  async (id: string) => {
    const res = await resourceApi.archive(id);
    return res.data;
  },
);

const upsertResource = (state: ResourceState, updated: IModuleResource) => {
  const index = state.resources.findIndex((item) => item._id === updated._id);
  if (index !== -1) {
    state.resources[index] = updated;
  } else {
    state.resources.push(updated);
  }
  if (state.selectedResource?._id === updated._id) {
    state.selectedResource = updated;
  }
};

const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    clearSelectedResource: (state) => {
      state.selectedResource = null;
    },
    clearResourceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchResources.fulfilled,
        (state, action: PayloadAction<IModuleResource[]>) => {
          state.loading = false;
          state.resources = action.payload || [];
        },
      )
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading resources";
      })

      .addCase(fetchResourceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResourceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedResource = action.payload;
      })
      .addCase(fetchResourceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading resource";
      })

      .addCase(createResource.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.resources.push(action.payload);
      })
      .addCase(createResource.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.error.message || "Failed to upload resource";
      })

      .addCase(updateResource.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertResource(state, action.payload);
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.error.message || "Failed to update resource";
      })

      .addCase(publishResource.fulfilled, (state, action) => {
        upsertResource(state, action.payload);
      })
      .addCase(publishResource.rejected, (state, action) => {
        state.error = action.error.message || "Failed to publish resource";
      })

      .addCase(draftResource.fulfilled, (state, action) => {
        upsertResource(state, action.payload);
      })
      .addCase(draftResource.rejected, (state, action) => {
        state.error = action.error.message || "Failed to move resource to draft";
      })

      .addCase(archiveResource.fulfilled, (state, action) => {
        upsertResource(state, action.payload);
      })
      .addCase(archiveResource.rejected, (state, action) => {
        state.error = action.error.message || "Failed to archive resource";
      });
  },
});

export const { clearSelectedResource, clearResourceError } = resourceSlice.actions;
export default resourceSlice.reducer;