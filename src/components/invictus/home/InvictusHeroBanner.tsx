"use client";

import { useAppSelector } from "@/lib/redux/store/hook";
import PageTitle from "@/components/common/PageTitle";

export default function InvictusHeroBanner() {
  const profile = useAppSelector((state) => state.authUser.profile);
  const fullName = profile?.fullName;
  const firstName = fullName ? fullName.split(" ")[0] : "Alexander";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#DECDB0] bg-gradient-to-b from-[#FDFBF7] to-[#F7F3EA] p-8 md:p-12 text-center shadow-xs">
      <div className="mx-auto max-w-2xl space-y-3">
        <p className="font-montserrat text-[10px] md:text-xs font-semibold tracking-[0.28em] text-[#9E7B28] uppercase">
          WELCOME TO THE CAMPUS
        </p>

        <PageTitle
          fontFamily="font-playfair"
          className="text-2xl md:text-4xl text-[#241D15] font-normal leading-snug"
        >
          Welcome back to the{" "}
          <span className="font-playfair italic font-medium text-[#9E7B28]">
            INVICTUS
          </span>{" "}
          Academy, <span className="italic">{firstName}</span>.
        </PageTitle>

        <p className="font-playfair italic text-base md:text-xl text-[#6B5F50] leading-relaxed pt-1">
          Your 3.0 version is waiting for you —{" "}
          <span className="not-italic">one room at a time...</span>
        </p>
      </div>
    </div>
  );
}
