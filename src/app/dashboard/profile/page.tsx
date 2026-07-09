"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import { getMyProfile } from "@/lib/features/profile/profileApi";

import ProfilePageHeader from "@/components/profile/profile-page-header";
import ProfileHeaderCard from "@/components/profile/profile-header-card";
import ProfileParticulars from "@/components/profile/profile-particulars";
import ProfileStanding from "@/components/profile/profile-standing";
import ProfileBio from "@/components/profile/profile-bio";

export default function ProfilePage() {
  const dispatch = useAppDispatch();

  const profile = useAppSelector((state) => state.profile.profile);


  const loading = useAppSelector((state) => state.profile.loading);

  useEffect(() => {
    if (!profile) {
      dispatch(getMyProfile());
    }
  }, [profile, dispatch]); 

  console.log("Profile data1:", profile);

  if (loading || !profile) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div
      className="
min-h-screen
bg-[#090909]
px-6
py-10
"
    >
      <div
        className="
max-w-6xl
mx-auto
"
      >
        <ProfilePageHeader />

        <ProfileHeaderCard profile={profile} />

        <div
          className="
grid
lg:grid-cols-[1fr_300px]
gap-6
mt-6
"
        >
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
