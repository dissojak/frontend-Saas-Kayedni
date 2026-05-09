import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@global/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Espace Staff",
  description:
    "Gerez votre planning, vos services et vos reservations via l'espace staff Kayedni.",
  noIndex: true,
});

export default function StaffLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
