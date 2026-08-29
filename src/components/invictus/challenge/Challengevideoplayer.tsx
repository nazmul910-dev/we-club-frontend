"use client";

import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { checkVideoAccess } from "@/lib/features/invictus/academy/video-module/videoSlice";
import { fetchMyVideoProgress, sendVideoHeartbeat } from "@/lib/features/invictus/videoProgress/videoProgressSlice";
import type { IModuleVideo } from "@/lib/features/invictus/academy/video-module/videoTypes";

const HEARTBEAT_INTERVAL_SECONDS = 10;

interface Props {
  video: IModuleVideo;
  pillarSlug: string;
}

export default function ChallengeVideoPlayer({ video, pillarSlug }: Props) {
  const dispatch = useAppDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const segmentStartRef = useRef<number | null>(null);
  const lastHeartbeatRef = useRef<number>(0);
  const [hasResumed, setHasResumed] = useState(false);

  const access = useAppSelector((state) => state.video.accessByVideoId[video._id]);
  const resume = useAppSelector((state) => state.videoProgress.byVideoId[video._id]);

  useEffect(() => {
    dispatch(checkVideoAccess(video._id));
    dispatch(fetchMyVideoProgress(video._id));
    segmentStartRef.current = null;
    lastHeartbeatRef.current = 0;
    setHasResumed(false);
  }, [dispatch, video._id]);

  const flushHeartbeat = (currentPosition: number) => {
    if (segmentStartRef.current === null) return;
    const segmentStart = segmentStartRef.current;
    if (currentPosition <= segmentStart) return;

    dispatch(
      sendVideoHeartbeat({
        videoId: video._id,
        data: {
          segmentStartSeconds: segmentStart,
          segmentEndSeconds: currentPosition,
          currentPositionSeconds: currentPosition,
        },
      }),
    );
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

    if (el.currentTime - lastHeartbeatRef.current >= HEARTBEAT_INTERVAL_SECONDS) {
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

  if (!access) {
    return <div className="flex aspect-video w-full items-center justify-center rounded-3xl border border-[#E8DDCA] bg-white text-[#8A8175]">Loading video...</div>;
  }

  if (!access.canWatch) {
    return (
      <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-3xl border border-[#E8DDCA] bg-[#171717] text-center text-white">
        <Lock size={32} className="text-[#C9A84C]" />
        <p className="text-lg font-semibold">This lesson is part of a paid pillar</p>
        <p className="max-w-sm text-sm text-white/60">
          {access.pillar?.title ? `Purchase ${access.pillar.title} to unlock this and every video inside it.` : "Purchase this pillar to unlock this video."}
        </p>
        <Link href={`/invictus/invictus-challenge/${pillarSlug}`} className="mt-2 rounded-xl bg-[#C9A84C] px-5 py-2 text-sm font-medium text-[#171717]">
          View Pillar
        </Link>
      </div>
    );
  }

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