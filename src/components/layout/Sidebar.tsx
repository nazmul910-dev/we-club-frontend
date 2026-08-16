"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  ShieldUser,
  FileText,
  GraduationCap,
  CircleUserRound,
  Crown,
  LayoutDashboard,
  LogOut,
  ArrowLeftRight,
  Network,
  Megaphone,
  Globe,
  CreditCard,
  Tag,
  RefreshCcw,
  ChevronDown,
  BriefcaseBusiness,
  Settings,
  UserRoundCog,
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
import { getLogo } from "@/lib/features/logo/logoApi";

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

  const siteLogo = useAppSelector((state) => state.logo?.logo);

  const showSwitchButton = accessTo === "both";

  const [logoutModal, setLogoutModal] = useState(false);

  const [openMenu, setOpenMenu] = useState<
    "management" | "business" | "account" | null
  >(null);

  useEffect(() => {
    dispatch(getLogo());
  }, [dispatch]);


  const managementItems = [
    {
      label: "Users",
      href: "/dashboard/users-management",
      icon: Users,
      show:
        userRole === "manager" ||
        userRole === "founder",
    },
    {
      label: "Management",
      href: "/dashboard/manager-management",
      icon: ShieldUser,
      show: userRole === "founder" || userRole === "manager",
    },
    {
      label: "Payment Link",
      href: "/dashboard/registration-payments",
      icon: CreditCard,
      show: userRole === "founder" || userRole === "manager",
    },
    {
      label: "Discount Codes",
      href: "/dashboard/discount-management",
      icon: Tag,
      show: userRole === "founder" || userRole === "manager",
    },
    {
      label: "Manage Logo",
      href: "/dashboard/manage-logo",
      icon: Globe,
      show: userRole === "founder" || userRole === "manager",
    },
  ].filter((item) => item.show);

  const businessItems = [
    {
      label: "Listings",
      href: "/dashboard/listings",
      icon: Building2,
    },
    {
      label: "Manage Listings",
      href: "/dashboard/manage-listings",
      icon: Building2,
    },
    {
      label: "Network",
      href: "/dashboard/network-directory",
      icon: Network,
    },
    {
      label: "Promoters",
      href: "/dashboard/my-promoters",
      icon: Megaphone,
    },
    {
      label: "Ledger",
      href: "/dashboard/commission-ledger",
      icon: FileText,
    },
  ];

  const PLAN_ROLES = [
  "ceo",
  "associate",
  "ceo_partner",
  "ambassador",
  "partner",
  "we_club_member",
];

const PROFILE_ROLES = [
  ...PLAN_ROLES,
  "admin",
  "community_manager",
  "founder",
  "manager",
  "super_admin",
];


const accountItems = [
  {
    label: "Plan",
    href: "/dashboard/upgrade-plan",
    icon: RefreshCcw,
    show: userRole ? PLAN_ROLES.includes(userRole) : false,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: CircleUserRound,
    show: userRole ? PROFILE_ROLES.includes(userRole) : false,
  },
].filter((item) => item.show);



  const isActive = (href: string) => pathname === href;

  const isGroupActive = (items: { href: string }[]) =>
    items.some((item) => pathname === item.href);

  /* Automatically open current group */
  useEffect(() => {
    if (isGroupActive(managementItems)) {
      setOpenMenu("management");
      return;
    }

    if (isGroupActive(businessItems)) {
      setOpenMenu("business");
      return;
    }

    if (isGroupActive(accountItems)) {
      setOpenMenu("account");
    }
  }, [pathname, userRole]);

  const toggleMenu = (
    menu: "management" | "business" | "account",
  ) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const closeMobileSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
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
        <div className="flex flex-col items-center gap-3 px-5">
          {siteLogo?.logo ? (
            <Link href="/dashboard">
              <img
                src={siteLogo.logo}
                alt="WE"
                className="h-auto w-28 shrink-0 object-contain lg:w-30"
              />
            </Link>
          ) : (
            <Crown
              className="text-[#CDAE53]"
              size={22}
              strokeWidth={1.75}
            />
          )}

          <div className="uppercase">
            <p className="font-montserrat text-center text-[19px] tracking-wide text-[#888]">
              command center
            </p>
          </div>
        </div>

        <div className="my-5 h-px bg-white/5" />

        {/* Navigation */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-3">
          <p className="px-2 pb-3 font-montserrat text-[10px] tracking-[0.2em] text-white/30">
            WORKSPACE
          </p>

          {/* Dashboard */}
          <Link
            href="/dashboard"
            onClick={closeMobileSidebar}
            className={`group mb-1 flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 font-montserrat text-[13px] uppercase transition-all ${
              pathname === "/dashboard"
                ? "border-[#CDAE53] bg-[#1A1610] text-[#CDAE53]"
                : "border-transparent text-white/60 hover:bg-white/5 hover:text-white/90"
            }`}
          >
            <LayoutDashboard
              size={18}
              className={
                pathname === "/dashboard"
                  ? "text-[#CDAE53]"
                  : "text-white/45"
              }
            />

            <span>Dashboard</span>
          </Link>

          <div className="mb-1">
            <button
              type="button"
              onClick={() => toggleMenu("business")}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg border-l-2 px-3 py-2.5 font-montserrat text-[13px] uppercase transition-all ${
                isGroupActive(businessItems)
                  ? "border-[#CDAE53] bg-[#1A1610] text-[#CDAE53]"
                  : "border-transparent text-white/60 hover:bg-white/5 hover:text-white/90"
              }`}
            >
              <div className="flex items-center gap-3">
                <BriefcaseBusiness
                  size={18}
                  className={
                    isGroupActive(businessItems)
                      ? "text-[#CDAE53]"
                      : "text-white/45"
                  }
                />

                <span>Business</span>
              </div>

              <ChevronDown
                size={15}
                className={`transition-transform duration-300 ${
                  openMenu === "business" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ${
                openMenu === "business"
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="ml-[21px] mt-1 space-y-1 border-l border-[#CDAE53]/15 pl-3">
                  {businessItems.map(
                    ({ label, href, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={closeMobileSidebar}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-montserrat text-[12px] uppercase transition-all ${
                          isActive(href)
                            ? "bg-[#CDAE53]/10 text-[#CDAE53]"
                            : "text-white/45 hover:bg-white/[0.04] hover:text-white/90"
                        }`}
                      >
                        <Icon
                          size={16}
                          className={
                            isActive(href)
                              ? "text-[#CDAE53]"
                              : "text-white/35"
                          }
                        />

                        <span>{label}</span>
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {managementItems.length > 0 && (
            <div className="mb-1">
              <button
                type="button"
                onClick={() => toggleMenu("management")}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg border-l-2 px-3 py-2.5 font-montserrat text-[13px] uppercase transition-all ${
                  isGroupActive(managementItems)
                    ? "border-[#CDAE53] bg-[#1A1610] text-[#CDAE53]"
                    : "border-transparent text-white/60 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings
                    size={18}
                    className={
                      isGroupActive(managementItems)
                        ? "text-[#CDAE53]"
                        : "text-white/45"
                    }
                  />

                  <span>Management</span>
                </div>

                <ChevronDown
                  size={15}
                  className={`transition-transform duration-300 ${
                    openMenu === "management"
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ${
                  openMenu === "management"
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="ml-[21px] mt-1 space-y-1 border-l border-[#CDAE53]/15 pl-3">
                    {managementItems.map(
                      ({ label, href, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={closeMobileSidebar}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-montserrat text-[12px] uppercase transition-all ${
                            isActive(href)
                              ? "bg-[#CDAE53]/10 text-[#CDAE53]"
                              : "text-white/45 hover:bg-white/[0.04] hover:text-white/90"
                          }`}
                        >
                          <Icon
                            size={16}
                            className={
                              isActive(href)
                                ? "text-[#CDAE53]"
                                : "text-white/35"
                            }
                          />

                          <span>{label}</span>
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Academy */}
          <Link
            href="/dashboard/academy"
            onClick={closeMobileSidebar}
            className={`group mb-1 flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 font-montserrat text-[13px] uppercase transition-all ${
              pathname === "/dashboard/academy"
                ? "border-[#CDAE53] bg-[#1A1610] text-[#CDAE53]"
                : "border-transparent text-white/60 hover:bg-white/5 hover:text-white/90"
            }`}
          >
            <GraduationCap
              size={18}
              className={
                pathname === "/dashboard/academy"
                  ? "text-[#CDAE53]"
                  : "text-white/45"
              }
            />

            <span>Academy</span>
          </Link>

          <div className="mb-1">
            <button
              type="button"
              onClick={() => toggleMenu("account")}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg border-l-2 px-3 py-2.5 font-montserrat text-[13px] uppercase transition-all ${
                isGroupActive(accountItems)
                  ? "border-[#CDAE53] bg-[#1A1610] text-[#CDAE53]"
                  : "border-transparent text-white/60 hover:bg-white/5 hover:text-white/90"
              }`}
            >
              <div className="flex items-center gap-3">
                <UserRoundCog
                  size={18}
                  className={
                    isGroupActive(accountItems)
                      ? "text-[#CDAE53]"
                      : "text-white/45"
                  }
                />

                <span>Account</span>
              </div>

              <ChevronDown
                size={15}
                className={`transition-transform duration-300 ${
                  openMenu === "account" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ${
                openMenu === "account"
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="ml-[21px] mt-1 space-y-1 border-l border-[#CDAE53]/15 pl-3">
                  {accountItems.map(
                    ({ label, href, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={closeMobileSidebar}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-montserrat text-[12px] uppercase transition-all ${
                          isActive(href)
                            ? "bg-[#CDAE53]/10 text-[#CDAE53]"
                            : "text-white/45 hover:bg-white/[0.04] hover:text-white/90"
                        }`}
                      >
                        <Icon
                          size={16}
                          className={
                            isActive(href)
                              ? "text-[#CDAE53]"
                              : "text-white/35"
                          }
                        />

                        <span>{label}</span>
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/5 px-3 pt-3">
          <div className="flex flex-col gap-2">
            {showSwitchButton && (
              <button
                type="button"
                title="Switch Platform"
                className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-xl border border-[#3A3120] px-3 font-montserrat text-[11px] uppercase tracking-wider text-[#CDAE53] transition hover:bg-[#1A1610]"
              >
                <ArrowLeftRight size={16} />

                <span>Switch Platform</span>
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

      {/* Logout Modal */}
      <Dialog
        open={logoutModal}
        onOpenChange={setLogoutModal}
      >
        <DialogContent className="max-w-md rounded-2xl border border-neutral-800 bg-[#0B0B0B] text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Logout
            </DialogTitle>

            <DialogDescription className="text-neutral-400">
              Are you sure you want to logout from your account?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => setLogoutModal(false)}
              className="h-11 cursor-pointer rounded-xl border border-neutral-700 px-6 font-semibold text-white transition hover:bg-neutral-800"
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
              className="h-11 cursor-pointer rounded-xl bg-red-500 px-6 font-semibold text-white transition hover:bg-red-600"
            >
              Yes, Logout
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}