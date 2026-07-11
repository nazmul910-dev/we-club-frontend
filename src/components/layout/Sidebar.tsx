"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/redux/store/hook";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Building2,
  Users,
  ShieldUser,
  UserPlus,
  FileText,
  GraduationCap,
  CircleUserRound,
  Crown,
  Menu,
  X,
  LogOut,
  ArrowLeftRight,
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
import { useAppDispatch } from "@/lib/redux/store/hook";
import { clearProfile } from "@/lib/features/profile/profileSlice";

const MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Listings", href: "/dashboard/listings", icon: Building2 },
  { label: "Users", href: "/dashboard/users-management", icon: Users },
  {
    label: "Manager Management",
    href: "/dashboard/manager-management",
    icon: ShieldUser,
  },
  {
    label: "Manage Listings",
    href: "/dashboard/manage-listings",
    icon: Building2,
  },
  {
    label: "Network Directory",
    href: "/dashboard/network-directory",
    icon: Users,
  },
  { label: "My Promoters", href: "/dashboard/my-promoters", icon: UserPlus },
  {
    label: "Commission Ledger",
    href: "/dashboard/commission-ledger",
    icon: FileText,
  },
  { label: "Academy", href: "/dashboard/academy", icon: GraduationCap },
  { label: "My Profile", href: "/dashboard/profile", icon: CircleUserRound },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userRole = useAppSelector((state) => state.authUser?.user?.role);

  const tokenUser = useAppSelector((state) => state.authUser.user);
  const profile = useAppSelector((state) => state.authUser.profile);
  const accessTo = profile?.accessTo || tokenUser?.accessTo;

  const showSwitchButton = accessTo === "both";

  const [logoutModal, setLogoutModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#463C20]/40 bg-[#0A0A0A] py-5 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5">
          <Crown className="text-[#CDAE53]" size={22} strokeWidth={1.75} />
          <div className="uppercase">
            <h2 className="font-playfair text-[18px] leading-tight text-[#CDAE53]">
              WE
            </h2>
            <p className="font-montserrat text-[11px] tracking-wide text-[#888]">
              command center
            </p>
          </div>
        </div>

        <div className="my-5 h-px bg-white/5" />

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
          <p className="px-2 pb-2 font-montserrat text-[10px] tracking-[0.2em] text-white/30">
            WORKSPACE
          </p>

          {MENU_ITEMS.filter((item) => {
            if (item.href === "/dashboard/users-management") {
              return userRole === "admin" || userRole === "manager";
            }
            return true;
          }).map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 font-montserrat text-[13px] transition-colors ${
                  isActive
                    ? "border-[#CDAE53] bg-[#1a1610] text-[#CDAE53]"
                    : "border-transparent text-white/60 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-[#CDAE53]" : "text-white/50"}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/5 px-3 pt-3">
          <div className="flex flex-col gap-3">
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
            <button
              type="button"
              onClick={() => setLogoutModal(true)}
              className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut
                size={18}
                className="text-red-400 group-hover:text-red-300"
              />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <Dialog open={logoutModal} onOpenChange={setLogoutModal}>
        <DialogContent
          className="
      max-w-md
      rounded-2xl
      border
      border-neutral-800
      bg-[#0B0B0B]
      text-white
      shadow-2xl
    "
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Logout</DialogTitle>

            <DialogDescription className="text-neutral-400">
              Are you sure you want to logout from your account?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => setLogoutModal(false)}
              className="
              cursor-pointer
          h-11
          rounded-xl
          border
          border-neutral-700
          px-6
          font-semibold
          text-white
          transition
          hover:bg-neutral-800
        "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                setLogoutModal(false);
                dispatch(clearProfile());
                dispatch(logout());
                router.push("/login");
              }}
              className="
          h-11 cursor-pointer
          rounded-xl
          bg-red-500
          px-6
          font-semibold
          text-white
          transition
          hover:bg-red-600
        "
            >
              Yes, Logout
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
