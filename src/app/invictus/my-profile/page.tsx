"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import { getMyProfile } from "@/lib/features/profile/profileApi";
import ProfilePage from "@/components/invictus/my-profile/profile-page";


export default function Page() {
  const dispatch = useAppDispatch();

  const { profile, loading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (!profile) {
      dispatch(getMyProfile());
    }
  }, [dispatch, profile]);

  return <ProfilePage profile={profile} loading={loading} />;
}
