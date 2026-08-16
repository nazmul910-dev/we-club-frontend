"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { DataItem, ISOCode } from "react-svg-worldmap";

import WorldMapCard, {
  type CountryMarker,
} from "./WorldMap";

import { StatPill } from "./StatPill";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { useAppDispatch } from "@/lib/redux/store/hook";
import { getAllUsers } from "@/lib/features/users/usersApi";

import {
  coordsToPosition,
  getCountryCoordinates,
  getCountryIsoCode,
} from "@/data/countryCoordinates";

import type { IUser } from "@/types/user-managemetn";

export default function ReachedAudience() {
  const dispatch = useAppDispatch();

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    dispatch(
      getAllUsers({
        limit: 1000,
      }),
    )
      .unwrap()
      .then((response) => {
        if (!isMounted) return;

        setUsers(response.users ?? []);
      })
      .catch(() => {
        if (!isMounted) return;

        setUsers([]);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // country name -> user count, built once from users list
  const countryCountMap = useMemo(() => {
    const map = new Map<string, number>();

    users.forEach((user) => {
      const country = user.country?.trim();

      if (!country) return;

      map.set(country, (map.get(country) ?? 0) + 1);
    });

    return map;
  }, [users]);

  // dot marker positions (lat/lng -> % left/top on the SVG)
  const markers = useMemo<CountryMarker[]>(() => {
    const countryMarkers: CountryMarker[] = [];

    countryCountMap.forEach((count, country) => {
      const coordinates = getCountryCoordinates(country);

      if (!coordinates) return;

      const position = coordsToPosition(
        coordinates.lat,
        coordinates.lng,
      );

      countryMarkers.push({
        country,
        count,
        left: position.left,
        top: position.top,
      });
    });

    return countryMarkers;
  }, [countryCountMap]);

  // ISO alpha-2 codes + values -> this is what react-svg-worldmap
  // actually reads to decide which country shape gets highlighted.
  const mapData = useMemo<DataItem<number>[]>(() => {
    const data: DataItem<number>[] = [];

    countryCountMap.forEach((count, country) => {
      const isoCode = getCountryIsoCode(country);

      if (!isoCode) return;

      data.push({
        country: isoCode as ISOCode,
        value: count,
      });
    });

    return data;
  }, [countryCountMap]);

  const totalCountries = markers.length;

  const totalCities = 214;

  return (
    <div className="py-8">
      <div className="sm:flex items-start justify-between">
        <div>
          <p className="mt-3 text-sm text-zinc-500">
            Live visitor distribution across the network.
          </p>
        </div>

        <div className="flex items-center gap-10">
          <StatPill
            value={totalCountries}
            label="Countries"
          />

          {/* <StatPill
            value={totalCities}
            label="Cities"
          /> */}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="
                  cursor-not-allowed
                  rounded-full
                  border
                  border-[#6B5522]
                  px-5
                  py-2
                  text-xs
                  uppercase
                  tracking-[0.28em]
                  text-[#D3AE57]
                  text-[8px]
                  sm:text-[14px]
                  transition
                  hover:border-[#C9A227]
                  hover:bg-[#191919]
                "
              >
                Open Atlas

                <ArrowUpRight className="ml-2 inline h-3 w-3" />
              </TooltipTrigger>

              <TooltipContent
                className="
                  max-w-55
                  border-white/10
                  bg-[#1a1a1a]
                  text-center
                  text-xs
                  text-white
                "
              >
                This feature isn&apos;t available yet!
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {!loading && (
        <WorldMapCard markers={markers} mapData={mapData} />
      )}
    </div>
  );
}