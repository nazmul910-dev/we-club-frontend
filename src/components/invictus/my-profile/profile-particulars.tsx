"use client";

import { useState } from "react";

import { Pencil } from "lucide-react";

import ProfileEditModal from "./profile-edit-modal";

export default function ProfileParticulars({ profile }: any) {
  const [open, setOpen] = useState(false);

  const fields = [
    {
      label: "FULL NAME",
      value: profile.fullName,
    },

    {
      label: "TITLE",
      value: profile.role,
    },

    {
      label: "EMAIL",
      value: profile.email,
    },

    {
      label: "PHONE",
      value: profile.phone,
    },

    {
      label: "TERRITORY",
      value: `${profile.city || ""}, ${profile.country || ""}`,
    },

    {
      label: "BROKERAGE",
      value: profile.brokerage,
    },

    {
      label: "LICENSE NUMBER",
      value: profile.licenseNumber,
    },
  ];

  return (
    <>
      <div className="bg-white border border-[#E8E0D2] rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xs tracking-[4px] uppercase text-[#C9A962]">
            PARTICULARS
          </h3>

          <button
            onClick={() => setOpen(true)}
            className="text-[#C9A962] cursor-pointer hover:text-black transition"
          >
            <Pencil size={15} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {fields.map((field) => (
            <div
              key={field.label}
              className="border border-[#EEE7DA] rounded-xl p-5"
            >
              <p className="text-[10px] tracking-[3px] uppercase text-[#999]">
                {field.label}
              </p>

              <p className="mt-3 text-sm text-[#111]">
                {field.value || <span className="text-[#999]">Add</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      <ProfileEditModal
        open={open}
        close={() => setOpen(false)}
        profile={profile}
      />
    </>
  );
}
