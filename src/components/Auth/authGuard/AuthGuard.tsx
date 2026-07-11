"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { getStoredUser, UserRole } from "@/lib/utils/auth";
import { setUser, logout } from "@/lib/features/auth/authUserSlice";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[]; 
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
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


    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(stored.role)) {
      router.replace("/dashboard"); 
      return;
    }


    if (!user) {
      dispatch(setUser(stored));
    }

    setChecking(false);
  }, []); 

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white/60 text-sm">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}