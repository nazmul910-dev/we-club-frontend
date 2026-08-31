"use client";

import { useEffect, useState, useMemo } from "react";
import { CalendarDays, Clock3, ArrowRight, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { sessionScheduleApi } from "@/lib/features/invictus/sessionSchedule/sessionScheduleApi";
import type {
  ISessionAttendanceItem,
  ISessionScheduleItem,
} from "@/lib/features/invictus/sessionSchedule/sessionScheduleTypes";
import { useSessionCountdown } from "@/hooks/useSessionCountdown";

const SESSION_TYPE_LABEL: Record<string, string> = {
  academy_live: "LIVE SESSION",
  mentorship_group: "1:1 SESSION",
  retreat_prep: "WORKSHOP",
  community_call: "LIVE SESSION",
  other: "SESSION",
};

function EventCard({
  session,
  isRegistered,
  onRegisterSuccess,
}: {
  session: ISessionScheduleItem;
  isRegistered: boolean;
  onRegisterSuccess: (sessionId: string) => void;
}) {
  const { canJoin, label } = useSessionCountdown(session.startTime);
  const [registering, setRegistering] = useState(false);

  const dateBadge = new Date(session.startTime)
    .toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })
    .toUpperCase();

  const timeLabel = new Date(session.startTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: session.timezone,
  });

  const handleAction = async () => {
    if (canJoin && session.meetingUrl) {
      window.open(
        session.meetingUrl.startsWith("http")
          ? session.meetingUrl
          : `https://${session.meetingUrl}`,
        "_blank",
      );
      return;
    }

    if (isRegistered) return; // Prevent double registration

    try {
      setRegistering(true);
      await sessionScheduleApi.registerForSession(session._id);
      toast.success("Successfully registered for session!");
      onRegisterSuccess(session._id);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not register for session");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E8DDCA] bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#C9A84C] hover:shadow-[0_15px_40px_rgba(201,168,76,0.15)]">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-[#FAF4E6] transition group-hover:bg-[#F5E8C8]" />

      <div className="relative space-y-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[#C9A84C] px-3 py-1 font-montserrat text-[9px] font-bold tracking-widest text-black">
            {dateBadge}
          </span>
          <span className="rounded-md border border-[#DECDB0] bg-[#FAF6EE] px-2 py-1 font-montserrat text-[9px] font-bold tracking-wider text-[#9E7B28]">
            {SESSION_TYPE_LABEL[session.sessionType] ?? "SESSION"}
          </span>
        </div>

        <div>
          <h3 className="font-playfair text-xl leading-snug text-[#241D15] group-hover:text-[#9E7B28] transition">
            {session.title}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-[#8f6e41]">
            <Clock3 size={13} />
            <p className="font-montserrat text-xs">
              {timeLabel} {session.timezone}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#EFE6D6] pt-4">
          <p className="font-montserrat text-[13px] text-gray-600">{label}</p>

          <button
            onClick={handleAction}
            disabled={registering || (isRegistered && !canJoin)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-montserrat text-[10px] font-bold tracking-widest transition-all duration-300 ${
              canJoin
                ? "bg-[#1C1A16] text-[#DECDB0] hover:bg-[#332C1E] cursor-pointer hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                : isRegistered
                  ? "bg-[#FAF0D7] text-[#8A6D1F] border border-[#DECDB0] cursor-not-allowed opacity-90"
                  : "bg-[#9E7B28] text-white hover:bg-[#7C5F1E] cursor-pointer hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-60"
            }`}
          >
            {registering ? (
              <Loader2 size={12} className="animate-spin" />
            ) : canJoin ? (
              <>
                JOIN
                <ArrowRight size={12} />
              </>
            ) : isRegistered ? (
              <>
                <Check size={12} className="text-[#8A6D1F]" />
                REGISTERED
              </>
            ) : (
              <>
                REGISTER
                <ArrowRight size={12} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InvictusEventsSection() {
  const [sessions, setSessions] = useState<ISessionScheduleItem[]>([]);
  const [attendances, setAttendances] = useState<ISessionAttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, attendancesRes] = await Promise.allSettled([
        sessionScheduleApi.getUpcoming(3),
        sessionScheduleApi.getMyAttendances(),
      ]);

      if (sessionsRes.status === "fulfilled" && Array.isArray(sessionsRes.value)) {
        setSessions(sessionsRes.value);
      }

      if (attendancesRes.status === "fulfilled" && Array.isArray(attendancesRes.value)) {
        setAttendances(attendancesRes.value);
      }
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const registeredSessionIds = useMemo(() => {
    const set = new Set<string>();
    attendances.forEach((att) => {
      if (
        att.session?._id &&
        att.status !== "cancelled" &&
        att.status !== "no_show"
      ) {
        set.add(att.session._id);
      }
    });
    return set;
  }, [attendances]);

  const handleRegisterSuccess = (sessionId: string) => {
    setAttendances((prev) => [
      ...prev,
      {
        _id: `temp-${Date.now()}`,
        session: { _id: sessionId } as any,
        user: {} as any,
        status: "registered",
      },
    ]);
  };

  if (!loading && sessions.length === 0) return null;

  return (
    <section className="space-y-5">
      <div>
        <p className="font-montserrat text-[10px] tracking-[0.35em] text-[#9E7B28] uppercase">
          THIS WEEK
        </p>
        <h2 className="font-playfair text-3xl text-[#1C1814]">Events</h2>
      </div>

      <div className="rounded-2xl border border-[#DECDB0] bg-gradient-to-br from-[#FAF6EE] to-white p-6 shadow-sm">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9E7B28]/10">
            <CalendarDays size={17} className="text-[#9E7B28]" />
          </div>
          <div>
            <p className="font-montserrat text-xs font-bold tracking-[0.2em] text-[#9E7B28]">
              UPCOMING
            </p>
            <p className="font-montserrat text-[11px] text-[#6B6358]">
              Private Academy Sessions
            </p>
          </div>
        </div>

        {loading ? (
          <p className="font-montserrat text-xs text-[#8f6e41]">Loading sessions...</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {sessions.map((s) => (
              <EventCard
                key={s._id}
                session={s}
                isRegistered={registeredSessionIds.has(s._id)}
                onRegisterSuccess={handleRegisterSuccess}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}