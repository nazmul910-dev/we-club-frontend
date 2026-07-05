import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#2B2B2B] bg-[#0A0A0A] px-8">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"
        />

        <input
          type="text"
          placeholder="Search..."
          className="h-11 w-full rounded-lg border border-[#3A3120] bg-[#131313] pl-11 pr-16 text-sm text-white placeholder:text-[#888] outline-none transition-all duration-200 focus:border-[#CDAE53]"
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-[#3A3120] px-2 py-0.5 text-xs text-[#888]">
          ⌘ K
        </span>
      </div>

      {/* Right Side */}
      <div className="ml-8 flex items-center gap-6">
        {/* Notification */}
        <button className="text-[#888] transition hover:text-[#CDAE53]">
          <Bell size={20} />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <h4 className="text-sm font-medium text-[#CDAE53]">
              Alexandra Voss
            </h4>

            <p className="text-xs uppercase tracking-[0.2em] text-[#888]">
              Geneva . CET
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CDAE53] bg-[#171717] font-medium text-[#CDAE53]">
            AV
          </div>
        </div>
      </div>
    </header>
  );
}