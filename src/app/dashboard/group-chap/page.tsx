"use client";

import { useEffect } from "react";
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

export default function GroupChatPage() {
  const dispatch = useDispatch<AppDispatch>();
  const room = useSelector((state: RootState) => state.chat.room);
  const { sendMessage, startTyping, stopTyping } = useSocket();

  useEffect(() => {
    dispatch(fetchGeneralRoom());
  }, [dispatch]);

  useEffect(() => {
    if (room?._id) {
      dispatch(fetchMessageHistory(room._id));
    }
  }, [dispatch, room?._id]);

  return (
    <div className="h-screen bg-zinc-950 flex justify-center p-6">
      <div className="w-full max-w-5xl rounded-2xl border border-zinc-800 bg-black flex flex-col overflow-hidden">
        <ChatHeader />

        <MessageList />

        <MessageInput
          onSend={sendMessage}
          onTypingStart={startTyping}
          onTypingStop={stopTyping}
        />
      </div>
    </div>
  );
}
