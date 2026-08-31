"use client";

import { useState } from "react";

import { X } from "lucide-react";

import { useAppDispatch } from "@/lib/redux/store/hook";

import { updateBio } from "@/lib/features/profile/profileApi";

export default function ProfileBioModal({ open, close, bio }: any) {
  const dispatch = useAppDispatch();

  const [value, setValue] = useState(bio);

  if (!open) return null;

  const save = () => {
    dispatch(
      updateBio({
        bio: value,
      }),
    );

    close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-5">
      <div className="bg-white rounded-2xl border border-[#E8E0D2] p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-[#111]">Edit Biography</h2>

          <button onClick={close}>
            <X />
          </button>
        </div>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={6}
          className="w-full rounded-xl border border-[#E8E0D2] p-4 text-sm text-[#333] outline-none resize-none focus:border-[#C9A962]"
        />

        <button
          onClick={save}
          className="mt-6 w-full h-12 rounded-full bg-[#C9A962] text-white text-xs uppercase tracking-widest"
        >
          Save Biography
        </button>
      </div>
    </div>
  );
}
