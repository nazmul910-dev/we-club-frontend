import api from "@/lib/api/api";

import type {
  IModuleProgress,
  IModuleProgressAdminQuery,
  IModuleProgressListResponse,
  IUserModuleProgressListResponse,
} from "./progressTypes";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const PROGRESS_URL = "/invictus/module-progress";

export const progressApi = {
  // Admin: paginated list of every member's module progress
  getAll: async (
    query: IModuleProgressAdminQuery,
  ): Promise<ApiEnvelope<IModuleProgressListResponse>> => {
    const res = await api.get(PROGRESS_URL, {
      params: {
        ...(query.userId ? { userId: query.userId } : {}),
        ...(query.moduleId ? { moduleId: query.moduleId } : {}),
        ...(query.isCompleted !== undefined
          ? { isCompleted: String(query.isCompleted) }
          : {}),
        page: query.page ?? 1,
        limit: query.limit ?? 20,
      },
    });
    return res.data;
  },

  // Admin: paginated list with ONE row per member — every module
  // record for that member is grouped together with a summary.
  getAllByUser: async (
    query: IModuleProgressAdminQuery,
  ): Promise<ApiEnvelope<IUserModuleProgressListResponse>> => {
    const res = await api.get(`${PROGRESS_URL}/by-user`, {
      params: {
        ...(query.userId ? { userId: query.userId } : {}),
        ...(query.moduleId ? { moduleId: query.moduleId } : {}),
        ...(query.isCompleted !== undefined
          ? { isCompleted: String(query.isCompleted) }
          : {}),
        page: query.page ?? 1,
        limit: query.limit ?? 20,
      },
    });
    return res.data;
  },

  // Admin: fetch (and recalculate) a single member's progress for a module
  getUserModuleProgress: async (
    userId: string,
    moduleId: string,
  ): Promise<ApiEnvelope<IModuleProgress>> => {
    const res = await api.get(
      `${PROGRESS_URL}/user/${userId}/module/${moduleId}`,
    );
    return res.data;
  },

  // Logged in member: my progress across every module
  getMyAll: async (): Promise<ApiEnvelope<IModuleProgress[]>> => {
    const res = await api.get(`${PROGRESS_URL}/me`);
    return res.data;
  },

  // Logged in member: my progress for a single module
  getMyModuleProgress: async (
    moduleId: string,
  ): Promise<ApiEnvelope<IModuleProgress>> => {
    const res = await api.get(`${PROGRESS_URL}/me/module/${moduleId}`);
    return res.data;
  },

  // Logged in member: force a recalculation of my module progress
  recalculateMyModuleProgress: async (
    moduleId: string,
  ): Promise<ApiEnvelope<IModuleProgress>> => {
    const res = await api.post(
      `${PROGRESS_URL}/me/module/${moduleId}/recalculate`,
    );
    return res.data;
  },
};