"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, CheckCircle2, Clock, XCircle, UserX, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { sessionScheduleApi } from "@/lib/features/invictus/sessionSchedule/sessionScheduleApi";
import type {
  ISessionAttendanceItem,
  ISessionScheduleItem,
  SessionAttendanceStatus,
} from "@/lib/features/invictus/sessionSchedule/sessionScheduleTypes";

interface Props {
  session: ISessionScheduleItem | null;
  open: boolean;
  onClose: () => void;
}

const ATTENDANCE_STATUS_CONFIG: Record<
  SessionAttendanceStatus,
  { label: string; bg: string; text: string; icon: any }
> = {
  registered: {
    label: "Registered",
    bg: "bg-[#F5EFE6]",
    text: "text-[#8A6D1F]",
    icon: Clock,
  },
  attended: {
    label: "Attended",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  late: {
    label: "Late",
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: Clock,
  },
  no_show: {
    label: "No Show",
    bg: "bg-rose-50",
    text: "text-rose-700",
    icon: UserX,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-gray-100",
    text: "text-gray-500",
    icon: XCircle,
  },
};

export default function AttendeesModal({ session, open, onClose }: Props) {
  const [attendees, setAttendees] = useState<ISessionAttendanceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadAttendees = async () => {
    if (!session) return;
    try {
      setLoading(true);
      const res = await sessionScheduleApi.getSessionAttendees(session._id, 1, 100);
      setAttendees(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Could not load attendees list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && session) {
      loadAttendees();
    }
  }, [open, session]);

  const handleStatusChange = async (
    attendance: ISessionAttendanceItem,
    status: SessionAttendanceStatus,
  ) => {
    if (!session) return;
    try {
      setUpdatingId(attendance._id);
      await sessionScheduleApi.markAttendance({
        session: session._id,
        user: attendance.user._id,
        status,
      });
      toast.success(`Marked as ${status}`);
      await loadAttendees();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = attendees.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.user?.fullName?.toLowerCase().includes(q) ||
      a.user?.email?.toLowerCase().includes(q) ||
      a.user?.role?.toLowerCase().includes(q)
    );
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden rounded-3xl border-[#E7DDCC] bg-white p-0 flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b border-[#EDE7D8] bg-[#FAF6EE]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9E7B28]/10 text-[#9E7B28]">
              <Users size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-[#1C1A16]">
                Session Attendees
              </DialogTitle>
              <p className="text-xs text-[#8A8375] mt-0.5 line-clamp-1">
                {session?.title} · {attendees.length}{" "}
                {attendees.length === 1 ? "person registered" : "people registered"}
              </p>
            </div>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8375]" size={15} />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#DECDB0] bg-white pl-10 pr-4 py-2 text-xs text-[#1C1A16] placeholder:text-[#B0A996] focus:outline-none focus:border-[#C6A34A]"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#8A8375]">
              <Loader2 className="h-6 w-6 animate-spin text-[#9E7B28] mb-2" />
              <p className="text-xs">Loading attendees...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E7DDCC] py-12 text-center">
              <Users className="mx-auto mb-2 text-[#DECDB0]" size={28} />
              <p className="text-sm font-medium text-[#1C1A16]">No attendees found</p>
              <p className="text-xs text-[#8A8375] mt-0.5">
                {search ? "Try searching with a different term." : "No one has registered for this session yet."}
              </p>
            </div>
          ) : (
            filtered.map((att) => {
              const statusCfg =
                ATTENDANCE_STATUS_CONFIG[att.status] ??
                ATTENDANCE_STATUS_CONFIG.registered;
              const StatusIcon = statusCfg.icon;
              const isBusy = updatingId === att._id;

              return (
                <div
                  key={att._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#EDE7D8] bg-[#FFFCF7] p-4 transition-all hover:border-[#DDBB6E]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF0D7] text-xs font-bold text-[#8A6D1F]">
                      {att.user?.fullName
                        ? att.user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "U"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1C1A16]">
                        {att.user?.fullName || "Anonymous Member"}
                      </p>
                      <p className="text-[11px] text-[#8A8375]">{att.user?.email}</p>
                      <span className="inline-block mt-0.5 rounded-sm bg-[#FAF6EE] px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider text-[#9E7B28]">
                        {att.user?.role?.replace("_", " ") || "Member"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusCfg.bg} ${statusCfg.text}`}
                    >
                      <StatusIcon size={12} />
                      {statusCfg.label}
                    </span>

                    <select
                      value={att.status}
                      disabled={isBusy}
                      onChange={(e) =>
                        handleStatusChange(
                          att,
                          e.target.value as SessionAttendanceStatus,
                        )
                      }
                      className="cursor-pointer rounded-lg border border-[#DECDB0] bg-white px-2 py-1 text-[11px] font-medium text-[#1C1A16] focus:outline-none focus:border-[#C6A34A] disabled:opacity-50"
                    >
                      <option value="registered">Registered</option>
                      <option value="attended">Attended</option>
                      <option value="late">Late</option>
                      <option value="no_show">No Show</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
