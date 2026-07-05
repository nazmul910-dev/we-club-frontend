'use client';

import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Montserrat,
  Lato, Inter } from "next/font/google";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store/store";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
  weight: ["100","300","400","700","900"],
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
      className={cn(geistSans.variable, geistMono.variable, playfair.variable, montserrat.variable, lato.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        
        <Provider store={store}>

        {children}
        </Provider>
        
        </body>
    </html>
  );
}
