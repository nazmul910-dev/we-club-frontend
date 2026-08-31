"use client";

import { useEffect, useState } from "react";
import ChecklistRow, { ChecklistRowItem } from "@/components/associates/ChecklistRow";
import ExternalLinkIcon from "@/components/associates/ExternalLinkIcon";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
  completeMyOnboardingTask,
  fetchMyOnboardingChecklist,
} from "@/lib/features/onboardingTasks/onboardingTaskSlice";

const tabs = ["Your First Week", "Upcoming Sessions", "What's Coming Next"] as const;

export default function FirstYearPage() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);

  const { items, isLoading, completingTaskId } = useAppSelector(
    (state) => state.onboardingTasks,
  );

  useEffect(() => {
    dispatch(fetchMyOnboardingChecklist());
  }, [dispatch]);

  // First not-yet-completed task is "active" (highlighted, opens now);
  // everything after it is "upcoming" — same visual rule as the design.
  const firstIncompleteIndex = items.findIndex((item) => !item.isCompleted);

  const checklist: ChecklistRowItem[] = items.map((item, index) => {
    const status: ChecklistRowItem["status"] = item.isCompleted
      ? "complete"
      : index === firstIncompleteIndex
        ? "active"
        : "upcoming";

    return {
      title: item.title,
      description: item.description,
      status,
      pointsReward: item.pointsReward,
      action:
        item.trigger === "manual"
          ? { label: item.actionLabel ?? "Open", href: item.actionUrl }
          : undefined,
    };
  });

  const handleComplete = (taskId: string) => {
    dispatch(completeMyOnboardingTask(taskId));
  };

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-body)] text-[#1C1A16]">
      <PageContainer variant="invictus" as="main">
        <header className="mb-8">
          <PageHeader
            variant="invictus"
            eyebrow="World Elite Associates"
            title="Your first year, engineered."
            description="This section is exclusively for members of Adam's eXp Realty organization."
            titleClassName="text-[30px] sm:text-[36px] leading-[1.2]"
          />
        </header>

        <nav className="mb-8 flex gap-6 border-b border-[#EDE7D8]">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative cursor-pointer -mb-px pb-3 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                  isActive
                    ? "text-[#1C1A16]"
                    : "text-[#B0A996] hover:text-[#8A8375]"
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[#1C1A16]" />
                )}
              </button>
            );
          })}
        </nav>

        {activeTab === "Your First Week" ? (
          <div className="mb-10 space-y-3">
            {isLoading && items.length === 0 ? (
              <p className="px-1 text-sm text-[#B0A996]">Loading your checklist…</p>
            ) : (
              items.map((item, index) => (
                <ChecklistRow
                  key={item._id}
                  item={checklist[index]}
                  index={index + 1}
                  isSubmitting={completingTaskId === item._id}
                  onComplete={() => handleComplete(item._id)}
                />
              ))
            )}
          </div>
        ) : (
          <div className="mb-10 rounded-lg border border-[#EDE7D8] px-6 py-12 text-center">
            <p className="text-sm text-[#B0A996]">
              {activeTab === "Upcoming Sessions"
                ? "Your upcoming sessions will appear here once scheduled."
                : "New milestones unlock as you complete your first week."}
            </p>
          </div>
        )}

        {/* CTA banner */}
        <section className="flex flex-col items-start justify-between gap-4 rounded-lg bg-[#FAF6EE] border border-[#DECDB0] shadow-2xs px-6 py-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4A3B12]">
              Associates Only
            </p>
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1C1A16]">
              Ready to manage your listings and commissions?
            </p>
          </div>
          <a
            href="#"
            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md bg-[#1C1A16] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#332C1E]"
          >
            Go to WE Command Center
            <ExternalLinkIcon />
          </a>
        </section>
      </PageContainer>
    </div>
  );
}
