"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { UploadCloud, Video as VideoIcon, X } from "lucide-react";
import { toast } from "sonner";

import { useAppDispatch } from "@/lib/redux/store/hook";
import { createVideo } from "@/lib/features/invictus/academy/video-module/videoSlice";
import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";
import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";

interface Props {
  open: boolean;
  onClose: () => void;
}

const emptyForm = {
  courseId: "",
  title: "",
  slug: "",
  description: "",
  isPaid: false,
  isRequired: true,
  requiredWatchPercent: 80,
  pointsReward: 10,
  order: 1,
};

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function CreateVideoModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch();

  const [courses, setCourses] = useState<ICourseModule[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      loadCourses();
    }
  }, [open]);

  const loadCourses = async () => {
    try {
      const res = await courseApi.getCourses();
      const published = res.data.filter(
        (item) => item.status === "published",
      );
      setCourses(published);
    } catch (error) {
      console.log(error);
    }
  };

  const updateField = (key: keyof typeof emptyForm, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleTitle = (value: string) => {
    updateField("title", value);
    updateField("slug", generateSlug(value));
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.courseId) next.courseId = "Select the course this video belongs to";
    if (!form.title.trim() || form.title.trim().length < 2)
      next.title = "Title minimum 2 charecter";
    if (!form.slug.trim()) next.slug = "Slug is required";
    if (!form.order || form.order < 1) next.order = "Order must be at least 1";
    if (!video) next.video = "Please select a video file to upload";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetForm = () => {
    setForm(emptyForm);
    setVideo(null);
  };

  const handleClose = () => {
    resetForm();
    setErrors({});
    onClose();
  };

  const submit = async () => {
    if (!validate() || !video) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("video", video);
      formData.append("title", form.title.trim());
      formData.append("slug", form.slug.trim());
      if (form.description.trim()) {
        formData.append("description", form.description.trim());
      }
      formData.append("isPaid", String(form.isPaid));
      formData.append("isRequired", String(form.isRequired));
      formData.append(
        "requiredWatchPercent",
        String(form.requiredWatchPercent),
      );
      formData.append("pointsReward", String(form.pointsReward));
      formData.append("order", String(form.order));

      await dispatch(
        createVideo({ moduleId: form.courseId, data: formData }),
      ).unwrap();

      toast.success("Module video uploaded successfully!");
      handleClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Video could not be uploaded, try again later!";
      toast.error(message);
      setErrors((prev) => ({
        ...prev,
        form: message,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1C1A17]">
            Upload Module Video
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label>Course</Label>
            <select
              className="mt-2 w-full cursor-pointer rounded-xl border border-[#E7DDCC] p-3"
              value={form.courseId}
              onChange={(e) => updateField("courseId", e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title} · {course.pillar?.name}
                </option>
              ))}
            </select>
            {errors.courseId && (
              <p className="mt-1 text-xs text-red-500">{errors.courseId}</p>
            )}
          </div>

          <div>
            <Label>Video File</Label>

            {video ? (
              <div className="mt-2 flex items-center justify-between rounded-xl border border-[#E7DDCC] p-4">
                <div className="flex items-center gap-3">
                  <VideoIcon className="text-[#B08A3E]" size={20} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#1C1A17]">
                      {video.name}
                    </p>
                    <p className="text-xs text-[#8A8175]">
                      {(video.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setVideo(null)}
                  className="cursor-pointer text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="mt-2 flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E7DDCA] transition hover:border-[#B08A3E]">
                <UploadCloud className="text-[#B08A3E]" size={26} />
                <p className="mt-2 text-sm text-[#8A8175]">
                  Click to select a video (MP4, WEBM, MOV)
                </p>
                <input
                  hidden
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files?.[0] || null)}
                />
              </label>
            )}
            {errors.video && (
              <p className="mt-1 text-xs text-red-500">{errors.video}</p>
            )}
          </div>

          <div>
            <Label>Video Title</Label>
            <Input
              className="mt-2"
              placeholder="Enter video title"
              value={form.title}
              onChange={(e) => handleTitle(e.target.value)}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <Label>Slug</Label>
            <Input
              className="mt-2"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
            />
            {errors.slug && (
              <p className="mt-1 text-xs text-red-500">{errors.slug}</p>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              className="mt-2 min-h-[100px]"
              placeholder="Enter video description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Lesson Order</Label>
              <Input
                className="mt-2"
                type="number"
                min={1}
                value={form.order}
                onChange={(e) => updateField("order", Number(e.target.value))}
              />
              {errors.order && (
                <p className="mt-1 text-xs text-red-500">{errors.order}</p>
              )}
            </div>

            <div>
              <Label>Points Reward</Label>
              <Input
                className="mt-2"
                type="number"
                min={0}
                value={form.pointsReward}
                onChange={(e) =>
                  updateField("pointsReward", Number(e.target.value))
                }
              />
            </div>
          </div>

          <div>
            <Label>Required Watch Percent (%)</Label>
            <Input
              className="mt-2"
              type="number"
              min={1}
              max={100}
              value={form.requiredWatchPercent}
              onChange={(e) =>
                updateField("requiredWatchPercent", Number(e.target.value))
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#E7DDCC] p-4">
            <div>
              <p className="font-medium">Premium Video</p>
              <p className="text-sm text-gray-500">
                Requires an active pillar purchase to watch
              </p>
            </div>
            <Switch
              className="cursor-pointer"
              checked={form.isPaid}
              onCheckedChange={(value) => updateField("isPaid", value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#E7DDCC] p-4">
            <div>
              <p className="font-medium">Required Lesson</p>
              <p className="text-sm text-gray-500">
                Must be watched to complete the course module
              </p>
            </div>
            <Switch
              className="cursor-pointer"
              checked={form.isRequired}
              onCheckedChange={(value) => updateField("isRequired", value)}
            />
          </div>

          {errors.form && (
            <p className="text-sm text-red-500">{errors.form}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer border-[#E7DDCC]"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            disabled={loading}
            className="cursor-pointer bg-[#B08A3E] text-white hover:bg-[#B08A3E]/90"
            onClick={submit}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}