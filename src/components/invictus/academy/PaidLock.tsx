"use client";

import { Lock, Crown } from "lucide-react";

interface Props {
  onUpgrade?: () => void;
}

export default function PaidLock({ onUpgrade }: Props) {
  return (
    <div
      className="
flex
flex-col
items-center
justify-center
rounded-3xl
border
border-[#C9A84C]/30
bg-[#111]
p-10
text-center
"
    >
      <div
        className="
mb-5
rounded-full
bg-[#C9A84C]/10
p-5
"
      >
        <Lock
          size={35}
          className="
text-[#C9A84C]
"
        />
      </div>

      <h2
        className="
text-2xl
font-semibold
text-white
"
      >
        Premium Lesson
      </h2>

      <p
        className="
mt-3
max-w-md
text-gray-400
"
      >
        This lesson is available for premium members only. Upgrade your plan to
        unlock this content.
      </p>

      <button
        onClick={onUpgrade}
        className="
mt-6
flex
items-center
gap-2
rounded-xl
bg-[#C9A84C]
px-6
py-3
font-semibold
text-black
transition
hover:scale-105
"
      >
        <Crown size={18} />
        Unlock Now
      </button>
    </div>
  );
}
