"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useAppDispatch } from "@/lib/redux/store/hook";
import { createOnboardingTask } from "@/lib/features/onboardingTasks/onboardingTaskSlice";
import type { OnboardingTaskTrigger } from "@/lib/features/onboardingTasks/onboardingTaskTypes";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TRIGGER_OPTIONS: {
  value: OnboardingTaskTrigger;
  label: string;
  hint: string;
}[] = [
  {
    value: "manual",
    label: "Manual (button click)",
    hint: 'Member must click the action button (e.g. "Open", "Book now") — you call /complete from that flow.',
  },
  {
    value: "auto_on_login",
    label: "Auto on login",
    hint: "Marked complete automatically the next time the member logs in.",
  },
  {
    value: "video_watch",
    label: "Video watch",
    hint: "Marked complete automatically once the linked module video is finished.",
  },
];

const emptyForm = {
  title: "",
  description: "",
  order: 1,
  trigger: "manual" as OnboardingTaskTrigger,
  actionLabel: "",
  actionUrl: "",
  pointsReward: 5,
};

export default function CreateTaskModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setErrors({});
    }
  }, [open]);

  const updateField = (
    key: keyof typeof emptyForm,
    value: string | number,
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

    if (!form.title.trim()) {
      next.title = "Task title is required";
    }

    if (!form.order || form.order < 1) {
      next.order = "Order must be at least 1";
    }

    if (form.pointsReward < 0) {
      next.pointsReward = "Points reward must be a non-negative number";
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
        createOnboardingTask({
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          order: form.order,
          trigger: form.trigger,
          actionLabel: form.actionLabel.trim() || undefined,
          actionUrl: form.actionUrl.trim() || undefined,
          pointsReward: form.pointsReward,
        }),
      ).unwrap();

      toast.success("Task created as draft. Publish it to show it to members.");
      handleClose();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1C1A17]">
            Add Onboarding Task
          </DialogTitle>

          <DialogDescription className="text-[#8A8175]">
            New tasks start as &quot;draft&quot; — publish them from the table
            once ready.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label>Task Title</Label>

            <Input
              className="mt-2"
              placeholder="Set Up Your Command Center Profile"
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
              placeholder="Log in and configure your listing pages, bio, and headshot."
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

              {errors.pointsReward && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.pointsReward}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Trigger</Label>

            <div className="mt-2 space-y-2">
              {TRIGGER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField("trigger", option.value)}
                  className={`w-full cursor-pointer rounded-xl border p-3 text-left transition ${
                    form.trigger === option.value
                      ? "border-[#B08A3E] bg-[#F3E9D2]/50"
                      : "border-[#E7DDCC] hover:border-[#B08A3E]/50"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      form.trigger === option.value
                        ? "text-[#B08A3E]"
                        : "text-[#1C1A17]"
                    }`}
                  >
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8A8175]">
                    {option.hint}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {form.trigger === "manual" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Action Label</Label>

                <Input
                  className="mt-2"
                  placeholder="Open / Book Now"
                  value={form.actionLabel}
                  onChange={(e) => updateField("actionLabel", e.target.value)}
                />
              </div>

              <div>
                <Label>Action URL</Label>

                <Input
                  className="mt-2"
                  placeholder="https://..."
                  value={form.actionUrl}
                  onChange={(e) => updateField("actionUrl", e.target.value)}
                />
              </div>
            </div>
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
            onClick={submit}
            className="cursor-pointer bg-[#B08A3E] text-white hover:bg-[#B08A3E]/90"
          >
            {loading ? "Saving..." : "Add Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
