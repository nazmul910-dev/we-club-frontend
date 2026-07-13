"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Crown } from "lucide-react";

import BgImage from "@/assets/Login/login-bg.jpg";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <Image
        src={BgImage}
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-5xl rounded-2xl border border-amber-500/20 p-6 backdrop-blur-[5px] sm:rounded-3xl sm:p-8 md:p-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 font-playfair text-[10px] uppercase tracking-[0.25em] text-amber-400 sm:mb-6 sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.35em]">
            <Crown size={14} />
            WE Club Network
          </div>

          <h1 className="font-playfair text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
            Build Your
            <span className="block text-amber-400">
              Luxury Real Estate Network
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl font-montserrat text-sm leading-7 text-white/65 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
            Join an exclusive community of real estate professionals,
            collaborate with trusted partners, manage premium listings, and
            grow your referral business from one centralized platform.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Link href="/login" className="w-full sm:w-auto">
              <button
                className="
                group
                flex
                w-full
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-amber-400
                px-6
                py-3
                text-sm
                font-semibold
                text-black
                shadow-lg
                shadow-amber-500/10
                transition-all
                duration-300
                hover:scale-[1.03]
                hover:bg-amber-300
                hover:shadow-amber-400/30
                active:scale-95
                sm:w-auto
                sm:px-8
                sm:py-3.5
                sm:text-base
                "
              >
                Login
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </Link>

            <Link href="/registration" className="w-full sm:w-auto">
              <button
                className="
                group
                flex
                w-full
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-amber-400/30
                bg-white/5
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:scale-[1.03]
                hover:border-amber-400
                hover:bg-white/10
                active:scale-95
                sm:w-auto
                sm:px-8
                sm:py-3.5
                sm:text-base
                "
              >
                Create Account
                <ArrowRight
                  size={18}
                  className="translate-x-0 transition-all duration-300 group-hover:translate-x-1 "
                />
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-16 sm:gap-5 md:grid-cols-3">
          <div
            className="
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-5
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-amber-400/30
            hover:bg-white/[0.07]
            sm:p-6
            "
          >
            <ShieldCheck className="mb-3 text-amber-400 sm:mb-4" size={28} />

            <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">
              Trusted Platform
            </h3>

            <p className="text-sm leading-6 text-white/55 sm:leading-7">
              Securely manage members, listings, commissions and business
              operations in one place.
            </p>
          </div>

          <div
            className="
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-5
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-amber-400/30
            hover:bg-white/[0.07]
            sm:p-6
            "
          >
            <Users className="mb-3 text-amber-400 sm:mb-4" size={28} />

            <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">
              Professional Network
            </h3>

            <p className="text-sm leading-6 text-white/55 sm:leading-7">
              Connect with associates, partners and industry professionals to
              expand your opportunities.
            </p>
          </div>

          <div
            className="
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-5
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-amber-400/30
            hover:bg-white/[0.07]
            sm:p-6
            "
          >
            <Crown className="mb-3 text-amber-400 sm:mb-4" size={28} />

            <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">
              Premium Experience
            </h3>

            <p className="text-sm leading-6 text-white/55 sm:leading-7">
              Designed exclusively for luxury real estate professionals with a
              clean, modern and premium interface.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}