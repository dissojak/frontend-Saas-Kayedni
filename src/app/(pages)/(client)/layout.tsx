import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@global/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Espace Client",
  description:
    "Consultez et suivez vos reservations depuis votre espace client Kayedni.",
  noIndex: true,
});

export default function ClientLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
