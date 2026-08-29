import api from "@/lib/api/api";

import type {
  IMyModuleVideoProgressResult,
  IMyVideoProgressResult,
  IRecordVideoHeartbeat,
  IVideoProgress,
  IVideoProgressAdminQuery,
  IVideoProgressListResponse,
} from "./videoProgressTypes";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const PROGRESS_URL = "/invictus/video-progress";

export const videoProgressApi = {
  // Member: send watched segment while the video is playing
  sendHeartbeat: async (
    videoId: string,
    data: IRecordVideoHeartbeat,
  ): Promise<ApiEnvelope<IVideoProgress>> => {
    const res = await api.patch(`${PROGRESS_URL}/video/${videoId}/heartbeat`, data);
    return res.data;
  },

  // Member: my progress for one video (used to resume playback)
  getMyVideoProgress: async (videoId: string): Promise<ApiEnvelope<IMyVideoProgressResult>> => {
    const res = await api.get(`${PROGRESS_URL}/video/${videoId}/me`);
    return res.data;
  },

  // Member: my video progress summary for one course module
  getMyModuleVideoProgress: async (
    moduleId: string,
  ): Promise<ApiEnvelope<IMyModuleVideoProgressResult>> => {
    const res = await api.get(`${PROGRESS_URL}/module/${moduleId}/me`);
    return res.data;
  },

  // Member: my complete video progress history
  getMyAll: async (): Promise<ApiEnvelope<IVideoProgress[]>> => {
    const res = await api.get(`${PROGRESS_URL}/me`);
    return res.data;
  },

  // Admin/Manager: progress report across all members
  getAll: async (query: IVideoProgressAdminQuery): Promise<ApiEnvelope<IVideoProgressListResponse>> => {
    const res = await api.get(PROGRESS_URL, {
      params: {
        ...(query.userId ? { userId: query.userId } : {}),
        ...(query.videoId ? { videoId: query.videoId } : {}),
        ...(query.moduleId ? { moduleId: query.moduleId } : {}),
        ...(query.isCompleted !== undefined ? { isCompleted: String(query.isCompleted) } : {}),
        page: query.page ?? 1,
        limit: query.limit ?? 20,
      },
    });
    return res.data;
  },
};