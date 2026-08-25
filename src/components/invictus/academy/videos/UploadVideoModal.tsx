"use client";

import { useState } from "react";

import { useAppDispatch } from "@/lib/redux/store/hook";

import { uploadModuleVideo } from "@/lib/features/invictus/academy/academySlice";

export default function UploadVideoModal({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();

  const [video, setVideo] = useState<File | null>(null);

  const [form, setForm] = useState({
    moduleId: "",

    title: "",

    description: "",

    isPaid: false,

    isRequired: false,

    requiredWatchPercent: 80,

    pointsReward: 10,

    order: 1,
  });

  const submit = () => {
    if (!video) return;

    dispatch(
      uploadModuleVideo({
        ...form,

        video,
      }),
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-xl rounded-3xl border border-[#C9A84C]/30 bg-[#111] p-8">
        <h2 className="text-2xl font-bold text-white">Upload New Video</h2>

        <div className="mt-6 space-y-4">
          <input
            placeholder="Module ID"
            className="w-full rounded-xl border border-white/10 bg-black p-3 text-white"
            onChange={(e) =>
              setForm({
                ...form,

                moduleId: e.target.value,
              })
            }
          />

          <input
            placeholder="Video Title"
            className="w-full rounded-xl border border-white/10 bg-black p-3 text-white"
            onChange={(e) =>
              setForm({
                ...form,

                title: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Description"
            className="w-full rounded-xl border border-white/10 bg-black p-3 text-white"
            onChange={(e) =>
              setForm({
                ...form,

                description: e.target.value,
              })
            }
          />

          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
          />

          <div className="flex items-center justify-between rounded-xl border border-white/10 p-4">
            <span>Premium Video?</span>

            <input
              type="checkbox"
              checked={form.isPaid}
              onChange={(e) =>
                setForm({
                  ...form,

                  isPaid: e.target.checked,
                })
              }
            />
          </div>

          <button
            onClick={submit}
            className="w-full rounded-xl bg-[#C9A84C] py-3 font-semibold text-black"
          >
            Upload
          </button>

          <button
            onClick={onClose}
            className="w-full rounded-xl border border-white/10 py-3 text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
