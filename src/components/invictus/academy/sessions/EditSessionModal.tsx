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
import type {
  ISessionScheduleItem,
  SessionStatus,
  SessionType,
} from "@/lib/features/invictus/sessionSchedule/sessionScheduleTypes";

interface HostUser {
  _id: string;
  fullName: string;
  role: string;
}

interface Props {
  session: ISessionScheduleItem | null;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const SESSION_TYPES: { value: SessionType; label: string }[] = [
  { value: "academy_live", label: "Academy Live Call" },
  { value: "mentorship_group", label: "1:1 Mentorship" },
  { value: "retreat_prep", label: "Retreat Prep / Workshop" },
  { value: "community_call", label: "Community Call" },
  { value: "other", label: "Other" },
];

const SESSION_STATUSES: { value: SessionStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "postponed", label: "Postponed" },
];

// Helper to format ISO date to local datetime-local input string (YYYY-MM-DDTHH:mm)
function toDatetimeLocal(isoString?: string): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function EditSessionModal({
  session,
  open,
  onClose,
  onUpdated,
}: Props) {
  const [hosts, setHosts] = useState<HostUser[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    sessionType: "academy_live" as SessionType,
    host: "",
    startTime: "",
    endTime: "",
    timezone: "Europe/Paris",
    meetingUrl: "",
    capacity: "",
    status: "scheduled" as SessionStatus,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadHosts();
    }
  }, [open]);

  useEffect(() => {
    if (session) {
      setForm({
        title: session.title ?? "",
        description: session.description ?? "",
        sessionType: session.sessionType ?? "academy_live",
        host: session.host?._id ?? "",
        startTime: toDatetimeLocal(session.startTime),
        endTime: toDatetimeLocal(session.endTime),
        timezone: session.timezone ?? "Europe/Paris",
        meetingUrl: session.meetingUrl ?? "",
        capacity: session.capacity ? String(session.capacity) : "",
        status: session.status ?? "scheduled",
      });
      setErrors({});
    }
  }, [session]);

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

  const updateField = (key: keyof typeof form, value: string) => {
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

  const submit = async () => {
    if (!session || !validate()) return;

    try {
      setLoading(true);

      await sessionScheduleApi.updateSession(session._id, {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        sessionType: form.sessionType,
        host: form.host,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        timezone: form.timezone.trim(),
        meetingUrl: form.meetingUrl.trim() || undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        status: form.status,
      });

      toast.success("Session updated successfully!");
      onUpdated();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Could not update session, try again.";
      toast.error(message);
      setErrors((prev) => ({ ...prev, form: message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1C1A17]">Edit Session</DialogTitle>
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
                className="mt-2 w-full cursor-pointer rounded-xl border border-[#E7DDCC] p-3 text-sm"
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
                className="mt-2 w-full cursor-pointer rounded-xl border border-[#E7DDCC] p-3 text-sm"
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

          <div className="grid grid-cols-3 gap-4">
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
                placeholder="Unlimited"
                value={form.capacity}
                onChange={(e) => updateField("capacity", e.target.value)}
              />
            </div>

            <div>
              <Label>Status</Label>
              <select
                className="mt-2 w-full cursor-pointer rounded-xl border border-[#E7DDCC] p-3 text-sm"
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
                {SESSION_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
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
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
