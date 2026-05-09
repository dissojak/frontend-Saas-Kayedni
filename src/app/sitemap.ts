import type { MetadataRoute } from "next";
import { buildAbsoluteUrl } from "@global/lib/seo";

const publicRoutes = [
  "/",
  "/search",
  "/businesses",
  "/business-solutions",
  "/faq",
  "/guide",
  "/help",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/barber",
  "/beauty&hairstyling",
  "/health-care",
  "/nail-salon",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: buildAbsoluteUrl(route),
    lastModified,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
