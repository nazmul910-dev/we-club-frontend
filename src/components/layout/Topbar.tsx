import { Menu, Search } from "lucide-react";

interface Props{
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Topbar({setIsOpen}:Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#2B2B2B] bg-[#0A0A0A]">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">

<button
    onClick={()=>setIsOpen(true)}
    className="
md:hidden
mr-3
flex
h-10
w-10
items-center
justify-center
rounded-lg
border
border-[#3A3120]
text-[#CDAE53]
hover:bg-[#1a1610]
transition
"
>
    <Menu size={20}/>
</button>

        {/* Search */}
        <div className="relative flex-1 hidden md:block  max-w-52 lg:max-w-md">
          
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"
          />

          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-full rounded-lg border border-[#3A3120] bg-[#131313] pl-11 pr-14 text-sm text-white placeholder:text-[#888] outline-none transition-all duration-200 focus:border-[#CDAE53]"
          />

          <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[#3A3120] px-2 py-0.5 text-xs text-[#888] lg:block">
            ⌘ K
          </span>
        </div>

        {/* Right */}
        <div className="flex flex-row-reverse md:flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="hidden text-right sm:block">
              <h4 className="font-playfair text-xs font-light text-white lg:text-sm">
                Alexandra Voss
              </h4>

              <p className="text-[9px] uppercase tracking-[0.2em] text-[#888]">
                Geneva · CET
              </p>
            </div>

            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#CDAE53] bg-[#171717] text-[10px] font-medium text-[#CDAE53] sm:h-9 sm:w-9 md:h-10 md:w-10 md:text-xs">
              AV
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#7bd0a469] bg-[#7bd0a418] px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7bd0a4]" />

            <span className="font-montserrat text-[7px] uppercase tracking-[2px] text-[#7bd0a4] sm:text-[8px]">
              Associate
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}