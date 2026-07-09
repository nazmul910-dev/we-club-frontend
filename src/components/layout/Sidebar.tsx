"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutGrid,
  Building2,
  Users,
  UserPlus,
  FileText,
  GraduationCap,
  CircleUserRound,
  Crown,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/features/auth/authUserSlice";
import { useAppDispatch } from "@/lib/redux/store/hook";
import { clearProfile } from '@/lib/features/profile/profileSlice';

const MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Listings", href: "/dashboard/listings", icon: Building2 },
  { label: "Users", href: "/dashboard/users-management", icon: Users },
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


export default function Sidebar({
    isOpen,
    setIsOpen
}: SidebarProps) {


    const pathname = usePathname();

    const router = useRouter();

    const dispatch = useAppDispatch();



    const handleLogout = () => {
 
        dispatch(logout());
        dispatch(clearProfile());
        router.push("/login");

    };



    return (
        <>


            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-[#463C20]/60 bg-[#0A0A0A] text-[#CDAE53] backdrop-blur-md transition-colors hover:border-[#CDAE53]/60 md:hidden"
            >
                {isOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>




            <div
export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-[#463C20]/60 bg-[#0A0A0A] text-[#CDAE53] backdrop-blur-md transition-colors hover:border-[#CDAE53]/60 md:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#463C20]/40 bg-[#0A0A0A] py-5 transition-transform duration-300 md:translate-x-0 ${
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

          {MENU_ITEMS.map(({ label, href, icon: Icon }) => {
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
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 font-montserrat text-[13px] text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut
              size={18}
              className="text-red-400 group-hover:text-red-300"
            />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
