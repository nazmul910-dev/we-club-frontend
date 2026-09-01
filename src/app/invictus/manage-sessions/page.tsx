"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  Plus,
  XCircle,
  Edit2,
  Trash2,
  Users,
  Search,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { sessionScheduleApi } from "@/lib/features/invictus/sessionSchedule/sessionScheduleApi";
import type { ISessionScheduleItem } from "@/lib/features/invictus/sessionSchedule/sessionScheduleTypes";
// import CreateSessionModal from "@/components/invictus/academy/sessions/CreateSessionModal";
// import EditSessionModal from "@/components/invictus/academy/sessions/EditSessionModal";
// import AttendeesModal from "@/components/invictus/academy/sessions/AttendeesModal";
import dynamic from "next/dynamic";

const CreateSessionModal = dynamic(()=> import("@/components/invictus/academy/sessions/CreateSessionModal"), {
  ssr : false
})
const EditSessionModal = dynamic(()=> import("@/components/invictus/academy/sessions/EditSessionModal"), {
  ssr : false
})
const AttendeesModal = dynamic(()=> import("@/components/invictus/academy/sessions/AttendeesModal"), {
  ssr : false
})


const STATUS_STYLE: Record<string, string> = {
  scheduled: "bg-[#F3E9D2] text-[#B08A3E]",
  ongoing: "bg-green-50 text-green-600",
  completed: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-50 text-red-500",
  postponed: "bg-yellow-50 text-yellow-600",
};

export default function ManageSessionsPage() {
  return (
    <AuthGuard allowedRoles={["founder", "manager", "admin", "super_admin"]}>
      <ManageSessionsContent />
    </AuthGuard>
  );
}

function ManageSessionsContent() {
  const [sessions, setSessions] = useState<ISessionScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editSession, setEditSession] = useState<ISessionScheduleItem | null>(null);
  const [attendeesSession, setAttendeesSession] = useState<ISessionScheduleItem | null>(null);

  // Cancel dialog
  const [cancelSession, setCancelSession] = useState<ISessionScheduleItem | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Delete dialog
  const [deleteSession, setDeleteSession] = useState<ISessionScheduleItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await sessionScheduleApi.getAllAdmin(1, 100);
      setSessions(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Could not load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmCancel = async () => {
    if (!cancelSession || !cancelReason.trim()) return;

    try {
      setCancelling(true);
      await sessionScheduleApi.cancelSession(
        cancelSession._id,
        cancelReason.trim(),
      );
      toast.success("Session cancelled successfully");
      setCancelSession(null);
      setCancelReason("");
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not cancel session");
    } finally {
      setCancelling(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteSession) return;

    try {
      setDeleting(true);
      await sessionScheduleApi.deleteSession(deleteSession._id);
      toast.success("Session deleted successfully");
      setDeleteSession(null);
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not delete session");
    } finally {
      setDeleting(false);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const matchSearch =
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.host?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      s.sessionType?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" || s.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="mx-auto max-w-[1180px] px-[6vw] py-[2vw] sm:px-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[4px] text-[#B18A3A] font-semibold uppercase">
            INVICTUS ACADEMY
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#171717]">
            Session Schedules & Management
          </h1>
          <p className="mt-1.5 text-sm text-[#8A8175]">
            Create and manage live calls, masterclasses, 1:1 sessions, and track registered attendees.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#B18A3A] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 cursor-pointer hover:bg-[#9E7B28] hover:shadow-[0_10px_25px_rgba(177,138,58,.25)]"
        >
          <Plus size={16} />
          Schedule Session
        </button>
      </div>

      {/* Filters & Search */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8175]"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by session title, host name, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#DECDB0] bg-white pl-10 pr-4 py-2 text-sm text-[#1C1A16] placeholder:text-[#B0A996] focus:outline-none focus:border-[#B18A3A]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-[#DECDB0] bg-white px-4 py-2 text-sm text-[#1C1A16] focus:outline-none focus:border-[#B18A3A] cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="postponed">Postponed</option>
        </select>
      </div>

      {/* Table List */}
      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-[#8A8175]">Loading sessions...</p>
        ) : filteredSessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E7DDCC] p-12 text-center bg-[#FFFCF7]">
            <CalendarClock className="mx-auto mb-3 text-[#B08A3E]" size={32} />
            <p className="text-base font-semibold text-[#1C1A16]">No sessions found</p>
            <p className="text-xs text-[#8A8175] mt-1">
              {search || statusFilter !== "all"
                ? "Try adjusting your search filters."
                : "Get started by scheduling your first live call or masterclass."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#E8DDCA] bg-white shadow-2xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF6EE] text-[#8A8175] text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Title</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Host</th>
                  <th className="px-4 py-3.5">Start Time</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE6D6]">
                {filteredSessions.map((s) => (
                  <tr key={s._id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#1C1A17]">{s.title}</p>
                      {s.meetingUrl && (
                        <a
                          href={s.meetingUrl.startsWith("http") ? s.meetingUrl : `https://${s.meetingUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#B18A3A] hover:underline mt-0.5"
                        >
                          Meeting Link <ExternalLink size={10} />
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-[#8A8175] capitalize">
                      {s.sessionType?.replace("_", " ")}
                    </td>
                    <td className="px-4 py-4 text-xs text-[#1C1A16]">
                      {s.host?.fullName || "—"}
                    </td>
                    <td className="px-4 py-4 text-xs text-[#8A8175]">
                      {new Date(s.startTime).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      <span className="text-[10px] text-[#B0A996]">({s.timezone})</span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[s.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setAttendeesSession(s)}
                          className="cursor-pointer rounded-lg border border-[#DECDB0] bg-[#FAF6EE] p-1.5 text-[#8A6D1F] hover:bg-[#F3ECD8] transition-colors"
                          title="View registered attendees & mark attendance"
                        >
                          <Users size={14} />
                        </button>
                        <button
                          onClick={() => setEditSession(s)}
                          className="cursor-pointer rounded-lg border border-[#DECDB0] bg-[#FAF6EE] p-1.5 text-[#8A8175] hover:bg-[#F3ECD8] hover:text-[#1C1A16] transition-colors"
                          title="Edit session details"
                        >
                          <Edit2 size={14} />
                        </button>
                        {s.status === "scheduled" && (
                          <button
                            onClick={() => {
                              setCancelSession(s);
                              setCancelReason("");
                            }}
                            className="cursor-pointer rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition-colors"
                            title="Cancel session"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteSession(s)}
                          className="cursor-pointer rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete session permanently"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {createOpen && <CreateSessionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={load}
      />}

      {/* Edit Session Modal */}
     {Boolean(editSession) && <EditSessionModal
        session={editSession}
        open={Boolean(editSession)}
        onClose={() => setEditSession(null)}
        onUpdated={load}
      />}

      {/* Attendees Modal */}
     {Boolean(attendeesSession) && <AttendeesModal
        session={attendeesSession}
        open={Boolean(attendeesSession)}
        onClose={() => setAttendeesSession(null)}
      />}

      {/* Cancel Session Dialog */}
      <Dialog
        open={Boolean(cancelSession)}
        onOpenChange={(open) => {
          if (!open && !cancelling) setCancelSession(null);
        }}
      >
        <DialogContent className="max-w-md border-[#E8DDCA] bg-[#FFFCF7] text-[#171717] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#171717]">
              Cancel session?
            </DialogTitle>
            <DialogDescription className="text-[#8A8175] text-xs">
              You are cancelling &quot;
              <span className="font-semibold text-[#171717]">
                {cancelSession?.title}
              </span>
              &quot;. Please provide a reason for attendees.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            placeholder="Enter cancellation reason"
            disabled={cancelling}
            className="text-xs min-h-[80px]"
            autoFocus
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCancelSession(null)}
              disabled={cancelling}
              className="cursor-pointer rounded-lg border-[#E8DDCA] text-[#5F574D] text-xs"
            >
              Keep session
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmCancel}
              disabled={cancelling || !cancelReason.trim()}
              className="cursor-pointer rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs"
            >
              {cancelling ? "Cancelling..." : "Cancel session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Session Dialog */}
      <Dialog
        open={Boolean(deleteSession)}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteSession(null);
        }}
      >
        <DialogContent className="max-w-md border-[#E8DDCA] bg-[#FFFCF7] text-[#171717] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#171717]">
              Delete session?
            </DialogTitle>
            <DialogDescription className="text-[#8A8175] text-xs">
              Are you sure you want to permanently delete &quot;
              <span className="font-semibold text-[#171717]">
                {deleteSession?.title}
              </span>
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteSession(null)}
              disabled={deleting}
              className="cursor-pointer rounded-lg border-[#E8DDCA] text-[#5F574D] text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
              className="cursor-pointer rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs"
            >
              {deleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
