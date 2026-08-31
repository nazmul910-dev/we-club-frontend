"use client";

import { useEffect, useState } from "react";
import MostViewedListings from "@/components/dashboard/MostViewedListings";
import { ChartAreaDefault } from "@/components/dashboard/PerformanceCharts";
import ReachedAudience from "@/components/dashboard/ReachedAudience";
import StatsGrid from "@/components/dashboard/StatsGrid";
import TopPromoters from "@/components/dashboard/TopPromoters";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import { fetchCurrentUserProfile } from "@/lib/features/auth/authUserSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { getGreeting } from "@/lib/utils/Helpers";
import {
  getDashboardStats,
  fetchTopPromoters,
} from "@/lib/features/dashboard/dashboardApi";

export default function Home() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.authUser.profile);
  const tokenUser = useAppSelector((state) => state.authUser.user);

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
    <PageContainer variant="dashboard">
      <PageHeader
        eyebrow="Dashboard · Private Command"
        title={
          <>
            {greeting},{" "}
            <span className="bg-linear-to-r from-gold via-gold to-orange-200 bg-clip-text text-transparent">
              {fullName}
            </span>
            .
          </>
        }
        description="Welcome back, nice to see you again."
      />
      <div>
        <StatsGrid />
      </div>
      <div>
        <ChartAreaDefault />
      </div>
      <div className="flex gap-4 flex-col xl:flex-row w-full">
        <TopPromoters />
        <MostViewedListings />
      </div>
      <ReachedAudience />
    </PageContainer>
  );
}