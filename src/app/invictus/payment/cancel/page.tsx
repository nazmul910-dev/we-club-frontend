"use client";

import Link from "next/link";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";

export default function InvictusPaymentCancelPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#FAF8F3] px-4 py-12">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#B18A3A]/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="overflow-hidden rounded-3xl border border-[#E8DDCA] bg-white p-8 text-center shadow-lg md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-[#B18A3A]">
            <AlertCircle className="h-10 w-10 text-[#B18A3A]" />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[4px] text-[#B18A3A]">
            INVICTUS CHALLENGE
          </p>
          <h1 className="mt-2 font-serif text-2xl font-bold text-[#171717] md:text-3xl">
            Checkout Cancelled
          </h1>
          <p className="mt-3 text-sm text-[#8A8175] leading-relaxed">
            Your payment was not completed and your card was not charged. You can return to the challenge and try again whenever you are ready.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/invictus/invictus-challenge"
              className="flex-1 inline-flex items-center justify-center rounded-xl bg-[#B18A3A] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#997734] transition-all text-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Link>

            <Link
              href="/invictus/academy"
              className="flex-1 inline-flex items-center justify-center rounded-xl border border-[#C8B89A] bg-white px-6 py-3.5 text-sm font-semibold text-[#4A4A4A] hover:bg-[#FAF8F3] transition-all text-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4 text-[#B18A3A]" />
              Back to Academy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
