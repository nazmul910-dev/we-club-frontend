import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { notificationApi } from "./notificationApi";
import type {
  IGetMyNotificationsParams,
  INotificationItem,
  INotificationsPagination,
} from "./notificationTypes";

interface NotificationState {
  notifications: INotificationItem[];
  meta: INotificationsPagination;
  unreadCount: number;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  unreadCount: 0,
  loading: false,
  actionLoading: false,
  error: null,
};

export const fetchMyNotifications = createAsyncThunk(
  "notification/fetchMyNotifications",
  async (params: IGetMyNotificationsParams | undefined, { rejectWithValue }) => {
    try {
      const res = await notificationApi.getMyNotifications(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

export const fetchMyUnreadCount = createAsyncThunk(
  "notification/fetchMyUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationApi.getUnreadCount();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationApi.markAllAsRead();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to mark all as read"
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notification/markOneAsRead",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await notificationApi.markOneAsRead(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }
);

export const markNotificationAsUnread = createAsyncThunk(
  "notification/markOneAsUnread",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await notificationApi.markOneAsUnread(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to mark notification as unread"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    incrementUnreadCount(state) {
      state.unreadCount += 1;
    },
    clearNotificationError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // --- Fetch My Notifications ---
    builder
      .addCase(fetchMyNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications || [];
        state.meta = action.payload.meta || state.meta;
      })
      .addCase(fetchMyNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- Fetch Unread Count ---
    builder.addCase(fetchMyUnreadCount.fulfilled, (state, action) => {
      state.unreadCount = action.payload?.unreadCount ?? 0;
    });

    // --- Mark All As Read ---
    builder
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.actionLoading = false;
        state.unreadCount = 0;
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        }));
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // --- Mark One As Read ---
    builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
      const updated = action.payload;
      const index = state.notifications.findIndex((n) => n._id === updated._id);
      if (index !== -1) {
        if (!state.notifications[index].isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications[index] = updated;
      }
    });

    // --- Mark One As Unread ---
    builder.addCase(markNotificationAsUnread.fulfilled, (state, action) => {
      const updated = action.payload;
      const index = state.notifications.findIndex((n) => n._id === updated._id);
      if (index !== -1) {
        if (state.notifications[index].isRead) {
          state.unreadCount += 1;
        }
        state.notifications[index] = updated;
      }
    });
  },
});

export const { incrementUnreadCount, clearNotificationError } =
  notificationSlice.actions;
export default notificationSlice.reducer;
