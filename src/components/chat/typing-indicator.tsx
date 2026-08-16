interface Props {
  user: string;
}

export default function TypingIndicator({
  user,
}: Props) {
  return (
    <div className="flex items-center gap-3">

      <div className="h-10 w-10 rounded-full bg-zinc-800" />

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">

        <p className="text-xs text-zinc-400 mb-2">
          {user} is typing...
        </p>

        <div className="flex gap-1">

          <span className="h-2 w-2 rounded-full bg-white animate-bounce" />

          <span
            className="h-2 w-2 rounded-full bg-white animate-bounce"
            style={{ animationDelay: "150ms" }}
          />

          <span
            className="h-2 w-2 rounded-full bg-white animate-bounce"
            style={{ animationDelay: "300ms" }}
          />

        </div>

      </div>

    </div>
  );
}