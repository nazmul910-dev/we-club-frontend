"use client";

import { useEffect, useRef, useState } from "react";
import { X, CornerUpLeft, SendHorizontal, Smile } from "lucide-react";
import { ReplyTo } from "@/types/chat";
import RichTextEditor, {
  RichTextEditorHandle,
} from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";

interface Props {
  onSend: (content: string, replyTo?: string | null) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  replyingTo?: (ReplyTo & { id: string }) | null;
  onCancelReply: () => void;
  editorRef: React.RefObject<RichTextEditorHandle | null>;
}

const TYPING_STOP_DELAY = 2000;

const EMOJIS = [
  "😀", "😁", "😂", "🤣", "😊", "😍", "😘", "😜", "🤔", "🙄",
  "😴", "😭", "😡", "🥳", "😎", "🤯", "👍", "👎", "👏", "🙌",
  "🙏", "💪", "🔥", "✨", "🎉", "❤️", "💯", "👀", "😅", "😇",
  "🤗", "😱", "🥺", "😤", "🤝", "👋", "✅", "❌", "⚡", "🚀",
];

function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg border border-zinc-700 bg-zinc-800 p-2 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-150 z-50">
      <div className="grid grid-cols-8 gap-1">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            className="flex h-7 w-7 items-center justify-center rounded text-base hover:bg-zinc-700 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MessageInput({
  onSend,
  onTypingStart,
  onTypingStop,
  replyingTo,
  onCancelReply,
  editorRef,
}: Props) {
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emojiContainerRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClick = (e: MouseEvent) => {
      if (
        emojiContainerRef.current &&
        !emojiContainerRef.current.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showEmojiPicker]);

  const handleUpdate = (_html: string, text: string) => {
    if (!text.trim()) return;
    onTypingStart();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
    }, TYPING_STOP_DELAY);
  };

  const handleSend = () => {
    const text = editorRef.current?.getText()?.trim();
    
    if (!text) return;
    const html = editorRef.current?.getHTML() ?? text;
    onSend(html, replyingTo?.id ?? null);
    editorRef.current?.clearContent();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    onTypingStop();
    onCancelReply();
    console.log("text", text)
    
  };

  const handleEmojiSelect = (emoji: string) => {
    editorRef.current?.insertText(emoji);
    editorRef.current?.focus();
    setShowEmojiPicker(false);
  };

  return (
    <div className="border-t border-gray-400 px-4 py-3">
      {/* Reply banner */}
      {replyingTo && (
        <div className="flex items-center gap-3 mb-2 animate-in slide-in-from-bottom-2 duration-150">
          <div className="w-[3px] self-stretch bg-indigo-400 rounded-full shrink-0" />
          <CornerUpLeft size={13} className="text-indigo-400 shrink-0" />
          <div className="flex-1 min-w-0 ">
            <p className="text-[11px] font-semibold text-indigo-300 mb-0.5">
              Replying to {replyingTo.sender.fullName}
            </p>
            <p
              className="text-[11px] text-zinc-400 truncate"
              dangerouslySetInnerHTML={{
                __html: replyingTo.isDeleted
                  ? "This message was deleted"
                  : replyingTo.content.replace(/<[^>]*>/g, ""),
              }}
            />
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors shrink-0"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <RichTextEditor
        ref={editorRef}
        placeholder={
          replyingTo
            ? `Reply to ${replyingTo.sender.fullName}…`
            : "Type your message…"
        }
        onSend={handleSend}
        onEscape={replyingTo ? onCancelReply : undefined}
        onUpdate={handleUpdate}
        autoFocus
        leftSlot={
          <div className="relative" ref={emojiContainerRef}>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()} // keep editor focused
              onClick={() => setShowEmojiPicker((v) => !v)}
              className={cn(
                "flex h-7 w-7 text-black items-center justify-center rounded transition-colors",
                showEmojiPicker
                  ? "bg-white "
                  : " hover:bg-zinc-700/50"
              )}
              title="Emoji"
            >
              <Smile size={18} />
            </button>
            {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
          </div>
        }
        rightSlot={
          <button
            type="button"
            onClick={handleSend}
            className="flex h-7 w-7 items-center justify-center rounded text-indigo-400 hover:text-indigo-300 transition-colors"
            title="Send (Enter)"
          >
            <SendHorizontal size={18} />
          </button>
        }
      />
    </div>
  );
}