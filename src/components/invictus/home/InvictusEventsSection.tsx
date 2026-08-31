"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock3, ArrowRight, Loader2 } from "lucide-react";
import { sessionScheduleApi } from "@/lib/features/invictus/sessionSchedule/sessionScheduleApi";
import type { ISessionScheduleItem } from "@/lib/features/invictus/sessionSchedule/sessionScheduleTypes";
import { useSessionCountdown } from "@/hooks/useSessionCountdown";

const SESSION_TYPE_LABEL: Record<string, string> = {
  academy_live: "LIVE SESSION",
  mentorship_group: "1:1 SESSION",
  retreat_prep: "WORKSHOP",
  community_call: "LIVE SESSION",
  other: "SESSION",
};

function EventCard({ session }: { session: ISessionScheduleItem }) {
  const { canJoin, label } = useSessionCountdown(session.startTime);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

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
      window.open(session.meetingUrl, "_blank");
      return;
    }
    try {
      setRegistering(true);
      await sessionScheduleApi.registerForSession(session._id);
      setRegistered(true);
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
            disabled={registering || (registered && !canJoin)}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-[#9E7B28] px-4 py-2 font-montserrat text-[10px] font-bold tracking-widest text-white transition-all duration-300 hover:bg-[#7C5F1E] hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-60"
          >
            {registering ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <>
                {canJoin ? "JOIN" : registered ? "REGISTERED" : "REGISTER"}
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionScheduleApi
      .getUpcoming(3)
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

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
              <EventCard key={s._id} session={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}