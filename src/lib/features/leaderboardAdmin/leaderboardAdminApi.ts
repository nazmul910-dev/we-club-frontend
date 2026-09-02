import api from "@/lib/api/api";

import type {
  AdminLeaderboard,
  AdminLeaderboardEntry,
  CreateLeaderboardPayload,
  GetAllLeaderboardsParams,
  PaginationMeta,
  UpdateLeaderboardPayload,
  UpsertPointsPayload,
} from "./leaderboardAdminTypes";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};

// CRUD lives under /invictus/leaderboards (leaderboard.route.ts)
const BASE = "/invictus/leaderboards";

// Entry management lives under /invictus (leaderboard.entry.route.ts,
// mounted with mergeParams at the "/invictus" prefix — see server router.ts)
const ENTRIES_BASE = "/invictus";

export const leaderboardAdminApi = {
  getAll: async (
    params: GetAllLeaderboardsParams = {},
  ): Promise<ApiEnvelope<Paginated<AdminLeaderboard>>> => {
    const res = await api.get(BASE, { params });
    return res.data;
  },

  getSingle: async (id: string): Promise<ApiEnvelope<AdminLeaderboard>> => {
    const res = await api.get(`${BASE}/${id}`);
    return res.data;
  },

  create: async (
    data: CreateLeaderboardPayload,
  ): Promise<ApiEnvelope<AdminLeaderboard>> => {
    const res = await api.post(BASE, data);
    return res.data;
  },

  update: async (
    id: string,
    data: UpdateLeaderboardPayload,
  ): Promise<ApiEnvelope<AdminLeaderboard>> => {
    const res = await api.patch(`${BASE}/${id}`, data);
    return res.data;
  },

  activate: async (id: string): Promise<ApiEnvelope<AdminLeaderboard>> => {
    const res = await api.post(`${BASE}/${id}/activate`);
    return res.data;
  },

  finalize: async (id: string): Promise<ApiEnvelope<AdminLeaderboard>> => {
    const res = await api.post(`${BASE}/${id}/finalize`);
    return res.data;
  },

  getEntries: async (
    leaderboardId: string,
    params: { page?: number; limit?: number } = {},
  ): Promise<ApiEnvelope<Paginated<AdminLeaderboardEntry>>> => {
    const res = await api.get(`${BASE}/${leaderboardId}/entries`, { params });
    return res.data;
  },

  upsertPoints: async (
    leaderboardId: string,
    data: UpsertPointsPayload,
  ): Promise<ApiEnvelope<AdminLeaderboardEntry>> => {
    const res = await api.post(`${ENTRIES_BASE}/${leaderboardId}/entries`, data);
    return res.data;
  },

  removeEntry: async (
    leaderboardId: string,
    userId: string,
  ): Promise<ApiEnvelope<AdminLeaderboardEntry>> => {
    const res = await api.delete(
      `${ENTRIES_BASE}/${leaderboardId}/entries/${userId}`,
    );
    return res.data;
  },

  recalculateRanks: async (
    leaderboardId: string,
  ): Promise<ApiEnvelope<{ updatedEntries: number }>> => {
    const res = await api.post(`${ENTRIES_BASE}/${leaderboardId}/recalculate`);
    return res.data;
  },
};
