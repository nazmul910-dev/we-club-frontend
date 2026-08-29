"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FileText, ListChecks, ExternalLink } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { setSelectedCourse } from "@/lib/features/invictus/academy/course/courseSlice";
import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";
import { fetchVideos } from "@/lib/features/invictus/academy/video-module/videoSlice";
import { fetchMyModuleVideoProgress } from "@/lib/features/invictus/videoProgress/videoProgressSlice";
import { fetchMyModuleProgress } from "@/lib/features/invictus/academy/progress/progressSlice";
import { fetchResources } from "@/lib/features/invictus/academy/resource/resourceSlice";
import { fetchMyCertificates } from "@/lib/features/invictus/academy/cerfificate/certificateSlice";
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

  const [selectedVideo, setSelectedVideo] = useState<IModuleVideo | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      const res = await courseApi.getCourseById(moduleId);
      dispatch(setSelectedCourse(res.data));
    };

    loadCourse();
    dispatch(fetchVideos({ moduleId, includeArchived: false }));
    dispatch(fetchMyModuleVideoProgress(moduleId));
    dispatch(fetchMyModuleProgress(moduleId));
    dispatch(fetchResources({ moduleId, includeArchived: false }));
    dispatch(fetchMyCertificates());
  }, [dispatch, moduleId]);

  const moduleVideos = useMemo(
    () =>
      videos
        .filter(
          (video) =>
            video.module._id === moduleId && video.status === "published",
        )
        .sort((a, b) => a.order - b.order),
    [videos, moduleId],
  );

  useEffect(() => {
    if (!selectedVideo && moduleVideos.length > 0) {
      setSelectedVideo(moduleVideos[0]);
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
    (item) => item.module._id === moduleId,
  );
  const alreadyCertified = myCertificates.some(
    (cert) => cert.module._id === moduleId && cert.status === "issued",
  );

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] px-[6vw] py-[2vw] text-sm text-[#8A8175]">
        Loading module...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#171717] mx-auto max-w-[1180px] px-[6vw] py-[2vw] sm:px-8">
      <Link
        href={`/invictus/invictus-challenge/${pillarSlug}`}
        className="text-sm text-[#B18A3A]"
      >
        &larr; Back to modules
      </Link>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-[3px] text-[#B18A3A]">
          Module {selectedCourse.moduleNumber}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#171717]">
          {selectedCourse.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#8A8175]">
          {selectedCourse.description}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {videosLoading && !selectedVideo ? (
            <div className="flex aspect-video w-full items-center justify-center rounded-3xl border border-[#E8DDCA] bg-white text-sm text-[#8A8175]">
              Loading videos...
            </div>
          ) : selectedVideo ? (
            <ChallengeVideoPlayer
              video={selectedVideo}
              pillarSlug={pillarSlug}
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-3xl border border-[#E8DDCA] bg-white text-sm text-[#8A8175]">
              No videos published for this module yet.
            </div>
          )}

          {selectedVideo && (
            <div className="rounded-3xl border border-[#E8DDCA] bg-white p-6">
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
            <div className="rounded-3xl border border-[#E8DDCA] bg-white p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-[#171717]">
                <FileText size={18} className="text-[#B18A3A]" /> Resources
              </h3>
              <div className="mt-4 space-y-2">
                {resources.map((resource) => (
                  <a
                    key={resource._id}
                    href={resource.secureUrl || resource.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-[#E8DDCA] px-4 py-3 text-sm text-[#171717] hover:border-[#B18A3A]/50"
                  >
                    {resource.title}
                    <ExternalLink size={14} className="text-[#B18A3A]" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <ChallengeQuizPanel
            moduleId={moduleId}
            quizUnlocked={currentProgress?.quizUnlocked ?? false}
            alreadyCertified={alreadyCertified}
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
