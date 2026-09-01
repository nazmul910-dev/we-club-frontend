"use client";

import { useEffect, useState, useMemo } from "react";
import {
  CalendarDays,
  Clock,
  Clock4,
  Video,
  Check,
  ArrowRight,
  Loader2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { sessionScheduleApi } from "@/lib/features/invictus/sessionSchedule/sessionScheduleApi";
import type {
  ISessionAttendanceItem,
  ISessionScheduleItem,
} from "@/lib/features/invictus/sessionSchedule/sessionScheduleTypes";
import { useSessionCountdown } from "@/hooks/useSessionCountdown";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SESSION_TYPE_CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  academy_live: {
    label: "ACADEMY LIVE",
    bg: "bg-[#F7EFE1]",
    text: "text-[#8A6D1F]",
  },
  mentorship_group: {
    label: "1:1 MENTORSHIP",
    bg: "bg-[#EEF5EA]",
    text: "text-[#2D6A2E]",
  },
  retreat_prep: {
    label: "WORKSHOP / RETREAT",
    bg: "bg-[#F5EDF8]",
    text: "text-[#6A2D75]",
  },
  community_call: {
    label: "COMMUNITY CALL",
    bg: "bg-[#EAF0F8]",
    text: "text-[#28578E]",
  },
  other: {
    label: "SPECIAL SESSION",
    bg: "bg-[#FAF6EE]",
    text: "text-[#9E7B28]",
  },
};

function SessionCard({
  session,
  userAttendance,
  onRegister,
  isRegistering,
}: {
  session: ISessionScheduleItem;
  userAttendance?: ISessionAttendanceItem;
  onRegister: (sessionId: string) => void;
  isRegistering?: boolean;
}) {
  const { canJoin, label: countdownLabel } = useSessionCountdown(
    session.startTime,
  );

  // Expired = endTime has passed
  const isExpired = session.endTime
    ? new Date(session.endTime).getTime() < Date.now()
    : false;

  const isRegistered =
    userAttendance &&
    userAttendance.status !== "cancelled" &&
    userAttendance.status !== "no_show";

  const typeConfig =
    SESSION_TYPE_CONFIG[session.sessionType] ?? SESSION_TYPE_CONFIG.other;

  const startDate = new Date(session.startTime);
  const formattedDate = isNaN(startDate.getTime())
    ? "TBD"
    : startDate
        .toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
        .toUpperCase();

  const formattedTime = isNaN(startDate.getTime())
    ? ""
    : startDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: session.timezone || undefined,
      });

  const handleJoin = () => {
    if (session.meetingUrl) {
      window.open(
        session.meetingUrl.startsWith("http")
          ? session.meetingUrl
          : `https://${session.meetingUrl}`,
        "_blank",
      );
    } else {
      toast.info("Meeting link will be activated closer to the start time.");
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
        isExpired
          ? "border-[#E8E2D7] bg-[#F7F5F1] opacity-85"
          : "border-[#EDE7D8] bg-white hover:border-[#DDBB6E] hover:shadow-[0_8px_30px_rgba(201,168,76,0.12)]"
      }`}
    >
      {/* Decorative top-right corner */}
      <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-[#FAF6EE] transition-colors group-hover:bg-[#F5ECD8]" />

      <div className="relative space-y-4">
        {/* Header: Date + Session Type */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#C6A34A] px-3 py-1 text-[10px] font-bold tracking-widest text-[#1C1A16]">
              {formattedDate}
            </span>
            <span
              className={`rounded-md px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase ${typeConfig.bg} ${typeConfig.text}`}
            >
              {typeConfig.label}
            </span>
          </div>

          {isExpired ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <Clock4 size={11} />
              Expired
            </span>
          ) : session.status === "cancelled" ? (
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600">
              Cancelled
            </span>
          ) : session.status === "ongoing" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Live Now
            </span>
          ) : isRegistered ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF0D7] border border-[#DECDB0] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8A6D1F]">
              <Check size={11} className="text-[#8A6D1F]" />
              Registered
            </span>
          ) : null}
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1C1A16] group-hover:text-[#8A6D1F] transition-colors">
            {session.title}
          </h3>
          {session.description && (
            <p className="mt-1 text-xs leading-relaxed text-[#8A8375] line-clamp-2">
              {session.description}
            </p>
          )}
        </div>

        {/* Host info & Time */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F3ECD8] pt-3 text-xs text-[#8A8375]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF6EE] text-[11px] font-bold text-[#8A6D1F] border border-[#EDE7D8]">
              {session.host?.fullName
                ? session.host.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "H"}
            </div>
            <div>
              <p className="font-semibold text-[#1C1A16] leading-none">
                {session.host?.fullName || "Invictus Host"}
              </p>
              <p className="text-[10px] text-[#B0A996] mt-0.5">
                {session.host?.role?.replace("_", " ") || "Host"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#8A6D1F] font-medium text-[11px]">
            <Clock size={13} />
            <span>
              {formattedTime} {session.timezone}
            </span>
          </div>
        </div>

        {/* Countdown & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#F3ECD8] pt-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#8A8375]">
              {isExpired ? "Session has ended" : countdownLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isExpired ? (
              <button
                disabled
                className="flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 shadow-2xs"
              >
                <Clock4 size={13} />
                Session Ended
              </button>
            ) : canJoin && session.status !== "cancelled" ? (
              <button
                onClick={handleJoin}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#1C1A16] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#DECDB0] shadow-sm transition-all hover:bg-[#332C1E] active:scale-95"
              >
                <Video size={13} className="text-[#C6A34A]" />
                Join Live Call
                <ExternalLink size={11} />
              </button>
            ) : isRegistered ? (
              <button
                disabled
                className="flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-[#DECDB0] bg-[#FAF6EE] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#8A6D1F] opacity-90 shadow-2xs"
              >
                <Check size={13} className="text-[#8A6D1F]" />
                Registered
              </button>
            ) : session.status === "scheduled" ? (
              <button
                onClick={() => onRegister(session._id)}
                disabled={isRegistering}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#C6A34A] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#1C1A16] transition-all hover:bg-[#B59239] hover:shadow-sm active:scale-95 disabled:opacity-60"
              >
                {isRegistering ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <>
                    Register for Session
                    <ArrowRight size={12} />
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpcomingSessionsTab() {
  const [sessions, setSessions] = useState<ISessionScheduleItem[]>([]);
  const [attendances, setAttendances] = useState<ISessionAttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, attendancesRes] = await Promise.allSettled([
        sessionScheduleApi.getAllAdmin(1, 50, { status: "scheduled" }),
        sessionScheduleApi.getMyAttendances(),
      ]);

      if (sessionsRes.status === "fulfilled" && sessionsRes.value?.data) {
        setSessions(sessionsRes.value.data);
      } else {
        try {
          const upcoming = await sessionScheduleApi.getUpcoming(20);
          setSessions(upcoming);
        } catch {
          setSessions([]);
        }
      }

      if (
        attendancesRes.status === "fulfilled" &&
        Array.isArray(attendancesRes.value)
      ) {
        setAttendances(attendancesRes.value);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegister = async (sessionId: string) => {
    try {
      setRegisteringId(sessionId);
      await sessionScheduleApi.registerForSession(sessionId);
      toast.success("Successfully registered for the session!");
      await loadData();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Could not register for session",
      );
    } finally {
      setRegisteringId(null);
    }
  };

  const attendanceBySessionId = useMemo(() => {
    const map = new Map<string, ISessionAttendanceItem>();
    attendances.forEach((att) => {
      if (att.session?._id) {
        map.set(att.session._id, att);
      }
    });
    return map;
  }, [attendances]);

  // Sort: active/upcoming first, expired (endTime past) last
  const sortedSessions = useMemo(() => {
    const now = Date.now();
    const active: ISessionScheduleItem[] = [];
    const expired: ISessionScheduleItem[] = [];
    sessions.forEach((s) => {
      const endMs = s.endTime ? new Date(s.endTime).getTime() : Infinity;
      if (endMs < now) {
        expired.push(s);
      } else {
        active.push(s);
      }
    });
    // Sort active: soonest first; expired: most recent first
    active.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
    expired.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );
    return [...active, ...expired];
  }, [sessions]);

  const totalPages = Math.ceil(sortedSessions.length / PAGE_SIZE);

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedSessions.slice(start, start + PAGE_SIZE);
  }, [sortedSessions, currentPage, PAGE_SIZE]);

  // Reset to page 1 when sessions reload
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mb-10 space-y-6">
      {/* Header Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-[#EDE7D8] bg-[#FAF6EE] px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C6A34A]/15 text-[#8A6D1F]">
          <CalendarDays size={18} />
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-[#1C1A16]">
            Upcoming Live Sessions & Calls
          </h2>
          <p className="text-xs text-[#8A8375]">
            Register for private organization calls, workshops, and 1:1
            sessions.
          </p>
        </div>
      </div>

      {/* Session Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#EDE7D8] bg-white py-16 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-[#C6A34A] mb-3" />
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-[#1C1A16]">
            Loading Upcoming Sessions...
          </p>
          <p className="text-xs text-[#8A8375] mt-1">
            Retrieving scheduled events and your registrations.
          </p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DECDB0] bg-[#FFFDF9] px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF6EE] text-[#C6A34A] mb-3 border border-[#EDE7D8]">
            <Sparkles size={22} />
          </div>
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1C1A16]">
            No Upcoming Sessions Scheduled
          </h3>
          <p className="mt-1.5 max-w-md text-xs text-[#8A8375]">
            There are currently no upcoming sessions on the calendar. New live
            calls and masterclasses will appear here once scheduled.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Session count info */}
          {sortedSessions.length > PAGE_SIZE && (
            <p className="text-[11px] text-[#8A8375] font-montserrat">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, sortedSessions.length)} of{" "}
              {sortedSessions.length} sessions
            </p>
          )}

          {/* Cards */}
          <div className="grid gap-5">
            {paginatedSessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                userAttendance={attendanceBySessionId.get(session._id)}
                onRegister={handleRegister}
                isRegistering={registeringId === session._id}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={`font-montserrat text-[11px] text-[#9E7B28] border border-[#DECDB0] bg-[#FAF6EE] hover:bg-[#F0E8D5] ${
                      currentPage === 1
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    }`}
                    text="Prev"
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    const isFirst = page === 1;
                    const isLast = page === totalPages;
                    const isNearCurrent = Math.abs(page - currentPage) <= 1;
                    const show = isFirst || isLast || isNearCurrent;
                    const showEllipsisBefore =
                      page === currentPage - 2 && currentPage - 2 > 1;
                    const showEllipsisAfter =
                      page === currentPage + 2 && currentPage + 2 < totalPages;

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis className="text-[#9E7B28]" />
                        </PaginationItem>
                      );
                    }

                    if (!show) return null;

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          className={`font-montserrat text-[11px] cursor-pointer ${
                            page === currentPage
                              ? "border border-[#9E7B28] bg-[#9E7B28] text-white font-bold"
                              : "border border-[#DECDB0] bg-[#FAF6EE] text-[#9E7B28] hover:bg-[#F0E8D5]"
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  },
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={`font-montserrat text-[11px] text-[#9E7B28] border border-[#DECDB0] bg-[#FAF6EE] hover:bg-[#F0E8D5] ${
                      currentPage === totalPages
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    }`}
                    text="Next"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
