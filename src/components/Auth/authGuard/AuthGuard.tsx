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

    // Check accessTo restriction
    if (
      allowedAccessTo &&
      allowedAccessTo.length > 0 &&
      !hasAccessTo(stored.accessTo, allowedAccessTo)
    ) {
      router.replace(getDefaultRedirect(stored));
      return;
    }

    // Check role restriction
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
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-[#CDAE53] text-sm font-montserrat">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#CDAE53] border-t-transparent" />
          <span className="tracking-wider uppercase text-xs text-white/60">
            Checking authentication...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}