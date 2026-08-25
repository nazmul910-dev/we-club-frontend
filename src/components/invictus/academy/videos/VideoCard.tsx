"use client";

import { Lock, Play, CheckCircle } from "lucide-react";

interface Props {
  title: string;

  description?: string;

  isPaid: boolean;

  isCompleted?: boolean;

  onClick?: () => void;
}

export default function VideoCard({
  title,
  description,
  isPaid,
  isCompleted = false,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="
group
cursor-pointer
rounded-2xl
border
border-white/10
bg-[#111]
p-5
transition
hover:border-[#C9A84C]/50
hover:-translate-y-1
"
    >
      <div
        className="
flex
items-start
justify-between
"
      >
        <div>
          <h3
            className="
text-lg
font-medium
text-white
"
          >
            {title}
          </h3>

          <p
            className="
mt-2
text-sm
text-gray-400
"
          >
            {description}
          </p>
        </div>

        {isPaid ? (
          <Lock
            className="
text-[#C9A84C]
"
            size={22}
          />
        ) : (
          <Play
            className="
text-[#C9A84C]
"
            size={22}
          />
        )}
      </div>

      <div
        className="
mt-5
flex
items-center
justify-between
"
      >
        <span 
          className="
rounded-full
bg-[#C9A84C]/10
px-3
py-1
text-xs
text-[#C9A84C]
"
        >
          {isPaid ? "Premium" : "Free"}
        </span>

        {isCompleted && (
          <CheckCircle
            size={20}
            className="
text-green-500
"
          />
        )}
      </div>
    </div>
  );
}
