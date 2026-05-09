import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@global/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Entreprises et Services en Tunisie",
  description:
    "Trouvez des entreprises locales et reservez vos services en ligne en Tunisie avec Kayedni.",
  keywords: ["entreprises tunisie", "annuaire services tunisie"],
});

export default function BusinessGroupLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
