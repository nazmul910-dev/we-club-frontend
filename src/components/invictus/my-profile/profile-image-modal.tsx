"use client";

import { useEffect, useState } from "react";

import { X, Upload } from "lucide-react";

import { useAppDispatch } from "@/lib/redux/store/hook";

import { updateProfileImage } from "@/lib/features/profile/profileApi";

export default function ProfileImageModal({ open, close }: any) {
  const dispatch = useAppDispatch();

  const [file, setFile] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);

      return;
    }

    const url = URL.createObjectURL(file);

    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!open) return null;

  const upload = () => {
    if (!file) return;

    dispatch(updateProfileImage(file));

    close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-5">
      <div className="bg-white rounded-2xl border border-[#E8E0D2] p-8 w-full max-w-md">
        <div className="flex justify-between mb-6">
          <h2 className="font-serif text-2xl">Update Avatar</h2>

          <button onClick={close} className=" cursor-pointer hover:text-red-500 duration-300 transition-all ease-in-out">
            <X />
          </button>
        </div>

        <label className="h-48 border border-dashed border-[#C9A962] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" />
          ) : (
            <div className="text-[#C9A962] flex flex-col items-center">
              <Upload />

              <span className="text-xs mt-2">Choose Image</span>
            </div>
          )}

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        <button
          onClick={upload}
          className="mt-6 w-full h-12 cursor-pointer hover:bg-[#C9A962]/80 duration-200 rounded-full bg-[#C9A962] text-white uppercase text-xs tracking-widest"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
