"use client";

import { useState } from "react";
import AuthGuard from "@/components/Auth/authGuard/AuthGuard";
import InvictusNavbar from "@/components/invictus/layout/InvictusNavbar";
import InvictusLeftSidebar from "@/components/invictus/layout/InvictusLeftSidebar";
import InvictusRightSidebar from "@/components/invictus/layout/InvictusRightSidebar";

export default function InvictusLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard allowedAccessTo={["invictus", "both"]}>
      <div className="min-h-screen bg-[#FAF8F5] text-[#2C241B] flex flex-col">
        {/* Full-width Top Navbar (Above Left and Right sidebars) */}
        <InvictusNavbar setMobileSidebarOpen={setSidebarOpen} />

        {/* Content Body with Left Sidebar, Main Content, and Right Sidebar */}
        <div className="flex flex-1 relative w-full">
          {/* Left Navigation Sidebar */}
          <InvictusLeftSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

          {/* Main Content Area */}
          <main className="flex-1 w-full lg:pl-64 xl:pr-80 min-w-0 bg-[#FAF8F5]">
            {children}
          </main>

          {/* Right Sidebar with Widgets (Desktop) */}
          <InvictusRightSidebar />
        </div>
      </div>
    </AuthGuard>
  );
}