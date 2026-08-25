"use client";

import ProfileHeader from "./profile-header";
import ProfileParticulars from "./profile-particulars";
import ProfileBio from "./profile-bio";
import ProfileSocialLinks from "./profile-social-links";
import ProfilePageSkeleton from "./profile-page-skeleton";
import PageHeader from "@/components/common/PageHeader";


interface props {
  profile: any;
  loading: boolean;
}

export default function ProfilePage({ profile, loading }: props) {
  if (loading || !profile) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          variant="invictus"
          className="mb-10"
          eyebrow="ACCOUNT · PRIVATE"
          title="My Profile"
          description="The face you present to the network."
          fontFamily="font-serif"
          titleClassName="text-5xl text-[#111]"
        />

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
