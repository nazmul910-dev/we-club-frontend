"use client";

import { CalendarDays, Clock3, ArrowRight } from "lucide-react";

const events = [
  {
    date: "THU 3 JULY",
    title: "Fearless Group Call w/ Adam Koubi",
    time: "6:00 PM CET",
    type: "LIVE SESSION",
    action: "JOIN",
    footer: "Starts in 02:14:33",
  },
  {
    date: "FRI 4 JULY",
    title: "1:1 W/ Sofia Marchetti",
    time: "11:30 AM CET",
    type: "1:1 SESSION",
    action: "REGISTER",
    footer: "Tomorrow",
  },
  {
    date: "MON 7 JULY",
    title: "Luxury Pricing Workshop",
    time: "5:00 PM CET",
    type: "WORKSHOP",
    action: "JOIN",
    footer: "In 4 days",
  },
];

export default function InvictusEventsSection() {
  return (
    <section className="space-y-5">
      <div>
        <p className="font-montserrat text-[10px] tracking-[0.35em] text-[#9E7B28] uppercase">
          THIS WEEK
        </p>

        <h2 className="font-playfair text-3xl text-[#1C1814]">Events</h2>
      </div>

      <div className="rounded-2xl border border-[#DECDB0] bg-gradient-to-br from-[#FAF6EE] to-white p-6 shadow-sm">
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.title}
              className="group relative overflow-hidden rounded-2xl border border-[#E8DDCA] bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#C9A84C] hover:shadow-[0_15px_40px_rgba(201,168,76,0.15)]"
            >
              <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-[#FAF4E6] transition group-hover:bg-[#F5E8C8]" />

              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#C9A84C] px-3 py-1 font-montserrat text-[9px] font-bold tracking-widest text-black">
                    {event.date}
                  </span>

                  <span className="rounded-md border border-[#DECDB0] bg-[#FAF6EE] px-2 py-1 font-montserrat text-[9px] font-bold tracking-wider text-[#9E7B28]">
                    {event.type}
                  </span>
                </div>

                <div>
                  <h3 className="font-playfair text-xl leading-snug text-[#241D15] group-hover:text-[#9E7B28] transition">
                    {event.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-[#8f6e41]">
                    <Clock3 size={13} />

                    <p className="font-montserrat text-xs">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#EFE6D6] pt-4">
                  <p className="font-montserrat text-[13px] text-gray-600">
                    {event.footer}
                  </p>

                  <button className="flex cursor-pointer items-center gap-2 rounded-full bg-[#9E7B28] px-4 py-2 font-montserrat text-[10px] font-bold tracking-widest text-white transition-all duration-300 hover:bg-[#7C5F1E] hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
                    {event.action}

                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
