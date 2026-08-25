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

import { pillarApi } from "@/lib/features/invictus/academy/pillar/pillarApi";

import CourseImageUpload from "./CourseImageUpload";

interface Props {
  open: boolean;

  onClose: () => void;

  onSubmit: (data: FormData) => void;
}

export default function CreateCourseDialog({
  open,

  onClose,

  onSubmit,
}: Props) {
  const [pillars, setPillars] = useState<any[]>([]);

  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    pillar: "",

    title: "",

    slug: "",

    shortDescription: "",

    description: "",

    moduleNumber: 1,

    estimatedDurationMinutes: 120,

    minimumVideoPercent: 80,

    minimumActionPercent: 80,

    minimumQuizScore: 70,

    maximumQuizAttempts: 2,

    completionPoints: 20,
  });

  useEffect(() => {
    if (open) {
      loadPillars();
    }
  }, [open]);

  const loadPillars = async () => {
    try {
      const res = await pillarApi.getAll();

      const published = res.data.filter(
        (item: any) => item.status === "published",
      );

      setPillars(published);
    } catch (error) {
      console.log(error);
    }
  };

  const updateField = (
    key: string,

    value: any,
  ) => {
    setForm((prev) => ({
      ...prev,

      [key]: value,
    }));
  };

  const generateSlug = (value: string) => {
    return value

      .toLowerCase()

      .trim()

      .replace(/[^a-z0-9]+/g, "-")

      .replace(/(^-|-$)/g, "");
  };

  const handleTitle = (value: string) => {
    updateField("title", value);

    updateField("slug", generateSlug(value));
  };

  const handleSubmit = () => {
    const formData = new FormData();

    if (image) {
      formData.append("thumbnail", image);
    }

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    onSubmit(formData);
  };

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
            Create Course Module
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
tracking-wide
text-[#B18A3A]
uppercase
"
            >
              Course Information
            </h3>

            <CourseImageUpload
              file={image}
              preview={preview}
              onChange={(file) => {
                setImage(file);

                setPreview(URL.createObjectURL(file));
              }}
              onRemove={() => {
                setImage(null);

                setPreview("");
              }}
            />

            <div>
              <label
                className="
text-sm
text-[#171717]
mb-2
block
"
              >
                Challenge Pillar
              </label>

              <select
                value={form.pillar}
                onChange={(e) => updateField("pillar", e.target.value)}
                className="
w-full
h-11
rounded-xl
border
border-[#E8DDCA]
bg-white
px-3
cursor-pointer
"
              >
                <option value="">Select Pillar</option>

                {pillars.map((pillar) => (
                  <option key={pillar._id} value={pillar._id}>
                    {pillar.name}
                  </option>
                ))}
              </select>
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
                value={form.title}
                onChange={(e) => handleTitle(e.target.value)}
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
                value={form.slug}
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
                value={form.shortDescription}
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
                Full Description
              </label>

              <Textarea
                rows={5}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-5">
            <h3
              className="
text-sm
font-semibold
tracking-wide
text-[#B18A3A]
uppercase
"
            >
              Learning Requirements
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
                  value={(form as any)[key]}
                  onChange={(e) => updateField(key, Number(e.target.value))}
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
mt-6
"
            >
              <p
                className="
text-sm
text-[#8A8175]
"
              >
                Course will be created as
              </p>

              <span
                className="
inline-block
mt-2
px-4
py-1
rounded-full
bg-[#F5ECD8]
text-[#B18A3A]
text-sm
"
              >
                Draft
              </span>
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
            disabled={!form.title || !form.pillar || !form.description}
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
            Create Course
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
