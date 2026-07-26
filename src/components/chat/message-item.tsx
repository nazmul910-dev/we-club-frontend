import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface Props {
  me: boolean;
  name: string;
  avatar: string;
  message: string;
  time: string;
}

export default function MessageItem({
  me,
  name,
  avatar,
  message,
  time,
}: Props) {
  return (
    <div
      className={`flex ${
        me ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex gap-3 max-w-[70%] ${
          me && "flex-row-reverse"
        }`}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} />
          <AvatarFallback>
            {name[0]}
          </AvatarFallback>
        </Avatar>

        <div>

          <div
            className={`flex gap-2 items-center ${
              me && "justify-end"
            }`}
          >
            <span className="text-sm font-medium text-white">
              {name}
            </span>

            <span className="text-xs text-zinc-500">
              {time}
            </span>
          </div>

          <div
            className={`mt-1 rounded-2xl px-4 py-3 ${
              me
                ? "bg-white text-black"
                : "bg-zinc-900 text-white border border-zinc-800"
            }`}
          >
            {message}
          </div>

        </div>

      </div>
    </div>
  );
}