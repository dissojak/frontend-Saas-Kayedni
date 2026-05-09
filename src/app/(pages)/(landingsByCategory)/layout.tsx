import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@global/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Categories de Services en Tunisie",
  description:
    "Explorez les meilleures categories de services en Tunisie et reservez rapidement avec Kayedni.",
  keywords: ["barber tunisie", "beauty tunisie", "health care tunisie"],
});

export default function CategoryLandingsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}
