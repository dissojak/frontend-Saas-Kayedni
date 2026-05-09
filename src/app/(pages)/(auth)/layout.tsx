/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@global/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Authentification",
  description:
    "Connectez-vous ou creez votre compte Kayedni pour gerer vos reservations en Tunisie.",
  noIndex: true,
});

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
