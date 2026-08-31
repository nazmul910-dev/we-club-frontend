"use client";

import { useEffect, useState } from "react";
import { User, Award, BookOpen, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchMyAllVideoProgress } from "@/lib/features/invictus/videoProgress/videoProgressSlice";
import { fetchMyAllProgress } from "@/lib/features/invictus/academy/progress/progressSlice";
import { fetchMyCertificates } from "@/lib/features/invictus/academy/cerfificate/certificateSlice";
import { fetchPillars } from "@/lib/features/invictus/academy/pillar/pillarSlice";

import ProfileHeader from "./profile-header";
import ProfileParticulars from "./profile-particulars";
import ProfileBio from "./profile-bio";
import ProfileSocialLinks from "./profile-social-links";
import ProfileAcademyProgress from "./profile-academy-progress";
import ProfilePageSkeleton from "./profile-page-skeleton";
import PageHeader from "@/components/common/PageHeader";

interface Props {
  profile: any;
  loading: boolean;
}

export default function ProfilePage({ profile, loading }: Props) {
  const dispatch = useAppDispatch();

  const [activeSection, setActiveSection] = useState<"details" | "progress">("details");

  const videoHistory = useAppSelector((state) => state.videoProgress.myHistory);
  const moduleProgressList = useAppSelector((state) => state.progress.myProgress);
  const myCertificates = useAppSelector((state) => state.certificate.myCertificates);
  const pillars = useAppSelector((state) => state.pillar.pillars);

  useEffect(() => {
    dispatch(fetchMyAllVideoProgress());
    dispatch(fetchMyAllProgress());
    dispatch(fetchMyCertificates());
    dispatch(fetchPillars(false));
  }, [dispatch]);

  if (loading || !profile) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          variant="invictus"
          className="mb-8"
          eyebrow="ACCOUNT · PRIVATE"
          title="My Profile & Progress"
          description="Manage your executive particulars and track your Invictus Challenge milestones."
          fontFamily="font-serif"
          titleClassName="text-4xl sm:text-5xl text-[#111]"
        />

        <ProfileHeader profile={profile} />

        {/* Primary Profile vs Challenge Progress Tab Switcher */}
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[#E8E0D2] bg-white p-2 shadow-sm">
          <button
            onClick={() => setActiveSection("details")}
            className={`flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition duration-200 ${
              activeSection === "details"
                ? "bg-[#B08A3E] text-white shadow-md"
                : "text-[#8A8175] hover:bg-[#F3E9D2]/60 hover:text-[#1C1A17]"
            }`}
          >
            <User size={18} />
            <span>Profile Particulars & Bio</span>
          </button>

          <button
            onClick={() => setActiveSection("progress")}
            className={`flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition duration-200 ${
              activeSection === "progress"
                ? "bg-[#B08A3E] text-white shadow-md"
                : "text-[#8A8175] hover:bg-[#F3E9D2]/60 hover:text-[#1C1A17]"
            }`}
          >
            <BookOpen size={18} />
            <span>Invictus Challenge & Academy Progress</span>
            {myCertificates.length > 0 && (
              <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C1A17] text-[10px] font-bold text-[#F3E9D2]">
                {myCertificates.length}
              </span>
            )}
          </button>
        </div>

        {/* Content Section */}
        {activeSection === "details" ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_330px]">
            <div className="space-y-8">
              <ProfileParticulars profile={profile} />
              <ProfileBio profile={profile} />
            </div>

            <div>
              <ProfileSocialLinks profile={profile} />
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <ProfileAcademyProgress
              videoHistory={videoHistory}
              moduleProgressList={moduleProgressList}
              certificates={myCertificates}
              pillars={pillars}
              userName={profile.fullName}
            />
          </div>
        )}
      </div>
    </div>
  );
}
