"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import {
  getStoredUser,
  UserRole,
  AccessTo,
  hasAccessTo,
  getDefaultRedirect,
} from "@/lib/utils/auth";

import { setUser, logout } from "@/lib/features/auth/authUserSlice";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  allowedAccessTo?: AccessTo[];
}

export default function AuthGuard({
  children,
  allowedRoles,
  allowedAccessTo,
}: AuthGuardProps) {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const user = useAppSelector((state) => state.authUser.user);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();

    if (!stored) {
      dispatch(logout());

      router.replace("/login");

      return;
    }

    // Access To Check

    if (
      allowedAccessTo &&
      allowedAccessTo.length > 0 &&
      !hasAccessTo(stored.accessTo, allowedAccessTo)
    ) {
      router.replace(getDefaultRedirect(stored));

      return;
    }

    // Role Check

    if (
      allowedRoles &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(stored.role)
    ) {
      router.replace(getDefaultRedirect(stored));

      return;
    }

    if (!user) {
      dispatch(setUser(stored));
    }

    setChecking(false);
  }, [allowedRoles, allowedAccessTo, dispatch, router, user]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090909]">
        <div className="relative flex h-28 w-28 items-center justify-center">
          {/* Outer rotating ring */}

          <div className="absolute h-28 w-28 animate-[spin_2.5s_linear_infinite] rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C]" />

          {/* Inner rotating ring */}

          <div className="absolute h-20 w-20 animate-[spin_1.8s_linear_infinite_reverse] rounded-full border border-[#C9A84C]/40 border-b-[#C9A84C]" />

          {/* Center glow */}

          <div className="h-10 w-10 animate-pulse rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8F6B18] shadow-[0_0_35px_rgba(201,168,76,0.65)]" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
