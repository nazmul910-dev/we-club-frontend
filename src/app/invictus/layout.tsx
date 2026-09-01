"use client";

import { useState } from "react";
import "../globals.css";
import AuthGuard from "@/components/Auth/authGuard/AuthGuard";
import InvictusNavbar from "@/components/invictus/layout/InvictusNavbar";
import InvictusLeftSidebar from "@/components/invictus/layout/InvictusLeftSidebar";
import InvictusRightSidebar from "@/components/invictus/layout/InvictusRightSidebar";

export default function InvictusLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard allowedAccessTo={["invictus", "both"]} >
      <div className="min-h-screen bg-[#FAF8F5] text-[#2C241B] flex flex-col">
        <InvictusNavbar setMobileSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 relative w-full">
          <InvictusLeftSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

          <main className="flex-1 w-full pt-20 lg:pl-72  xl:pr-80 min-w-0 bg-[#FAF8F5]">
            {children}
          </main>
          <InvictusRightSidebar />
        </div>
      </div>
    </AuthGuard>
  );
}