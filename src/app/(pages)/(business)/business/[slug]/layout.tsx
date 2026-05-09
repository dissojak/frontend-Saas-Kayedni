/* eslint-disable react-refresh/only-export-components */
import type { Metadata, ResolvingMetadata } from "next";
import { fetchBusinessById } from "../../actions/backend";
import { extractBusinessIdFromSlug } from "@global/lib/businessSlug";
import { createPageMetadata, toCanonicalPath } from "@global/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const id = extractBusinessIdFromSlug(slug);

  try {
    const business = await fetchBusinessById(id);

    if (!business) {
      return createPageMetadata({
        title: "Business Not Found",
        description: "The business page you are looking for is not available.",
        path: `/business/${slug}`,
        noIndex: true,
      });
    }

    const title = `${business.name} | Kayedni`;
    const description = business.description || `Book an appointment with ${business.name} on Kayedni.`;
    const imageUrl = business.imageUrl || business.logo;
    const images = imageUrl ? [imageUrl] : [];

    return {
      ...createPageMetadata({
        title,
        description,
        path: `/business/${slug}`,
        keywords: ["business profile", "reservation", "Tunisie"],
      }),
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "Kayedni",
        images,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images,
      },
      alternates: {
        canonical: toCanonicalPath(`/business/${slug}`),
      },
    };
  } catch {
    return createPageMetadata({
      title: "Business Not Found",
      description: "The business page you are looking for is not available.",
      path: `/business/${slug}`,
      noIndex: true,
    });
  }
}

export default function BusinessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
