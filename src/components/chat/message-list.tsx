import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "./message-item";
import TypingIndicator from "./typing-indicator";
import { RootState } from "@/lib/redux/store/store";

export default function MessageList() {
  const messages = useSelector((state: RootState) => state.chat.messages);
  const typingUsers = useSelector((state: RootState) => state.chat.typingUsers);
  const currentUserId = useSelector(
    (state: RootState) => state.authUser.profile?._id,
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typingUsers.length]);

  // console.log("Rendering MessageList with messages:", messages);

  return (
    <ScrollArea className="min-h-0">
      <div className="space-y-6 p-6">
        {messages
          .filter((message) => message?.sender)
          .map((message) => (
            <MessageItem
              key={message._id}
              me={message.sender._id === currentUserId}
              name={message.sender.fullName}
              avatar={message.sender.profileImage ?? ""}
              message={message.content}
              time={new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          ))}

        {typingUsers.length > 0 && (
          <TypingIndicator
            user={typingUsers.map((t) => t.fullName).join(", ")}
          />
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
