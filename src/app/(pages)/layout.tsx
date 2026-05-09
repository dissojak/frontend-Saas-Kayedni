import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@global/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Reservation en Ligne en Tunisie",
  description:
    "Decouvrez, comparez et reservez vos rendez-vous en ligne partout en Tunisie avec Kayedni.",
});

export default function PagesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
