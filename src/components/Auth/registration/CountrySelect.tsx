'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { COUNTRIES } from '@/data/country';


interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DROPDOWN_MAX_HEIGHT = 260; // search box + list mile approx height

export default function CountrySelect({
  value,
  onChange,
  placeholder = 'Select your country',
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [openUpward, setOpenUpward] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // outside click hole dropdown close hobe
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // dropdown open howar age check kore neya hocche niche naki upore jayga ache
  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // niche jayga na thakle ebong upore beshi jayga thakle -> upore khulbe
    if (spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow) {
      setOpenUpward(true);
    } else {
      setOpenUpward(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen((prev) => !prev);
  };
 
  // window resize/scroll hole abar recalculate hobe (open thakle)
  useEffect(() => {
    if (!isOpen) return;

    const handleReposition = () => calculatePosition();

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isOpen]);

  // open hole search box e auto focus
  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  const filteredCountries = COUNTRIES.filter((country) =>
    country.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleSelect = (country: string) => {
    onChange(country);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between rounded-xl border border-amber-400/20 bg-transparent px-4 py-3 text-left text-sm text-white outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
      >
        <span className={value ? 'text-white' : 'text-white/30'}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-white/40 transition-transform ${
            isOpen && !openUpward ? 'rotate-180' : ''
          } ${isOpen && openUpward ? '' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 w-full overflow-hidden rounded-xl border border-amber-400/20 bg-black/95 backdrop-blur-xl shadow-xl ${
            openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          <div className="flex items-center gap-2 border-b border-amber-400/20 px-3 py-2">
            <Search size={14} className="text-white/40" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
            />
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-amber-400/10 ${
                    country === value ? 'bg-amber-400/10 text-amber-400' : 'text-white/80'
                  }`}
                >
                  {country}
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-white/40">No country found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}