"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { Menu, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { getInitials, formatLabel } from "@/lib/utils/auth";
import { fetchCurrentUserProfile } from "@/lib/features/auth/authUserSlice";


import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
 
export default function Topbar({ setIsOpen }: Props) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.authUser.profile);
  const tokenUser = useAppSelector((state) => state.authUser.user);
  const isProfileLoading = useAppSelector((state) => state.authUser.isProfileLoading);

  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  useEffect(() => { 

    if (tokenUser?.id && !profile && !isProfileLoading) {
      dispatch(fetchCurrentUserProfile(tokenUser.id));
    }
  }, [tokenUser, profile, isProfileLoading, dispatch]);


  React.useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  };

  document.addEventListener("keydown", down);

  return () => document.removeEventListener("keydown", down);
}, []);

  const fullName = profile?.fullName;
  const role = profile?.role || tokenUser?.role;

  const profileImage = profile?.profileImage;
  const location = [profile?.city, profile?.country].filter(Boolean).join(" · ");


  return (
    <>
    <header className="sticky top-0 right-0 left-0 z-40 border-b border-[#2B2B2B] bg-[#0A0A0A] w-full">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden mr-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[#3A3120] text-[#CDAE53] hover:bg-[#1a1610] transition"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden w-full max-w-52 flex-1 lg:block xl:max-w-md">
  <button
    type="button"
    onClick={() => setOpen(true)}
    className="relative flex h-10 w-full items-center rounded-lg border border-[#3A3120] bg-[#131313] pl-11 pr-14 text-left text-sm text-[#888] transition-all duration-200 hover:border-[#CDAE53]"
  >
    <Search
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"
    />

    <span>Search...</span>

    <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-[#3A3120] px-2 py-0.5 text-xs text-[#888]">
      ⌘ K
    </span>
  </button>
</div>
 
        <div className="flex flex-row-reverse md:flex-col items-center gap-2">
          <div className="flex items-center gap-3">
 
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

    <CommandDialog open={open} onOpenChange={setOpen}>
  <Command className="bg-gray-900 text-white">
    <CommandInput placeholder="Search pages..." />

    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>

      <CommandGroup heading="Navigation" >
        
        <CommandItem
        className="text-amber-300"
          onSelect={() => {
            router.push("/dashboard");
            setOpen(false);
          }}
        >
          Dashboard
        </CommandItem>

        <CommandItem
        className="text-amber-300"
          onSelect={() => {
            router.push("/dashboard/listings");
            setOpen(false);
          }}
        >
          Listings
        </CommandItem>

        <CommandItem
        className="text-amber-300"
          onSelect={() => {
            router.push("/dashboard/users");
            setOpen(false);
          }}
        >
          Users
        </CommandItem>

        <CommandItem
        className="text-amber-300"
          onSelect={() => {
            router.push("/dashboard/manage-listings");
            setOpen(false);
          }}
        >
          Manage Listings
        </CommandItem>

        <CommandItem
        className="text-amber-300"
          onSelect={() => {
            router.push("/dashboard/network-directory");
            setOpen(false);
          }}
        >
          Network Directory
        </CommandItem>

        <CommandItem
        className="text-amber-300"
          onSelect={() => {
            router.push("/dashboard/my-promoters");
            setOpen(false);
          }}
        >
          My Promoters
        </CommandItem>

        <CommandItem
        className="text-amber-300"
          onSelect={() => {
            router.push("/dashboard/commission-ledger");
            setOpen(false);
          }}
        >
          Commission Ledger
        </CommandItem>

        <CommandItem
        className="text-amber-300"
          onSelect={() => {
            router.push("/dashboard/academy");
            setOpen(false);
          }}
        >
          Academy
        </CommandItem>

        <CommandItem
        className="text-amber-300"
          onSelect={() => {
            router.push("/dashboard/profile");
            setOpen(false);
          }}
        >
          My Profile
        </CommandItem>

        <CommandItem
        className="text-amber-300"
          onSelect={() => {
            router.push("/dashboard/manager-management");
            setOpen(false);
          }}
        >
          Manager Management
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</CommandDialog>
    
    </>
    
  );
}