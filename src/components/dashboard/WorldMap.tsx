"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import {
  WorldMap,
  type CountryContext,
  type DataItem,
} from "react-svg-worldmap";

export interface CountryMarker {
  country: string;
  count: number;
  left: string;
  top: string;
}

interface WorldMapCardProps {
  markers: CountryMarker[];
  mapData?: DataItem<number>[];
}

export default function WorldMapCard({
  markers,
  mapData = [],
}: WorldMapCardProps) {
  const measurementRef = useRef<HTMLDivElement>(null);
  const [mapWidth, setMapWidth] = useState(0);

  useEffect(() => {
    const container = measurementRef.current;

    if (!container) return;

const updateMapWidth = () => {
  const availableWidth = container.clientWidth;

  if (!availableWidth) return;

  const isLargeScreen = window.innerWidth >= 1280;

  const viewportLimit = isLargeScreen
    ? Math.min(window.innerHeight * 0.92, 980)
    : Math.min(window.innerWidth, window.innerHeight) * 0.75;

  const nextWidth = Math.floor(
    Math.min(availableWidth, viewportLimit),
  );

  setMapWidth((previousWidth) =>
    previousWidth === nextWidth
      ? previousWidth
      : nextWidth,
  );
};

    updateMapWidth();

    const resizeObserver = new ResizeObserver(updateMapWidth);

    resizeObserver.observe(container);
    window.addEventListener("resize", updateMapWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMapWidth);
    };
  }, []);

  const countryStyle = useCallback(
    (context: CountryContext<number>): CSSProperties => {
      const hasVisitor = context.countryValue !== undefined;

      return {
        fill: hasVisitor ? "#C7A343" : "#8A702F",
        fillOpacity: hasVisitor ? 0.5 : 0.22,

        stroke: "#D6B75C",
        strokeWidth: 0.8,
        strokeOpacity: hasVisitor ? 0.95 : 0.72,

        vectorEffect: "non-scaling-stroke",
        cursor: "default",
        transition: "fill-opacity 180ms ease, stroke-opacity 180ms ease",
      };
    },
    [],
  );

  return (
    <div
      className="
        relative
        mt-8
        rounded-2xl
        border
        border-gold/30
        bg-[#0F0F0F]
        p-3
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-gold/50
        hover:shadow-gold
        sm:p-5
      "
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
          rounded-2xl
        "
      >
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.13),transparent_68%)]
          "
        />
      </div>

      {/* Available card width measure করার container */}
      <div
        ref={measurementRef}
        className="relative z-10 w-full"
      >
        {mapWidth > 0 && (

          <div
            className="relative mx-auto"
            style={{
              width: `${mapWidth}px`,
            }}
          >
            <WorldMap
              size={mapWidth}
              data={mapData}
              color="#C7A343"
              borderColor="#D6B75C"
              backgroundColor="transparent"
              strokeOpacity={0.75}
              styleFunction={countryStyle}
              richInteraction={false}
              containerClassName="
                !w-full
                [&_figure]:!m-0
                [&_figure]:!bg-transparent
                [&_svg]:!block
              "
            />

            {/* Marker overlay — exact same size as SVG map */}
            <div className="pointer-events-none absolute inset-0 z-20">
              {markers.map((marker) => (
                <div
                  key={marker.country}
                  className="group pointer-events-auto absolute z-30"
                  style={{
                    left: marker.left,
                    top: marker.top,
                  }}
                >
                  <div
                    className="
                      relative
                      flex
                      h-9
                      w-9
                      -translate-x-1/2
                      -translate-y-1/2
                      cursor-pointer
                      items-center
                      justify-center
                    "
                  >
                    {/* Pulse */}
                    <span
                      className="
                        absolute
                        h-7
                        w-7
                        animate-ping
                        rounded-full
                        bg-[#C7A343]/25
                      "
                    />

                    {/* Glow */}
                    <span
                      className="
                        absolute
                        h-7
                        w-7
                        rounded-full
                        bg-[#C7A343]/20
                        blur-md
                      "
                    />

                    {/* Main dot */}
                    <span
                      className="
                        relative
                        block
                        h-3
                        w-3
                        rounded-full
                        border
                        border-[#F3DE91]
                        bg-[#D5AE43]
                        shadow-[0_0_18px_rgba(213,174,67,0.95)]
                      "
                    />

                    {/* Custom tooltip */}
                    <div
                      className="
                        invisible
                        pointer-events-none
                        absolute
                        bottom-full
                        left-1/2
                        z-50
                        mb-2
                        -translate-x-1/2
                        whitespace-nowrap
                        rounded-lg
                        border
                        border-[#C7A343]/30
                        bg-[#181818]
                        px-3
                        py-2
                        text-center
                        text-xs
                        opacity-0
                        shadow-xl
                        transition-all
                        duration-150
                        group-hover:visible
                        group-hover:-translate-y-1
                        group-hover:opacity-100
                      "
                    >
                      <p className="font-medium text-[#D9B957]">
                        {marker.country}
                      </p>

                      <p className="mt-0.5 text-white/70">
                        {marker.count}{" "}
                        {marker.count === 1 ? "viewer" : "viewers"}
                      </p>

                      <span
                        className="
                          absolute
                          left-1/2
                          top-full
                          -translate-x-1/2
                          border-4
                          border-transparent
                          border-t-[#181818]
                        "
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}