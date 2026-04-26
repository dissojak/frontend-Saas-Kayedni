import type { Metadata, ResolvingMetadata } from "next";
import { fetchBusinessById } from "../../actions/backend";
import { extractBusinessIdFromSlug } from "@global/lib/businessSlug";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const id = extractBusinessIdFromSlug(slug);

  try {
    const business = await fetchBusinessById(id);

    if (!business) {
      return {
        title: "Business Not Found | Kayedni",
      };
    }

    const title = `${business.name} | Kayedni`;
    const description = business.description || `Book an appointment with ${business.name} on Kayedni.`;
    const imageUrl = business.imageUrl || business.logo;
    const images = imageUrl ? [imageUrl] : [];

    return {
      title,
      description,
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
    };
  } catch (e) {
    return {
      title: "Business Not Found | Kayedni",
    };
  }
}

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
