"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ExternalLink, Calendar, Video, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/api/api";
import { sessionScheduleApi } from "@/lib/features/invictus/sessionSchedule/sessionScheduleApi";
import type { ISessionScheduleItem } from "@/lib/features/invictus/sessionSchedule/sessionScheduleTypes";

import adam from "@/assets/Invictus/Home/adam.jpg";
import tour from "@/assets/Invictus/Navbar/tour.jpg";
import Link from "next/link";

function formatSessionTime(startTime: string, timezone?: string) {
  const d = new Date(startTime);
  if (isNaN(d.getTime())) return "TBD";
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone || undefined,
  });
  return `${weekday} · ${time}`;
}

interface LatestRetreatInfo {
  title: string;
  dateLabel: string;
  coverImage?: string;
}

export default function InvictusRightSidebar() {
  const router = useRouter();
  const [switchModal, setSwitchModal] = useState(false);
  const [sessions, setSessions] = useState<ISessionScheduleItem[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [latestRetreat, setLatestRetreat] = useState<LatestRetreatInfo | null>(null);
  const [imageError, setImageError] = useState(false);


  useEffect(() => {
    sessionScheduleApi
      .getUpcoming(3)
      .then((data) => setSessions(data || []))
      .catch(() => setSessions([]))
      .finally(() => setLoadingSessions(false));

    // Fetch latest retreat location
    api
      .get("/invictus/retreat-locations", { params: { limit: 1 } })
      .then((locRes) => {
        const loc = locRes?.data?.data?.data?.[0] ?? locRes?.data?.data?.[0];
        if (!loc) return;

        // Try to get the latest batch for this location
        api
          .get("/invictus/retreat-batches", {
            params: { locationId: loc._id, limit: 1 },
          })
          .then((batchRes) => {
            const batch =
              batchRes?.data?.data?.data?.[0] ?? batchRes?.data?.data?.[0];

            let dateLabel = "Exclusive Retreat";
            if (batch?.startDate) {
              const start = new Date(batch.startDate);
              if (!isNaN(start.getTime())) {
                const month = start.toLocaleDateString("en-US", {
                  month: "long",
                });
                const year = start.getFullYear();
                dateLabel = `${month} ${year} · Exclusive`;
              }
            } else if (loc.city && loc.country) {
              dateLabel = `${loc.city}, ${loc.country} · Exclusive`;
            } else if (loc.tagline) {
              dateLabel = `${loc.tagline} · Exclusive`;
            }

            setLatestRetreat({
              title: loc.title || "Leadership Retreat",
              dateLabel,
              coverImage: loc.coverImage || undefined,
            });
          })
          .catch(() => {
            // No batch — still show location info
            setLatestRetreat({
              title: loc.title || "Leadership Retreat",
              dateLabel: loc.city
                ? `${loc.city}, ${loc.country} · Exclusive`
                : "Exclusive Retreat",
              coverImage: loc.coverImage || undefined,
            });
          });
      })
      .catch(() => {
        // leave latestRetreat null → fallback image shows
      });
  }, []);

  return (
    <>
      <aside className="hidden xl:flex fixed right-0 top-16 z-30 h-[calc(100vh-4rem)] w-80 flex-col border-l border-[#EAE4D7] bg-[#FAF8F5] p-5 overflow-y-auto scrollbar-hide space-y-6">
        {/* Widget 1: World Élite Command Center Switcher Card */}
        <div className="rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] p-5 text-center shadow-xs space-y-3.5">
          <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-full border-2 border-[#DECDB0] bg-white shadow-2xs">
            <span className="font-playfair text-lg font-bold italic text-[#9E7B28]">
              WE
            </span>
          </div>

          <div className="space-y-1 px-1">
            <p className="font-montserrat text-[11px] text-[#5C5348] leading-relaxed">
              Go now to the{" "}
              <span className="font-bold text-[#1C1814]">
                WORLD ÉLITE — COMMAND CENTER
              </span>{" "}
              to find and refer properties.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSwitchModal(true)}
            className="inline-flex items-center justify-center gap-1.5 font-montserrat text-xs font-bold uppercase tracking-wider text-[#9E7B28] hover:text-[#7C5F1E] transition cursor-pointer"
          >
            <span>ENTER</span>
            <ExternalLink size={13} />
          </button>
        </div>

        {/* Widget 2: Upcoming General Sessions */}
        <Link
          href="/invictus/associates"
          className="group rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] p-4 shadow-xs space-y-3 cursor-pointer transition-all hover:border-[#C9A84C] hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-montserrat text-[10px] font-bold tracking-[0.2em] text-[#1C1814] uppercase group-hover:text-[#9E7B28] transition-colors">
              UPCOMING GENERAL SESSIONS
            </h4>
            <Calendar size={13} className="text-[#9E7B28]" />
          </div>

          <div className="space-y-2">
            {loadingSessions ? (
              <p className="font-montserrat text-[11px] text-[#7A7062] py-2">
                Loading sessions...
              </p>
            ) : sessions.length === 0 ? (
              <div className="flex items-start gap-3 rounded-xl border border-[#EAE2D2] bg-white p-3 shadow-2xs">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#FAF4E6] text-[#9E7B28]">
                  <Sparkles size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-montserrat text-xs font-bold text-[#1C1814] truncate">
                    Coming Soon
                  </p>
                  <p className="font-montserrat text-[10px] text-[#7A7062]">
                    New sessions will be announced soon
                  </p>
                </div>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session._id}
                  className="flex items-start gap-3 rounded-xl border border-[#EAE2D2] bg-white p-3 shadow-2xs transition-all group-hover:border-[#DECDB0]"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#FAF4E6] text-[#9E7B28]">
                    {session.sessionType === "mentorship_group" ? (
                      <Video size={14} />
                    ) : (
                      <Calendar size={14} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-montserrat text-xs font-bold text-[#1C1814] truncate">
                      {session.title}
                    </p>
                    <p className="font-montserrat text-[10px] text-[#7A7062]">
                      {formatSessionTime(session.startTime, session.timezone)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Link>

        {/* Widget 3: Your Mentor */}
        <div className="rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] p-4 text-center shadow-xs space-y-3">
          <h4 className="font-montserrat text-[10px] font-bold tracking-[0.2em] text-[#8C8273] uppercase">
            YOUR MENTOR
          </h4>

          <div className="flex flex-col items-center space-y-1.5">
            <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-[#9E7B28] shadow-xs">
              <Image
                src={adam}
                alt="Mentor Adam Koubi"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="font-playfair text-sm font-bold text-[#1C1814]">
                Adam Koubi
              </p>
              <p className="font-montserrat text-[8px] font-bold tracking-wider text-[#9E7B28] uppercase">
                LEAD MENTOR
              </p>
            </div>
          </div>

          <a
            href="mailto:adam@worldelite.com,sofia@worldelite.com?subject=Mentorship%20Request"
            className="block w-full rounded-xl border border-[#9E7B28] bg-transparent py-1.5 font-montserrat text-[10px] font-bold tracking-wider text-[#9E7B28] hover:bg-[#9E7B28] hover:text-white transition cursor-pointer text-center"
          >
            CONTACT MY MENTORS
          </a>
        </div>

        {/* Widget 4: Next Retreat Preview */}
        <div className="rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-montserrat text-[10px] font-bold tracking-[0.2em] text-[#8C8273] uppercase">
              NEXT RETREAT
            </h4>
            <Sparkles size={13} className="text-[#9E7B28]" />
          </div>

          <div
            onClick={() => router.push("/invictus/retreats")}
            className="group relative overflow-hidden rounded-xl border border-[#DECDB0] bg-black/90 aspect-video flex items-end p-3 cursor-pointer"
          >
            {latestRetreat?.coverImage && !imageError ? (
              <img
                src={latestRetreat.coverImage}
                alt={latestRetreat.title || "Retreat"}
                onError={() => setImageError(true)}
                className="absolute inset-0 h-full w-full object-cover opacity-75 group-hover:scale-105 transition duration-500"
              />
            ) : (
              <Image
                src={tour}
                alt={latestRetreat?.title || "Marrakech Retreat"}
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover opacity-75 group-hover:scale-105 transition duration-500"
              />
            )}
            <div className="relative z-10 text-white">
              <p className="font-playfair text-xs font-bold line-clamp-1">
                {latestRetreat?.title || "Leadership Retreat"}
              </p>
              <p className="font-montserrat text-[9px] text-white/80 line-clamp-1">
                {latestRetreat?.dateLabel || "October 2026 · Exclusive"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Switch Platform Confirmation Modal */}
      <Dialog open={switchModal} onOpenChange={setSwitchModal}>
        <DialogContent className="max-w-md rounded-2xl border border-[#DECDB0] bg-[#FAF8F5] text-[#1C1814] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl font-bold text-[#1C1814]">
              Switch to Command Center
            </DialogTitle>
            <DialogDescription className="text-[#6B6358] font-lato text-sm">
              Are you sure you want to switch to the WORLD ÉLITE — Command
              Center platform?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-5 gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setSwitchModal(false)}
              className="h-10 cursor-pointer rounded-xl border border-[#D9CEBA] bg-white px-5 font-montserrat text-xs font-semibold text-[#4A4237] transition hover:bg-[#F5EEDB]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                setSwitchModal(false);
                router.push("/dashboard");
              }}
              className="h-10 cursor-pointer rounded-xl bg-[#947124] px-5 font-montserrat text-xs font-semibold text-white transition hover:bg-[#7C5F1E]"
            >
              Yes, Switch
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
