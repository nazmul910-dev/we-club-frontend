import api from "@/lib/api/api";
import type {
  ICreateSessionSchedulePayload,
  ISessionAttendanceItem,
  ISessionScheduleItem,
  IUpdateSessionSchedulePayload,
} from "./sessionScheduleTypes";

const BASE = "/invictus/session-schedules";
const ATTENDANCE_BASE = "/invictus/session-attendances";

interface PaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const sessionScheduleApi = {
  // ---------------------------------------------------------------------
  // Public / user side
  // ---------------------------------------------------------------------

  // upcoming session list — Events section + sidebar duitatei lage
  getUpcoming: async (limit = 5): Promise<ISessionScheduleItem[]> => {
    const res = await api.get(BASE, {
      params: { status: "scheduled", startDate: new Date().toISOString(), limit },
    });
    return res.data.data.data as ISessionScheduleItem[];
  },

  // single session details (join page / detail modal-e lagbe)
  getSingleSession: async (id: string): Promise<ISessionScheduleItem> => {
    const res = await api.get(`${BASE}/${id}`);
    return res.data.data as ISessionScheduleItem;
  },

  registerForSession: async (sessionId: string) => {
    const res = await api.post(`${ATTENDANCE_BASE}/register`, { session: sessionId });
    return res.data.data as ISessionAttendanceItem;
  },

  getMyAttendances: async (): Promise<ISessionAttendanceItem[]> => {
    const res = await api.get(`${ATTENDANCE_BASE}/me`);
    return res.data.data as ISessionAttendanceItem[];
  },

  // ---------------------------------------------------------------------
  // Admin / manager side (create/update/cancel/delete session)
  // ---------------------------------------------------------------------

  getAllAdmin: async (
    page = 1,
    limit = 20,
    filters?: {
      status?: string;
      sessionType?: string;
      hostId?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<PaginatedResponse<ISessionScheduleItem>> => {
    const res = await api.get(BASE, {
      params: { page, limit, ...filters },
    });
    return res.data.data as PaginatedResponse<ISessionScheduleItem>;
  },

  createSession: async (
    payload: ICreateSessionSchedulePayload,
  ): Promise<ISessionScheduleItem> => {
    const res = await api.post(BASE, payload);
    return res.data.data as ISessionScheduleItem;
  },

  updateSession: async (
    id: string,
    payload: IUpdateSessionSchedulePayload,
  ): Promise<ISessionScheduleItem> => {
    const res = await api.patch(`${BASE}/${id}`, payload);
    return res.data.data as ISessionScheduleItem;
  },

  cancelSession: async (
    id: string,
    reason: string,
  ): Promise<ISessionScheduleItem> => {
    const res = await api.patch(`${BASE}/${id}/cancel`, { reason });
    return res.data.data as ISessionScheduleItem;
  },

  deleteSession: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete(`${BASE}/${id}`);
    return res.data.data;
  },

  // ---------------------------------------------------------------------
  // Admin / manager side (attendance management — mark / cancel / list)
  // ---------------------------------------------------------------------

  markAttendance: async (payload: {
    session: string;
    user: string;
    status: "attended" | "late" | "no_show" | "registered" | "cancelled";
    notes?: string;
  }): Promise<ISessionAttendanceItem> => {
    const res = await api.post(`${ATTENDANCE_BASE}/mark`, payload);
    return res.data.data as ISessionAttendanceItem;
  },

  cancelAttendance: async (payload: {
    session: string;
    user: string;
    reason: string;
  }): Promise<ISessionAttendanceItem> => {
    const res = await api.post(`${ATTENDANCE_BASE}/cancel`, payload);
    return res.data.data as ISessionAttendanceItem;
  },

  getAllAttendancesAdmin: async (
    page = 1,
    limit = 20,
    filters?: { sessionId?: string; userId?: string; status?: string },
  ): Promise<PaginatedResponse<ISessionAttendanceItem>> => {
    const res = await api.get(ATTENDANCE_BASE, {
      params: { page, limit, ...filters },
    });
    return res.data.data as PaginatedResponse<ISessionAttendanceItem>;
  },
};