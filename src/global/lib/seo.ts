import type { Metadata } from "next";

const FALLBACK_SITE_URL = "https://kayedni.com";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;

export const TUNISIA_KEYWORDS = [
  "kayedni",
  "booking tunisie",
  "prise de rendez-vous tunisie",
  "reservation en ligne tunisie",
  "salon beaute tunisie",
  "barbier tunisie",
  "spa tunisie",
  "coiffeur tunis",
  "sousse",
  "sfax",
  "nabeul",
  "monastir",
  "gestion rendez-vous entreprise",
];

type SeoOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function toCanonicalPath(path = "/"): string {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }

  return path;
}

export function buildAbsoluteUrl(path = "/"): string {
  return new URL(toCanonicalPath(path), SITE_URL).toString();
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  noIndex = false,
}: SeoOptions): Metadata {
  const canonicalPath = toCanonicalPath(path);
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);

  return {
    title,
    description,
    keywords: [...TUNISIA_KEYWORDS, ...keywords],
    alternates: {
      canonical: canonicalPath,
      languages: {
        "fr-TN": canonicalPath,
        "ar-TN": canonicalPath,
        "en-TN": canonicalPath,
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_TN",
      siteName: "Kayedni",
      url: canonicalUrl,
      countryName: "Tunisia",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      "geo.region": "TN",
      "geo.placename": "Tunisia",
      "content-language": "fr-TN, ar-TN, en-TN",
    },
  };
}