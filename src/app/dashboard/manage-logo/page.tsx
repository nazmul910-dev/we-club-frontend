"use client";

import { useEffect } from "react";
import { ImageIcon, Loader2 } from "lucide-react";

import { getLogo } from "@/lib/features/logo/logoApi";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import LogoUploadModal from "@/components/Admin/logoManagement/LogoUploadModal";

export default function ManageLogo() {
  const dispatch = useAppDispatch();
  const { logo, loading, error } = useAppSelector((state) => state.logo);

  useEffect(() => {
    dispatch(getLogo());
  }, [dispatch]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="w-full space-y-6 md:space-y-0 md:flex md:items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#cdae53]">
            Logo Management
          </p>

          <h1 className="mt-2 font-playfair text-4xl font-medium text-white">
            Site Logo
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            Upload or update the logo used across the platform.
          </p>
        </div>

        <LogoUploadModal existingLogo={logo?.logo} />
      </div>

      {/* Main Card */}
      <div className="w-full overflow-hidden rounded-2xl border border-neutral-800 bg-[#0B0B0B] shadow-xl">
        <div className="border-b border-neutral-800 px-6 py-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Current Logo
          </h2>
        </div>

        {/* Loading */}
        {loading && !logo && (
          <div className="flex h-72 items-center justify-center text-neutral-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex h-72 items-center justify-center text-red-400">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && !logo?.logo && (
          <div className="flex h-72 flex-col items-center justify-center gap-3 text-neutral-500">
            <ImageIcon className="h-10 w-10 text-neutral-700" />
            <p>No logo uploaded yet.</p>
          </div>
        )}

        {/* Logo Preview */}
        {!loading && !error && logo?.logo && (
          <div className="flex h-72 items-center justify-center p-8">
            <div className="flex h-full w-full max-w-md items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.logo}
                alt="Site logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}