"use client";

import { useState } from "react";
import Image from "next/image";
import { getYouTubeId, youTubeEmbed, youTubeThumbnail } from "@/utils/youtube";

export type RetreatVideoProps = {
  title: string;
  promoVideoUrl?: string;
  coverImage: string;
};

export function RetreatVideo({ title, promoVideoUrl, coverImage }: RetreatVideoProps) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(promoVideoUrl);
  const poster = videoId ? youTubeThumbnail(videoId) : coverImage;

  return (
    <div className="relative aspect-video w-full overflow-hidden border border-line bg-dark rounded-2xl overflow-hidden">
      {playing && videoId ? (
        <iframe
          src={youTubeEmbed(videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full "
        />
      ) : (
        <button
          type="button"
          onClick={() => videoId && setPlaying(true)}
          disabled={!videoId}
          className="group relative block h-full w-full disabled:cursor-default"
        >
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          {videoId && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6 text-dark">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          )}

          <span className="absolute bottom-4 left-5 font-display text-[0.95rem] italic text-white/90">
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
