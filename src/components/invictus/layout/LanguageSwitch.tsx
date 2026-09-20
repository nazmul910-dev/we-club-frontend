"use client";

import { useEffect, useState } from "react";
import { Globe2, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_LANG = "en";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

interface LanguageSwitchProps {
  className?: string;
}

export default function LanguageSwitch({ className }: LanguageSwitchProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANG);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved language on mount
  useEffect(() => {
    const saved = localStorage.getItem("selectedLanguage");

    if (saved === "en" || saved === "fr") {
      setSelectedLanguage(saved);
    }
  }, []);

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,fr",
            autoDisplay: false,
          },
          "google_translate_element",
        );
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (lang: "en" | "fr") => {
    if (lang === selectedLanguage) return;

    setIsLoading(true);

    localStorage.setItem("selectedLanguage", lang);

    document.cookie =
      "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${lang}; path=/`;
    document.cookie = `googtrans=/en/${lang}; path=/; domain=${domain}`;

    window.location.reload();
  };

  return (
    <div className="relative">
      <div id="google_translate_element" className="hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger>
          <button
            type="button"
            disabled={isLoading}
            className={cn(
              "flex h-9 items-center cursor-pointer gap-1.5 rounded-xl border border-gold-soft px-3 transition hover:bg-[#F3EBD8] disabled:opacity-70",
              className,
            )}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            ) : (
              <>
                <Globe2 size={18} className="text-gold" />
                <span className="text-xs font-semibold uppercase text-gold">
                  {selectedLanguage}
                </span>
                <ChevronDown size={14} className="text-gold/70" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-44 rounded-xl border border-[#EAE4D7] bg-[#FAF8F5] p-2 shadow-xl"
        >
          <DropdownMenuItem
            onClick={() => changeLanguage("en")}
            className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-[#4A4237] hover:bg-[#F3EBD8] focus:bg-[#F3EBD8]"
          >
            <span>English</span>
            {selectedLanguage === "en" && (
              <Check size={15} className="text-[#947124]" />
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => changeLanguage("fr")}
            className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-[#4A4237] hover:bg-[#F3EBD8] focus:bg-[#F3EBD8]"
          >
            <span>Français</span>
            {selectedLanguage === "fr" && (
              <Check size={15} className="text-[#947124]" />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
