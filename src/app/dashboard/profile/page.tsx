"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import { getMyProfile } from "@/lib/features/profile/profileApi";

import ProfilePageHeader from "@/components/profile/profile-page-header";
import ProfileHeaderCard from "@/components/profile/profile-header-card";
import ProfileParticulars from "@/components/profile/profile-particulars";
import ProfileStanding from "@/components/profile/profile-standing";
import ProfileBio from "@/components/profile/profile-bio";
import ProfilePageSkeleton from "@/components/profile/ProfilePageSkeleton";

export default function ProfilePage() {
  const dispatch = useAppDispatch();

  const { profile, loading } = useAppSelector(
    (state) => state.profile
  );

  useEffect(() => {
    if (!profile) {
      dispatch(getMyProfile());
    }
  }, [dispatch, profile]);

  if (loading || !profile) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#090909] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <ProfilePageHeader />

        <ProfileHeaderCard profile={profile} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <ProfileParticulars profile={profile} />
            <ProfileBio profile={profile} />
          </div>

          <ProfileStanding profile={profile} />
        </div>
      </div>
    </div>
  );
}