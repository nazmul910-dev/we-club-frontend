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
  return (
    <html
      lang="en"
      className={` ${geistSans.variable}
        ${geistMono.variable}
        ${playfair.variable}
        ${montserrat.variable}
        ${lato.variable}`}
    >
      <body className="min-h-full  flex flex-col">

        <Provider store={store}>
          <main className="bg-[#0A0A0A] h-screen w-full flex items-start justify-start">
            <div className="w-[15%] ">
              <Sidebar />
            </div>
            <div className="flex w-full flex-col gap-5">
              <Topbar/>
              {children}  
            </div>
            
          </main>

        </Provider>

      </body>
    </html>
  );
}
