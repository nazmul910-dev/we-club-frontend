"use client";

import { Plus } from "lucide-react";

interface Props {
  onCreate: () => void;
}

export default function CourseHeader({ onCreate }: Props) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <p className="text-[11px] tracking-[4px] text-[#B18A3A] font-semibold">
          INVICTUS ACADEMY
        </p>

        <h1 className="text-3xl font-semibold text-[#171717] mt-3">
          Course Modules
        </h1>

        <p className="text-sm text-[#8A8175] mt-2">
          Manage academy learning paths and modules
        </p>
      </div>

      <button
        onClick={onCreate}
        className="
flex items-center gap-2
bg-[#B18A3A]
text-white
px-5
py-2.5
rounded-full
text-sm
transition-all
duration-300
cursor-pointer
hover:-translate-y-1
hover:shadow-[0_10px_25px_rgba(177,138,58,.25)]
"
      >
        <Plus size={16} />
        Create Course
      </button>
    </div>
  );
}
