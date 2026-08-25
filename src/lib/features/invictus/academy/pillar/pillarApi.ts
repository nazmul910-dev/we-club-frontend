import api from "@/lib/api/api";

import type {
  ChallengePillar,
  CreatePillarPayload,
  UpdatePillarPayload,
} from "./pillarTypes";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const BASE = "/invictus/challenge-pillars";

export const pillarApi = {
  getAll: async (
    includeArchived = false,
  ): Promise<ApiEnvelope<ChallengePillar[]>> => {
    const res = await api.get(BASE, {
      params: includeArchived ? { includeArchived: "true" } : undefined,
    });
    return res.data;
  },

  getBySlug: async (slug: string): Promise<ApiEnvelope<ChallengePillar>> => {
    const res = await api.get(`${BASE}/${slug}`);
    return res.data;
  },

  create: async (
    data: CreatePillarPayload,
  ): Promise<ApiEnvelope<ChallengePillar>> => {
    const res = await api.post(BASE, data);
    return res.data;
  },

  update: async (
    id: string,
    data: UpdatePillarPayload,
  ): Promise<ApiEnvelope<ChallengePillar>> => {
    const res = await api.patch(`${BASE}/${id}`, data);
    return res.data;
  },

  publish: async (id: string): Promise<ApiEnvelope<ChallengePillar>> => {
    const res = await api.patch(`${BASE}/${id}/publish`);
    return res.data;
  },

  draft: async (id: string): Promise<ApiEnvelope<ChallengePillar>> => {
    const res = await api.patch(`${BASE}/${id}/draft`);
    return res.data;
  },

  // ব্যাকএন্ডে হার্ড ডিলিট নেই — archive-ই soft-delete
  archive: async (id: string): Promise<ApiEnvelope<ChallengePillar>> => {
    const res = await api.patch(`${BASE}/${id}/archive`);
    return res.data;
  },

  seedDefaults: async (): Promise<ApiEnvelope<ChallengePillar[]>> => {
    const res = await api.post(`${BASE}/seed-defaults`);
    return res.data;
  },
};