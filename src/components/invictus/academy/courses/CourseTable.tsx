"use client";

import { useState } from "react";

import { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";

import { Archive, Edit, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface Props {
  courses: ICourseModule[];

  onEdit: (course: ICourseModule) => void;

  onToggleStatus: (course: ICourseModule) => void;

  onArchive: (course: ICourseModule) => void;
}

export default function CourseTable({
  courses,

  onEdit,

  onToggleStatus,

  onArchive,
}: Props) {
  const [archiveTarget, setArchiveTarget] = useState<ICourseModule | null>(null);

  const confirmArchive = () => {
    if (!archiveTarget) return;
    onArchive(archiveTarget);
    setArchiveTarget(null);
  };

  return (
    <>
      <div className=" border border-[#E8DDCA] rounded-3xl overflow-hidden overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8DDCA] bg-[#FAF6EE] text-[#8A8175]">
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
                <td className="px-5 py-2 font-medium text-[#171717]">{course.title}</td>

                <td className="px-5 py-2 text-[#8A8175]">{course.pillar?.name}</td>

                <td className="px-5 py-2 text-[#8A8175]">
                  {course.estimatedDurationMinutes} min
                </td>

                <td className="px-5 py-2">
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

                <td className="px-5 py-2">
                  <div className="flex justify-center gap-2">
                    {/* <button
                      onClick={() => onEdit(course)}
                      className="w-9 h-9 border border-[#E8DDCA] flex items-center justify-center cursor-pointer rounded-lg transition-all hover:bg-[#B18A3A] hover:text-white hover:-translate-y-1"
                    >
                      <Edit size={15} />
                    </button> */}
                      <Button
                      variant="outline"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => onEdit(course)}
                      title="Edit course"
                    >
                      <Edit size={16} />
                    </Button>

                    {/* <button
                      className="w-9 h-9 border border-[#E8DDCA] flex items-center justify-center cursor-pointer rounded-lg transition-all hover:bg-red-500 hover:text-white hover:-translate-y-1"
                      onClick={() => setArchiveTarget(course)}
                      title="Archive course"
                    >
                      <Archive size={16} />
                    </button> */}
                    <Button 
                      variant="outline"
                      size="icon"
                      className="cursor-pointer border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
                      onClick={() => setArchiveTarget(course)}
                      title="Archive course"
                    >
                      <Archive size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={Boolean(archiveTarget)}
        onOpenChange={(open) => {
          if (!open) setArchiveTarget(null);
        }}
      >
        <AlertDialogContent className="rounded-3xl border border-[#E7DDCC] bg-white p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1C1A17]">
              Archive course?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#8A8175]">
              {archiveTarget
                ? `This course (${archiveTarget.title}) will be archived and hidden from members. This cannot be undone.`
                : "This course will be archived."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer border-[#E7DDCC] bg-transparent text-[#1C1A17] hover:bg-[#FAF8F4]"
              onClick={() => setArchiveTarget(null)}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
              onClick={confirmArchive}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
