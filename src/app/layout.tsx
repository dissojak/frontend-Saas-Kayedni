import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@global/providers";
import GoogleAnalytics from "./ga";
import React from "react";
import { SITE_URL, TUNISIA_KEYWORDS } from "@global/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const zain = localFont({
  src: "../../public/fonts/Zain-Regular.ttf",
  variable: "--font-zain",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kayedni Tunisie | Plateforme de Reservation en Ligne",
    template: "%s | Kayedni Tunisie",
  },
  description:
    "Kayedni simplifie la reservation en ligne en Tunisie pour les clients, salons et entreprises de services.",
  keywords: TUNISIA_KEYWORDS,
  alternates: {
    canonical: "/",
    languages: {
      "fr-TN": "/",
      "ar-TN": "/",
      "en-TN": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Kayedni Tunisie",
    description:
      "Plateforme de reservation en ligne en Tunisie pour la beaute, le bien-etre et les services professionnels.",
    type: "website",
    locale: "fr_TN",
    siteName: "Kayedni",
    countryName: "Tunisia",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kayedni Tunisie",
    description:
      "Reservez vos rendez-vous en ligne en Tunisie avec Kayedni.",
  },
  other: {
    "geo.region": "TN",
    "geo.placename": "Tunisia",
    "content-language": "fr-TN, ar-TN, en-TN",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-TN" dir="ltr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${zain.variable} antialiased bg-background text-foreground`}>
        <GoogleAnalytics />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}