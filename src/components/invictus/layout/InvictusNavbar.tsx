"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import {
  Crown,
  Menu,
  Bell,
  LogOut,
  User,
  ArrowLeftRight,
  ChevronDown,
  Settings,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  logout,
  fetchCurrentUserProfile,
} from "@/lib/features/auth/authUserSlice";

import { clearProfile } from "@/lib/features/profile/profileSlice";

import { getInitials, formatLabel } from "@/lib/utils/auth";

import LanguageSwitch from "./LanguageSwitch";

interface InvictusNavbarProps {
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InvictusNavbar({
  setMobileSidebarOpen,
}: InvictusNavbarProps) {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const pathname = usePathname();

const isInvictusPage = pathname.startsWith("/invictus");

  const tokenUser = useAppSelector((state) => state.authUser.user);

  const profile = useAppSelector((state) => state.authUser.profile);

  const isProfileLoading = useAppSelector(
    (state) => state.authUser.isProfileLoading,
  );

  useEffect(() => {
    if (tokenUser?.id && !profile && !isProfileLoading) {
      dispatch(fetchCurrentUserProfile(tokenUser.id));
    }
  }, [tokenUser, profile, isProfileLoading, dispatch]);

  const fullName = profile?.fullName;

  const userRole = profile?.role || tokenUser?.role;

  const userEmail = profile?.email || tokenUser?.email;

  const profileImage = profile?.profileImage;

  const accessTo = profile?.accessTo || tokenUser?.accessTo;

  const showSwitchButton = accessTo === "both";

  const [logoutModal, setLogoutModal] = useState(false);

  const [switchModal, setSwitchModal] = useState(false);

  const handleLogout = () => {
    setLogoutModal(false);

    dispatch(clearProfile());

    dispatch(logout());

    router.push("/login");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#EAE4D7] bg-[#FAF8F5]/90 px-4 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/invictus" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EBD8]">
              <Crown
                size={20}
                className="text-[#947124] transition group-hover:scale-110"
              />
            </div>

            <span className="font-playfair text-xl font-bold tracking-[0.18em] text-[#1C1814]">
              INVICTUS
            </span>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <span className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.3em] text-[#947124]">
            LIMITLESS · FEARLESS · BORDERLESS
          </span>
        </div>

        <div className="flex items-center gap-3">
           {isInvictusPage && <LanguageSwitch/>}
           
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#6B6358] transition hover:bg-[#F3EBD8]">
            <Bell size={17} />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#947124] ring-2 ring-[#FAF8F5]" />
          </button>
          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="group flex cursor-pointer items-center gap-2 rounded-full border border-transparent p-1 transition hover:border-[#E0D7C4]">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={fullName || "avatar"}
                      className="h-9 w-9 rounded-full border border-[#947124] object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EBD8] text-xs font-bold text-[#947124]">
                      {fullName ? getInitials(fullName) : "U"}
                    </div>
                  )}

                  <ChevronDown
                    size={14}
                    className="hidden text-[#8C8273] md:block"
                  />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 rounded-2xl border border-[#EAE4D7] bg-[#FAF8F5] p-2 shadow-2xl"
              >
                <div className="rounded-xl bg-[#F7F2E7] p-3">
                  <p className="truncate font-playfair text-sm font-bold text-[#1C1814]">
                    {fullName || "Invictus Member"}
                  </p>

                  <p className="truncate font-montserrat text-[10px] text-[#8C8273]">
                    {userEmail || ""}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-[#947124]/10 px-3 py-1 font-montserrat text-[9px] font-bold uppercase text-[#947124]">
                    {formatLabel(userRole) || "Member"}
                  </span>
                </div>

                <DropdownMenuSeparator className="my-2 bg-[#EAE4D7]" />

                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                  className="flex cursor-pointer gap-3 rounded-xl py-2 font-montserrat text-xs hover:bg-[#F3EBD8]"
                >
                  <User size={15} className="text-[#947124]" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem className="flex cursor-pointer gap-3 rounded-xl py-2 font-montserrat text-xs hover:bg-[#F3EBD8]">
                  <Settings size={15} className="text-[#947124]" />
                  Account Settings
                </DropdownMenuItem>

                {showSwitchButton && (
                  <DropdownMenuItem
                    onClick={() => setSwitchModal(true)}
                    className="flex cursor-pointer gap-3 rounded-xl py-2 font-montserrat text-xs hover:bg-[#F3EBD8]"
                  >
                    <ArrowLeftRight size={15} className="text-[#947124]" />
                    Switch Platform
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="my-2 bg-[#EAE4D7]" />

                <DropdownMenuItem
                  onClick={() => setLogoutModal(true)}
                  className="flex cursor-pointer gap-3 rounded-xl py-2 font-montserrat text-xs text-red-600 hover:bg-red-50"
                >
                  <LogOut size={15} />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D9CEBA] bg-white text-[#947124] transition hover:bg-[#F3EBD8] lg:hidden"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Switch Dialog */}

      <Dialog open={switchModal} onOpenChange={setSwitchModal}>
        <DialogContent className="max-w-md rounded-2xl border border-[#DECDB0] bg-[#FAF8F5]">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl font-bold">
              Switch Platform
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to switch to Command Center?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <button
              onClick={() => setSwitchModal(false)}
              className="cursor-pointer rounded-xl border border-[#D9CEBA] px-5 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer rounded-xl bg-[#947124] px-5 py-2 text-sm text-white"
            >
              Yes Switch
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Dialog */}

      <Dialog open={logoutModal} onOpenChange={setLogoutModal}>
        <DialogContent className="max-w-md rounded-2xl border border-[#EAE4D7] bg-[#FAF8F5]">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl font-bold">
              Sign Out
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to sign out?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <button
              onClick={() => setLogoutModal(false)}
              className="cursor-pointer rounded-xl border px-5 py-2"
            >
              Cancel
            </button>

            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-xl bg-[#947124] px-5 py-2 text-white"
            >
              Yes Sign Out
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
