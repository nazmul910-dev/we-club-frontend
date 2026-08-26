import api from "@/lib/api/api";

import type {
  ICreateModuleAction,
  IModuleAction,
  IUpdateModuleAction,
} from "./actionChecklistTypes";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const ACTION_URL = "/invictus/module-actions";

export const actionApi = {
  // Get All Actions (optionally filter by module)
  getAll: async (
    moduleId?: string,
    includeArchived = false,
  ): Promise<ApiEnvelope<IModuleAction[]>> => {
    const res = await api.get(ACTION_URL, {
      params: {
        ...(moduleId ? { moduleId } : {}),
        ...(includeArchived ? { includeArchived: "true" } : {}),
      },
    });
    return res.data;
  },

  // Get Actions for a specific Course Module
  getByModule: async (
    moduleId: string,
  ): Promise<ApiEnvelope<IModuleAction[]>> => {
    const res = await api.get(`${ACTION_URL}/module/${moduleId}`);
    return res.data;
  },

  // Get Single Action
  getById: async (id: string): Promise<ApiEnvelope<IModuleAction>> => {
    const res = await api.get(`${ACTION_URL}/${id}`);
    return res.data;
  },

  // Create Action Checklist Item under a Course Module
  create: async (moduleId: string, data: ICreateModuleAction) => {
    const res = await api.post(`${ACTION_URL}/module/${moduleId}`, data);
    return res.data;
  },

  // Update Action
  update: async (id: string, data: IUpdateModuleAction) => {
    const res = await api.patch(`${ACTION_URL}/${id}`, data);
    return res.data;
  },

  // Publish
  publish: async (id: string): Promise<ApiEnvelope<IModuleAction>> => {
    const res = await api.patch(`${ACTION_URL}/${id}/publish`);
    return res.data;
  },

  // Draft
  draft: async (id: string): Promise<ApiEnvelope<IModuleAction>> => {
    const res = await api.patch(`${ACTION_URL}/${id}/draft`);
    return res.data;
  },

  // Archive
  archive: async (id: string): Promise<ApiEnvelope<IModuleAction>> => {
    const res = await api.patch(`${ACTION_URL}/${id}/archive`);
    return res.data;
  },
};