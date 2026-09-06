"use client";

import { useEffect, useState } from "react";
import { Loader2, Play, X } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchCurrentUserProfile } from "@/lib/features/auth/authUserSlice";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import AccessUpgradeModal from "@/components/common/AccessUpgradeModal";
import { videoApi } from "@/lib/features/invictus/academy/video-module/videoApi";
import type { IModuleVideo } from "@/lib/features/invictus/academy/video-module/videoTypes";

export default function AcademyPage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.authUser.profile);
  const tokenUser = useAppSelector((state) => state.authUser.user);
  const isProfileLoading = useAppSelector(
    (state) => state.authUser.isProfileLoading,
  );
  const accessTo = profile?.accessTo || tokenUser?.accessTo;
  const hasFullAccess = accessTo === "both" || tokenUser?.role === "admin";
  const userId = tokenUser?.id;
  const [videos, setVideos] = useState<IModuleVideo[]>([]);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<IModuleVideo | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [playerLoading, setPlayerLoading] = useState(false);

  useEffect(() => {
    if (userId && !profile && !isProfileLoading)
      dispatch(fetchCurrentUserProfile(userId));
  }, [dispatch, userId, profile, isProfileLoading]);

  useEffect(() => {
    if (!hasFullAccess) return;
    videoApi
      .getAll(undefined, false)
      .then((response) => setVideos(response.data.slice(0, 4)))
      .catch(() => setVideos([]));
  }, [hasFullAccess]);

  const openVideo = async (video: IModuleVideo) => {
    setSelectedVideo(video);
    setPlaybackUrl(null);
    setPlayerLoading(true);

    try {
      const response = await videoApi.checkAccess(video._id);
      if (!response.data.canWatch || !response.data.playbackUrl) {
        toast.error("This video is not available for your account.");
        setSelectedVideo(null);
        return;
      }
      setPlaybackUrl(response.data.playbackUrl);
    } catch {
      toast.error("Could not load this video.");
      setSelectedVideo(null);
    } finally {
      setPlayerLoading(false);
    }
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    setPlaybackUrl(null);
  };

  return (
    <PageContainer variant="dashboard">
      <PageHeader
        eyebrow="Invictus Academy"
        title={
          hasFullAccess
            ? "Welcome to Invictus Academy"
            : "Invictus Academy Access"
        }
        description={
          hasFullAccess
            ? "Your access includes the full Invictus Academy curriculum. Explore the latest lessons below."
            : "Upgrade your plan to unlock Invictus Academy and its full curriculum."
        }
      />

      {hasFullAccess ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {videos.length === 0 ? (
            <div className="rounded-3xl border border-gold-soft/30 bg-[#111111]/70 p-8 text-sm text-muted-foreground">
              No published academy videos are available yet.
            </div>
          ) : (
            videos.map((video) => (
              <button
                type="button"
                onClick={() => openVideo(video)}
                key={video._id}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-gold-soft/30 bg-[#111111]/70 text-left shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-gold-soft/70"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-[#1a1a1a]">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gold">
                      <Play size={34} />
                    </div>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D6A83F] text-[#111111]">
                      <Play size={20} fill="currentColor" />
                    </span>
                  </span>
                </div>
                <h2 className="px-5 py-5 text-lg font-semibold text-white">
                  {video.title}
                </h2>
              </button>
            ))
          )}
        </div>
      ) : (
        <section className="mt-4 rounded-3xl border border-gold-soft/30 bg-[#111111]/70 p-8 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-montserrat text-xs uppercase tracking-[0.32em] text-gold">
                Access required
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                No access to Invictus Academy yet
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Upgrade your active membership to unlock the Invictus Academy
                platform.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setUpgradeOpen(true)}
              className="inline-flex cursor-pointer h-12 items-center justify-center rounded-full border border-gold-soft/30 bg-gold-soft/10 px-6 text-sm font-semibold uppercase tracking-[0.18em] text-gold transition hover:bg-gold-soft/20"
            >
              Purchase plan
            </button>
          </div>
        </section>
      )}

      <AccessUpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        variant="dashboard"
      />

      {selectedVideo && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-5xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="truncate text-xl font-semibold text-white">
                {selectedVideo.title}
              </h2>
              <button
                type="button"
                onClick={closeVideo}
                className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Close video"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
              {playerLoading ? (
                <Loader2 className="animate-spin text-[#D6A83F]" size={32} />
              ) : playbackUrl ? (
                <video
                  className="h-full w-full"
                  controls
                  autoPlay
                  src={playbackUrl}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
