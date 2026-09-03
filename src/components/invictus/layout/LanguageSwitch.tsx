"use client";

import { useEffect, useState } from "react";
import { Globe2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);
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
    if (lang === selectedLanguage) {
      setOpen(false);
      return;
    }

    setIsLoading(true);
    setOpen(false);

    localStorage.setItem("selectedLanguage", lang);

    document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${lang}; path=/`;
    document.cookie = `googtrans=/en/${lang}; path=/; domain=${domain}`;

    window.location.reload();
  };

  return (
    <div className="relative">
      <div id="google_translate_element" className="hidden" />

      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={isLoading}
        className={cn(
          "flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-gold-soft transition hover:bg-[#F3EBD8] disabled:opacity-70",
          className,
        )}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Globe2 size={20} className="text-gold" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-[9999] w-44 rounded-xl border border-[#EAE4D7] bg-[#FAF8F5] p-2 shadow-xl">
          <button
            onClick={() => changeLanguage("en")}
            className="flex w-full items-center justify-between cursor-pointer rounded-lg px-3 py-2 text-sm text-[#4A4237] hover:bg-[#F3EBD8]"
          >
            <span>English</span>
            {selectedLanguage === "en" && (
              <Check size={15} className="text-[#947124]" />
            )}
          </button>

          <button
            onClick={() => changeLanguage("fr")}
            className="flex w-full items-center justify-between cursor-pointer rounded-lg px-3 py-2 text-sm text-[#4A4237] hover:bg-[#F3EBD8]"
          >
            <span>Français</span>
            {selectedLanguage === "fr" && (
              <Check size={15} className="text-[#947124]" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}