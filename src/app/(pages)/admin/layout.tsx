import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@global/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Administration",
  description: "Espace administration interne Kayedni.",
  noIndex: true,
});

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
