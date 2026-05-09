import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@global/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Activation",
  description: "Activation de compte Kayedni.",
  noIndex: true,
});

export default function ActivateLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
