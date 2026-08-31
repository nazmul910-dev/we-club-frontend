"use client";

import { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";

import { Edit, Trash2 } from "lucide-react";

import { Switch } from "@/components/ui/switch";

interface Props {
  courses: ICourseModule[];

  onEdit: (course: ICourseModule) => void;

  onToggleStatus: (course: ICourseModule) => void;
}

export default function CourseTable({
  courses,

  onEdit,

  onToggleStatus,
}: Props) {
  return (
    <div className="bg-white border border-[#E8DDCA] rounded-3xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E8DDCA] text-[#8A8175]">
            <th className="text-left p-5 font-normal">Course</th>

            <th className="text-left p-5 font-normal">Pillar</th>

            <th className="text-left p-5 font-normal">Duration</th>

            <th className="text-center p-5 font-normal">Status</th>

            <th className="text-center p-5 font-normal">Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course) => (
            <tr
              key={course._id}
              className="border-b border-[#F0E8DB] hover:bg-[#FCFAF6] transition"
            >
              <td className="p-5 font-medium text-[#171717]">{course.title}</td>

              <td className="p-5 text-[#8A8175]">{course.pillar?.name}</td>

              <td className="p-5 text-[#8A8175]">
                {course.estimatedDurationMinutes} min
              </td>

              <td className="p-5">
                <div className="flex items-center justify-center gap-3">
                  <Switch
                    checked={course.status === "published"}
                    onCheckedChange={() => onToggleStatus(course)}
                    className="
data-[state=checked]:bg-[#B18A3A]
cursor-pointer
"
                  />

                  <span
                    className="
text-xs
text-[#8A8175]
capitalize
"
                  >
                    {course.status}
                  </span>
                </div>
              </td>

              <td className="p-5">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(course)}
                    className="w-9 h-9 border border-[#E8DDCA] flex items-center justify-center cursor-pointer rounded-lg transition-all hover:bg-[#B18A3A] hover:text-white hover:-translate-y-1"
                  >
                    <Edit size={15} />
                  </button>

                  <button className="w-9 h-9 border border-[#E8DDCA] flex items-center justify-center cursor-pointer rounded-lg transition-all hover:bg-red-500 hover:text-white hover:-translate-y-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
