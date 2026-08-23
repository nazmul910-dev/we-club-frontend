"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import {
  Home,
  Flame,
  MessageSquare,
  UserCheck,
  Users,
  Globe2,
  Sparkles,
  Trophy,
  ClipboardCheck,
  UserCircle,
  BriefcaseBusiness,
  ChevronDown,
  LogOut,
  X,
  ArrowLeftRight,
  UserRound,
  Crown,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { logout } from "@/lib/features/auth/authUserSlice";
import { clearProfile } from "@/lib/features/profile/profileSlice";
import { formatLabel, getInitials, UserRole } from "@/lib/utils/auth";

interface InvictusLeftSidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  roles?: UserRole[];
}

export default function InvictusLeftSidebar({
  isOpen,
  setIsOpen,
}: InvictusLeftSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const tokenUser = useAppSelector((state) => state.authUser.user);
  const profile = useAppSelector((state) => state.authUser.profile);

  const userRole = (profile?.role || tokenUser?.role) as UserRole | undefined;

  const accessTo = profile?.accessTo || tokenUser?.accessTo;

  const showSwitchButton = accessTo === "both";

  const fullName = profile?.fullName;
  const profileImage = profile?.profileImage;

  const [logoutModal, setLogoutModal] = useState(false);
  const [switchModal, setSwitchModal] = useState(false);

  const [peopleOpen, setPeopleOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const mainItems: NavItem[] = [
    {
      label: "HOME",
      href: "/invictus",
      icon: Home,
    },

    {
      label: "THE INVICTUS CHALLENGE",
      href: "/invictus/challenge",
      icon: Flame,
    },

    {
      label: "COMMUNITY ROOMS",
      href: "/invictus/community-rooms",
      icon: MessageSquare,
    },

    {
      label: "WORLD ÉLITE ASSOCIATES",
      href: "/invictus/associates",
      icon: Globe2,
    },

    {
      label: "RETREATS",
      href: "/invictus/retreats",
      icon: Sparkles,
    },

    {
      label: "LEADERBOARD",
      href: "/invictus/leaderboard",
      icon: Trophy,
    },

    {
      label: "MY ACCOUNTABILITY",
      href: "/invictus/accountability",
      icon: ClipboardCheck,
    },

    {
      label: "MY PROFILE",
      href: "/invictus/my-profile",
      icon: UserCircle,
    },
  ];

  const peopleItems: NavItem[] = [
    {
      label: "CEO PROFILES",
      href: "/invictus/ceo-profiles",
      icon: UserCheck,
      // roles: [
      //   "ceo",
      //   "ceo_partner",
      //   "founder",
      //   "super_admin",
      //   "admin",
      //   "manager",
      // ],
    },

    {
      label: "FOUNDERS PROFILES",
      href: "/invictus/founders-profiles",
      icon: Users,
      // roles: ["founder", "super_admin", "admin", "manager"],
    },
  ];

  

  const serviceItems = [
    {
      label: "PARTNERS OFFERS",
      href: "/invictus/services/partners-offers",
    },

    {
      label: "INVESTMENT IN YOUR 3.0 VERSION",
      href: "/invictus/services/investment",
    },

    {
      label: "WHY BECOME A WORLD ÉLITE ASSOCIATE",
      href: "/invictus/services/why-become-associate",
    },
  ];

  const visiblePeopleItems = peopleItems.filter((item) => {
    if (!item.roles) return true;

    if (!userRole) return false;

    return item.roles.includes(userRole);
  });

  const isActive = (href: string) => {
    if (href === "/invictus") return pathname === "/invictus";

    return pathname.startsWith(href);
  };

  const isPeopleActive = visiblePeopleItems.some((item) =>
    pathname.startsWith(item.href),
  );

  const isServiceActive = serviceItems.some((item) =>
    pathname.startsWith(item.href),
  );

  useEffect(() => {
    if (isPeopleActive) setPeopleOpen(true);

    if (isServiceActive) setServicesOpen(true);
  }, [isPeopleActive, isServiceActive]);

  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    setLogoutModal(false);

    dispatch(clearProfile());

    dispatch(logout());

    router.push("/login");
  };

  return (
    <>
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition lg:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <aside
        className={`fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-72 flex-col border-r border-[#EAE4D7] bg-[#FAF8F5] transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-[#EAE4D7] px-5 py-4 lg:hidden">
          <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-[#947124]">
            Invictus
          </span>

          <button
            onClick={closeSidebar}
            className="rounded-lg p-2 text-[#8C8273] hover:bg-[#F3EBD8]"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-5 scrollbar-hide space-y-2">
          <div className="mb-3">
            <p className="mb-2 px-3 font-montserrat text-[10px] font-bold uppercase tracking-[0.25em] text-[#A69B89]">
              Main
            </p>

            {mainItems.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeSidebar}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 font-montserrat text-[11px] font-semibold uppercase tracking-wider transition-all ${active ? "bg-[#F3EBD8] text-[#947124] shadow-sm" : "text-[#5C5348] hover:bg-[#F6F1E7] hover:text-[#1C1814]"}`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${active ? "bg-[#947124]/10" : "bg-[#F3EEE4] group-hover:bg-white"}`}
                  >
                    <Icon
                      size={15}
                      className={active ? "text-[#947124]" : "text-[#7A7062]"}
                    />
                  </div>

                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mb-3">
            <button
              onClick={() => setPeopleOpen(!peopleOpen)}
              className={`flex w-full items-center justify-between cursor-pointer rounded-xl px-3 py-2.5 transition-all ${isPeopleActive ? "bg-[#F3EBD8] text-[#947124]" : "text-[#5C5348] hover:bg-[#F6F1E7]"}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F3EEE4]">
                  <Users size={15} />
                </div>

                <span className="font-montserrat text-[11px] font-semibold uppercase tracking-wider">
                  People
                </span>
              </div>

              <ChevronDown
                size={15}
                className={`transition-transform ${peopleOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all ${peopleOpen ? "max-h-60 mt-2" : "max-h-0"}`}
            >
              <div className="ml-5 space-y-1 border-l border-[#D9CEBA] pl-3">
                {visiblePeopleItems.map(({ label, href, icon: Icon }) => {
                  const active = isActive(href);

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeSidebar}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 font-montserrat text-[10px] font-medium uppercase transition ${active ? "bg-[#F3EBD8] text-[#947124]" : "text-[#6C6357] hover:bg-[#F6F1E7]"}`}
                    >
                      <Icon size={13} />

                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`flex w-full items-center justify-between cursor-pointer rounded-xl px-3 py-2.5 transition-all ${isServiceActive ? "bg-[#F3EBD8] text-[#947124]" : "text-[#5C5348] hover:bg-[#F6F1E7]"}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F3EEE4]">
                  <BriefcaseBusiness size={15} />
                </div>

                <span className="font-montserrat text-[11px] font-semibold uppercase tracking-wider">
                  Services
                </span>
              </div>

              <ChevronDown
                size={15}
                className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all ${servicesOpen ? "max-h-80 mt-2" : "max-h-0"}`}
            >
              <div className="ml-5 space-y-1 border-l border-[#D9CEBA] pl-3">
                {serviceItems.map(({ label, href }) => {
                  const active = pathname === href;

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeSidebar}
                      className={`block rounded-lg px-3 py-2 font-montserrat text-[10px] font-medium uppercase transition ${active ? "bg-[#F3EBD8] text-[#947124]" : "text-[#6C6357] hover:bg-[#F6F1E7]"}`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        <div className="border-t block lg:hidden border-[#EAE4D7] bg-[#F7F4EE] px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#EAE4D7] bg-white p-3">
            {profileImage ? (
              <img
                src={profileImage}
                alt="profile"
                className="h-10 w-10 rounded-full border border-[#947124] object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3EBD8] text-sm font-bold text-[#947124]">
                {getInitials(fullName)}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate font-playfair text-sm font-bold text-[#1C1814]">
                {fullName || "Invictus Member"}
              </p>

              <p className="font-montserrat text-[10px] uppercase text-[#947124]">
                {formatLabel(userRole) || "Member"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            {showSwitchButton && (
              <button
                onClick={() => setSwitchModal(true)}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#D9CEBA] bg-white py-2 font-montserrat text-[10px] font-semibold text-[#947124]"
              >
                <ArrowLeftRight size={12} />
                Switch
              </button>
            )}

            <button
              onClick={() => setLogoutModal(true)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-50 py-2 font-montserrat text-[10px] font-semibold text-red-600"
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>

          <div className="mt-4 text-center">
            <span className="font-montserrat text-[9px] font-semibold tracking-[0.25em] text-[#A69B89]">
              BY WORLD ÉLITE
            </span>
          </div>
        </div>

        <Dialog open={switchModal} onOpenChange={setSwitchModal}>
          <DialogContent className="max-w-md rounded-2xl border border-[#DECDB0] bg-[#FAF8F5]">
            <DialogHeader>
              <DialogTitle className="font-playfair text-2xl font-bold text-[#1C1814]">
                Switch Platform
              </DialogTitle>

              <DialogDescription className="text-[#6B6358]">
                Are you sure you want to switch to Command Center?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2">
              <button
                onClick={() => setSwitchModal(false)}
                className="rounded-xl border border-[#D9CEBA] px-5 py-2 font-montserrat text-xs"
              >
                Cancel
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="rounded-xl bg-[#947124] px-5 py-2 font-montserrat text-xs text-white"
              >
                Yes Switch
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={logoutModal} onOpenChange={setLogoutModal}>
          <DialogContent className="max-w-md rounded-2xl border border-[#EAE4D7] bg-[#FAF8F5]">
            <DialogHeader>
              <DialogTitle className="font-playfair text-2xl font-bold">
                Sign Out
              </DialogTitle>

              <DialogDescription>
                Are you sure you want to logout from Invictus?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <button
                onClick={() => setLogoutModal(false)}
                className="rounded-xl border px-5 py-2 font-montserrat text-xs"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-[#947124] px-5 py-2 font-montserrat text-xs text-white"
              >
                Yes Sign Out
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </aside>
    </>
  );
}
