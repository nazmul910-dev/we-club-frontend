"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
  addRealtimeNotification,
  fetchMyUnreadCount,
} from "@/lib/features/invictus/notifications/notificationSlice";
import type { INotificationItem } from "@/lib/features/invictus/notifications/notificationTypes";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export default function NotificationSocketListener() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(
    (state) => state.authUser.isAuthenticated,
  );
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      dispatch(fetchMyUnreadCount());
    });

    socket.on("notification:new", (newNotification: INotificationItem) => {
      if (!newNotification) return;

      dispatch(addRealtimeNotification(newNotification));

      toast.info(newNotification.title || "New Notification", {
        description: newNotification.body || "",
        duration: 5000,
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, dispatch]);

  return null;
}
