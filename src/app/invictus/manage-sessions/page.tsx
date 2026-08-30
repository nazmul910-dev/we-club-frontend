"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Plus, XCircle } from "lucide-react";
import { toast } from "sonner";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";
import { sessionScheduleApi } from "@/lib/features/invictus/sessionSchedule/sessionScheduleApi";
import type { ISessionScheduleItem } from "@/lib/features/invictus/sessionSchedule/sessionScheduleTypes";
import CreateSessionModal from "@/components/invictus/academy/sessions/CreateSessionModal";

const STATUS_STYLE: Record<string, string> = {
  scheduled: "bg-[#F3E9D2] text-[#B08A3E]",
  ongoing: "bg-green-50 text-green-600",
  completed: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-50 text-red-500",
  postponed: "bg-yellow-50 text-yellow-600",
};

export default function ManageSessionsPage() {
  return (
    <AuthGuard allowedRoles={["founder", "manager", "admin"]}>
      <ManageSessionsContent />
    </AuthGuard>
  );
}

function ManageSessionsContent() {
  const [sessions, setSessions] = useState<ISessionScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await sessionScheduleApi.getAllAdmin(1, 50);
      setSessions(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (session: ISessionScheduleItem) => {
    const reason = window.prompt(`Cancel "${session.title}" — reason?`);
    if (!reason) return;

    try {
      await sessionScheduleApi.cancelSession(session._id, reason);
      toast.success("Session cancelled");
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not cancel session");
    }
  };

  return (
    <div className="mx-auto max-w-[1180px] px-[6vw] py-[2vw] sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[4px] text-[#B18A3A] font-semibold">
            INVICTUS ACADEMY
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[#171717]">
            Session Schedules
          </h1>
          <p className="mt-2 text-sm text-[#8A8175]">
            Create and manage live calls, 1:1s, workshops and community sessions
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#B18A3A] px-5 py-2.5 text-sm text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(177,138,58,.25)]"
        >
          <Plus size={16} />
          Schedule Session
        </button>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-[#8A8175]">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E7DDCC] p-10 text-center">
            <CalendarClock className="mx-auto mb-3 text-[#B08A3E]" size={28} />
            <p className="text-sm text-[#8A8175]">No sessions scheduled yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#E8DDCA]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF6EE] text-[#8A8175]">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Host</th>
                  <th className="px-4 py-3">Start</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s._id} className="border-t border-[#EFE6D6]">
                    <td className="px-4 py-3 font-medium text-[#1C1A17]">{s.title}</td>
                    <td className="px-4 py-3 text-[#8A8175]">{s.sessionType}</td>
                    <td className="px-4 py-3 text-[#8A8175]">{s.host?.fullName}</td>
                    <td className="px-4 py-3 text-[#8A8175]">
                      {new Date(s.startTime).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[s.status]}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.status === "scheduled" && (
                        <button
                          onClick={() => handleCancel(s)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline cursor-pointer"
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateSessionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={load}
      />
    </div>
  );
}