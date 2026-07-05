'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

const MENU_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { label: 'My Listings', href: '/dashboard/my-listings', icon: Building2 },
  { label: 'Network Directory', href: '/dashboard/network-directory', icon: Users },
  { label: 'My Promoters', href: '/dashboard/my-promoters', icon: UserPlus },
  { label: 'Commission Ledger', href: '/dashboard/commission-ledger', icon: FileText },
  { label: 'Academy', href: '/dashboard/academy', icon: GraduationCap },
  { label: 'My Profile', href: '/dashboard/profile', icon: CircleUserRound },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-[#463C20]/60 bg-[#0A0A0A] text-[#CDAE53] backdrop-blur-md transition-colors hover:border-[#CDAE53]/60 md:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-[#0A0A0A] backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-100 flex h-screen w-64 flex-col gap-5 border-r border-[#463C20]/40 bg-[#0A0A0A] py-5 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar logo */}
        <div className="flex items-center justify-center gap-3 px-5">
          <Crown className="text-[#CDAE53]" size={22} strokeWidth={1.75} />
          <div className="uppercase">
            <h2 className="font-playfair text-[18px] leading-tight text-[#CDAE53]">WE</h2>
            <p className="font-montserrat text-[11px] tracking-wide text-[#888]">
              command center
            </p>
          </div>
        </div>

        <div className="mx-5 h-px bg-white/5" />

        {/* Sidebar menu */}
        <nav className="flex flex-col gap-1 overflow-y-auto px-3">
          <p className="font-montserrat px-2 pb-2 text-[10px] tracking-[0.2em] text-white/30">
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
                    ? 'border-[#CDAE53] bg-[#1a1610] text-[#CDAE53]'
                    : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white/90'
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={1.75}
                  className={isActive ? 'text-[#CDAE53]' : 'text-white/50 group-hover:text-white/80'}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}