import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { videoProgressApi } from "./videoProgressApi";
import type {
  IMyModuleVideoProgressResult,
  IMyVideoProgressResult,
  IRecordVideoHeartbeat,
  IVideoProgress,
} from "./videoProgressTypes";

interface VideoProgressState {
  // videoId -> latest known progress for that video
  byVideoId: Record<string, IMyVideoProgressResult>;
  // moduleId -> full video list + progress for that module
  byModuleId: Record<string, IMyModuleVideoProgressResult>;
  myHistory: IVideoProgress[];
  heartbeatLoading: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: VideoProgressState = {
  byVideoId: {},
  byModuleId: {},
  myHistory: [],
  heartbeatLoading: false,
  loading: false,
  error: null,
};

export const sendVideoHeartbeat = createAsyncThunk(
  "videoProgress/heartbeat",
  async ({ videoId, data }: { videoId: string; data: IRecordVideoHeartbeat }) => {
    const res = await videoProgressApi.sendHeartbeat(videoId, data);
    return { videoId, progress: res.data };
  },
);

export const fetchMyVideoProgress = createAsyncThunk(
  "videoProgress/getMyVideo",
  async (videoId: string) => {
    const res = await videoProgressApi.getMyVideoProgress(videoId);
    return { videoId, result: res.data };
  },
);

export const fetchMyModuleVideoProgress = createAsyncThunk(
  "videoProgress/getMyModule",
  async (moduleId: string) => {
    const res = await videoProgressApi.getMyModuleVideoProgress(moduleId);
    return { moduleId, result: res.data };
  },
);

export const fetchMyAllVideoProgress = createAsyncThunk(
  "videoProgress/getMyAll",
  async () => {
    const res = await videoProgressApi.getMyAll();
    return res.data;
  },
);

const videoProgressSlice = createSlice({
  name: "videoProgress",
  initialState,
  reducers: {
    clearVideoProgressError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendVideoHeartbeat.pending, (state) => {
        state.heartbeatLoading = true;
      })
      .addCase(sendVideoHeartbeat.fulfilled, (state, action) => {
        state.heartbeatLoading = false;
        const { videoId, progress } = action.payload;
        state.byVideoId[videoId] = {
          video: {
            id: progress.video._id,
            title: progress.video.title,
            slug: progress.video.slug,
            thumbnailUrl: progress.video.thumbnailUrl,
            durationSeconds: progress.video.durationSeconds,
            requiredWatchPercent: progress.video.requiredWatchPercent,
            isRequired: progress.video.isRequired,
            isPaid: progress.video.isPaid,
            order: progress.video.order,
          },
          module: {
            id: progress.module._id,
            title: progress.module.title,
            slug: progress.module.slug,
            moduleNumber: progress.module.moduleNumber,
            pillar: progress.module.pillar,
          },
          progress: {
            totalWatchedSeconds: progress.totalWatchedSeconds,
            watchPercent: progress.watchPercent,
            lastPositionSeconds: progress.lastPositionSeconds,
            isCompleted: progress.isCompleted,
            completedAt: progress.completedAt,
            lastWatchedAt: progress.lastWatchedAt,
          },
        };
      })
      .addCase(sendVideoHeartbeat.rejected, (state, action) => {
        state.heartbeatLoading = false;
        state.error = action.error.message || "Failed to save watch progress";
      })

      .addCase(fetchMyVideoProgress.fulfilled, (state, action) => {
        state.byVideoId[action.payload.videoId] = action.payload.result;
      })

      .addCase(fetchMyModuleVideoProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyModuleVideoProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.byModuleId[action.payload.moduleId] = action.payload.result;
      })
      .addCase(fetchMyModuleVideoProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading module progress";
      })

      .addCase(fetchMyAllVideoProgress.fulfilled, (state, action) => {
        state.myHistory = action.payload || [];
      });
  },
});

export const { clearVideoProgressError } = videoProgressSlice.actions;
export default videoProgressSlice.reducer;