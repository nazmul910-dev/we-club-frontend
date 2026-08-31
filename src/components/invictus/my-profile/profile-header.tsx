"use client";

import { Pencil, LockKeyhole } from "lucide-react";

import { useState } from "react";

import ProfileImageModal from "./profile-image-modal";

export default function ProfileHeader({ profile }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white border border-[#E8E0D2] rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                className="w-24 h-24 rounded-full object-cover border border-[#C9A962]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#EFE8DA] flex items-center justify-center text-2xl font-serif text-[#111]">
                {profile.fullName?.slice(0, 2)}
              </div>
            )}

            <button
              onClick={() => setOpen(true)}
              className="absolute bottom-1 cursor-pointer right-1 bg-[#C9A962] rounded-full p-2"
            >
              <Pencil size={13} />
            </button>
          </div>

          <div>
            <h2 className="text-3xl font-serif text-[#111]">
              {profile.fullName}
            </h2>

            <p className="mt-2 text-xs tracking-[3px] uppercase text-[#C9A962]">
              {profile.role}
            </p>
          </div>
        </div>

        <a
          href="/invictus/my-profile/change-password"
          className="flex items-center justify-center gap-2 border border-[#C9A962] rounded-full px-6 py-3 text-xs tracking-widest text-[#111]"
        >
          <LockKeyhole size={14} />
          CHANGE PASSWORD
        </a>
      </div>

      <ProfileImageModal open={open} close={() => setOpen(false)} />
    </>
  );
}
