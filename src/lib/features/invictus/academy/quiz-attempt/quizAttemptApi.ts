import api from "@/lib/api/api";

import type {
  IQuizAttempt,
  IQuizAttemptAdminQuery,
  IQuizAttemptListResponse,
  ISubmitQuizAttempt,
} from "./quizAttemptTypes";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const ATTEMPT_URL = "/invictus/quiz-attempts";

export const quizAttemptApi = {
  // Member: submit answers for a module's quiz
  submit: async (
    moduleId: string,
    data: ISubmitQuizAttempt,
  ): Promise<ApiEnvelope<IQuizAttempt>> => {
    const res = await api.post(`${ATTEMPT_URL}/module/${moduleId}/submit`, data);
    return res.data;
  },

  // Member: all my attempts for one module
  getMyModuleAttempts: async (moduleId: string): Promise<ApiEnvelope<IQuizAttempt[]>> => {
    const res = await api.get(`${ATTEMPT_URL}/me/module/${moduleId}`);
    return res.data;
  },

  // Member: one of my attempts by id
  getMySingleAttempt: async (attemptId: string): Promise<ApiEnvelope<IQuizAttempt>> => {
    const res = await api.get(`${ATTEMPT_URL}/me/${attemptId}`);
    return res.data;
  },

  // Admin/Manager: paginated list of every attempt
  getAll: async (query: IQuizAttemptAdminQuery): Promise<ApiEnvelope<IQuizAttemptListResponse>> => {
    const res = await api.get(ATTEMPT_URL, {
      params: {
        ...(query.userId ? { userId: query.userId } : {}),
        ...(query.moduleId ? { moduleId: query.moduleId } : {}),
        ...(query.passed !== undefined ? { passed: String(query.passed) } : {}),
        page: query.page ?? 1,
        limit: query.limit ?? 20,
      },
    });
    return res.data;
  },

  // Admin/Manager: single attempt with correct answers revealed
  getSingleAdmin: async (id: string): Promise<ApiEnvelope<IQuizAttempt>> => {
    const res = await api.get(`${ATTEMPT_URL}/${id}`);
    return res.data;
  },
};