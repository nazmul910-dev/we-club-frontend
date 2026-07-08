'use client';

import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Montserrat,
  Lato,
} from "next/font/google";

import "../globals.css";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store/store";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useState } from "react";
import AuthGuard from "@/components/Auth/authGuard/AuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={` ${geistSans.variable}
        ${geistMono.variable}
        ${playfair.variable}
        ${montserrat.variable}
        ${lato.variable}`}
    >
      <body className="min-h-full flex flex-col">

        <Provider store={store}>
          <AuthGuard>
            <main className="flex  min-h-screen  bg-[#0A0A0A] overflow-hidden w-screen">

            <Sidebar
              isOpen={sidebarOpen}
              setIsOpen={setSidebarOpen}
            />

            <div className="flex min-h-screen flex-1 flex-col lg:ml-64 w-full">

              <Topbar
                setIsOpen={setSidebarOpen}
              />

              <div className="  w-full container1">
                {children}
              </div>

            </div>

          </main>
          </AuthGuard>

        </Provider>

      </body>
    </html>
  );
}
