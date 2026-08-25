"use client";

import { Edit, Eye, Archive } from "lucide-react";

interface Props {
  onEdit: () => void;

  onView: () => void;

  onArchive: () => void;
}

export default function CourseActions({ onEdit, onView, onArchive }: Props) {
  return (
    <div
      className="
flex
gap-2
"
    >
      <button
        onClick={onView}
        className="
w-9
h-9
border
border-[#E8DDCA]
flex
items-center
justify-center
cursor-pointer
transition-all
hover:bg-[#B18A3A]
hover:text-white
hover:-translate-y-1
"
      >
        <Eye size={15} />
      </button>

      <button
        onClick={onEdit}
        className="
w-9
h-9
border
border-[#E8DDCA]
flex
items-center
justify-center
cursor-pointer
transition-all
hover:bg-[#B18A3A]
hover:text-white
hover:-translate-y-1
"
      >
        <Edit size={15} />
      </button>

      <button
        onClick={onArchive}
        className="
w-9
h-9
border
border-[#E8DDCA]
flex
items-center
justify-center
cursor-pointer
transition-all
hover:bg-red-500
hover:text-white
hover:-translate-y-1
"
      >
        <Archive size={15} />
      </button>
    </div>
  );
}
