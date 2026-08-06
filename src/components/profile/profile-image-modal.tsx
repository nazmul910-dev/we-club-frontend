"use client";

import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";

import { useAppDispatch } from "@/lib/redux/store/hook";

import {
  updateProfileImage
} from "@/lib/features/profile/profileApi";

interface Props {
  open: boolean;
  close: () => void;
}

export default function ProfileImageModal({
  open,
  close
}: Props) {

  const dispatch = useAppDispatch();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!open)
    return null;

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    close();
  }

  const uploadImage = () => {
    if (!file)
      return;

    dispatch(
      updateProfileImage(file)
    );

    handleClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">

      <div className="bg-[#111] border border-[#302718] rounded-xl p-6 w-full max-w-md">

        <div className="flex justify-between mb-6">
          <h2 className="text-white font-serif text-2xl">
            Update Avatar
          </h2>

          <button onClick={handleClose}>
            <X className="text-white cursor-pointer" />
          </button>
        </div>

        <label className="h-40 border border-dashed border-[#C9A962] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#C9A962] overflow-hidden relative">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <>
              <Upload />
              <span className="mt-2 text-xs">
                Choose Image
              </span>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={
              e =>
                setFile(
                  e.target.files?.[0] || null
                )
            }
          />
        </label>

        <button
          onClick={uploadImage}
          className="mt-5 w-full bg-[#C9A962] text-white cursor-pointer hover:bg-[#C9A962]/90 transition duration-300 py-3 rounded-md uppercase text-xs tracking-widest"
        >
          Upload
        </button>

      </div>

    </div>
  )
}