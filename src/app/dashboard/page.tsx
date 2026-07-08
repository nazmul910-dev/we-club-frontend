"use client";

import MostViewedListings from "@/components/dashboard/MostViewedListings";
import { ChartAreaDefault } from "@/components/dashboard/PerformanceCharts";
import ReachedAudience from "@/components/dashboard/ReachedAudience";
import StatsGrid from "@/components/dashboard/StatsGrid";
import TopPromoters from "@/components/dashboard/TopPromoters";


export default function Home() {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-eyebrow mb-2">Dashboard · Private Command</div>
          <h1 className="font-display text-3xl md:text-4xl text-white mb-2">
            Good Morning,{" "}
            <span className="bg-gradient-to-r from-gold via-gold to-orange-200 bg-clip-text text-transparent">
              Alexandra
            </span>
            .
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Welcome back, nice to see you again.
          </p>
        </div>
      </div>
      <div>
        <StatsGrid/>
      </div>
      <div>
        <ChartAreaDefault/>
      </div>
      <div className="flex gap-4 flex-col xl:flex-row">
        <TopPromoters/>
        <MostViewedListings/>
      </div>
    <ReachedAudience/>
    </div>
  );
}
