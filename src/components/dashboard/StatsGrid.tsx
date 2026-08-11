"use client";

import { useEffect, useState } from "react";

import StatCard, { dashboardStats } from "./StatCard";

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux/store/hook";

import { getDashboardStats } from "@/lib/features/dashboard/dashboardApi";

import {
  getTotalAdminCommssions,
  getTotalMyCommssions,
} from "@/lib/features/commissionLedger/commissionLedgerApi";

export default function StatsGrid() {
  const dispatch = useAppDispatch();

  const { stats } = useAppSelector(
    (state) => state.dashboard,
  );

  const user = useAppSelector(
    (state) => state.authUser.user,
  );

  const [commissionTotal, setCommissionTotal] =
    useState<number>(0);

  const [commissionLoading, setCommissionLoading] =
    useState(true);

  // Dashboard stats
  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  // Final commission total
  useEffect(() => {
    const fetchCommissionTotal = async () => {
      if (!user?.role) return;

      try {
        setCommissionLoading(true);

        const isFounderOrManager =
          user.role === "founder" ||
          user.role === "manager";

        if (isFounderOrManager) {
          // Founder / Manager = all users commission
          const response = await dispatch(
            getTotalAdminCommssions(),
          ).unwrap();

          setCommissionTotal(
            Number(
              response.data
                .total_final_commission ?? 0,
            ),
          );
        } else {
          // Other users = only own commission
          const response = await dispatch(
            getTotalMyCommssions(),
          ).unwrap();

          setCommissionTotal(
            Number(
              response.data
                .total_final_commission ?? 0,
            ),
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch commission total:",
          error,
        );

        setCommissionTotal(0);
      } finally {
        setCommissionLoading(false);
      }
    };

    fetchCommissionTotal();
  }, [dispatch, user?.role]);

  const cards = dashboardStats(
    stats,
    commissionTotal,
  );

  return (
    <section className="grid gap-3 xl:gap-5 md:grid-cols-3">
      {cards.map((stat) => (
        <StatCard
          key={stat.id}
          stat={
            stat.id === 6 && commissionLoading
              ? {
                  ...stat,
                  value: "...",
                }
              : stat
          }
        />
      ))}
    </section>
  );
}