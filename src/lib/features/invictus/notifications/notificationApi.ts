import api from "@/lib/api/api";
import type {
  IGetMyNotificationsParams,
  INotificationItem,
  INotificationsResponse,
  IUnreadCountResponse,
} from "./notificationTypes";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const NOTIFICATIONS_URL = "/invictus/notifications";

export const notificationApi = {
  /**
   * Fetch current user's notifications with optional pagination and filters.
   * GET /invictus/notifications/me
   */
  getMyNotifications: async (
    params?: IGetMyNotificationsParams
  ): Promise<ApiEnvelope<INotificationsResponse>> => {
    const query = new URLSearchParams();
    if (params?.isRead !== undefined) query.set("isRead", String(params.isRead));
    if (params?.type) query.set("type", params.type);
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const res = await api.get(`${NOTIFICATIONS_URL}/me?${query.toString()}`);
    return res.data;
  },

  /**
   * Fetch current user's unread notification count.
   * GET /invictus/notifications/me/unread-count
   */
  getUnreadCount: async (): Promise<ApiEnvelope<IUnreadCountResponse>> => {
    const res = await api.get(`${NOTIFICATIONS_URL}/me/unread-count`);
    return res.data;
  },

  /**
   * Mark all notifications as read.
   * PATCH /invictus/notifications/me/read-all
   */
  markAllAsRead: async (): Promise<ApiEnvelope<{ modifiedCount: number }>> => {
    const res = await api.patch(`${NOTIFICATIONS_URL}/me/read-all`);
    return res.data;
  },

  /**
   * Mark a single notification as read.
   * PATCH /invictus/notifications/me/:id/read
   */
  markOneAsRead: async (
    id: string
  ): Promise<ApiEnvelope<INotificationItem>> => {
    const res = await api.patch(`${NOTIFICATIONS_URL}/me/${id}/read`);
    return res.data;
  },

  /**
   * Mark a single notification as unread.
   * PATCH /invictus/notifications/me/:id/unread
   */
  markOneAsUnread: async (
    id: string
  ): Promise<ApiEnvelope<INotificationItem>> => {
    const res = await api.patch(`${NOTIFICATIONS_URL}/me/${id}/unread`);
    return res.data;
  },
};
