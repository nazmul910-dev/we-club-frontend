"use client";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";

export default function AcademyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard allowedRoles={["founder", "manager"]}>
      {children}
    </AuthGuard>
  );
}
