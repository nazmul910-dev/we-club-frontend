"use client";

import { useEffect } from "react";
import { Menu, Search, ArrowLeftRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { getInitials, formatLabel } from "@/lib/utils/auth";
import { fetchCurrentUserProfile } from "@/lib/features/auth/authUserSlice";

interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
 
export default function Topbar({ setIsOpen }: Props) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.authUser.profile);
  const tokenUser = useAppSelector((state) => state.authUser.user);
  const isProfileLoading = useAppSelector((state) => state.authUser.isProfileLoading);

  useEffect(() => { 

    if (tokenUser?.id && !profile && !isProfileLoading) {
      dispatch(fetchCurrentUserProfile(tokenUser.id));
    }
  }, [tokenUser, profile, isProfileLoading, dispatch]);

  console.log("TopId",tokenUser?.id)
  const fullName = profile?.fullName;
  const role = profile?.role || tokenUser?.role;
  const accessTo = profile?.accessTo || tokenUser?.accessTo;
  const profileImage = profile?.profileImage;
  const location = [profile?.city, profile?.country].filter(Boolean).join(" · ");
  const showSwitchButton = accessTo === "both";

  return (
    <header className="sticky top-0 z-50 border-b border-[#2B2B2B] bg-[#0A0A0A]">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden mr-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[#3A3120] text-[#CDAE53] hover:bg-[#1a1610] transition"
        >
          <Menu size={20} />
        </button>

        <div className="relative flex-1 hidden md:block max-w-52 lg:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-full rounded-lg border border-[#3A3120] bg-[#131313] pl-11 pr-14 text-sm text-white placeholder:text-[#888] outline-none transition-all duration-200 focus:border-[#CDAE53]"
          />
          <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[#3A3120] px-2 py-0.5 text-xs text-[#888] lg:block">
            ⌘ K
          </span>
        </div>

        <div className="flex flex-row-reverse md:flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            {showSwitchButton && (
              <button
                type="button"
                title="Switch Platform"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3A3120] text-[#CDAE53] transition hover:bg-[#1a1610] sm:h-10 sm:w-auto sm:gap-2 sm:px-3"
              >
                <ArrowLeftRight size={16} />
                <span className="hidden font-montserrat text-[11px] uppercase tracking-wider sm:inline">
                  Switch Platform
                </span>
              </button>
            )}

            <div className="hidden text-right sm:block">
              <h4 className="font-playfair text-xs font-light text-white lg:text-sm">
                {fullName || "Loading..."}
              </h4>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#888]">
                {location || "\u00A0"}
              </p>
            </div>

            {profileImage ? (
              <img
                src={profileImage}
                alt={fullName || "User"}
                className="h-8 w-8 rounded-full border border-[#CDAE53] object-cover sm:h-9 sm:w-9 md:h-10 md:w-10"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#CDAE53] bg-[#171717] text-[10px] font-medium text-[#CDAE53] sm:h-9 sm:w-9 md:h-10 md:w-10 md:text-xs">
                {getInitials(fullName)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#7bd0a469] bg-[#7bd0a418] px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7bd0a4]" />
            <span className="font-montserrat text-[7px] uppercase tracking-[2px] text-[#7bd0a4] sm:text-[8px]">
              {formatLabel(role) || "..."}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}