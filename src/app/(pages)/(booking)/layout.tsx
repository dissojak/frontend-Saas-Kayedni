import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@global/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Gestion de Reservation",
  description:
    "Finalisez et suivez vos reservations Kayedni en quelques etapes simples.",
  noIndex: true,
});

export default function BookingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
