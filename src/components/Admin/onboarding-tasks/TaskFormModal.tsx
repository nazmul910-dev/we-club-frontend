"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
  createOnboardingTask,
  updateOnboardingTask,
} from "@/lib/features/onboardingTasks/onboardingTaskSlice";
import {
  AdminOnboardingTask,
  OnboardingTaskTrigger,
} from "@/lib/features/onboardingTasks/onboardingTaskTypes";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the modal edits this task instead of creating a new one. */
  task?: AdminOnboardingTask | null;
}

const TRIGGER_OPTIONS: { value: OnboardingTaskTrigger; label: string; hint: string }[] = [
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

const inputClass =
  "w-full rounded-xl border border-yellow-500/20 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20";

const labelClass =
  "mb-2 block text-xs font-medium uppercase tracking-wider text-white/50";

export default function TaskFormModal({ open, onOpenChange, task }: Props) {
  const dispatch = useAppDispatch();
  const isSavingTask = useAppSelector((state) => state.onboardingTasks.isSavingTask);
  const mutatingTaskId = useAppSelector((state) => state.onboardingTasks.mutatingTaskId);

  const isEditing = Boolean(task);
  const isSaving = isEditing ? mutatingTaskId === task?._id : isSavingTask;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("1");
  const [trigger, setTrigger] = useState<OnboardingTaskTrigger>("manual");
  const [actionLabel, setActionLabel] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [pointsReward, setPointsReward] = useState("5");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setOrder(String(task.order));
      setTrigger(task.trigger);
      setActionLabel(task.actionLabel ?? "");
      setActionUrl(task.actionUrl ?? "");
      setPointsReward(String(task.pointsReward));
    } else {
      setTitle("");
      setDescription("");
      setOrder("1");
      setTrigger("manual");
      setActionLabel("");
      setActionUrl("");
      setPointsReward("5");
    }
    setError("");
  }, [open, task]);

  const handleSubmit = async () => {
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const orderNum = Number(order);
    const pointsNum = Number(pointsReward);

    if (!Number.isFinite(orderNum) || orderNum < 0) {
      setError("Order must be a valid non-negative number.");
      return;
    }

    if (!Number.isFinite(pointsNum) || pointsNum < 0) {
      setError("Points reward must be a valid non-negative number.");
      return;
    }

    try {
      if (isEditing && task) {
        await dispatch(
          updateOnboardingTask({
            taskId: task._id,
            payload: {
              title: title.trim(),
              description: description.trim() || null,
              order: orderNum,
              trigger,
              actionLabel: actionLabel.trim() || null,
              actionUrl: actionUrl.trim() || null,
              pointsReward: pointsNum,
            },
          }),
        ).unwrap();

        toast.success("Task updated successfully.");
      } else {
        await dispatch(
          createOnboardingTask({
            title: title.trim(),
            description: description.trim() || undefined,
            order: orderNum,
            trigger,
            actionLabel: actionLabel.trim() || undefined,
            actionUrl: actionUrl.trim() || undefined,
            pointsReward: pointsNum,
          }),
        ).unwrap();

        toast.success("Task created as draft. Publish it to show it to members.");
      }

      onOpenChange(false);
    } catch (e: any) {
      setError(e || "Failed to save task.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto rounded-2xl border border-neutral-800 bg-[#0B0B0B] text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Edit Onboarding Task" : "Create Onboarding Task"}
          </DialogTitle>

          <DialogDescription className="text-neutral-400">
            {isEditing
              ? "Updating a published task takes effect immediately for every member."
              : 'New tasks start as "draft" — publish them from the table once ready.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Set Up Your Command Center Profile"
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={2}
              className={inputClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Log in and configure your listing pages, bio, and headshot."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Order *</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Points Reward *</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={pointsReward}
                onChange={(e) => setPointsReward(e.target.value)}
                placeholder="5"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Trigger *</label>
            <div className="space-y-2">
              {TRIGGER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTrigger(option.value)}
                  className={`w-full cursor-pointer rounded-xl border p-3 text-left transition ${
                    trigger === option.value
                      ? "border-yellow-500 bg-yellow-500/10"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      trigger === option.value ? "text-yellow-400" : "text-white"
                    }`}
                  >
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-xs text-white/40">{option.hint}</p>
                </button>
              ))}
            </div>
          </div>

          {trigger === "manual" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Action Label</label>
                <input
                  className={inputClass}
                  value={actionLabel}
                  onChange={(e) => setActionLabel(e.target.value)}
                  placeholder="Open / Book Now"
                />
              </div>

              <div>
                <label className={labelClass}>Action URL</label>
                <input
                  className={inputClass}
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="mt-2 gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="h-11 cursor-pointer rounded-xl border border-neutral-700 px-6 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Create Task"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}