"use client";

import { BookOpen, PlayCircle, Clock } from "lucide-react";

interface Props {
  title: string;

  description?: string;

  totalVideos: number;

  duration?: string;
}

export default function ModuleHeader({
  title,
  description,
  totalVideos,
  duration = "0 min",
}: Props) {
  return (
    <div
      className="
relative
overflow-hidden
rounded-3xl
border
border-[#C9A84C]/20
bg-[#111111]
p-8
"
    >
      <div
        className="
absolute
right-0
top-0
h-40
w-40
rounded-full
bg-[#C9A84C]/10
blur-3xl
"
      />

      <div
        className="
relative
z-10
"
      >
        <div
          className="
mb-4
flex
items-center
gap-3
text-[#C9A84C]
"
        >
          <BookOpen size={26} />

          <span
            className="
text-sm
uppercase
tracking-[3px]
"
          >
            Invictus Academy
          </span>
        </div>

        <h1
          className="
text-3xl
font-semibold
text-white
"
        >
          {title}
        </h1>

        <p
          className="
mt-3
max-w-3xl
text-gray-400
"
        >
          {description}
        </p>

        <div
          className="
mt-6
flex
gap-6
text-sm
text-gray-300
"
        >
          <div
            className="
flex
items-center
gap-2
"
          >
            <PlayCircle size={18} className="text-[#C9A84C]" />
            {totalVideos} Lessons
          </div>

          <div
            className="
flex
items-center
gap-2
"
          >
            <Clock size={18} className="text-[#C9A84C]" />

            {duration}
          </div>
        </div>
      </div>
    </div>
  );
}
