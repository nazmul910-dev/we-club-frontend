"use client";

import { useEffect } from "react";

import StatCard, { dashboardStats } from "./StatCard";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { getDashboardStats } from "@/lib/features/dashboard/dashboardApi";

export default function StatsGrid() {
  const dispatch = useAppDispatch();

  const { stats } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);


  const cards = dashboardStats(stats);

  return (
    <section className="grid gap-3 xl:gap-5 md:grid-cols-3">
      {cards.map((stat) => (
        <StatCard
          key={stat.id}
          stat={stat}
        />
      ))}
    </section>
  );
}