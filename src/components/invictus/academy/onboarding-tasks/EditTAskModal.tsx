"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";

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
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { updateOnboardingTask } from "@/lib/features/onboardingTasks/onboardingTaskSlice";
import type {
  AdminOnboardingTask,
  OnboardingTaskTrigger,
} from "@/lib/features/onboardingTasks/onboardingTaskTypes";
import { videoApi } from "@/lib/features/invictus/academy/video-module/videoApi";
import type { IModuleVideo } from "@/lib/features/invictus/academy/video-module/videoTypes";

interface Props {
  open: boolean;
  task: AdminOnboardingTask | null;
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
  trigger: "manual" as OnboardingTaskTrigger,
  actionLabel: "",
  actionUrl: "",
  linkedVideo: "",
  pointsReward: 5,
};

export default function EditTaskModal({ open, task, onClose }: Props) {
  const dispatch = useAppDispatch();

  const mutatingTaskId = useAppSelector(
    (state) => state.onboardingTasks.mutatingTaskId,
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(emptyForm);

  const [videos, setVideos] = useState<IModuleVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videoPickerOpen, setVideoPickerOpen] = useState(false);
  const [videoSearch, setVideoSearch] = useState("");

  const isSaving = task ? mutatingTaskId === task._id : false;

  useEffect(() => {
    if (open) {
      const loadVideos = async () => {
        try {
          setVideosLoading(true);
          const res = await videoApi.getAll();
          if (res.data) {
            setVideos(res.data);
          }
        } catch (err) {
          console.error("Failed to load videos:", err);
        } finally {
          setVideosLoading(false);
        }
      };

      loadVideos();
    }
  }, [open]);

  useEffect(() => {
    if (task) {
      const initialLinkedVideo =
        typeof task.linkedVideo === "object" && task.linkedVideo !== null
          ? task.linkedVideo._id
          : task.linkedVideo || "";

      setForm({
        title: task.title || "",
        description: task.description || "",
        trigger: task.trigger,
        actionLabel: task.actionLabel || "",
        actionUrl: task.actionUrl || "",
        linkedVideo: initialLinkedVideo,
        pointsReward: task.pointsReward || 0,
      });
      setErrors({});
      setVideoSearch("");
      setVideoPickerOpen(false);
    }
  }, [task]);

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


    if (form.pointsReward < 0) {
      next.pointsReward = "Points reward must be a non-negative number";
    }

    if (form.trigger === "video_watch" && !form.linkedVideo) {
      next.linkedVideo = "Please select a video to link with this task";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const submit = async () => {
    if (!task) return;
    if (!validate()) return;

    try {
      await dispatch(
        updateOnboardingTask({
          taskId: task._id,
          payload: {
            title: form.title.trim(),
            description: form.description.trim() || null,
            trigger: form.trigger,
            actionLabel: form.actionLabel.trim() || null,
            actionUrl: form.actionUrl.trim() || null,
            linkedVideo:
              form.trigger === "video_watch" ? form.linkedVideo || null : null,
            pointsReward: form.pointsReward,
          },
        }),
      ).unwrap();

      toast.success("Task updated successfully.");
      handleClose();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to update task.");
    }
  };

  const selectedVideoObj = videos.find((v) => v._id === form.linkedVideo);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1C1A17]">
            Edit Onboarding Task
          </DialogTitle>

          <DialogDescription className="text-[#8A8175]">
            Updating a published task takes effect immediately for every
            member.
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

          {form.trigger === "video_watch" && (
            <div className="space-y-4 rounded-xl border border-[#E7DDCC] bg-[#FAFAF8] p-4">
              <div>
                <Label>Select Academy / Module Video</Label>
                <Popover open={videoPickerOpen} onOpenChange={setVideoPickerOpen}>
                  <PopoverTrigger className="mt-2 block w-full">
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={videoPickerOpen}
                      className="w-full justify-between border-[#E7DDCC] bg-white font-normal hover:bg-[#F9F7F2]"
                    >
                      <span className="truncate">
                        {selectedVideoObj
                          ? `${selectedVideoObj.title} ${
                              selectedVideoObj.module?.title
                                ? `· ${selectedVideoObj.module.title}`
                                : ""
                            }`
                          : form.linkedVideo
                            ? typeof task?.linkedVideo === "object" &&
                              task.linkedVideo !== null &&
                              "title" in task.linkedVideo
                              ? task.linkedVideo.title
                              : "Selected Video"
                            : videosLoading
                              ? "Loading videos..."
                              : "Search and select a video..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--anchor-width)] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput
                        value={videoSearch}
                        onValueChange={setVideoSearch}
                        placeholder="Search video title or module..."
                      />
                      <CommandList className="max-h-72 overflow-y-auto">
                        <CommandEmpty>
                          {videosLoading ? "Loading videos..." : "No videos found."}
                        </CommandEmpty>
                        {videos.map((vid) => {
                          const moduleName =
                            typeof vid.module === "object" && vid.module !== null
                              ? vid.module.title
                              : "";
                          return (
                            <CommandItem
                              key={vid._id}
                              value={`${vid.title} ${moduleName}`}
                              onSelect={() => {
                                updateField("linkedVideo", vid._id);
                                setVideoPickerOpen(false);
                                setVideoSearch("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  form.linkedVideo === vid._id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <div className="flex flex-col overflow-hidden">
                                <span className="truncate text-sm font-medium text-[#1C1A17]">
                                  {vid.title}
                                </span>
                                {moduleName && (
                                  <span className="truncate text-xs text-[#8A8175]">
                                    Module: {moduleName}
                                  </span>
                                )}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {errors.linkedVideo && (
                  <p className="mt-1 text-xs text-red-500">{errors.linkedVideo}</p>
                )}
              </div>

              <div>
                <Label>Action URL (Optional)</Label>
                <Input
                  className="mt-2 bg-white"
                  placeholder="e.g. /invictus/invictus-challenge/pillars/video (optional direct link)"
                  value={form.actionUrl}
                  onChange={(e) => updateField("actionUrl", e.target.value)}
                />
                <p className="mt-1 text-xs text-[#8A8175]">
                  Optional link for the member to open this video directly from their onboarding checklist.
                </p>
              </div>
            </div>
          )}

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
            disabled={isSaving}
            onClick={submit}
            className="cursor-pointer bg-[#B08A3E] text-white hover:bg-[#B08A3E]/90"
          >
            {isSaving ? "Updating..." : "Update Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
