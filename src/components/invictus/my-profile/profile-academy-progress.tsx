"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  PlayCircle,
  CheckCircle2,
  Award,
  ListChecks,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Circle,
  BookOpen,
} from "lucide-react";
import type { IVideoProgress } from "@/lib/features/invictus/videoProgress/videoProgressTypes";
import type { IModuleProgress } from "@/lib/features/invictus/academy/progress/progressTypes";
import type { IQuizCertificate } from "@/lib/features/invictus/academy/cerfificate/certificateTypes";
import type { ChallengePillar } from "@/lib/features/invictus/academy/pillar/pillarTypes";
import ProfileCertificateModal from "./profile-certificate-modal";

interface Props {
  videoHistory: IVideoProgress[];
  moduleProgressList: IModuleProgress[];
  certificates: IQuizCertificate[];
  pillars: ChallengePillar[];
  userName?: string;
}

const formatDuration = (seconds?: number) => {
  if (!seconds || seconds <= 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs > 0 ? `${secs}s` : ""}`;
};

export default function ProfileAcademyProgress({
  videoHistory,
  moduleProgressList,
  certificates,
  pillars,
  userName,
}: Props) {
  const [activeTab, setActiveTab] = useState<"videos" | "quizzes" | "certificates">("videos");
  const [selectedCertificate, setSelectedCertificate] = useState<IQuizCertificate | null>(null);

  // Group watched videos by pillar
  const pillarVideoMap = useMemo(() => {
    const map: Record<
      string,
      {
        pillarName: string;
        pillarSlug: string;
        videos: IVideoProgress[];
      }
    > = {};

    videoHistory.forEach((item) => {
      const pSlug = item.module?.pillar?.slug || "general";
      const pName = item.module?.pillar?.name || "General Track";

      if (!map[pSlug]) {
        map[pSlug] = {
          pillarName: pName,
          pillarSlug: pSlug,
          videos: [],
        };
      }
      map[pSlug].videos.push(item);
    });

    return map;
  }, [videoHistory]);

  // Overall Statistics
  const totalVideosWatched = videoHistory.length;
  const completedVideos = videoHistory.filter((v) => v.isCompleted).length;
  const totalWatchSeconds = videoHistory.reduce((sum, v) => sum + (v.totalWatchedSeconds || 0), 0);
  const quizzesPassed = moduleProgressList.filter((m) => m.quizSummary?.passed).length;
  const totalCertificates = certificates.filter((c) => c.status === "issued").length;

  return (
    <div className="space-y-8">
      {/* Top Learning Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[#E8E0D2] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E9D2] text-[#B08A3E]">
            <PlayCircle size={20} />
          </div>
          <p className="mt-3 text-xs uppercase tracking-wider text-[#8A8175]">Videos Watched</p>
          <h4 className="mt-1 text-2xl font-bold text-[#1C1A17]">{totalVideosWatched}</h4>
          <p className="mt-1 text-[11px] text-[#8A8175]">{completedVideos} fully completed</p>
        </div>

        <div className="rounded-2xl border border-[#E8E0D2] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E9D2] text-[#B08A3E]">
            <Clock size={20} />
          </div>
          <p className="mt-3 text-xs uppercase tracking-wider text-[#8A8175]">Total Watch Time</p>
          <h4 className="mt-1 text-2xl font-bold text-[#1C1A17]">{formatDuration(totalWatchSeconds)}</h4>
          <p className="mt-1 text-[11px] text-[#8A8175]">across all pillars</p>
        </div>

        <div className="rounded-2xl border border-[#E8E0D2] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E9D2] text-[#B08A3E]">
            <ListChecks size={20} />
          </div>
          <p className="mt-3 text-xs uppercase tracking-wider text-[#8A8175]">Quizzes Passed</p>
          <h4 className="mt-1 text-2xl font-bold text-[#1C1A17]">{quizzesPassed}</h4>
          <p className="mt-1 text-[11px] text-[#8A8175]">score ≥ 70% required</p>
        </div>

        <div className="rounded-2xl border border-[#E8E0D2] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E9D2] text-[#B08A3E]">
            <Award size={20} />
          </div>
          <p className="mt-3 text-xs uppercase tracking-wider text-[#8A8175]">Certificates</p>
          <h4 className="mt-1 text-2xl font-bold text-[#1C1A17]">{totalCertificates}</h4>
          <p className="mt-1 text-[11px] text-[#8A8175]">earned and verified</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E0D2] pb-2">
        <button
          onClick={() => setActiveTab("videos")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-150 ${
            activeTab === "videos"
              ? "bg-[#B08A3E] text-white shadow-sm"
              : "text-[#8A8175] hover:bg-[#F3E9D2]/50 hover:text-[#1C1A17]"
          }`}
        >
          <PlayCircle size={16} />
          <span>Watched Videos by Pillar ({videoHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("quizzes")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-150 ${
            activeTab === "quizzes"
              ? "bg-[#B08A3E] text-white shadow-sm"
              : "text-[#8A8175] hover:bg-[#F3E9D2]/50 hover:text-[#1C1A17]"
          }`}
        >
          <ListChecks size={16} />
          <span>Quiz Assessment Results ({moduleProgressList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("certificates")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-150 ${
            activeTab === "certificates"
              ? "bg-[#B08A3E] text-white shadow-sm"
              : "text-[#8A8175] hover:bg-[#F3E9D2]/50 hover:text-[#1C1A17]"
          }`}
        >
          <Award size={16} />
          <span>Earned Certificates ({certificates.length})</span>
        </button>
      </div>

      {/* Tab 1: Watched Videos By Pillar */}
      {activeTab === "videos" && (
        <div className="space-y-6">
          {Object.keys(pillarVideoMap).length === 0 ? (
            <div className="rounded-2xl border border-[#E8E0D2] bg-white p-12 text-center">
              <PlayCircle size={40} className="mx-auto text-[#B08A3E]/60" />
              <h4 className="mt-4 text-lg font-semibold text-[#1C1A17]">No Video Watch History Yet</h4>
              <p className="mt-1 text-sm text-[#8A8175]">
                Start watching lessons in the Invictus Challenge to track your video progress here.
              </p>
              <Link
                href="/invictus/invictus-challenge"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#B08A3E] px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#997734]"
              >
                Go to Invictus Challenge
                <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            Object.values(pillarVideoMap).map((pillarGroup) => (
              <div
                key={pillarGroup.pillarSlug}
                className="overflow-hidden rounded-3xl border border-[#E8E0D2] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E0D2] pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#B08A3E]">
                      PILLAR TRACK
                    </span>
                    <h3 className="mt-0.5 text-xl font-bold text-[#1C1A17]">{pillarGroup.pillarName}</h3>
                  </div>

                  <Link
                    href={`/invictus/invictus-challenge/${pillarGroup.pillarSlug}`}
                    className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#B08A3E] transition hover:underline"
                  >
                    <span>Open Track</span>
                    <ExternalLink size={14} />
                  </Link>
                </div>

                <div className="mt-4 divide-y divide-[#F3E9D2]">
                  {pillarGroup.videos.map((item) => {
                    const videoTitle = item.video?.title || "Lesson Video";
                    const duration = item.video?.durationSeconds || item.durationSecondsSnapshot || 0;
                    const isCompleted = item.isCompleted;
                    const percent = Math.min(100, Math.round(item.watchPercent || 0));

                    return (
                      <div
                        key={item._id}
                        className="flex flex-wrap items-center justify-between gap-4 py-3.5 transition hover:bg-[#FAF8F4] px-2 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                              isCompleted
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-[#F3E9D2] text-[#B08A3E]"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={18} /> : <PlayCircle size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1C1A17]">{videoTitle}</p>
                            <p className="text-xs text-[#8A8175]">
                              {item.module?.title || "Module"} · {formatDuration(duration)} total
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="w-28 text-right sm:w-36">
                            <div className="flex items-center justify-between text-xs font-medium text-[#8A8175]">
                              <span>Watched</span>
                              <span className={isCompleted ? "font-bold text-emerald-700" : "text-[#1C1A17]"}>
                                {percent}%
                              </span>
                            </div>
                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#F3E9D2]">
                              <div
                                style={{ width: `${percent}%` }}
                                className={`h-full ${isCompleted ? "bg-emerald-500" : "bg-[#B08A3E]"}`}
                              />
                            </div>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              isCompleted
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {isCompleted ? "Completed" : "In Progress"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Quiz Assessment Results */}
      {activeTab === "quizzes" && (
        <div className="space-y-4">
          {moduleProgressList.length === 0 ? (
            <div className="rounded-2xl border border-[#E8E0D2] bg-white p-12 text-center">
              <ListChecks size={40} className="mx-auto text-[#B08A3E]/60" />
              <h4 className="mt-4 text-lg font-semibold text-[#1C1A17]">No Quiz Assessments Taken Yet</h4>
              <p className="mt-1 text-sm text-[#8A8175]">
                Complete module videos and resources to unlock and take module assessments.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-[#E8E0D2] bg-white p-6 shadow-sm">
              <h3 className="border-b border-[#E8E0D2] pb-4 text-lg font-bold text-[#1C1A17]">
                Module Assessment History
              </h3>

              <div className="mt-4 divide-y divide-[#F3E9D2]">
                {moduleProgressList.map((progress) => {
                  const quiz = progress.quizSummary;
                  const moduleTitle = progress.module?.title || "Course Module";
                  const pillarName = progress.module?.pillar?.name || "Invictus Pillar";
                  const hasPassed = quiz?.passed;
                  const bestScore = quiz?.bestScore ?? 0;
                  const attemptsUsed = quiz?.attemptsUsed ?? 0;

                  return (
                    <div
                      key={progress._id}
                      className="flex flex-wrap items-center justify-between gap-4 py-4 px-2 hover:bg-[#FAF8F4] rounded-xl transition"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                            hasPassed
                              ? "bg-emerald-100 text-emerald-700"
                              : attemptsUsed > 0
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {hasPassed ? (
                            <CheckCircle2 size={22} />
                          ) : attemptsUsed > 0 ? (
                            <FileCheck size={22} />
                          ) : (
                            <BookOpen size={22} />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#1C1A17]">{moduleTitle}</p>
                          <p className="text-xs text-[#8A8175]">
                            {pillarName} · Attempts Used: {attemptsUsed} / 2
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-[#8A8175]">Best Score</p>
                          <p className="font-serif text-base font-bold text-[#1C1A17]">{bestScore}%</p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            hasPassed
                              ? "bg-emerald-100 text-emerald-800"
                              : attemptsUsed > 0
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {hasPassed
                            ? "Passed"
                            : attemptsUsed > 0
                            ? "Failed / Retry"
                            : progress.quizUnlocked
                            ? "Unlocked"
                            : "Locked"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Earned Certificates */}
      {activeTab === "certificates" && (
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <div className="rounded-2xl border border-[#E8E0D2] bg-white p-12 text-center">
              <Award size={40} className="mx-auto text-[#B08A3E]/60" />
              <h4 className="mt-4 text-lg font-semibold text-[#1C1A17]">No Certificates Earned Yet</h4>
              <p className="mt-1 text-sm text-[#8A8175]">
                Score 70% or higher on any module assessment to claim your official Invictus Certificate.
              </p>
              <Link
                href="/invictus/invictus-challenge"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#B08A3E] px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#997734]"
              >
                Go to Challenges
                <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {certificates.map((cert) => {
                const isRevoked = cert.status === "revoked";

                return (
                  <div
                    key={cert._id}
                    className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E8E0D2] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#B08A3E]/50 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3E9D2] text-[#B08A3E]">
                        <Award size={24} />
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isRevoked
                            ? "bg-red-100 text-red-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isRevoked ? "Revoked" : "Official / Issued"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B08A3E]">
                        {cert.pillar?.name || "INVICTUS CHALLENGE"}
                      </span>
                      <h4 className="mt-1 text-lg font-serif font-bold text-[#1C1A17]">
                        {cert.module?.title || "Course Certificate"}
                      </h4>
                      <p className="mt-2 font-mono text-xs text-[#8A8175]">
                        Certificate ID: {cert.certificateNumber}
                      </p>
                      <p className="mt-1 text-xs text-[#8A8175]">
                        Score: <span className="font-semibold text-[#1C1A17]">{cert.score}%</span> · Issued:{" "}
                        {new Date(cert.issuedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-[#E8E0D2] pt-4">
                      <button
                        onClick={() => setSelectedCertificate(cert)}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#B08A3E] py-2.5 text-xs font-semibold text-white shadow transition hover:bg-[#997734]"
                      >
                        <Award size={15} />
                        View & Print Certificate
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      <ProfileCertificateModal
        open={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
        certificate={selectedCertificate}
        userName={userName}
      />
    </div>
  );
}
