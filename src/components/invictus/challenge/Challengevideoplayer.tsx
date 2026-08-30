"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, ShoppingCart } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { checkVideoAccess } from "@/lib/features/invictus/academy/video-module/videoSlice";
import {
  fetchMyVideoProgress,
  sendVideoHeartbeat,
} from "@/lib/features/invictus/videoProgress/videoProgressSlice";
import { fetchMyModuleProgress } from "@/lib/features/invictus/academy/progress/progressSlice";
import { fetchMyModuleVideoProgress } from "@/lib/features/invictus/videoProgress/videoProgressSlice";
import type { IModuleVideo } from "@/lib/features/invictus/academy/video-module/videoTypes";
import BuyPillarModal from "@/components/invictus/challenge/BuyPillarModal";
import type { ChallengePillar } from "@/lib/features/invictus/academy/pillar/pillarTypes";

const HEARTBEAT_INTERVAL_SECONDS = 10;

interface Props {
  video: IModuleVideo;
  pillarSlug: string;
  moduleId?: string;
  /** Pass the current pillar so the player doesn't re-fetch it (which resets selectedPillar) */
  pillar?: ChallengePillar | null;
}

export default function ChallengeVideoPlayer({ video, pillarSlug, moduleId, pillar }: Props) {
  const dispatch = useAppDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const segmentStartRef = useRef<number | null>(null);
  const lastHeartbeatRef = useRef<number>(0);
  const [hasResumed, setHasResumed] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const access = useAppSelector((state) => state.video.accessByVideoId[video._id]);
  const resume = useAppSelector(
    (state) => state.videoProgress.byVideoId[video._id]
  );

  // Use the pillar passed from the parent page — do NOT dispatch fetchPillarBySlug here
  // as it resets selectedPillar to null in the pillar slice, breaking the parent page.
  const activePillar = pillar ?? null;

  useEffect(() => {
    dispatch(checkVideoAccess(video._id));
    dispatch(fetchMyVideoProgress(video._id));
    segmentStartRef.current = null;
    lastHeartbeatRef.current = 0;
    setHasResumed(false);
  }, [dispatch, video._id]);

  const flushHeartbeat = async (currentPosition: number) => {
    if (segmentStartRef.current === null) return;
    const segmentStart = segmentStartRef.current;
    if (currentPosition <= segmentStart) return;

    await dispatch(
      sendVideoHeartbeat({
        videoId: video._id,
        data: {
          segmentStartSeconds: segmentStart,
          segmentEndSeconds: currentPosition,
          currentPositionSeconds: currentPosition,
        },
      })
    );

    if (moduleId) {
      dispatch(fetchMyModuleProgress(moduleId));
      dispatch(fetchMyModuleVideoProgress(moduleId));
    }
  };

  const handleLoadedMetadata = () => {
    if (hasResumed || !videoRef.current) return;
    const lastPosition = resume?.progress.lastPositionSeconds ?? 0;
    if (lastPosition > 0 && lastPosition < videoRef.current.duration - 2) {
      videoRef.current.currentTime = lastPosition;
    }
    setHasResumed(true);
  };

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || el.paused) return;

    if (segmentStartRef.current === null) {
      segmentStartRef.current = el.currentTime;
      lastHeartbeatRef.current = el.currentTime;
      return;
    }

    if (
      el.currentTime - lastHeartbeatRef.current >=
      HEARTBEAT_INTERVAL_SECONDS
    ) {
      flushHeartbeat(el.currentTime);
      segmentStartRef.current = el.currentTime;
      lastHeartbeatRef.current = el.currentTime;
    }
  };

  const handlePauseOrEnd = () => {
    const el = videoRef.current;
    if (!el) return;
    flushHeartbeat(el.currentTime);
    segmentStartRef.current = null;
  };

  const handleSeeking = () => {
    const el = videoRef.current;
    if (!el) return;
    flushHeartbeat(el.currentTime);
    segmentStartRef.current = null;
  };

  // Loading state
  if (!access) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-3xl border border-[#E8DDCA] bg-white text-[#8A8175]">
        Loading video...
      </div>
    );
  }

  // Locked — needs pillar purchase
  if (!access.canWatch) {
    const pillarTitle = access.pillar?.title ?? activePillar?.title;
    const priceCents = access.pillar?.priceCents ?? activePillar?.priceCents;
    const currency = access.pillar?.currency ?? activePillar?.currency ?? "usd";

    const priceFormatted = priceCents
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency.toUpperCase(),
          minimumFractionDigits: 0,
        }).format(priceCents / 100)
      : null;

    const effectivePillar = (activePillar ?? access.pillar) as ChallengePillar | undefined;
    const isPillarPaid = effectivePillar?.isPaid ?? true;

    return (
      <>
        <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#0F0F0F] text-center">
          {/* Background glow effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(177,138,58,0.12)_0%,_transparent_70%)]" />

          <div className="relative z-10 flex flex-col items-center gap-4 px-8">
            {/* Lock icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#B18A3A]/40 bg-[#B18A3A]/15">
              <Lock size={28} className="text-[#C9A84C]" />
            </div>

            <div className="space-y-1">
              <p className="text-lg font-bold text-white">
                Paid Content — Locked
              </p>
              <p className="max-w-xs text-sm text-white/55 leading-relaxed">
                {pillarTitle
                  ? `This video is part of the ${pillarTitle} pillar.`
                  : "This lesson is part of a paid pillar."}
                {priceFormatted
                  ? ` Unlock full access for ${priceFormatted}.`
                  : " Purchase the pillar to unlock."}
              </p>
            </div>

            {/* Buy button */}
            {effectivePillar && isPillarPaid && (
              <button
                onClick={() => setShowBuyModal(true)}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#B18A3A] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#C9A84C] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              >
                <ShoppingCart size={16} />
                Unlock{priceFormatted ? ` · ${priceFormatted}` : " Now"}
              </button>
            )}
          </div>
        </div>

        {effectivePillar && isPillarPaid && (
          <BuyPillarModal
            open={showBuyModal}
            onClose={() => setShowBuyModal(false)}
            pillar={effectivePillar}
          />
        )}
      </>
    );
  }

  // Playable
  return (
    <video
      ref={videoRef}
      src={access.playbackUrl ?? undefined}
      controls
      className="aspect-video w-full rounded-3xl border border-[#E8DDCA] bg-black"
      onLoadedMetadata={handleLoadedMetadata}
      onTimeUpdate={handleTimeUpdate}
      onPause={handlePauseOrEnd}
      onEnded={handlePauseOrEnd}
      onSeeking={handleSeeking}
    />
  );
}