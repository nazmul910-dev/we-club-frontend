"use client";

import { useState } from "react";

import { X } from "lucide-react";

import { useAppDispatch } from "@/lib/redux/store/hook";

import { updateBasicProfile } from "@/lib/features/profile/profileApi";

export default function ProfileEditModal({ open, close, profile }: any) {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    fullName: profile.fullName || "",

    phone: profile.phone || "",

    city: profile.city || "",

    country: profile.country || "",

    brokerage: profile.brokerage || "",
  });

  if (!open) return null;

  const save = () => {
    dispatch(updateBasicProfile(form));

    close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-5">
      <div className="bg-white rounded-2xl border border-[#E8E0D2] p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif text-[#111]">Edit Profile</h2>

          <button onClick={close}>
            <X />
          </button>
        </div>

        <div className="space-y-4">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              value={(form as any)[key]}
              onChange={(e) =>
                setForm({
                  ...form,

                  [key]: e.target.value,
                })
              }
              placeholder={key}
              className="w-full h-12 rounded-lg border border-[#E8E0D2] px-4 text-sm outline-none focus:border-[#C9A962]"
            />
          ))}
        </div>

        <button
          onClick={save}
          className="mt-6 w-full h-12 rounded-full bg-[#C9A962] text-white uppercase text-xs tracking-widest"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
