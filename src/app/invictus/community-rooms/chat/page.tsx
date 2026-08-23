"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

import ChatHeader from "@/components/chat/chat-header";
import MessageInput from "@/components/chat/message-input";
import MessageList from "@/components/chat/message-list";
import { useSocket } from "@/hooks/useSocket";
import {
  fetchCountryRoom,
  fetchMessageHistory,
} from "@/lib/features/chat/chatSlice";
import { fetchCurrentUserProfile } from "@/lib/features/auth/authUserSlice";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { ReplyTo } from "@/types/chat";
import { RichTextEditorHandle } from "@/components/ui/rich-text-editor";

export default function GroupChatPage() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const room = useSelector((state: RootState) => state.chat.room);
  const profile = useSelector((state: RootState) => state.authUser.profile);
  const tokenUser = useSelector((state: RootState) => state.authUser.user);
  const selectedCountry = searchParams.get("countryName") || undefined;
  const editorRef = useRef<RichTextEditorHandle>(null);
  const messageRefs = useRef(new Map<string, HTMLDivElement>());
  const canChooseAnyRoom =
    profile?.role === "founder" ||
    profile?.role === "admin" ||
    profile?.role === "manager";
  const countryName =
    canChooseAnyRoom ? selectedCountry || profile?.country : profile?.country;
  const { sendMessage, deleteMessage, startTyping, stopTyping } = useSocket(
    countryName,
    canChooseAnyRoom,
  );

  // reply-to state: holds the message the user is replying to (null = no active reply)
  const [replyingTo, setReplyingTo] = useState<
    (ReplyTo & { id: string }) | null
  >(null);

  useEffect(() => {
    if (!profile && tokenUser?.id) {
      dispatch(fetchCurrentUserProfile(tokenUser.id));
    }
  }, [dispatch, profile, tokenUser?.id]);

  useEffect(() => {
    if (countryName) {
      dispatch(fetchCountryRoom(countryName));
    }
  }, [countryName, dispatch]);

  useEffect(() => {
    if (room?._id) {
      dispatch(fetchMessageHistory(room._id));
    }
  }, [dispatch, room?._id]);

  const handleSend = useCallback(
    (content: string, replyTo?: string | null) => {
      sendMessage(content, replyTo);
    },
    [sendMessage],
  );

  const handleReply = useCallback((msg: ReplyTo & { id: string }) => {
    setReplyingTo(msg);
  }, []);

  useEffect(() => {
    if (replyingTo) {
      requestAnimationFrame(() => editorRef.current?.focus());
    }
  }, [replyingTo]);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  const handleReplyClick = useCallback((messageId: string) => {
    if (!messageId) return;

    const messageElement = messageRefs.current.get(messageId);
    messageElement?.scrollIntoView({ behavior: "smooth", block: "center" });

    if (messageElement) {
      messageElement.classList.add("ring-2", "ring-indigo-400");
      window.setTimeout(() => {
        messageElement.classList.remove("ring-2", "ring-indigo-400");
      }, 1200);
    }
  }, []);

  const registerMessageRef = useCallback(
    (messageId: string, element: HTMLDivElement | null) => {
      if (element) {
        messageRefs.current.set(messageId, element);
      } else {
        messageRefs.current.delete(messageId);
      }
    },
    [],
  );

  const handleDelete = useCallback(
    (messageId: string) => {
      deleteMessage(messageId);
    },
    [deleteMessage],
  );

 

  return (
    <div className="h-[calc(100vh-60px)] flex justify-center p-6">
      <div className="w-full max-w-5xl rounded-2xl border  flex flex-col overflow-hidden">
        <ChatHeader />

        <MessageList
          onReply={handleReply}
          onDelete={handleDelete}
          onReplyClick={handleReplyClick}
          registerMessageRef={registerMessageRef}
        />

        <MessageInput
          onSend={handleSend}
          onTypingStart={startTyping}
          onTypingStop={stopTyping}
          replyingTo={replyingTo}
          onCancelReply={handleCancelReply}
          
          editorRef={editorRef}
        />
      </div>
    </div>
  );
}
