"use client";

import { WorldMap } from "react-svg-worldmap";

const mapData = [
  { country: "us", value: 1 },
  { country: "ca", value: 1 },
  { country: "gb", value: 1 },
  { country: "fr", value: 1 },
  { country: "de", value: 1 },
  { country: "ae", value: 1 },
  { country: "jp", value: 1 },
  { country: "au", value: 1 },
];

const markers = [
  { left: "17%", top: "33%" },
  { left: "21%", top: "41%" },
  { left: "24%", top: "53%" },
  { left: "31%", top: "47%" },
  { left: "39%", top: "59%" },

  { left: "63%", top: "47%" },
  { left: "67%", top: "55%" },
  { left: "73%", top: "62%" },
];

export default function WorldMapCard() {
  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border border-gold/30 bg-[#0F0F0F] py-6 hover:shadow-gold transition-all duration-300 hover:border-gold/50 hover:-translate-y-1">
      {/* Glow */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,39,.08),transparent_65%)]" />

      {/* Map */}

      <div className="relative opacity-60">
        <WorldMap
          color="#2C2C2C"
          size="responsive"
          data={mapData}
          backgroundColor="transparent"
        />
      </div>

      {/* Markers */}

      {markers.map((marker, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: marker.left,
            top: marker.top,
          }}
        >
          {/* Pulse */}

          <span
            className="
            absolute
            left-1/2
            top-1/2
            h-7
            w-7
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#C7A343]/20
            animate-ping
          "
          />

          {/* Outer */}

          <span
            className="
            absolute
            left-1/2
            top-1/2
            h-6
            w-6
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#C7A343]/15
            blur-sm
          "
          />

          {/* Dot */}

          <span
            className="
            relative
            block
            h-3
            w-3
            rounded-full
            border
            border-[#E8D08B]
            bg-[#C7A343]
            shadow-[0_0_20px_rgba(199,163,67,.8)]
          "
          />
        </div>
      ))}
    </div>
  );
}
