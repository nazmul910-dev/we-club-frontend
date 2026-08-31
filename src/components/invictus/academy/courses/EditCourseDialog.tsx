"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import Image from "next/image";

import { X, UploadCloud } from "lucide-react";

import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";

interface Props {
  open: boolean;

  course: ICourseModule | null;

  onClose: () => void;

  onSubmit: (
    id: string,

    data: FormData,
  ) => void;
}

export default function EditCourseDialog({
  open,

  course,

  onClose,

  onSubmit,
}: Props) {
  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title,

        slug: course.slug,

        shortDescription: course.shortDescription || "",

        description: course.description,

        moduleNumber: course.moduleNumber,

        estimatedDurationMinutes: course.estimatedDurationMinutes,

        minimumVideoPercent: course.minimumVideoPercent,

        minimumActionPercent: course.minimumActionPercent,

        minimumQuizScore: course.minimumQuizScore,

        maximumQuizAttempts: course.maximumQuizAttempts,

        completionPoints: course.completionPoints,
      });

      setPreview(course.thumbnailUrl || "");
    }
  }, [course]);

  const updateField = (
    key: string,

    value: any,
  ) => {
    setForm((prev: any) => ({
      ...prev,

      [key]: value,
    }));
  };

  const handleSubmit = () => {
    if (!course) return;

    const formData = new FormData();

    if (image) {
      formData.append("thumbnail", image);
    }

    Object.entries(form).forEach(([key, value]) => {
      formData.append(
        key,

        String(value),
      );
    });

    onSubmit(
      course._id,

      formData,
    );
  };

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
max-w-4xl
max-h-[90vh]
overflow-y-auto
bg-[#FAF8F4]
border-[#E8DDCA]
rounded-3xl
"
      >
        <DialogHeader>
          <DialogTitle
            className="
text-2xl
font-semibold
text-[#171717]
"
          >
            Edit Course Module
          </DialogTitle>
        </DialogHeader>

        <div
          className="
grid
grid-cols-1
gap-8
mt-5
"
        >
          <div className="space-y-5">
            <h3
              className="
text-sm
font-semibold
uppercase
tracking-wide
text-[#B18A3A]
"
            >
              Course Information
            </h3>

            <div>
              <label
                className="
text-sm
block
mb-2
"
              >
                Course Thumbnail
              </label>

              {preview ? (
                <div
                  className="
relative
h-48
rounded-2xl
overflow-hidden
border
border-[#E8DDCA]
group
"
                >
                  <Image
                    src={preview}
                    alt="course"
                    fill
                    className="
object-cover
"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setPreview("");

                      setImage(null);
                    }}
                    className="
absolute
right-3
top-3
w-8
h-8
rounded-full
bg-white
text-red-500
flex
items-center
justify-center
cursor-pointer
opacity-0
group-hover:opacity-100
transition
"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <label
                  className="
h-48
rounded-2xl
border-2
border-dashed
border-[#E8DDCA]
flex
flex-col
items-center
justify-center
cursor-pointer
hover:border-[#B18A3A]
transition
"
                >
                  <UploadCloud
                    className="
text-[#B18A3A]
"
                    size={30}
                  />

                  <p
                    className="
text-sm
text-[#8A8175]
mt-2
"
                  >
                    Upload New Image
                  </p>

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        setImage(file);

                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              )}
            </div>

            <div>
              <label
                className="
text-sm
block
mb-2
"
              >
                Course Title
              </label>

              <Input
                value={form.title || ""}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>

            <div>
              <label
                className="
text-sm
block
mb-2
"
              >
                Slug
              </label>

              <Input
                value={form.slug || ""}
                onChange={(e) => updateField("slug", e.target.value)}
              />
            </div>

            <div>
              <label
                className="
text-sm
block
mb-2
"
              >
                Short Description
              </label>

              <Input
                value={form.shortDescription || ""}
                onChange={(e) =>
                  updateField("shortDescription", e.target.value)
                }
              />
            </div>

            <div>
              <label
                className="
text-sm
block
mb-2
"
              >
                Description
              </label>

              <Textarea
                rows={5}
                value={form.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-5">
            <h3
              className="
text-sm
font-semibold
uppercase
tracking-wide
text-[#B18A3A]
"
            >
              Learning Settings
            </h3>

            {[
              ["moduleNumber", "Module Number"],

              ["estimatedDurationMinutes", "Course Duration (Minutes)"],

              ["minimumVideoPercent", "Required Video Completion (%)"],

              ["minimumActionPercent", "Required Action Completion (%)"],

              ["minimumQuizScore", "Passing Quiz Score (%)"],

              ["maximumQuizAttempts", "Maximum Quiz Attempts"],

              ["completionPoints", "Completion Reward Points"],
            ].map(([key, label]) => (
              <div key={key}>
                <label
                  className="
text-sm
block
mb-2
"
                >
                  {label}
                </label>

                <Input
                  type="number"
                  value={form[key] ?? ""}
                  onChange={(e) =>
                    updateField(
                      key,

                      Number(e.target.value),
                    )
                  }
                />
              </div>
            ))}

            <div
              className="
bg-white
border
border-[#E8DDCA]
rounded-2xl
p-5
"
            >
              <p
                className="
text-sm
text-[#8A8175]
"
              >
                Parent Pillar
              </p>

              <div
                className="
mt-2
inline-flex
px-4
py-2
rounded-full
bg-[#F5ECD8]
text-[#B18A3A]
text-sm
"
              >
                {course.pillar.name}
              </div>
            </div>
          </div>
        </div>

        <div
          className="
flex
justify-end
gap-3
mt-8
"
        >
          <Button
            variant="outline"
            onClick={onClose}
            className="
cursor-pointer
border-[#E8DDCA]
"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            className="
bg-[#B18A3A]
text-white
cursor-pointer
transition-all
duration-300
hover:-translate-y-1
hover:shadow-[0_10px_25px_rgba(177,138,58,.25)]
"
          >
            Update Course
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
