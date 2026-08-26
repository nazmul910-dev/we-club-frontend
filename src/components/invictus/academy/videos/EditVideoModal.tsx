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

import { useAppDispatch } from "@/lib/redux/store/hook";
import { updateVideo } from "@/lib/features/invictus/academy/video-module/videoSlice";
import type { IModuleVideo } from "@/lib/features/invictus/academy/video-module/videoTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  video: IModuleVideo | null;
}

const buildFormFromVideo = (video: IModuleVideo | null) => ({
  title: video?.title || "",
  slug: video?.slug || "",
  description: video?.description || "",
  isPaid: video?.isPaid || false,
  isRequired: video?.isRequired ?? true,
  requiredWatchPercent: video?.requiredWatchPercent ?? 80,
  pointsReward: video?.pointsReward ?? 10,
  order: video?.order ?? 1,
});

export default function EditVideoModal({ open, onClose, video }: Props) {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(buildFormFromVideo(video));

  useEffect(() => {
    setForm(buildFormFromVideo(video));
    setErrors({});
  }, [video]);

  const updateField = (
    key: keyof ReturnType<typeof buildFormFromVideo>,
    value: string | number | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.title.trim() || form.title.trim().length < 2)
      next.title = "Title minimum 2 charecter";
    if (!form.slug.trim()) next.slug = "Slug is required";
    if (!form.order || form.order < 1) next.order = "Order must be at least 1";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!video || !validate()) return;

    try {
      setLoading(true);

      await dispatch(
        updateVideo({
          id: video._id,
          data: {
            title: form.title.trim(),
            slug: form.slug.trim(),
            description: form.description.trim() || null,
            isPaid: form.isPaid,
            isRequired: form.isRequired,
            requiredWatchPercent: form.requiredWatchPercent,
            pointsReward: form.pointsReward,
            order: form.order,
          },
        }),
      ).unwrap();

      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : undefined;
      setErrors((prev) => ({
        ...prev,
        form: message || "Video could not be updated, try again later!",
      }));
    } finally {
      setLoading(false);
    }
  };

  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1C1A17]">
            Edit Module Video
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-xl border border-[#E7DDCC] bg-[#FAF8F4] p-4">
            <p className="text-sm text-[#8A8175]">Course Module</p>
            <div className="mt-2 inline-flex rounded-full bg-[#F3E9D2] px-4 py-2 text-sm text-[#B08A3E]">
              {video.module?.title || "—"}
            </div>
          </div>

          <div>
            <Label>Video Title</Label>
            <Input
              className="mt-2"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
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
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            disabled={loading}
            className="cursor-pointer bg-[#B08A3E] text-white hover:bg-[#B08A3E]/90"
            onClick={submit}
          >
            {loading ? "Saving..." : "Update Video"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}