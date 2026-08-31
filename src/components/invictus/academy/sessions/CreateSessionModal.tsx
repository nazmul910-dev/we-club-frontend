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
import { toast } from "sonner";

import api from "@/lib/api/api";
import { sessionScheduleApi } from "@/lib/features/invictus/sessionSchedule/sessionScheduleApi";
import type { SessionType } from "@/lib/features/invictus/sessionSchedule/sessionScheduleTypes";

interface HostUser {
  _id: string;
  fullName: string;
  role: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const SESSION_TYPES: { value: SessionType; label: string }[] = [
  { value: "academy_live", label: "Academy Live Call" },
  { value: "mentorship_group", label: "1:1 Mentorship" },
  { value: "retreat_prep", label: "Retreat Prep / Workshop" },
  { value: "community_call", label: "Community Call" },
  { value: "other", label: "Other" },
];

const emptyForm = {
  title: "",
  description: "",
  sessionType: "academy_live" as SessionType,
  host: "",
  startTime: "",
  endTime: "",
  timezone: "Europe/Paris",
  meetingUrl: "",
  capacity: "",
};

export default function CreateSessionModal({ open, onClose, onCreated }: Props) {
  const [hosts, setHosts] = useState<HostUser[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) loadHosts();
  }, [open]);

  const loadHosts = async () => {
    try {
      const results = await Promise.allSettled([
        api.get("/users", { params: { role: "founder", limit: 50 } }),
        api.get("/users", { params: { role: "manager", limit: 50 } }),
        api.get("/users", { params: { role: "admin", limit: 50 } }),
      ]);

      const allHosts: HostUser[] = [];
      const seenIds = new Set<string>();

      results.forEach((res) => {
        if (res.status === "fulfilled" && res.value?.data?.data?.data) {
          const list = res.value.data.data.data as HostUser[];
          list.forEach((u) => {
            if (!seenIds.has(u._id)) {
              seenIds.add(u._id);
              allHosts.push(u);
            }
          });
        }
      });

      setHosts(allHosts);
    } catch (err) {
      console.log(err);
    }
  };

  const updateField = (key: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.host) next.host = "Select a host";
    if (!form.startTime) next.startTime = "Start time is required";
    if (!form.endTime) next.endTime = "End time is required";
    if (
      form.startTime &&
      form.endTime &&
      new Date(form.endTime).getTime() <= new Date(form.startTime).getTime()
    ) {
      next.endTime = "End time must be after start time";
    }
    if (!form.timezone.trim()) next.timezone = "Timezone is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetForm = () => setForm(emptyForm);

  const handleClose = () => {
    resetForm();
    setErrors({});
    onClose();
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await sessionScheduleApi.createSession({
        title: form.title.trim(),
        ...(form.description.trim() ? { description: form.description.trim() } : {}),
        sessionType: form.sessionType,
        host: form.host,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        timezone: form.timezone.trim(),
        ...(form.meetingUrl.trim() ? { meetingUrl: form.meetingUrl.trim() } : {}),
        ...(form.capacity ? { capacity: Number(form.capacity) } : {}),
      });

      toast.success("Session scheduled successfully!");
      onCreated();
      handleClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Could not schedule session, try again.";
      toast.error(message);
      setErrors((prev) => ({ ...prev, form: message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1C1A17]">Schedule a Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label>Title</Label>
            <Input
              className="mt-2"
              placeholder="e.g. Fearless Group Call w/ Adam Koubi"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              className="mt-2 min-h-[80px]"
              placeholder="What is this session about?"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Session Type</Label>
              <select
                className="mt-2 w-full cursor-pointer rounded-xl border border-[#E7DDCC] p-3"
                value={form.sessionType}
                onChange={(e) => updateField("sessionType", e.target.value)}
              >
                {SESSION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Host</Label>
              <select
                className="mt-2 w-full cursor-pointer rounded-xl border border-[#E7DDCC] p-3"
                value={form.host}
                onChange={(e) => updateField("host", e.target.value)}
              >
                <option value="">Select host</option>
                {hosts.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.fullName} · {h.role}
                  </option>
                ))}
              </select>
              {errors.host && <p className="mt-1 text-xs text-red-500">{errors.host}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Time</Label>
              <Input
                className="mt-2"
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => updateField("startTime", e.target.value)}
              />
              {errors.startTime && (
                <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>
              )}
            </div>

            <div>
              <Label>End Time</Label>
              <Input
                className="mt-2"
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => updateField("endTime", e.target.value)}
              />
              {errors.endTime && (
                <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Timezone</Label>
              <Input
                className="mt-2"
                placeholder="Europe/Paris"
                value={form.timezone}
                onChange={(e) => updateField("timezone", e.target.value)}
              />
              {errors.timezone && (
                <p className="mt-1 text-xs text-red-500">{errors.timezone}</p>
              )}
            </div>

            <div>
              <Label>Capacity (optional)</Label>
              <Input
                className="mt-2"
                type="number"
                min={1}
                placeholder="Leave empty for unlimited"
                value={form.capacity}
                onChange={(e) => updateField("capacity", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Meeting URL (Zoom/Meet link)</Label>
            <Input
              className="mt-2"
              placeholder="https://zoom.us/j/..."
              value={form.meetingUrl}
              onChange={(e) => updateField("meetingUrl", e.target.value)}
            />
          </div>

          {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" className="cursor-pointer border-[#E7DDCC]" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={loading}
            className="cursor-pointer bg-[#B08A3E] text-white hover:bg-[#B08A3E]/90"
            onClick={submit}
          >
            {loading ? "Scheduling..." : "Schedule Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}