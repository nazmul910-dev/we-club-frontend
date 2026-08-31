"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, SearchX } from "lucide-react";
import PageTitle from "@/components/common/PageTitle";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#1A1610] mb-6">
          <SearchX className="w-10 h-10 text-[#CDAE53]" strokeWidth={1.5} />
        </div>

        <PageTitle className="text-7xl font-semibold tracking-tight text-white">
          404
        </PageTitle>

        <h2 className="mt-3 text-xl font-medium text-white">
          Page not found
        </h2>

        <p className="mt-2 text-sm text-[#8C8273] leading-relaxed">
          The dashboard page you're looking for doesn't exist or may have
          been moved.
        </p>

        <button
          onClick={() => router.back()}
          className="cursor-pointer group mt-8 inline-flex items-center gap-2 rounded-full bg-[#CDAE53] px-6 py-3 text-sm font-medium text-[#0A0A0A] transition-all duration-300 ease-out hover:bg-[#b89a42] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#CDAE53]/20 active:translate-y-0"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 ease-out group-hover:-translate-x-1" />
          Back
        </button>
      </div>
    </div>
  );
}