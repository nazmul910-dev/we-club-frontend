import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, SendHorizontal } from "lucide-react";

interface Props {
  onSend: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

const TYPING_STOP_DELAY = 2000;

export default function MessageInput({
  onSend,
  onTypingStart,
  onTypingStop,
}: Props) {
  const [value, setValue] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    onTypingStart();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
    }, TYPING_STOP_DELAY);
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setValue("");

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    onTypingStop();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-zinc-800 p-4">

      <div className="flex gap-3">

        <Button variant="ghost" size="icon">
          <Smile />
        </Button>

        <Input
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="bg-zinc-900 px-4 border-zinc-800 text-white"
        />

        <Button size="icon" onClick={handleSend}>
          <SendHorizontal />
        </Button>

      </div>

    </div>
  );
}