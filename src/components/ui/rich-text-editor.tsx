"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useEditor, EditorContent, Editor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Public API ────────────────────────────────────────────────────────────────
export interface RichTextEditorHandle {
  getText: () => string;
  getHTML: () => string;
  clearContent: () => void;
  focus: () => void;
  insertText: (text: string) => void;
}

export interface RichTextEditorProps {
  placeholder?: string;
  className?: string;
  onSend?: () => void;
  onEscape?: () => void;
  onUpdate?: (html: string, text: string) => void;
  autoFocus?: boolean;
  /** Slot rendered on the left of the bottom bar (e.g. emoji button) */
  leftSlot?: React.ReactNode;
  /** Slot rendered on the right of the bottom bar (e.g. send button) */
  rightSlot?: React.ReactNode;
}

// ─── Toolbar icon button ──────────────────────────────────────────────────────
// ─── Toolbar icon button ──────────────────────────────────────────────────────
function FmtBtn({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // keep editor focused
        onClick();
      }}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded transition-colors duration-100",
        active
          ? "bg-indigo-500/20 text-indigo-300"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
      )}
    >
      {children}
    </button>
  );
}
// ─── Bottom formatting bar ────────────────────────────────────────────────────
// ─── Bottom formatting bar ────────────────────────────────────────────────────
function FormatBar({
  editor,
  leftSlot,
  rightSlot,
}: {
  editor: Editor;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  // Subscribe to just the active-state booleans we need.
  // This re-renders on selection change / mark toggle — not on every keystroke elsewhere.
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrike: ctx.editor.isActive("strike"),
      isCode: ctx.editor.isActive("code"),
      isLink: ctx.editor.isActive("link"),
    }),
  });

  const setLink = useCallback(() => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex items-center justify-between px-2 py-1">
      <div className="flex items-center gap-0.5">
        {leftSlot}
        <div className="mx-1 h-4 w-px bg-zinc-700" />
        <FmtBtn
          active={editorState.isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <Bold size={14} />
        </FmtBtn>
        <FmtBtn
          active={editorState.isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <Italic size={14} />
        </FmtBtn>
        <FmtBtn
          active={editorState.isStrike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </FmtBtn>
        <FmtBtn
          active={editorState.isCode}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code"
        >
          <Code size={14} />
        </FmtBtn>
        <FmtBtn
          active={editorState.isLink}
          onClick={setLink}
          title="Insert Link"
        >
          <LinkIcon size={14} />
        </FmtBtn>
      </div>

      {rightSlot && <div className="flex items-center">{rightSlot}</div>}
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────
const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  function RichTextEditor(
    {
      placeholder,
      className,
      onSend,
      onEscape,
      onUpdate,
      autoFocus,
      leftSlot,
      rightSlot,
    },
    ref
  ) {
    const editorRef = useRef<Editor | null>(null);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: false,
          bulletList: false,
          orderedList: false,
          listItem: false,
          blockquote: false,
          horizontalRule: false,
          codeBlock: false,
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class:
              "text-blue-400 underline underline-offset-2 cursor-pointer hover:text-blue-300",
          },
        }),
        Placeholder.configure({
          placeholder: placeholder ?? "Type a message…",
          emptyEditorClass:
            "before:content-[attr(data-placeholder)] before:text-zinc-500 before:pointer-events-none before:absolute before:top-0 before:left-0",
        }),
      ],
      editorProps: {
        attributes: {
          class: cn(
            "relative prose prose-invert prose-sm max-w-none focus:outline-none",
            "text-black text-sm leading-relaxed min-h-[1.5rem]",
            "[&_strong]:font-semibold [&_em]:italic [&_s]:line-through",
            "[&_code]:bg-zinc-700 [&_code]:text-rose-300 [&_code]:rounded",
            "[&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono"
          ),
        },
        handleKeyDown(view, event) {
          // Plain Enter → send
          if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onSend?.();
            return true;
          }
          // Shift+Enter or Ctrl+Enter → insert hard break (new line)
          if (event.key === "Enter" && (event.shiftKey || event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            view.dispatch(
              view.state.tr.replaceSelectionWith(
                view.state.schema.nodes.hardBreak.create()
              )
            );
            return true;
          }
          // Escape → cancel reply
          if (event.key === "Escape") {
            onEscape?.();
            return true;
          }
          return false;
        },
      },
      onUpdate({ editor }) {
        onUpdate?.(editor.getHTML(), editor.getText());
      },
      autofocus: autoFocus ? "end" : false,
      immediatelyRender: false,
    });

    useEffect(() => {
      editorRef.current = editor;
    }, [editor]);

    useImperativeHandle(ref, () => ({
      getText: () => editorRef.current?.getText() ?? "",
      getHTML: () => editorRef.current?.getHTML() ?? "",
      clearContent: () => {
        editorRef.current?.commands.clearContent(true);
        editorRef.current?.commands.focus();
      },
      focus: () => editorRef.current?.commands.focus(),
      insertText: (text: string) => {
        editorRef.current?.chain().focus().insertContent(text).run();
      }, // NEW
    }));

    if (!editor) return null;

    return (
      <div
        className={cn(
          "flex flex-col w-full rounded-lg",
          "bg-white border text-black border-zinc-600/50",
          "focus-within:border-zinc-500/70 transition-colors duration-150",
          className
        )}
      >
        {/* Scrollable text area */}
        <div className="overflow-y-auto max-h-52 px-4 pt-3 pb-1">
          <EditorContent editor={editor} />
        </div>

        {/* Bottom bar: format toolbar + slots */}
        <FormatBar editor={editor} leftSlot={leftSlot} rightSlot={rightSlot} />
      </div>
    );
  }
);

export default RichTextEditor;
