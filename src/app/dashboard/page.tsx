"use client";

import MostViewedListings from "@/components/dashboard/MostViewedListings";
import { ChartAreaDefault } from "@/components/dashboard/PerformanceCharts";
import ReachedAudience from "@/components/dashboard/ReachedAudience";
import StatsGrid from "@/components/dashboard/StatsGrid";
import TopPromoters from "@/components/dashboard/TopPromoters";
import { fetchCurrentUserProfile } from "@/lib/features/auth/authUserSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { useEffect, useState } from "react";

import {
  getDashboardStats,
  fetchTopPromoters,
} from "@/lib/features/dashboard/dashboardApi";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

export default function Home() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.authUser.profile);
  const tokenUser = useAppSelector((state) => state.authUser.user);

    const { stats } = useAppSelector(
    (state) => state.dashboard
  );


  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    if (!profile && tokenUser?.id) {
      dispatch(fetchCurrentUserProfile(tokenUser.id));
    }
  }, [tokenUser, profile, dispatch]);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
  dispatch(getDashboardStats());
  dispatch(fetchTopPromoters());

}, [dispatch]);

  const fullName = profile?.fullName;

  return (
    <div className="flex-1  px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a]  ">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-eyebrow mb-2">Dashboard · Private Command</div>
          <h1 className="font-display text-3xl xl::text-4xl text-white mb-2">
            {greeting},{" "}
            <span className="bg-linear-to-r from-gold via-gold to-orange-200 bg-clip-text text-transparent">
              {fullName}
            </span>
            .
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Welcome back, nice to see you again.
          </p>
        </div>
      </div>
      <div>
        <StatsGrid />
      </div>
      <div>
        <ChartAreaDefault  />
      </div>
      <div className="flex gap-4 flex-col xl:flex-row w-full">
        <TopPromoters />
        <MostViewedListings />
      </div>
      <ReachedAudience />
    </div>
  );
}