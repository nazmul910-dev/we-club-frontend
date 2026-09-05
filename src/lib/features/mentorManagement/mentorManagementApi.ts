import api from "@/lib/api/api";

import type {
  CreateMentorPayload,
  MentorProfile,
  MentorProfileQuery,
  UpdateMentorPayload,
} from "./mentorManagementTypes";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const BASE = "/invictus/mentorship-profiles";

export const mentorManagementApi = {
  list: async (
    query: MentorProfileQuery = {},
  ): Promise<ApiEnvelope<MentorProfile[]>> => {
    const response = await api.get<ApiEnvelope<MentorProfile[]>>(
      `${BASE}/management`,
      {
      params: query,
      },
    );
    return response.data;
  },

  create: async (
    payload: CreateMentorPayload,
  ): Promise<ApiEnvelope<MentorProfile>> => {
    const response = await api.post<ApiEnvelope<MentorProfile>>(
      `${BASE}/create-mentor`,
      payload,
    );
    return response.data;
  },

  update: async (
    id: string,
    payload: UpdateMentorPayload,
  ): Promise<ApiEnvelope<MentorProfile>> => {
    const response = await api.patch<ApiEnvelope<MentorProfile>>(
      `${BASE}/${id}`,
      payload,
    );
    return response.data;
  },

  publish: async (id: string): Promise<ApiEnvelope<MentorProfile>> => {
    const response = await api.patch<ApiEnvelope<MentorProfile>>(
      `${BASE}/${id}/publish`,
    );
    return response.data;
  },

  draft: async (id: string): Promise<ApiEnvelope<MentorProfile>> => {
    const response = await api.patch<ApiEnvelope<MentorProfile>>(
      `${BASE}/${id}/draft`,
    );
    return response.data;
  },

  archive: async (id: string): Promise<ApiEnvelope<MentorProfile>> => {
    const response = await api.patch<ApiEnvelope<MentorProfile>>(
      `${BASE}/${id}/archive`,
    );
    return response.data;
  },
};
