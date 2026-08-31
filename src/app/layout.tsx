"use client";
import {
    Geist,
    Geist_Mono,
    Playfair_Display,
    Montserrat,
    Lato,
    Noto_Sans,
} from "next/font/google";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store/store";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
});
const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});
const lato = Lato({
    variable: "--font-lato",
    weight: ["100", "300", "400", "700", "900"],
    subsets: ["latin"],
});

function TranslationRouteGuard() {
    const pathname = usePathname();

    useEffect(() => {
        const isInvictusRoute =
            pathname === "/invictus" || pathname.startsWith("/invictus/");
        const savedLanguage = localStorage.getItem("selectedLanguage");
        const hasTranslationCookie = document.cookie.includes("googtrans=");

        if (!isInvictusRoute && hasTranslationCookie) {
            document.cookie =
                "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
            window.location.reload();
            return;
        }

        if (
            isInvictusRoute &&
            savedLanguage === "fr" &&
            !hasTranslationCookie
        ) {
            document.cookie = "googtrans=/en/fr; path=/";
            document.cookie = `googtrans=/en/fr; path=/; domain=${window.location.hostname}`;
            window.location.reload();
        }
    }, [pathname]);

    return null;
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(
                geistSans.variable,
                geistMono.variable,
                playfair.variable,
                montserrat.variable,
                lato.variable,
                notoSans.variable,
                "font-sans",
            )}
        >
            <body className="min-h-full flex flex-col" suppressHydrationWarning>
                <Provider store={store}>
                    <TranslationRouteGuard />
                    {children}
                </Provider>
                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    expand
                    duration={3000}
                    theme="dark"
                />
            </body>
        </html>
    );
}
