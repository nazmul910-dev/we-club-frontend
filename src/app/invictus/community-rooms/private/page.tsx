"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import ChatHeader from "@/components/chat/chat-header";
import MessageInput from "@/components/chat/message-input";
import MessageList from "@/components/chat/message-list";
import { useSocket } from "@/hooks/useSocket";
import { fetchMessageHistory, fetchPrivateRoom } from "@/lib/features/chat/chatSlice";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { ReplyTo } from "@/types/chat";
import { RichTextEditorHandle } from "@/components/ui/rich-text-editor";

export default function PrivateCommunityRoomPage() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const slug = searchParams.get("room") || "";
  const room = useSelector((state: RootState) => state.chat.room);
  const editorRef = useRef<RichTextEditorHandle>(null);
  const messageRefs = useRef(new Map<string, HTMLDivElement>());
  const [replyingTo, setReplyingTo] = useState<(ReplyTo & { id: string }) | null>(null);
  const { sendMessage, deleteMessage, startTyping, stopTyping } = useSocket(undefined, false, slug);

  useEffect(() => {
    if (slug) dispatch(fetchPrivateRoom(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (room?._id) dispatch(fetchMessageHistory(room._id));
  }, [dispatch, room?._id]);

  const handleReplyClick = useCallback((messageId: string) => {
    const element = messageRefs.current.get(messageId);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <div className="flex h-[calc(100vh-60px)] justify-center p-6">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border bg-white">
        <ChatHeader />
        <MessageList
          onReply={setReplyingTo}
          onDelete={deleteMessage}
          onReplyClick={handleReplyClick}
          registerMessageRef={(id, element) => {
            if (element) messageRefs.current.set(id, element);
            else messageRefs.current.delete(id);
          }}
        />
        <MessageInput
          onSend={(content, replyTo) => sendMessage(content, replyTo)}
          onTypingStart={startTyping}
          onTypingStop={stopTyping}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          editorRef={editorRef}
        />
      </div>
    </div>
  );
}
