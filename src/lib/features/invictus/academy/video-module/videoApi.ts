import api from "@/lib/api/api";

import type { IModuleVideo, IUpdateModuleVideo, IModuleRef, IVideoAccessResult } from "./videoTypes";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const VIDEO_URL = "/invictus/module-videos";

export const videoApi = {
  // Get All Videos (optionally filter by module/course)
  getAll: async (
    moduleId?: string,
    includeArchived = false,
  ): Promise<ApiEnvelope<IModuleVideo[]>> => {
    const res = await api.get(VIDEO_URL, {
      params: {
        ...(moduleId ? { moduleId } : {}),
        ...(includeArchived ? { includeArchived: "true" } : {}),
      },
    });
    return res.data;
  },

  // Get Videos for a specific Course Module
  getByModule: async (
    moduleId: string,
  ): Promise<ApiEnvelope<{ module: IModuleRef; videos: IModuleVideo[] }>> => {
    const res = await api.get(`${VIDEO_URL}/module/${moduleId}`);
    return res.data;
  },

  // Get Single Video
  getById: async (id: string): Promise<ApiEnvelope<IModuleVideo>> => {
    const res = await api.get(`${VIDEO_URL}/${id}`);
    return res.data;
  },

  // Create (Upload) Video under a Course Module
  create: async (moduleId: string, data: FormData) => {
    const res = await api.post(`${VIDEO_URL}/module/${moduleId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // Update Video metadata
  update: async (id: string, data: IUpdateModuleVideo) => {
    const res = await api.patch(`${VIDEO_URL}/${id}`, data);
    return res.data;
  },

  // Publish
  publish: async (id: string): Promise<ApiEnvelope<IModuleVideo>> => {
    const res = await api.patch(`${VIDEO_URL}/${id}/publish`);
    return res.data;
  },

  // Draft
  draft: async (id: string): Promise<ApiEnvelope<IModuleVideo>> => {
    const res = await api.patch(`${VIDEO_URL}/${id}/draft`);
    return res.data;
  },

  // Archive (soft delete — backend has no hard delete for videos)
  archive: async (id: string): Promise<ApiEnvelope<IModuleVideo>> => {
    const res = await api.patch(`${VIDEO_URL}/${id}/archive`);
    return res.data;
  },
  
    checkAccess: async (id: string): Promise<ApiEnvelope<IVideoAccessResult>> => {
    const res = await api.get(`${VIDEO_URL}/${id}/access`);
    return res.data;
  },
};