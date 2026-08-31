"use client";

import { useState } from "react";

import { Pencil } from "lucide-react";
import ProfileBioModal from "./profile-bio-modal";



export default function ProfileBio({ profile }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white border border-[#E8E0D2] rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs tracking-[4px] uppercase text-[#C9A962]">
            BIOGRAPHY
          </h3>

          <button onClick={() => setOpen(true)} className="text-[#C9A962] cursor-pointer">
            <Pencil size={15} />
          </button>
        </div>

        <div className="min-h-[130px] border border-[#EEE7DA] rounded-xl p-5 text-sm leading-7 text-[#555]">
          {profile.bio ? (
            profile.bio
          ) : (
            <span className="text-[#999]">Add biography</span>
          )}
        </div>
      </div>

      <ProfileBioModal
        open={open}
        close={() => setOpen(false)}
        bio={profile.bio || ""}
      />
    </>
  );
}
