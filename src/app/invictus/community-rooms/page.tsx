"use client";

import { useEffect } from "react";
import { CouncilCard } from "@/components/invictus/community/CouncilCard";
import { RoomCard } from "@/components/invictus/community/RoomCard";
import { fetchCurrentUserProfile } from "@/lib/features/auth/authUserSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

const focusGroups = [
  { code: "CA", countryName: "Canada", name: "World Élite Canada — Focus Group & Referrals", status: "enter" as const },
  { code: "US", countryName: "United States", name: "World Élite USA — Focus Group & Referrals", status: "invitation" as const },
  { code: "ES", countryName: "Spain", name: "World Élite Spain — Focus Group & Referrals", status: "invitation" as const },
  { code: "MX", countryName: "Mexico", name: "World Élite Mexico — Focus Group & Referrals", status: "invitation" as const },
  { code: "PT", countryName: "Portugal", name: "World Élite Portugal — Focus Group & Referrals", status: "invitation" as const },
  { code: "FR", countryName: "France", name: "World Élite France — Focus Group & Referrals", status: "invitation" as const },
  // { name: "Contact World Élite for Global Referrals", status: "enter" as const },
];

const innerCircles = [
  { name: "CCC — CEOs Council Club" },
  { name: "FCC — Founders Council Club" },
  { name: "The NewGen VIP Community" },
  { name: "World Élite Inner Circle" },
];

export default function CommunityRoomsPage() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.authUser.profile?.role);
  const profile = useAppSelector((state) => state.authUser.profile);
  const tokenUser = useAppSelector((state) => state.authUser.user);
  const isProfileLoading = useAppSelector(
    (state) => state.authUser.isProfileLoading,
  );
  const countryName = profile?.country;
  const canChooseAnyRoom =
    role === "founder" || role === "admin" || role === "manager";

  useEffect(() => {
    if (tokenUser?.id && !profile && !isProfileLoading) {
      dispatch(fetchCurrentUserProfile(tokenUser.id));
    }
  }, [dispatch, isProfileLoading, profile, tokenUser?.id]);

  return (
    <PageContainer variant="invictus" as="main">
      {/* page head */}
      <div className="mb-9">
        <PageHeader
          variant="invictus"
          eyebrow="Community Rooms"
          title="Where the work happens."
          titleClassName="text-[clamp(2.2rem,4.4vw,3.6rem)]"
        />
      </div>

      {/* focus groups */}
      <section className="mb-16 p-8 md:p-10 rounded-2xl border border-[#DECDB0]">
        <div className="mb-7 flex flex-col">
          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold-deep">
            Focus Groups
          </span>
          <h2 className="font-display text-2xl font-medium tracking-[-0.005em]">
            World Élite Global
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
          {focusGroups.map((room, i) => (
            <RoomCard
              key={room.name}
              {...room}
              href={`/invictus/community-rooms/chat?countryName=${encodeURIComponent(room.countryName ?? "")}`}
              status={canChooseAnyRoom ? "enter" : room.status}
              disabled={!canChooseAnyRoom && room.countryName !== countryName}
              delay={i * 60}
            />
          ))}
        </div>
      </section>

      {/* inner circles */}
      <section>
        <div className="mb-7 flex flex-col">
          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold-deep">
            Inner Circles
          </span>
          <h2 className="font-display text-2xl font-medium tracking-[-0.005em]">
            Invitation-only councils
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {innerCircles.map((circle, i) => (
            <CouncilCard key={circle.name} {...circle} delay={i * 80} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
