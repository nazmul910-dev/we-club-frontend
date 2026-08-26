import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import { videoApi } from "./videoApi";
import type { IModuleVideo, IUpdateModuleVideo } from "./videoTypes";

interface VideoState {
  videos: IModuleVideo[];
  selectedVideo: IModuleVideo | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: VideoState = {
  videos: [],
  selectedVideo: null,
  loading: false,
  actionLoading: false,
  error: null,
};

export const fetchVideos = createAsyncThunk(
  "video/getAll",
  async (
    params: { moduleId?: string; includeArchived?: boolean } | undefined,
  ) => {
    const res = await videoApi.getAll(
      params?.moduleId,
      params?.includeArchived ?? true,
    );
    return res.data;
  },
);

export const fetchVideoById = createAsyncThunk(
  "video/getById",
  async (id: string) => {
    const res = await videoApi.getById(id);
    return res.data;
  },
);

export const createVideo = createAsyncThunk(
  "video/create",
  async ({ moduleId, data }: { moduleId: string; data: FormData }) => {
    const res = await videoApi.create(moduleId, data);
    return res.data;
  },
);

export const updateVideo = createAsyncThunk(
  "video/update",
  async ({ id, data }: { id: string; data: IUpdateModuleVideo }) => {
    const res = await videoApi.update(id, data);
    return res.data;
  },
);

export const publishVideo = createAsyncThunk(
  "video/publish",
  async (id: string) => {
    const res = await videoApi.publish(id);
    return res.data;
  },
);

export const draftVideo = createAsyncThunk(
  "video/draft",
  async (id: string) => {
    const res = await videoApi.draft(id);
    return res.data;
  },
);

export const archiveVideo = createAsyncThunk(
  "video/archive",
  async (id: string) => {
    const res = await videoApi.archive(id);
    return res.data;
  },
);

const upsertVideo = (state: VideoState, updated: IModuleVideo) => {
  const index = state.videos.findIndex((item) => item._id === updated._id);
  if (index !== -1) {
    state.videos[index] = updated;
  } else {
    state.videos.push(updated);
  }
  if (state.selectedVideo?._id === updated._id) {
    state.selectedVideo = updated;
  }
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    clearSelectedVideo: (state) => {
      state.selectedVideo = null;
    },
    clearVideoError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchVideos.fulfilled,
        (state, action: PayloadAction<IModuleVideo[]>) => {
          state.loading = false;
          state.videos = action.payload || [];
        },
      )
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading videos";
      })

      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVideo = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading video";
      })

      .addCase(createVideo.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.videos.push(action.payload);
      })
      .addCase(createVideo.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.error.message || "Failed to upload video";
      })

      .addCase(updateVideo.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertVideo(state, action.payload);
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.error.message || "Failed to update video";
      })

      .addCase(publishVideo.fulfilled, (state, action) => {
        upsertVideo(state, action.payload);
      })
      .addCase(publishVideo.rejected, (state, action) => {
        state.error = action.error.message || "Failed to publish video";
      })

      .addCase(draftVideo.fulfilled, (state, action) => {
        upsertVideo(state, action.payload);
      })
      .addCase(draftVideo.rejected, (state, action) => {
        state.error = action.error.message || "Failed to move video to draft";
      })

      .addCase(archiveVideo.fulfilled, (state, action) => {
        upsertVideo(state, action.payload);
      })
      .addCase(archiveVideo.rejected, (state, action) => {
        state.error = action.error.message || "Failed to archive video";
      });
  },
});

export const { clearSelectedVideo, clearVideoError } = videoSlice.actions;
export default videoSlice.reducer;