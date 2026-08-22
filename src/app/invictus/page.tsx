"use client";

import { useState } from "react";
import InvictusHeroBanner from "@/components/invictus/home/InvictusHeroBanner";
import InvictusChallengeCard from "@/components/invictus/home/InvictusChallengeCard";
import InvictusCampusSection from "@/components/invictus/home/InvictusCampusSection";
import { Calendar, Video, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function InvictusCampusPage() {
  const router = useRouter();
  const [switchModal, setSwitchModal] = useState(false);

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-10 space-y-8">
        <InvictusHeroBanner />

        <InvictusChallengeCard />

        <InvictusCampusSection />

        <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] p-5 text-center shadow-xs space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#DECDB0] bg-white shadow-2xs">
              <span className="font-playfair text-base font-bold italic text-[#9E7B28]">
                WE
              </span>
            </div>
            <p className="font-montserrat text-xs text-[#5C5348] leading-relaxed">
              Go now to the <span className="font-bold text-[#1C1814]">WORLD ÉLITE — COMMAND CENTER</span> to find and refer properties.
            </p>
            <button
              type="button"
              onClick={() => setSwitchModal(true)}
              className="inline-flex items-center justify-center gap-1.5 font-montserrat text-xs font-bold uppercase tracking-wider text-[#9E7B28] hover:text-[#7C5F1E] transition cursor-pointer"
            >
              <span>ENTER</span>
              <ExternalLink size={13} />
            </button>
          </div>

          {/* Sessions (Mobile) */}
          <div className="rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] p-5 shadow-xs space-y-3">
            <h4 className="font-montserrat text-[10px] font-bold tracking-[0.2em] text-[#1C1814] uppercase">
              UPCOMING GENERAL SESSIONS
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-xl border border-[#EAE2D2] bg-white p-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#FAF4E6] text-[#9E7B28]">
                  <Calendar size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-montserrat text-xs font-bold text-[#1C1814] truncate">Thursday Live w/ Adam</p>
                  <p className="font-montserrat text-[10px] text-[#7A7062]">Thu · 6:00 PM CET</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[#EAE2D2] bg-white p-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#FAF4E6] text-[#9E7B28]">
                  <Video size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-montserrat text-xs font-bold text-[#1C1814] truncate">1:1 w/ Sofia Marchetti</p>
                  <p className="font-montserrat text-[10px] text-[#7A7062]">Fri · 11:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Switch Platform Confirmation Modal */}
      <Dialog open={switchModal} onOpenChange={setSwitchModal}>
        <DialogContent className="max-w-md rounded-2xl border border-[#DECDB0] bg-[#FAF8F5] text-[#1C1814] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl font-bold text-[#1C1814]">
              Switch to Command Center
            </DialogTitle>
            <DialogDescription className="text-[#6B6358] font-lato text-sm">
              Are you sure you want to switch to the WORLD ÉLITE — Command Center platform?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-5 gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setSwitchModal(false)}
              className="h-10 cursor-pointer rounded-xl border border-[#D9CEBA] bg-white px-5 font-montserrat text-xs font-semibold text-[#4A4237] transition hover:bg-[#F5EEDB]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                setSwitchModal(false);
                router.push("/dashboard");
              }}
              className="h-10 cursor-pointer rounded-xl bg-[#947124] px-5 font-montserrat text-xs font-semibold text-white transition hover:bg-[#7C5F1E]"
            >
              Yes, Switch
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}