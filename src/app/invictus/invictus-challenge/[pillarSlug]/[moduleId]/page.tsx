"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FileText, ListChecks, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { setSelectedCourse, clearSelectedCourse } from "@/lib/features/invictus/academy/course/courseSlice";
import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";
import { fetchVideos } from "@/lib/features/invictus/academy/video-module/videoSlice";
import { fetchMyModuleVideoProgress } from "@/lib/features/invictus/videoProgress/videoProgressSlice";
import { fetchMyModuleProgress, fetchMyAllProgress } from "@/lib/features/invictus/academy/progress/progressSlice";
import { fetchResources } from "@/lib/features/invictus/academy/resource/resourceSlice";
import { fetchMyCertificates } from "@/lib/features/invictus/academy/cerfificate/certificateSlice";
import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";
import type { IModuleVideo } from "@/lib/features/invictus/academy/video-module/videoTypes";
import type { IModuleVideoWithProgress } from "@/lib/features/invictus/videoProgress/videoProgressTypes";
import ChallengeVideoPlayer from "@/components/invictus/challenge/Challengevideoplayer";
import ChallengeQuizPanel from "@/components/invictus/challenge/ChallengeQuizPanel";
import ChallengeVideoList from "@/components/invictus/challenge/ChallengVideoList";

export default function ModuleChallengePage() {
  const dispatch = useAppDispatch();
  const params = useParams<{ pillarSlug: string; moduleId: string }>();
  const { pillarSlug, moduleId } = params;

  const { selectedCourse } = useAppSelector((state) => state.course);
  const { videos, loading: videosLoading } = useAppSelector(
    (state) => state.video,
  );
  const moduleVideoProgress = useAppSelector(
    (state) => state.videoProgress.byModuleId[moduleId],
  );
  const { myProgress } = useAppSelector((state) => state.progress);
  const { resources } = useAppSelector((state) => state.resource);
  const { myCertificates } = useAppSelector((state) => state.certificate);
  // Read selectedPillar WITHOUT dispatching fetchPillarBySlug (that resets it to null)
  const selectedPillar = useAppSelector((state) => state.pillar.selectedPillar);

  const [courseLoading, setCourseLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<IModuleVideo | null>(null);
  const [pillarModules, setPillarModules] = useState<ICourseModule[]>([]);

  /**
   * True when the user has passed the quiz for EVERY published module in this pillar.
   * This is the gate that enables the "Claim Certificate" button.
   */
  const allModulesPassed = useMemo(() => {
    if (pillarModules.length === 0) return false;
    return pillarModules.every((mod) => {
      const modId = typeof mod._id === "string" ? mod._id : String(mod._id);
      const progress = myProgress.find(
        (item) =>
          (typeof item?.module === "string" ? item.module : item?.module?._id) ===
          modId,
      );
      return progress?.quizSummary?.passed === true;
    });
  }, [pillarModules, myProgress]);

  useEffect(() => {
    dispatch(clearSelectedCourse());
    setSelectedVideo(null);
    setCourseLoading(true);

    const loadCourse = async () => {
      try {
        const res = await courseApi.getCourseById(moduleId);
        dispatch(setSelectedCourse(res.data));

        const pId =
          typeof res.data?.pillar === "string"
            ? res.data.pillar
            : res.data?.pillar?._id;

        if (pId) {
          try {
            const pillarRes = await courseApi.getCoursesByPillar(pId);
            const rawModules = Array.isArray(pillarRes?.data?.modules)
              ? pillarRes.data.modules
              : [];
            setPillarModules(
              rawModules.filter(
                (m: ICourseModule) => m.status === "published",
              ),
            );
          } catch (pErr) {
            // eslint-disable-next-line no-console
            console.error("Failed to load pillar modules", pErr);
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load course module", moduleId, err);
      } finally {
        setCourseLoading(false);
      }
    };

    loadCourse();
    dispatch(fetchVideos({ moduleId, includeArchived: false }));
    dispatch(fetchMyModuleVideoProgress(moduleId));
    dispatch(fetchMyModuleProgress(moduleId));
    dispatch(fetchMyAllProgress());
    dispatch(fetchResources({ moduleId, includeArchived: false }));
    dispatch(fetchMyCertificates());

    return () => {
      dispatch(clearSelectedCourse());
    };
  }, [dispatch, moduleId]);

  const moduleVideos = useMemo(
    () =>
      videos
        .filter((video) => {
          const videoModId =
            typeof video.module === "string"
              ? video.module
              : video.module?._id;
          return videoModId === moduleId && video.status === "published";
        })
        .sort((a, b) => a.order - b.order),
    [videos, moduleId],
  );

  useEffect(() => {
    if (moduleVideos.length > 0) {
      const isSelectedInCurrentModule =
        selectedVideo && moduleVideos.some((v) => v._id === selectedVideo._id);
      if (!isSelectedInCurrentModule) {
        setSelectedVideo(moduleVideos[0]);
      }
    } else {
      setSelectedVideo(null);
    }
  }, [moduleVideos, selectedVideo]);

  const progressByVideoId = useMemo(() => {
    const map: Record<string, IModuleVideoWithProgress> = {};
    moduleVideoProgress?.videos.forEach((video) => {
      map[video._id] = video;
    });
    return map;
  }, [moduleVideoProgress]);

  const currentProgress = myProgress.find(
    (item) =>
      (typeof item?.module === "string"
        ? item.module
        : item?.module?._id) === moduleId,
  );

  // Pillar info — always read from selectedCourse even during partial load
  const pillarId = selectedCourse
    ? (typeof selectedCourse.pillar === "string"
        ? selectedCourse.pillar
        : selectedCourse.pillar?._id ?? "")
    : "";
  const pillarName = selectedCourse
    ? (typeof selectedCourse.pillar === "object"
        ? selectedCourse.pillar?.name ?? ""
        : "")
    : "";

  // Certificate is issued at the PILLAR level
  // ONLY true if there is a valid non-empty pillarId AND an issued certificate for THIS specific pillar
  const alreadyCertified = Boolean(
    pillarId &&
      myCertificates.some((cert) => {
        const certPillarId =
          typeof cert?.pillar === "string"
            ? cert.pillar
            : cert?.pillar?._id;
        return certPillarId === pillarId && cert?.status === "issued";
      }),
  );

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] mx-auto max-w-[1180px] px-[6vw] py-[2vw] sm:px-8">
        {/* Back link skeleton */}
        <Skeleton className="h-4 w-28 rounded" />

        {/* Header skeleton */}
        <div className="mt-4 space-y-2">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-8 w-2/3 rounded-lg" />
          <Skeleton className="h-4 w-full max-w-md rounded" />
          <Skeleton className="h-4 w-3/4 max-w-sm rounded" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Video player skeleton */}
            <Skeleton className="aspect-video w-full rounded-3xl" />
            {/* Video info skeleton */}
            <div className="rounded-3xl border border-[#E8DDCA] bg-white p-6">
              <Skeleton className="h-6 w-1/2 rounded" />
              <Skeleton className="mt-2 h-4 w-3/4 rounded" />
            </div>
            {/* Quiz skeleton */}
            <div className="rounded-3xl border border-[#E8DDCA] bg-white p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8DDCA] pb-4">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-48 rounded" />
                  <Skeleton className="h-3 w-64 rounded" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-[#E8DDCA] p-5 space-y-3">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex items-center justify-between rounded-xl border border-[#E8DDCA] px-4 py-3">
                        <Skeleton className="h-3.5 w-32 rounded" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#E8DDCA] bg-white p-5 space-y-3">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <div className="rounded-3xl border border-[#E8DDCA] bg-white p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-2">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3.5 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#171717] mx-auto max-w-[1180px] px-[6vw] py-[2vw] sm:px-8">
      <Link
        href={`/invictus/invictus-challenge/${pillarSlug}`}
        className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-[#B18A3A] transition duration-200 hover:-translate-x-1 hover:text-[#997734]"
      >
        &larr; Back to modules
      </Link>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-[3px] text-[#B18A3A]">
          Module {selectedCourse?.moduleNumber}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#171717]">
          {selectedCourse?.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#8A8175]">
          {selectedCourse?.description}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {videosLoading && !selectedVideo ? (
            <Skeleton className="aspect-video w-full rounded-3xl" />
          ) : selectedVideo ? (
            <ChallengeVideoPlayer
              key={selectedVideo._id}
              video={selectedVideo}
              pillarSlug={pillarSlug}
              moduleId={moduleId}
              pillar={
                selectedPillar ??
                (typeof selectedCourse?.pillar === "object"
                  ? (selectedCourse.pillar as any)
                  : null)
              }
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-3xl border border-[#E8DDCA] bg-white text-sm text-[#8A8175]">
              No videos published for this module yet.
            </div>
          )}

          {selectedVideo && (
            <div className="rounded-3xl border border-[#E8DDCA] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#171717]">
                {selectedVideo.title}
              </h2>
              {selectedVideo.description && (
                <p className="mt-2 text-sm text-[#8A8175]">
                  {selectedVideo.description}
                </p>
              )}
            </div>
          )}

          {resources.length > 0 && (
            <div className="rounded-3xl border border-[#E8DDCA] bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-[#171717]">
                <FileText size={18} className="text-[#B18A3A]" /> Downloadable Resources & Links
              </h3>
              <div className="mt-4 space-y-2">
                {resources.map((resource) => (
                  <a
                    key={resource._id}
                    href={resource.secureUrl || resource.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-[#E8DDCA] bg-white px-4 py-3 text-sm text-[#171717] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#B18A3A] hover:shadow-md"
                  >
                    <span className="font-medium">{resource.title}</span>
                    <div className="flex items-center gap-1.5 text-xs text-[#B18A3A]">
                      <span>Open</span>
                      <ExternalLink size={14} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <ChallengeQuizPanel
            moduleId={moduleId}
            pillarId={pillarId}
            pillarName={pillarName}
            quizUnlocked={currentProgress?.quizUnlocked ?? false}
            alreadyCertified={alreadyCertified}
            moduleQuizPassed={currentProgress?.quizSummary?.passed ?? false}
            moduleScore={currentProgress?.quizSummary?.bestScore ?? 0}
            allModulesPassed={allModulesPassed}
            pillarTotalModules={pillarModules.length}
            pillarPassedModules={pillarModules.filter((mod) => {
              const modId = typeof mod._id === "string" ? mod._id : String(mod._id);
              const p = myProgress.find(
                (item) =>
                  (typeof item?.module === "string" ? item.module : item?.module?._id) === modId,
              );
              return p?.quizSummary?.passed === true;
            }).length}
          />
        </div>

        <div className="space-y-6">
          {currentProgress && (
            <div className="rounded-3xl border border-[#E8DDCA] bg-white p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#171717]">
                <ListChecks size={16} className="text-[#B18A3A]" /> Your
                Progress
              </h3>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-[#8A8175]">
                  <span>Overall</span>
                  <span>{currentProgress.overallCompletionPercent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#F3E9D2]">
                  <div
                    style={{
                      width: `${currentProgress.overallCompletionPercent}%`,
                    }}
                    className="h-full bg-[#B18A3A]"
                  />
                </div>
              </div>
            </div>
          )}

          {moduleVideos.length > 0 && (
            <ChallengeVideoList
              videos={moduleVideos}
              progressByVideoId={progressByVideoId}
              selectedVideoId={selectedVideo?._id}
              onSelect={setSelectedVideo}
            />
          )}
        </div>
      </div>
    </div>
  );
}
