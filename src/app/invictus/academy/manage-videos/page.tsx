"use client";

import { useState } from "react";

import { Upload, Video, Lock, Unlock } from "lucide-react";

import UploadVideoModal from "@/components/invictus/academy/videos/UploadVideoModal";
import AuthGuard from "@/components/Auth/authGuard/AuthGuard";



export default function ManageVideosPage() {
  return (
    <AuthGuard allowedRoles={["founder", "manager", "admin"]}>
      <ManageVideosContent />
    </AuthGuard>
  );
}

function ManageVideosContent() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080808] px-6 py-10 text-white">
      <div className="flex items-center justify-between rounded-3xl border border-[#C9A84C]/20 bg-[#111] p-8">
        <div>
          <p className="text-sm uppercase tracking-[3px] text-[#C9A84C]">
            Invictus Academy
          </p>

          <h1 className="mt-3 text-3xl font-bold">Video Management</h1>

          <p className="mt-2 text-gray-400">
            Upload and manage academy lessons
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#C9A84C] px-5 py-3 font-semibold text-black"
        >
          <Upload size={18} />
          Upload Video
        </button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Card icon={<Video />} title="Total Videos" value="24" />

        <Card icon={<Unlock />} title="Free Videos" value="14" />

        <Card icon={<Lock />} title="Premium Videos" value="10" />
      </div>

      {open && <UploadVideoModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function Card({ icon, title, value }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
      <div className="text-[#C9A84C]">{icon}</div>

      <p className="mt-4 text-gray-400">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </div>
  );
}
