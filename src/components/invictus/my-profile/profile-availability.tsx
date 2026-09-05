"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAppDispatch } from "@/lib/redux/store/hook";
import {
  getPrimaryMentorAvailability,
  updatePrimaryMentorAvailability,
  type AvailabilitySlot,
} from "@/lib/features/profile/profileApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DAYS: AvailabilitySlot["day"][] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
] as const;

const emptySlot = (timezone: string): AvailabilitySlot => ({
  day: "monday",
  startTime: "09:00",
  endTime: "17:00",
  timezone,
});

export default function ProfileAvailability({ role }: { role: string }) {
  const dispatch = useAppDispatch();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(role === "founder");
  const [editorOpen, setEditorOpen] = useState(false);
  const [browserTimezone, setBrowserTimezone] = useState("UTC");

  const timezones = browserTimezone === "UTC" || COMMON_TIMEZONES.includes(browserTimezone as (typeof COMMON_TIMEZONES)[number])
    ? COMMON_TIMEZONES
    : [browserTimezone, ...COMMON_TIMEZONES];

  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detectedTimezone) setBrowserTimezone(detectedTimezone);
  }, []);

  useEffect(() => {
    if (role !== "founder" && role !== "co_mentor") {
      setLoading(false);
      return;
    }

    dispatch(getPrimaryMentorAvailability()).then((result) => {
      if (getPrimaryMentorAvailability.fulfilled.match(result)) {
        setSlots(result.payload.availability);
        setVisible(true);
      } else {
        setVisible(false);
      }
      setLoading(false);
    });
  }, [dispatch, role]);

  if (loading || !visible) return null;

  const updateSlot = (
    index: number,
    field: keyof AvailabilitySlot,
    value: string,
  ) => {
    setSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [field]: value } : slot,
      ),
    );
  };

  const save = async () => {
    setSaving(true);
    const result = await dispatch(updatePrimaryMentorAvailability(slots));
    setSaving(false);

    if (updatePrimaryMentorAvailability.fulfilled.match(result)) {
      setSlots(result.payload);
      setEditorOpen(false);
      toast.success("Availability updated");
    } else {
      toast.error("Could not update availability");
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-[#E8E0D2] bg-white p-5 shadow-[0_12px_32px_rgba(76,58,28,0.05)] sm:p-6">
        <div className="space-y-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8F4EA] text-[#B08A3E]">
              <CalendarClock size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#C9A962]">
                Availability
              </p>
              <h3 className="mt-1 font-serif text-xl leading-tight text-[#111] sm:text-2xl">
                Primary mentor hours
              </h3>
              <p className="mt-2 text-sm leading-5 text-[#777]">
                {slots.length > 0
                  ? `${slots.length} time window${slots.length === 1 ? "" : "s"} set for members.`
                  : "No hours set for members yet."}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditorOpen(true)}
            className="w-full border-[#E8E0D2] text-[#9B7A32] hover:bg-[#F8F4EA]"
          >
            {slots.length > 0 ? "Update hours" : "Set availability"}
          </Button>
        </div>

        {slots.length > 0 && (
          <div className="mt-5 grid gap-2">
            {slots.slice(0, 3).map((slot, index) => (
              <span
                key={`${slot.day}-${index}`}
                className="w-full rounded-xl bg-[#F8F4EA] px-3 py-2 text-xs font-medium capitalize text-[#6F6045]"
              >
                {slot.day} · {slot.startTime}-{slot.endTime}
              </span>
            ))}
            {slots.length > 3 && (
              <span className="rounded-full bg-[#F5F5F3] px-3 py-1.5 text-xs text-[#777]">
                +{slots.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl border-[#E8E0D2] bg-[#FBF9F4]">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#111]">
              Update availability
            </DialogTitle>
            <DialogDescription>
              Add the days and time windows when members can book sessions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {slots.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#E8E0D2] p-5 text-sm text-[#888]">
                No time windows yet. Add your first availability below.
              </p>
            )}
            {slots.map((slot, index) => (
              <div
                key={`${slot.day}-${index}`}
                className="grid gap-2 rounded-xl border border-[#EEE7DA] bg-white p-3 sm:grid-cols-[1.1fr_1fr_1fr_1.4fr_auto] sm:items-center"
              >
                <Select
                  value={slot.day}
                  onValueChange={(value) => updateSlot(index, "day", value ?? "monday")}
                >
                  <SelectTrigger className="h-10 w-full border-[#E8E0D2] bg-white text-sm capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day) => (
                      <SelectItem key={day} value={day} className="capitalize">
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="time" value={slot.startTime} onChange={(event) => updateSlot(index, "startTime", event.target.value)} className="h-10 rounded-lg border border-[#E8E0D2] bg-white px-3 text-sm outline-none focus:border-[#C9A962]" />
                <input type="time" value={slot.endTime} onChange={(event) => updateSlot(index, "endTime", event.target.value)} className="h-10 rounded-lg border border-[#E8E0D2] bg-white px-3 text-sm outline-none focus:border-[#C9A962]" />
                <Select
                  value={slot.timezone || browserTimezone}
                  onValueChange={(value) =>
                    updateSlot(index, "timezone", value ?? browserTimezone)
                  }
                >
                  <SelectTrigger className="h-10 w-full border-[#E8E0D2] bg-white text-sm">
                    <SelectValue placeholder={browserTimezone} />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((timezone) => (
                      <SelectItem key={timezone} value={timezone}>
                        {timezone}
                        {timezone === browserTimezone ? " (your location)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button type="button" title="Remove hours" onClick={() => setSlots((current) => current.filter((_, slotIndex) => slotIndex !== index))} className="flex h-10 items-center justify-center rounded-lg px-3 text-[#B85C4B] hover:bg-[#FBEDEA]"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>

          <button type="button" onClick={() => setSlots((current) => [...current, emptySlot(browserTimezone)])} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#D8C9A8] text-sm font-semibold text-[#9B7A32] hover:bg-[#F8F4EA]">
            <Plus size={15} /> Add another time window
          </button>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditorOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" variant="invictus" onClick={save} disabled={saving}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? "Saving" : "Save availability"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}