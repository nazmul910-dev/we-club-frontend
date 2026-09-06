"use client";

import { useEffect, useState } from "react";
import { CouncilCard } from "@/components/invictus/community/CouncilCard";
import { RoomCard } from "@/components/invictus/community/RoomCard";
import { fetchCurrentUserProfile } from "@/lib/features/auth/authUserSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import { getPrivateRoomAccess, type PrivateRoomAccess } from "@/lib/features/addManager/privateRoomApi";
import {
  getCountryRoomAccess,
  getCountryRoomRequestsForReview,
  requestCountryRoom,
  reviewCountryRoomRequest,
  type CountryRoomAccess,
  type CountryRoomRequest,
} from "@/lib/features/addManager/privateRoomApi";
import { toast } from "sonner";

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
  { name: "CCC — CEOs Council Club", slug: "ceos-council-club" },
  { name: "FCC — Founders Council Club", slug: "founders-council-club" },
  { name: "The NewGen VIP Community", slug: "vip-community" },
  { name: "World Élite Inner Circle", slug: "world-elite-inner-circle" },
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
  const canEnterPrivateRooms = role === "founder" || role === "manager";
  const [privateRoomAccess, setPrivateRoomAccess] = useState<PrivateRoomAccess[]>([]);
  const [countryAccess, setCountryAccess] = useState<Record<string, CountryRoomAccess>>({});
  const [reviewRequests, setReviewRequests] = useState<CountryRoomRequest[]>([]);

  useEffect(() => {
    if (tokenUser?.id && !profile && !isProfileLoading) {
      dispatch(fetchCurrentUserProfile(tokenUser.id));
    }
  }, [dispatch, isProfileLoading, profile, tokenUser?.id]);

  useEffect(() => {
    getPrivateRoomAccess()
      .then(setPrivateRoomAccess)
      .catch(() => setPrivateRoomAccess([]));
  }, []);

  const loadCountryAccess = async () => {
    const results = await Promise.all(
      focusGroups.map(async (room) => [
        room.countryName,
        await getCountryRoomAccess(room.countryName),
      ] as const),
    );
    setCountryAccess(Object.fromEntries(results));
  };

  useEffect(() => {
    loadCountryAccess().catch(() => undefined);
  }, [role, countryName]);

  useEffect(() => {
    if (role !== "founder" && role !== "manager") return;
    getCountryRoomRequestsForReview()
      .then(setReviewRequests)
      .catch(() => setReviewRequests([]));
  }, [role]);

  const handleRequest = async (roomCountry: string) => {
    try {
      await requestCountryRoom(roomCountry);
      toast.success(`Request sent for the ${roomCountry} community`);
      await loadCountryAccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Could not send request");
    }
  };

  const handleReview = async (
    requestId: string,
    status: "approved" | "rejected",
  ) => {
    try {
      await reviewCountryRoomRequest(requestId, status);
      setReviewRequests((current) =>
        current.filter((request) => request._id !== requestId),
      );
      toast.success(status === "approved" ? "Request approved" : "Request rejected");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Could not review request");
    }
  };

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
              status={
                canChooseAnyRoom || countryAccess[room.countryName]?.canEnter
                  ? "enter"
                  : "invitation"
              }
              disabled={!canChooseAnyRoom && !countryAccess[room.countryName]?.canEnter}
              onRequest={
                !canChooseAnyRoom && !countryAccess[room.countryName]?.canEnter
                  ? () => handleRequest(room.countryName)
                  : undefined
              }
              requestLabel={
                countryAccess[room.countryName]?.requestStatus === "pending"
                  ? "Request pending"
                  : "Request to join"
              }
              delay={i * 60}
            />
          ))}
        </div>
      </section>

      {(role === "founder" || role === "manager") && reviewRequests.length > 0 && (
        <section className="mt-10 rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] p-6">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold-deep">
            Room requests
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium">Review country access</h2>
          <div className="mt-5 space-y-3">
            {reviewRequests.map((request) => (
              <div key={request._id} className="flex flex-col gap-3 rounded-xl border border-[#E7DDCC] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-[#1C1A17]">
                    {request.user?.fullName ?? "User"} requested {request.countryName}
                  </p>
                  <p className="text-sm text-[#8A8175]">{request.user?.email}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleReview(request._id, "rejected")} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">Reject</button>
                  <button type="button" onClick={() => handleReview(request._id, "approved")} className="rounded-lg bg-[#B08A3E] px-3 py-2 text-xs font-semibold text-white hover:bg-[#9B7835]">Approve</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
            <CouncilCard
              key={circle.name}
              name={circle.name}
              href={`/invictus/community-rooms/private?room=${encodeURIComponent(circle.slug)}`}
              canEnter={
                canEnterPrivateRooms ||
                privateRoomAccess.some(
                  (room) => room.slug === circle.slug && room.canEnter,
                )
              }
              delay={i * 80}
            />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
