"use client";

import { Clock, ArrowRight } from "lucide-react";

import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";

interface Props {
  course: ICourseModule;
  onView: () => void;
}

export default function CourseCard({ course, onView }: Props) {
  return (
    <div
      className="
bg-white
border
border-[#E8DDCA]
rounded-3xl
overflow-hidden
transition-all
duration-300
hover:-translate-y-2
hover:shadow-[0_15px_35px_rgba(177,138,58,.15)]
cursor-pointer
"
    >
      <div
        className="
h-52
bg-[#F6F1E8]
overflow-hidden
"
      >
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="
w-full
h-full
object-cover
transition-transform
duration-500
hover:scale-105
"
          />
        ) : (
          <div
            className="
flex
items-center
justify-center
h-full
text-[#B18A3A]
"
          >
            INVICTUS
          </div>
        )}
      </div>

      <div className="p-6">
        <div
          className="
flex
justify-between
items-center
mb-4
"
        >
          <span
            className="
text-[11px]
tracking-widest
text-[#B18A3A]
font-semibold
"
          >
            {course.pillar?.name}
          </span>

        </div>

        <h3
          className="
text-xl
font-semibold
text-[#171717]
"
        >
          {course.title}
        </h3>

        <p
          className="
text-sm
text-[#8A8175]
mt-3
line-clamp-2
"
        >
          {course.shortDescription}
        </p>

        <div
          className="
flex
items-center
justify-between
mt-6
"
        >
          <div
            className="
flex
items-center
gap-2
text-sm
text-[#8A8175]
"
          >
            <Clock size={15} />
            {course.estimatedDurationMinutes} min
          </div>

          <button
            onClick={onView}
            className="
flex
items-center
gap-2
text-sm
text-[#B18A3A]
cursor-pointer
transition-all
duration-300
hover:gap-4
"
          >
            View
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
