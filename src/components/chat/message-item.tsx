"use client";

import { useState } from "react";
import { Reply, Trash2 } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ReplyTo } from "@/types/chat";

interface Props {
  messageId: string;
  me: boolean;
  name: string;
  avatar: string;
  message: string;
  time: string;
  isDeleted?: boolean;
  replyTo?: ReplyTo | null;
  onReply: () => void;
  onDelete: () => void;
  /** Optional: jump to the original replied-to message */
  onReplyClick?: () => void;
}

export default function MessageItem({
  messageId: _messageId,
  me,
  name,
  avatar,
  message,
  time,
  isDeleted,
  replyTo,
  onReply,
  onDelete,
  onReplyClick,
}: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex pb-5 ${me ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`flex gap-3 max-w-[70%] ${me ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <Avatar className="h-9 w-9 shrink-0 self-end">
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-zinc-700 text-white text-xs">
            {name[0]}
          </AvatarFallback>
        </Avatar>

        {/* Bubble column */}
        <div className={`flex flex-col ${me ? "items-end" : "items-start"}`}>
          {/* Name + time */}
          <div className={`flex gap-2 items-center mb-1 ${me ? "flex-row-reverse" : ""}`}>
            <span className="text-xs font-semibold text-zinc-300">{name}</span>
            <span className="text-[10px] text-zinc-500">{time}</span>
          </div>

          {/* Reply preview — Discord style, clickable */}
          {replyTo && !isDeleted && (
            <button
              type="button"
              onClick={onReplyClick}
              className={`max-w-[320px]
                flex items-stretch rounded-xl overflow-hidden mb-1 text-left
                bg-zinc-800/60 border border-zinc-700/50
                hover:bg-zinc-700/50 hover:border-zinc-600/60
                transition-colors duration-150 cursor-pointer
                ${me ? "flex-row-reverse" : ""}
              `}
            >
              {/* Colored accent bar */}
              <div className={`w-[3px] shrink-0 ${me ? "bg-white/40" : "bg-indigo-400"}`} />
              <div className="px-3 py-1.5 min-w-0">
                <p className={`text-[11px] font-semibold truncate mb-0.5 ${me ? "text-zinc-300" : "text-indigo-300"}`}>
                  {replyTo.sender.fullName}
                </p>
                <p
                  className="text-[11px] text-zinc-400 truncate"
                  dangerouslySetInnerHTML={{
                    __html: replyTo.isDeleted
                      ? "This message was deleted"
                      : replyTo.content.replace(/<[^>]*>/g, ""),
                  }}
                />
              </div>
            </button>
          )}

          {/* Message bubble */}
          <div
            className={`rounded-2xl max-w-[320px] px-4 py-2.5 text-sm leading-relaxed break-words
    ${isDeleted
                ? "italic text-zinc-500 bg-zinc-900 border border-zinc-800 border-dashed"
                : me
                  ? "bg-white text-black rounded-tr-sm"
                  : "bg-zinc-900 text-white border border-zinc-800 rounded-tl-sm"
              }
    [&_strong]:font-semibold [&_em]:italic [&_s]:line-through
    [&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2
    [&_code]:bg-zinc-800 [&_code]:text-rose-300 [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono
    [&_p]:my-0 [&_p+p]:mt-1`}
            dangerouslySetInnerHTML={{
              __html: isDeleted ? "🗑 This message was deleted" : message,
            }}
          />

          {/* Hover action row — sits below the bubble, always in flow */}
          {!isDeleted && (
            <div
              className={`flex items-center gap-0.5 mt-1 transition-all duration-150
                ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"}
                ${me ? "flex-row-reverse" : ""}`}
            >
              <button
                onClick={onReply}
                title="Reply"
                className="flex items-center gap-1 px-2 py-0.5 aspect-square rounded-full text-[11px] text-zinc-400
                  hover:text-white hover:bg-zinc-700/60 transition-colors"
              >
                <Reply size={16} />

              </button>
              {me && (
                <button
                  onClick={onDelete}
                  title="Delete"
                  className="flex items-center gap-1 px-2 py-0.5 aspect-square rounded-full text-[11px] text-zinc-400
                    hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={16} />

                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}