import api from "@/lib/api/api";

import type { IModuleResource, IUpdateModuleResource } from "./resourceTypes";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const RESOURCE_URL = "/invictus/module-resources";

export const resourceApi = {
  // Get All Resources (optionally filter by module)
  getAll: async (
    moduleId?: string,
    includeArchived = false,
  ): Promise<ApiEnvelope<IModuleResource[]>> => {
    const res = await api.get(RESOURCE_URL, {
      params: {
        ...(moduleId ? { moduleId } : {}),
        ...(includeArchived ? { includeArchived: "true" } : {}),
      },
    });
    return res.data;
  },

  // Get Resources for a specific Course Module
  getByModule: async (
    moduleId: string,
  ): Promise<ApiEnvelope<IModuleResource[]>> => {
    const res = await api.get(`${RESOURCE_URL}/module/${moduleId}`);
    return res.data;
  },

  // Get Single Resource
  getById: async (id: string): Promise<ApiEnvelope<IModuleResource>> => {
    const res = await api.get(`${RESOURCE_URL}/${id}`);
    return res.data;
  },

  // Create Resource under a Course Module (multipart if provider=cloudinary)
  create: async (moduleId: string, data: FormData) => {
    const res = await api.post(`${RESOURCE_URL}/module/${moduleId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // Update Resource metadata
  update: async (id: string, data: IUpdateModuleResource) => {
    const res = await api.patch(`${RESOURCE_URL}/${id}`, data);
    return res.data;
  },

  // Publish
  publish: async (id: string): Promise<ApiEnvelope<IModuleResource>> => {
    const res = await api.patch(`${RESOURCE_URL}/${id}/publish`);
    return res.data;
  },

  // Draft
  draft: async (id: string): Promise<ApiEnvelope<IModuleResource>> => {
    const res = await api.patch(`${RESOURCE_URL}/${id}/draft`);
    return res.data;
  },

  // Archive
  archive: async (id: string): Promise<ApiEnvelope<IModuleResource>> => {
    const res = await api.patch(`${RESOURCE_URL}/${id}/archive`);
    return res.data;
  },
};