import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@global/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Espace Business",
  description:
    "Tableau de bord Kayedni pour gerer staff, services et reservations business.",
  noIndex: true,
});

export default function BusinessWorkspaceLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}
