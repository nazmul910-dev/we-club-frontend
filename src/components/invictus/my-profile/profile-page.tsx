"use client";

import ProfileHeader from "./profile-header";
import ProfileParticulars from "./profile-particulars";
import ProfileBio from "./profile-bio";
import ProfileSocialLinks from "./profile-social-links";
import ProfilePageSkeleton from "./profile-page-skeleton";

export default function ProfilePage({ profile, loading }: any) {
  if (loading || !profile) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-[11px] tracking-[5px] uppercase text-[#C9A962]">
            ACCOUNT · PRIVATE
          </p>

          <h1 className="mt-3 text-5xl font-serif text-[#111]">My Profile</h1>

          <p className="mt-3 text-[#777]">
            The face you present to the network.
          </p>
        </div>

        <ProfileHeader profile={profile} />

        <div className="mt-8 grid lg:grid-cols-[1fr_330px] gap-8">
          <div className="space-y-8">
            <ProfileParticulars profile={profile} />

            <ProfileBio profile={profile} />
          </div>

          <div>
            <ProfileSocialLinks profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
}
