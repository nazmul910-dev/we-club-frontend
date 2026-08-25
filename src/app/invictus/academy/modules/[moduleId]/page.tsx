"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import {
  fetchModuleById,
  fetchModuleVideos,
  fetchMyEntitlement,
} from "@/lib/features/invictus/academy/academySlice";

import ModuleHeader from "@/components/invictus/academy/ModuleHeader";

import VideoCard from "@/components/invictus/academy/videos/VideoCard";

import PaidLock from "@/components/invictus/academy/PaidLock";

import VideoPlayer from "@/components/invictus/academy/videos/VideoPlayer";

export default function ModuleDetailsPage() {
  const params = useParams();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const moduleId = params.moduleId as string;

  const { videos, loading, entitlement, selectedModule } = useAppSelector(
    (state) => state.academy,
  );

  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showLock, setShowLock] = useState(false);

  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (moduleId) {
      dispatch(fetchModuleVideos(moduleId));
      fetchModuleById(moduleId);
    }
  }, [moduleId, dispatch]);

  useEffect(() => {
    dispatch(fetchMyEntitlement());
  }, [dispatch]);

  if (loading) {
    return (
      <div
        className="
flex
h-screen
items-center
justify-center
bg-[#080808]
text-[#C9A84C]
"
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
min-h-screen
bg-[#080808]
px-6
py-10
text-white
"
    >
      <ModuleHeader
        title={selectedModule?.title || ""}
        description="
Develop your leadership mindset and unlock your potential.
"
        totalVideos={videos.length}
      />

      <div
        className="
mt-10
grid
gap-8
lg:grid-cols-3
"
      >
        {/* VIDEO LIST */}

        <div
          className="
space-y-4
"
        >
          <h2
            className="
mb-5
text-xl
font-semibold
"
          >
            Lessons
          </h2>

          {videos.map((video: any) => (
            <VideoCard
              key={video._id}
              title={video.title}
              description={video.description}
              isPaid={video.isPaid}
              onClick={() => {
                if (video.isPaid && !entitlement) {
                  setShowLock(true);

                  setSelectedVideo(null);

                  return;
                }

                setShowLock(false);

                setSelectedVideo(video);
              }}
            />
          ))}
        </div>

        {/* PLAYER */}

        <div
          className="
lg:col-span-2
"
        >
          {showLock ? (
            <PaidLock
              onUpgrade={() => {
                router.push("/invictus/pricing");
              }}
            />
          ) : selectedVideo ? (
            <VideoPlayer
              src={selectedVideo.video}
              title={selectedVideo.title}
            />
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-3xl border border-white/10 bg-[#111] text-gray-400">
              Select a lesson to start learning
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
