"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Maximize, Play } from "lucide-react";
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

  // Currently selected / playing video (left side)
  const [activeVideo, setActiveVideo] = useState<IModuleVideo | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [playerLoading, setPlayerLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Auto-select the first video once the list loads
  useEffect(() => {
    if (videos.length > 0 && !activeVideo) {
      selectVideo(videos[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos]);

  const selectVideo = async (video: IModuleVideo) => {
    setActiveVideo(video);
    setPlaybackUrl(null);
    setPlayerLoading(true);

    try {
      const response = await videoApi.checkAccess(video._id);
      if (!response.data.canWatch || !response.data.playbackUrl) {
        toast.error("This video is not available for your account.");
        setPlaybackUrl(null);
        return;
      }
      setPlaybackUrl(response.data.playbackUrl);
    } catch {
      toast.error("Could not load this video.");
      setPlaybackUrl(null);
    } finally {
      setPlayerLoading(false);
    }
  };

  const goFullscreen = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ((el as any).webkitRequestFullscreen) {
      (el as any).webkitRequestFullscreen();
    }
  };

  // Everything except the currently active video, in original order
  const queueVideos = videos.filter(
    (v) => v._id !== activeVideo?._id,
  );

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
        <div className="mt-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-montserrat text-xs uppercase tracking-[0.32em] text-gold">
                The Program · Vol.{" "}
                {String(videos.length).padStart(2, "0")}
              </p>
              <h2 className="mt-2 font-playfair text-3xl  text-white sm:text-4xl">
                The Private Screening Room
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-playfair text-4xl text-gold">
                {String(videos.length).padStart(2, "0")}
              </p>
              <p className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Lessons queued
              </p>
            </div>
          </div>

          {videos.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-gold-soft/30 bg-[#111111]/70 p-8 text-sm text-muted-foreground">
              No published academy videos are available yet.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {/* LEFT: active player */}
              <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-xl shadow-black/40 lg:col-span-2">
                <div className="group relative aspect-video w-full overflow-hidden bg-black">
                  {playerLoading ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <Loader2
                        className="animate-spin text-[#D6A83F]"
                        size={32}
                      />
                    </div>
                  ) : playbackUrl ? (
                    <>
                      <video
                        ref={videoRef}
                        key={playbackUrl}
                        className="h-full w-full"
                        controls
                        autoPlay
                        src={playbackUrl}
                      />
                      <button
                        type="button"
                        onClick={goFullscreen}
                        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-[#D6A83F] hover:text-black"
                        aria-label="Fullscreen"
                      >
                        <Maximize size={16} />
                      </button>
                    </>
                  ) : activeVideo?.thumbnailUrl ? (
                    <img
                      src={activeVideo.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#D6A83F]/40">
                      <Play size={48} />
                    </div>
                  )}

                  {!playerLoading && (
                    <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-[#D6A83F]/40 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#D6A83F] backdrop-blur-sm">
                      Now Showing
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                    {activeVideo &&
                      String(videos.indexOf(activeVideo) + 1).padStart(
                        2,
                        "0",
                      )}{" "}
                    · Featured
                  </p>
                  <h3 className="mt-1 truncate font-playfair text-xl font-semibold text-white sm:text-2xl">
                    {activeVideo?.title}
                  </h3>
                </div>
              </div>

              {/* RIGHT: queue */}
              <div className="flex flex-col gap-4">
                {queueVideos.map((video) => {
                  const originalIndex = videos.indexOf(video);
                  return (
                    <button
                      type="button"
                      key={video._id}
                      onClick={() => selectVideo(video)}
                      className="group flex items-center gap-4 rounded-xl border border-white/10 bg-[#111111]/70 p-3 text-left transition hover:border-[#D6A83F]/40 hover:bg-[#161616]"
                    >
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#1a1a1a]">
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#D6A83F]/40">
                            <Play size={18} />
                          </div>
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                          <Play
                            size={16}
                            className="text-white"
                            fill="currentColor"
                          />
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-montserrat text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {String(originalIndex + 1).padStart(2, "0")}
                        </p>
                        <h4 className="truncate font-playfair text-base font-semibold text-white">
                          {video.title}
                        </h4>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
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
    </PageContainer>
  );
}