"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { UserProfile } from "@/lib/features/profile/profileSlice";
import ProfileBioModal from "./profile-bio-modal";


interface Props {
  profile: UserProfile;
}


export default function ProfileBio({
  profile,
}: Props) {


  const [open, setOpen] = useState(false);


  return (
    <>
      <div
        className="
        mt-6
        border
        border-[#302718]
        rounded-xl
        bg-[#111]
        p-6
        "
      >

        <div
          className="
          flex
          justify-between
          items-center
          mb-5
          "
        >

          <h3
            className="
            text-[#C9A962]
            text-xs
            tracking-[3px]
            uppercase
            "
          >
            Biography
          </h3>


          <button
            onClick={() => setOpen(true)}
            className="
            text-[#C9A962]
            hover:text-white
            transition
            "
          >
            <Pencil size={15}/>
          </button>


        </div>



        <div
          className="
          min-h-[100px]
          border
          border-[#302718]
          rounded-md
          bg-[#0d0d0d]
          p-4
          text-sm
          text-white
          leading-relaxed
          "
        >


          {
            profile.bio
            ?
            profile.bio
            :
            <span className="text-[#777]">
              Add biography
            </span>
          }


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