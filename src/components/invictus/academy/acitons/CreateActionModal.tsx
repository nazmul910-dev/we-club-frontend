"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useAppDispatch } from "@/lib/redux/store/hook";

import { createModuleAction } from "@/lib/features/invictus/academy/action-module/actionChecklistSlice";

import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";

import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";

interface Props {
  open: boolean;
  onClose: () => void;
}

const emptyForm = {
  moduleId: "",
  title: "",
  description: "",
  order: 1,
  pointsReward: 5,
  isRequired: true,
};

export default function CreateActionModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch();

  const [courses, setCourses] = useState<ICourseModule[]>([]);

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

      setCourses(res.data.filter((item) => item.status === "published"));
    } catch (error) {
      console.log(error);
    }
  };

  const updateField = (
    key: keyof typeof emptyForm,
    value: string | number | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.moduleId) {
      next.moduleId = "Select course module";
    }

    if (!form.title.trim()) {
      next.title = "Action title is required";
    }

    if (!form.order || form.order < 1) {
      next.order = "Order must be at least 1";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const resetForm = () => {
    setForm(emptyForm);

    setErrors({});
  };

  const handleClose = () => {
    resetForm();

    onClose();
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await dispatch(
        createModuleAction({
          moduleId: form.moduleId,
          data: {
            title: form.title.trim(),
            description: form.description.trim(),
            order: form.order,
            pointsReward: form.pointsReward,
            isRequired: form.isRequired,
          },
        }),
      ).unwrap();

      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1C1A17]">
            Add Module Action
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label>Course Module</Label>

            <select
              value={form.moduleId}
              onChange={(e) => updateField("moduleId", e.target.value)}
              className="mt-2 w-full cursor-pointer rounded-xl border border-[#E7DDCC] p-3"
            >
              <option value="">Select Course Module</option>

              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title} · {course.pillar?.name}
                </option>
              ))}
            </select>

            {errors.moduleId && (
              <p className="mt-1 text-xs text-red-500">{errors.moduleId}</p>
            )}
          </div>

          <div>
            <Label>Action Title</Label>

            <Input
              className="mt-2"
              placeholder="Enter action title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />

            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <Label>Description</Label>

            <Textarea
              className="mt-2 min-h-[100px]"
              placeholder="Enter action description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Order</Label>

              <Input
                className="mt-2"
                type="number"
                min={1}
                value={form.order}
                onChange={(e) => updateField("order", Number(e.target.value))}
              />
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

          <div className="flex items-center justify-between rounded-xl border border-[#E7DDCC] p-4">
            <div>
              <p className="font-medium text-[#1C1A17]">Required Action</p>

              <p className="text-sm text-[#8A8175]">
                Counts toward module completion
              </p>
            </div>

            <Switch
              className="cursor-pointer"
              checked={form.isRequired}
              onCheckedChange={(value) => updateField("isRequired", value)}
            />
          </div>
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
            onClick={submit}
            className="cursor-pointer bg-[#B08A3E] text-white hover:bg-[#B08A3E]/90"
          >
            {loading ? "Saving..." : "Add Action"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
