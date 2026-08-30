export type NotificationChannel = "in_app" | "email" | "push";

export interface INotificationItem {
  _id: string;
  recipient: string | { _id: string; fullName?: string; email?: string };
  actor?: string | { _id: string; fullName?: string; email?: string; profileImage?: string };
  template?: string | { _id: string; templateKey?: string; name?: string };

  type: string;
  title: string;
  body: string;

  channels: NotificationChannel[];

  relatedEntityType?: string;
  relatedEntityId?: string;
  actionUrl?: string;

  metadata?: Record<string, any>;

  isRead: boolean;
  readAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface IGetMyNotificationsParams {
  isRead?: boolean;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface INotificationsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface INotificationsResponse {
  notifications: INotificationItem[];
  meta: INotificationsPagination;
}

export interface IUnreadCountResponse {
  unreadCount: number;
}
