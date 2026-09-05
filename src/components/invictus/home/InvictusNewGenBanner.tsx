"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Crown,
  Globe,
  Infinity,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { sessionScheduleApi } from "@/lib/features/invictus/sessionSchedule/sessionScheduleApi";

function WaitingListButton() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const [sessions, attendances] = await Promise.all([
          sessionScheduleApi.getUpcoming(1),
          sessionScheduleApi.getMyAttendances(),
        ]);
        const session = sessions[0];

        setSessionId(session?._id ?? null);
        setIsRegistered(
          Boolean(
            session &&
            attendances.some(
              (attendance) =>
                attendance.session?._id === session._id &&
                attendance.status !== "cancelled" &&
                attendance.status !== "no_show",
            ),
          ),
        );
      } catch {
        setSessionId(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const handleJoin = async () => {
    if (!sessionId || isRegistered) return;

    try {
      setRegistering(true);
      await sessionScheduleApi.registerForSession(sessionId);
      setIsRegistered(true);
      toast.success("Successfully joined the waiting list!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message || "Could not join the waiting list",
      );
    } finally {
      setRegistering(false);
    }
  };

  const canJoin = Boolean(sessionId) && !isRegistered;

  return (
    <button
      type="button"
      onClick={handleJoin}
      disabled={loading || registering || !canJoin}
      className={`
        flex items-center justify-center gap-2
        w-full sm:w-auto rounded-md px-8 xl:px-3 3xl:px-8 py-3
        text-xs font-bold tracking-widest transition-all duration-300
        ${
          canJoin
            ? "cursor-pointer bg-[#C9A84C] text-black hover:-translate-y-1 hover:bg-[#B89435] hover:shadow-[0_10px_30px_rgba(201,168,76,0.35)] active:scale-95"
            : "cursor-not-allowed border border-[#5A4720] bg-[#171717] text-[#8F8A80]"
        }
      `}
    >
      {loading || registering ? (
        <Loader2 size={12} className="animate-spin" />
      ) : isRegistered ? (
        <>
          <Check size={12} className="text-[#C9A84C]" />REGISTERED
        </>
      ) : canJoin ? (
        <>
          JOIN WAITING LIST
          <ArrowRight size={12} />
        </>
      ) : (
        "COMING SOON"
      )}
    </button>
  );
}

export default function InvictusNewGenBanner() {
  return (
    <section className="space-y-4">
      <div>
        <p className="font-montserrat text-[10px] tracking-[0.3em] text-[#9E7B28] uppercase">
          RISING
        </p>

        <h2 className="font-playfair text-2xl md:text-3xl text-[#1C1814]">
          The NewGen of Business Wo/Men
        </h2>
      </div>

      <div
        className="
        rounded-2xl
        bg-[#090909]
        p-6
        sm:p-8
        md:p-12
        text-white
        space-y-8
        "
      >
        {/* Top Heading */}

        <div className="text-center">
          <p
            className="
          font-montserrat
          text-[10px]
          tracking-[0.4em]
          text-[#C9A84C]
          "
          >
            THE MOMENT
          </p>

          <h3
            className="
            font-playfair
            italic
            text-3xl
            sm:text-4xl
            mt-3
            "
          >
            If not now, when?
          </h3>

          <p
            className="
          font-montserrat
          text-[10px]
          sm:text-xs
          tracking-[0.4em]
          mt-3
          text-gray-300
          "
          >
            JOIN THE WAITING LIST
          </p>
        </div>

        <div className="border-t border-[#5A4720]" />

        {/* Bottom Content */}

        <div
          className="
          flex
          flex-col
          xl:flex-row
          items-center
          justify-between
          gap-8
          "
        >
          <h4
            className="
            font-playfair
            text-2xl
            sm:text-3xl
            text-center
            xl:text-left
            "
          >
            Ready to become
            <br />
            the
            <span className="italic text-[#C9A84C]"> 3.0 version</span>
            <br />
            of yourself?
          </h4>

          {/* Right Side */}

          <div
            className="
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-6
            w-full
            lg:w-auto
            "
          >
            <div className="flex items-center justify-between gap-4 w-full sm:w-auto">
              <div
                className="
              group
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
              "
              >
                <Crown
                  className="
                mx-auto
                text-[#C9A84C]
                transition-transform
                duration-300
                group-hover:scale-110
                "
                />

                <p className="text-[10px] tracking-widest mt-1">FEARLESS</p>
              </div>

              <div
                className="
              group
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
              "
              >
                <Infinity
                  className="
                mx-auto
                text-[#C9A84C]
                transition-transform
                duration-300
                group-hover:scale-110
                "
                />

                <p className="text-[10px] tracking-widest mt-1">LIMITLESS</p>
              </div>

              <div
                className="
              group
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
              "
              >
                <Globe
                  className="
                mx-auto
                text-[#C9A84C]
                transition-transform
                duration-300
                group-hover:scale-110
                "
                />

                <p className="text-[10px] tracking-widest mt-1">BORDERLESS</p>
              </div>
            </div>

            <WaitingListButton />
          </div>
        </div>
      </div>
    </section>
  );
}
