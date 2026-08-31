import api from "@/lib/api/api";

import type {
  IModuleRef,
  IModuleVideo,
} from "@/lib/features/invictus/academy/video-module/videoTypes";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const moduleApi = {
  getModuleById: async (moduleId: string): Promise<ApiEnvelope<any>> => {
    const res = await api.get(`/invictus/course-modules/${moduleId}`);

    return res.data;
  },

  getModuleVideos: async (
    moduleId: string,
  ): Promise<ApiEnvelope<{ module: IModuleRef; videos: IModuleVideo[] }>> => {
    const res = await api.get(`/invictus/module-videos/module/${moduleId}`);

    return res.data;
  },
};
