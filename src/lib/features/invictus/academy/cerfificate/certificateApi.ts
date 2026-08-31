import api from "@/lib/api/api";

import type {
  IAttachCertificateUrl,
  ICertificateListResponse,
  IQuizCertificate,
  IQuizCertificateAdminQuery,
  IVerifyCertificateResult,
} from "./certificateTypes";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const CERTIFICATE_URL = "/invictus/quiz-certificates";

export const certificateApi = {
  // Admin: paginated list of every issued / revoked certificate
  getAll: async (
    query: IQuizCertificateAdminQuery,
  ): Promise<ApiEnvelope<ICertificateListResponse>> => {
    const res = await api.get(CERTIFICATE_URL, {
      params: {
        ...(query.userId ? { userId: query.userId } : {}),
        ...(query.moduleId ? { moduleId: query.moduleId } : {}),
        ...(query.pillarId ? { pillarId: query.pillarId } : {}),
        ...(query.status ? { status: query.status } : {}),
        page: query.page ?? 1,
        limit: query.limit ?? 20,
      },
    });
    return res.data;
  },

  // Admin: single certificate by its Mongo _id
  getById: async (id: string): Promise<ApiEnvelope<IQuizCertificate>> => {
    const res = await api.get(`${CERTIFICATE_URL}/${id}`);
    return res.data;
  },

  // Admin: attach the generated certificate file/asset URL
  attachUrl: async (
    id: string,
    data: IAttachCertificateUrl,
  ): Promise<ApiEnvelope<IQuizCertificate>> => {
    const res = await api.patch(`${CERTIFICATE_URL}/${id}/attach-url`, data);
    return res.data;
  },

  // Admin: revoke an issued certificate
  revoke: async (
    id: string,
    reason?: string,
  ): Promise<ApiEnvelope<IQuizCertificate>> => {
    const res = await api.patch(`${CERTIFICATE_URL}/${id}/revoke`, {
      ...(reason ? { reason } : {}),
    });
    return res.data;
  },

  // Logged in member: every certificate I've earned
  getMine: async (): Promise<ApiEnvelope<IQuizCertificate[]>> => {
    const res = await api.get(`${CERTIFICATE_URL}/me`);
    return res.data;
  },

  // Logged in member: a single certificate of mine
  getMineById: async (
    certificateId: string,
  ): Promise<ApiEnvelope<IQuizCertificate>> => {
    const res = await api.get(`${CERTIFICATE_URL}/me/${certificateId}`);
    return res.data;
  },

  // Logged in member: claim pillar certificate once ALL module quizzes in the pillar are passed
  issueMine: async (
    pillarId: string,
  ): Promise<ApiEnvelope<IQuizCertificate>> => {
    const res = await api.post(`${CERTIFICATE_URL}/pillar/${pillarId}/issue`);
    return res.data;
  },

  // Public: verify a certificate by its printed certificate number
  verify: async (
    certificateNumber: string,
  ): Promise<ApiEnvelope<IVerifyCertificateResult>> => {
    const res = await api.get(
      `${CERTIFICATE_URL}/verify/${certificateNumber}`,
    );
    return res.data;
  },
};