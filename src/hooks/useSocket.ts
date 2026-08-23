import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";

import {
  messageReceived,
  messageDeleted,
  typingUpdated,
  presenceListSet,
  presenceUpdated,
} from "@/lib/features/chat/chatSlice";
import { Message } from "@/types/chat";
import { AppDispatch, RootState } from "@/lib/redux/store/store";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const useSocket = (countryName?: string, canSwitchRooms = false) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.authUser.isAuthenticated,
  );
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!isAuthenticated) return;
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    let requestedRoom = false;
    socket.on("room:joined", () => {
      if (canSwitchRooms && countryName && !requestedRoom) {
        requestedRoom = true;
        socket.emit("room:join", countryName);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err.message);
    });

    // backend emits this right before it force-disconnects a bad connection
    // (e.g. missing/invalid country) — without this listener that disconnect
    // was completely silent on the client.
    socket.on("error", (message: string) => {
      console.error("Socket error:", message);
    });

    socket.on("message:new", (message: Message) => {
      dispatch(messageReceived(message));
    });

    // patch the deleted message in the store — no re-fetch needed
    socket.on(
      "message:deleted",
      (payload: { messageId: string; content: string }) => {
        dispatch(messageDeleted(payload));
      },
    );

    socket.on(
      "typing:update",
      (payload: { userId: string; fullName: string; typing: boolean }) => {
        dispatch(typingUpdated(payload));
      },
    );

    socket.on("presence:list", (userIds: string[]) => {
      dispatch(presenceListSet(userIds));
    });

    socket.on(
      "presence:update",
      (payload: { userId: string; online: boolean }) => {
        dispatch(presenceUpdated(payload));
      },
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, countryName, canSwitchRooms, dispatch]);

  const sendMessage = useCallback(
    (content: string, replyTo?: string | null) => {
      socketRef.current?.emit("message:send", { content, replyTo: replyTo ?? null });
    },
    [],
  );

  const deleteMessage = useCallback((messageId: string) => {
    socketRef.current?.emit("message:delete", messageId);
  }, []);

  const startTyping = useCallback(() => {
    socketRef.current?.emit("typing:start");
  }, []);

  const stopTyping = useCallback(() => {
    socketRef.current?.emit("typing:stop");
  }, []);

  return { sendMessage, deleteMessage, startTyping, stopTyping };
};