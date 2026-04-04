import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@global/providers";
import GoogleAnalytics from "./ga";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const zain = localFont({
  src: "../../public/fonts/Zain-Regular.ttf",
  variable: "--font-zain",
});

export const metadata: Metadata = {
  title: "kayedni",
  description: "kayedni is a Saas platform for easy booking management!",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${zain.variable} antialiased bg-background text-foreground`}>
        <GoogleAnalytics />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}