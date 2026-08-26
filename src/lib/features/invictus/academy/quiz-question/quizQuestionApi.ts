import api from "@/lib/api/api";

import type {
  ICreateQuizQuestion,
  IQuizQuestion,
  IUpdateQuizQuestion,
} from "./quizQuestionTypes";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const QUESTION_URL = "/invictus/quiz-questions";

export const quizQuestionApi = {
  // Get All Questions (optionally filter by module)
  getAll: async (
    moduleId?: string,
    includeArchived = false,
  ): Promise<ApiEnvelope<IQuizQuestion[]>> => {
    const res = await api.get(QUESTION_URL, {
      params: {
        ...(moduleId ? { moduleId } : {}),
        ...(includeArchived ? { includeArchived: "true" } : {}),
      },
    });
    return res.data;
  },

  // Get Questions for a specific Course Module
  getByModule: async (
    moduleId: string,
  ): Promise<ApiEnvelope<IQuizQuestion[]>> => {
    const res = await api.get(`${QUESTION_URL}/module/${moduleId}`);
    return res.data;
  },

  // Get Single Question
  getById: async (id: string): Promise<ApiEnvelope<IQuizQuestion>> => {
    const res = await api.get(`${QUESTION_URL}/${id}`);
    return res.data;
  },

  // Create Question under a Course Module
  create: async (moduleId: string, data: ICreateQuizQuestion) => {
    const res = await api.post(`${QUESTION_URL}/module/${moduleId}`, data);
    return res.data;
  },

  // Update Question
  update: async (id: string, data: IUpdateQuizQuestion) => {
    const res = await api.patch(`${QUESTION_URL}/${id}`, data);
    return res.data;
  },

  // Publish
  publish: async (id: string): Promise<ApiEnvelope<IQuizQuestion>> => {
    const res = await api.patch(`${QUESTION_URL}/${id}/publish`);
    return res.data;
  },

  // Draft
  draft: async (id: string): Promise<ApiEnvelope<IQuizQuestion>> => {
    const res = await api.patch(`${QUESTION_URL}/${id}/draft`);
    return res.data;
  },

  // Archive
  archive: async (id: string): Promise<ApiEnvelope<IQuizQuestion>> => {
    const res = await api.patch(`${QUESTION_URL}/${id}/archive`);
    return res.data;
  },
};