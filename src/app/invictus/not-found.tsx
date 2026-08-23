"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#F3EBD8] mb-6">
          <Compass className="w-10 h-10 text-[#947124]" strokeWidth={1.5} />
        </div>

        <h1 className="font-playfair text-7xl font-normal tracking-tight text-[#1C1814]">
          404
        </h1>

        <h2 className="font-playfair mt-3 text-2xl italic font-medium text-[#9E7B28]">
          Page not found
        </h2>

        <p className="mt-2 text-sm text-[#6B5F50] leading-relaxed">
          This page isn't part of the Invictus experience, or it may have
          moved.
        </p>

        <button
          onClick={() => router.back()}
          className="cursor-pointer group mt-8 inline-flex items-center gap-2 rounded-full bg-[#1C1814] px-6 py-3 text-sm font-medium text-[#FAF8F5] transition-all duration-300 ease-out hover:bg-[#947124] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 ease-out group-hover:-translate-x-1" />
          Back
        </button>
      </div>
    </div>
  );
}