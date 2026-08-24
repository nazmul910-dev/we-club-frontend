"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Crown } from "lucide-react";

import BgImage from "@/assets/Login/login-bg.jpg";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <Image
        src={BgImage}
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,158,53,0.15),transparent_60%)]" />

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-amber-500/20 bg-white/[0.03] p-8 text-center backdrop-blur-[6px] sm:rounded-3xl sm:p-14">

        <h1 className="font-playfair text-6xl font-bold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 sm:text-8xl">
          404
        </h1>

        <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent sm:mt-6" />

        <h2 className="mt-5 font-playfair text-xl font-medium text-white sm:mt-6 sm:text-2xl">
          This page doesn&apos;t exist
        </h2>

        <p className="mx-auto mt-3 max-w-sm font-montserrat text-sm leading-7 text-white/55 sm:text-base">
          It may have been moved, renamed, or is no longer available.
        </p>

        <button
          onClick={() => router.back()}
          className="group mt-9 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-400 px-8 py-3.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/10 transition-all duration-300 hover:scale-[1.03] hover:bg-amber-300 hover:shadow-amber-400/30 active:scale-95 sm:w-auto sm:text-base"
        >
          <ArrowLeft
            size={18}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Back
        </button>
      </div>
    </main>
  );
}