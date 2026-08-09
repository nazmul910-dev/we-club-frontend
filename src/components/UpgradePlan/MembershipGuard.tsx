"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/lib/redux/store/hook";

const PAID_ROLES = ["associate", "partner", "ambassador", "ceo", "ceo_partner"];

const UPGRADE_PLAN_PATH = "/dashboard/upgrade-plan";

interface Props {
  children: React.ReactNode;
}

export default function MembershipGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAppSelector(
    (state) => state.authUser.isAuthenticated
  );
  const tokenUser = useAppSelector((state) => state.authUser.user);

  const userRole = tokenUser?.role;
  const isPaidRole = userRole ? PAID_ROLES.includes(userRole) : false;
  const isExpired =
    isPaidRole && tokenUser?.membershipAccessStatus === "expired";

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (isExpired && pathname !== UPGRADE_PLAN_PATH) {
      router.replace(UPGRADE_PLAN_PATH);
    }
  }, [isAuthenticated, isExpired, pathname, router]);

  // token লোড হওয়ার আগে কিছুক্ষণের জন্য tokenUser null থাকতে পারে —
  // ততক্ষণ কনটেন্ট flash হওয়া এড়াতে সংক্ষিপ্ত loading state
  if (isAuthenticated && !tokenUser) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (isExpired && pathname !== UPGRADE_PLAN_PATH) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return <>{children}</>;
}