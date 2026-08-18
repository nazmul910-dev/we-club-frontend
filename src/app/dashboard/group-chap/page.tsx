"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ChatHeader from "@/components/chat/chat-header";
import MessageInput from "@/components/chat/message-input";
import MessageList from "@/components/chat/message-list";
import { useSocket } from "@/hooks/useSocket";
import {
  fetchGeneralRoom,
  fetchMessageHistory,
} from "@/lib/features/chat/chatSlice";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { ReplyTo } from "@/types/chat";

export default function GroupChatPage() {
  const dispatch = useDispatch<AppDispatch>();
  const room = useSelector((state: RootState) => state.chat.room);
  const { sendMessage, deleteMessage, startTyping, stopTyping } = useSocket();

  // reply-to state: holds the message the user is replying to (null = no active reply)
  const [replyingTo, setReplyingTo] = useState<
    (ReplyTo & { id: string }) | null
  >(null);

  useEffect(() => {
    dispatch(fetchGeneralRoom());
  }, [dispatch]);

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

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  const handleDelete = useCallback(
    (messageId: string) => {
      deleteMessage(messageId);
    },
    [deleteMessage],
  );

  return (
    <div className="h-screen bg-zinc-950 flex justify-center p-6">
      <div className="w-full max-w-5xl rounded-2xl border border-zinc-800 bg-black flex flex-col overflow-hidden">
        <ChatHeader />

        <MessageList onReply={handleReply} onDelete={handleDelete} />

        <MessageInput
          onSend={handleSend}
          onTypingStart={startTyping}
          onTypingStop={stopTyping}
          replyingTo={replyingTo}
          onCancelReply={handleCancelReply}
        />
      </div>
    </div>
  );
}
