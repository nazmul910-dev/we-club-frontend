"use client";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useState } from "react";
import AuthGuard from "@/components/Auth/authGuard/AuthGuard";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <main className="flex min-h-screen bg-[#0A0A0A]">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex min-h-screen flex-1 flex-col lg:pl-64 xl:pl-0 xl:ml-64 w-full">
          <Topbar setIsOpen={setSidebarOpen} />
          <div className="container1 bg-[#0a0a0a]">{children}</div>
        </div>
      </main>
    </AuthGuard>
  );
}