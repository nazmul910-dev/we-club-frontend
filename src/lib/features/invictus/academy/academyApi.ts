import api from "@/lib/api/api";

import { ModuleVideo, VideoUploadPayload } from "./academyTypes";

export const academyApi = {
  getModuleVideos: async (moduleId: string) => {
    const res = await api.get(`/module-videos/module/${moduleId}`);

    return res.data;
  },

  getVideoById: async (id: string) => {
    const res = await api.get(`/module-videos/${id}`);

    return res.data;
  },

  uploadVideo: async (payload: VideoUploadPayload) => {
    const formData = new FormData();

    formData.append("video", payload.video);

    formData.append("title", payload.title);

    formData.append("moduleId", payload.moduleId);

    formData.append("description", payload.description || "");

    formData.append("isPaid", String(payload.isPaid));

    formData.append("isRequired", String(payload.isRequired));

    formData.append(
      "requiredWatchPercent",
      String(payload.requiredWatchPercent),
    );

    formData.append("pointsReward", String(payload.pointsReward));

    formData.append("order", String(payload.order));

    const res = await api.post("/module-videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  updateVideo: async (id: string, data: Partial<ModuleVideo>) => {
    const res = await api.patch(`/module-videos/${id}`, data);

    return res.data;
  },

  publishVideo: async (id: string) => {
    const res = await api.patch(`/module-videos/${id}/publish`);

    return res.data;
  },

  draftVideo: async (id: string) => {
    const res = await api.patch(`/module-videos/${id}/draft`);

    return res.data;
  },

  archiveVideo: async (id: string) => {
    const res = await api.patch(`/module-videos/${id}/archive`);

    return res.data;
  },
  getMyEntitlement: async () => {
    const res = await api.get("/user-entitlements/me");

    return res.data;
  },
  getModules: async () => {
    const res = await api.get("/course-modules");

    return res.data;
  },
  getModuleById: async (id: string) => {
    const res = await api.get(`/course-modules/${id}`);

    return res.data;
  },
};
