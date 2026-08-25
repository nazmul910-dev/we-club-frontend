import api from "@/lib/api/api";

import type {
  ICourseModule,
  ICreateCourseModule,
  IUpdateCourseModule,
} from "./courseTypes";

export type ApiEnvelope<T> = {
  success: boolean;

  message: string;

  data: T;
};

const COURSE_URL = "/invictus/course-modules";

export const courseApi = {
  // Get All Courses

  getCourses: async (): Promise<ApiEnvelope<ICourseModule[]>> => {
    const res = await api.get(COURSE_URL);

    return res.data;
  },

  // Get Single Course

  getCourseById: async (id: string): Promise<ApiEnvelope<ICourseModule>> => {
    const res = await api.get(`${COURSE_URL}/${id}`);

    return res.data;
  },

  // Get Courses By Pillar

  getCoursesByPillar: async (
    pillarId: string,
  ): Promise<ApiEnvelope<ICourseModule[]>> => {
    const res = await api.get(`${COURSE_URL}/pillar/${pillarId}`);

    return res.data;
  },

  // Create Course

  createCourse: async (data: FormData) => {
    const res = await api.post(
      COURSE_URL,

      data,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return res.data;
  },

  // Update Course

  updateCourse: async (id: string, data: FormData) => {
    const res = await api.patch(
      `${COURSE_URL}/${id}`,

      data,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return res.data;
  },

  // Publish

  publishCourse: async (id: string): Promise<ApiEnvelope<ICourseModule>> => {
    const res = await api.patch(`${COURSE_URL}/${id}/publish`);

    return res.data;
  },

  // Draft

  draftCourse: async (id: string): Promise<ApiEnvelope<ICourseModule>> => {
    const res = await api.patch(`${COURSE_URL}/${id}/draft`);

    return res.data;
  },

  // Archive

  archiveCourse: async (id: string): Promise<ApiEnvelope<ICourseModule>> => {
    const res = await api.patch(`${COURSE_URL}/${id}/archive`);

    return res.data;
  },
};
