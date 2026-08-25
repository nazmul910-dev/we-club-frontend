"use client";

import { useState } from "react";
import ProgressBar from "@/components/accountability/ProgressBar";
import StatusDot from "@/components/accountability/statusDot";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import SectionHeader from "@/components/common/SectionHeader";
import SectionCard from "@/components/common/SectionCard";

/* -------------------------------------------------------------------------- */
/*  Mock data — replace with real data fetched from your backend               */
/* -------------------------------------------------------------------------- */

const mentors = [
  {
    name: "Adam Koubi",
    role: "Lead Mentor",
    initials: "AK",
  },
  {
    name: "Sofia Marchetti",
    role: "Co-Mentor",
    initials: "SM",
  },
];

const nextSession = {
  date: "Thursday, 6:00 PM CET",
  description: "Fearless group call with Adam Koubi",
};

const pillars = [
  {
    name: "Fearless Pillar",
    active: true,
    progress: 78,
    modules: [
      { label: "Module 1", status: "Complete", meta: "Watch time: 45m" },
      { label: "Module 2", status: "Available", meta: "Watch time: 32m" },
      { label: "Module 3", status: "Locked", meta: "" },
    ],
  },
  {
    name: "Limitless Pillar",
    active: false,
    progress: 0,
    modules: [],
  },
  {
    name: "Borderless Pillar",
    active: false,
    progress: 0,
    modules: [],
  },
];

const overallProgress = 35;

const sessionHistory = [
  {
    date: "Mar 28",
    duration: "60 min",
    description: "Discussed limiting psychology and next week's prospecting plan.",
  },
  {
    date: "Mar 21",
    duration: "60 min",
    description: "First call — set 90-day outcomes and defined the fear list.",
  },
];

export default function MyAccountabilityPage() {
  const [journalEntry, setJournalEntry] = useState("");

  return (
    <div className="min-h-screen bg-[#FBF9F4] font-[family-name:var(--font-body)] text-[#1C1A16]">
      <PageContainer variant="invictus" as="main">
        {/* Header */}
        <div className="mb-10">
          <PageHeader
            variant="invictus"
            eyebrow="My Accountability"
            title={
              <>
                Your challenge. Your mentors.
                <br />
                Your progress.
              </>
            }
            titleClassName="text-[28px] sm:text-[34px] leading-[1.25]"
          />
        </div>

        {/* Active challenge */}
        <SectionCard variant="light" className="mb-6">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9C9284]">
            Active Challenge
          </p>
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#B8923D]">
              Fearless
            </h2>
            <span className="whitespace-nowrap text-sm font-medium text-[#8A8375]">
              42% complete
            </span>
          </div>
          <ProgressBar value={42} className="mt-3" />
        </SectionCard>

        {/* Mentor pairing */}
        <SectionCard variant="invictus" className="mb-6">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A88A3F]">
            Your Mentorship Team
          </p>
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {mentors.map((mentor) => (
              <div
                key={mentor.name}
                className="flex items-center gap-3 rounded-lg border border-[#EFE6CE] bg-white py-3 min-h-25 px-5 md:px-10"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFE1BD] font-[family-name:var(--font-display)] text-sm font-semibold text-[#8A6E22]">
                  {mentor.initials}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9C9284]">
                    {mentor.role}
                  </p>
                  <p className="text-md font-semibold text-[#1C1A16]">
                    {mentor.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="w-full rounded-md bg-[#C6A34A] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#B8923D] cursor-pointer"
          >
            Book your accountability session — with both mentors
          </button>
        </SectionCard>

        {/* Next session */}
        <SectionCard variant="invictus" className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9C9284]">
              Next Session
            </p>
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1C1A16]">
              {nextSession.date}
            </p>
            <p className="text-sm text-[#8A8375]">{nextSession.description}</p>
          </div>
          <button
            type="button"
            className="shrink-0 cursor-pointer rounded-md bg-[#C6A34A] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#B8923D]"
          >
            Join
          </button>
        </SectionCard>

        {/* Member progress report */}
        <SectionHeader variant="invictus" title="Member Progress Report" />
        <SectionCard variant="invictus" className="mb-4">
          <div className="divide-y divide-[#F0EBDE]">
            {pillars.map((pillar) => (
              <div key={pillar.name} className="py-4 first:pt-0 last:pb-0">
                <div className="mb-3 flex items-center justify-between">
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
                      pillar.active ? "text-[#1C1A16]" : "text-[#C7C0B0]"
                    }`}
                  >
                    {pillar.name}
                  </p>
                  {pillar.active && (
                    <span className="text-sm font-medium text-[#8A8375]">
                      {pillar.progress}%
                    </span>
                  )}
                </div>

                {pillar.active ? (
                  <>
                    <ul className="space-y-2">
                      {pillar.modules.map((mod) => (
                        <li
                          key={mod.label}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="flex items-center gap-2 text-[#4A4539]">
                            <StatusDot status={mod.status} />
                            {mod.label} — {mod.status}
                          </span>
                          {mod.meta && (
                            <span className="text-xs text-[#B0A996]">
                              {mod.meta}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <ProgressBar value={pillar.progress} className="mt-4" />
                  </>
                ) : (
                  <p className="text-sm text-[#C7C0B0]">
                    Unlocks after Fearless is complete
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-[#F0EBDE] pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9C9284]">
              Overall Success Rate
            </p>
            <span className="text-sm font-medium text-[#8A8375]">
              {overallProgress}%
            </span>
          </div>
          <ProgressBar value={overallProgress} className="mt-2" />
        </SectionCard>

        <button
          type="button"
          className="mb-10 w-full rounded-md border border-[#DECDB0] cursor-pointer bg-[#FAF6EE] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#A88A3F] transition-colors hover:bg-[#FBF3DC]"
        >
          Download my progress report
        </button>

        {/* Session history */}
        <SectionHeader variant="invictus" title="Session History" />
        <section className="mb-10 space-y-3">
          {sessionHistory.map((session) => (
            <div
              key={session.date}
              className="flex items-center justify-between gap-4 rounded-xl border border-[#E9E2D2] bg-white p-5"
            >
              <div>
                <p className="mb-1 text-sm font-semibold text-[#1C1A16]">
                  {session.date}{" "}
                  <span className="font-normal text-[#B0A996]">
                    · {session.duration}
                  </span>
                </p>
                <p className="text-sm text-[#8A8375]">{session.description}</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-md border border-[#E9E2D2] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#8A8375] cursor-pointer transition-colors hover:border-[#DDBB6E] hover:text-[#A88A3F]"
              >
                Watch session recap
              </button>
            </div>
          ))}
        </section>

        {/* Progress journal */}
        <SectionHeader
          variant="invictus"
          title="Progress Journal"
          description="Private to you and your mentors."
        />
        <SectionCard variant="invictus" className="p-5">
          <textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="What did you commit to this week? What did you actually do?"
            rows={4}
            className="w-full resize-none rounded-md border border-[#E9E2D2] bg-[#FDFCF9] p-3 text-sm text-[#1C1A16] outline-none placeholder:text-[#B0A996] focus:border-[#C6A34A]"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              disabled={!journalEntry.trim()}
              className="rounded-md bg-[#C6A34A] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white cursor-pointer transition-colors hover:bg-[#B8923D] disabled:cursor-not-allowed disabled:bg-[#E9E2D2] disabled:text-[#B0A996]"
            >
              Save entry
            </button>
          </div>
        </SectionCard>
      </PageContainer>
    </div>
  );
}
