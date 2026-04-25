"use client";

import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@components/ui/button";
import Image from "next/image";
import { useLocale } from "@global/hooks/useLocale";
import { businessDetailT } from "../i18n";

interface GalleryImage {
  imageUrl: string;
}

/** Returns a Tailwind grid-cols class based on the thumbnail count. */
function getThumbnailGridCols(count: number): string {
  const colMap: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  };
  return colMap[count] ?? "grid-cols-6";
}

interface InlinePhotoGalleryProps {
  images: GalleryImage[];
  businessName: string;
  /** Maximum images to display. Defaults to 6. */
  maxImages?: number;
}

const InlinePhotoGallery: React.FC<InlinePhotoGalleryProps> = ({
  images,
  businessName,
  maxImages = 6,
}) => {
  const { locale } = useLocale();

  const t = (key: Parameters<typeof businessDetailT>[1], params?: Record<string, string | number>) =>
    businessDetailT(locale, key, params);

  const visibleImages = images.slice(0, maxImages);
  const [activeIndex, setActiveIndex] = useState(0);
  const gridColsClass = getThumbnailGridCols(visibleImages.length);

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setActiveIndex((prev) => (prev + 1) % visibleImages.length);
    },
    [visibleImages.length]
  );

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setActiveIndex(
        (prev) => (prev - 1 + visibleImages.length) % visibleImages.length
      );
    },
    [visibleImages.length]
  );

  const handleThumbnailClick = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  // Empty state
  if (visibleImages.length === 0) {
    return (
      <div className="mb-12 mt-6">
        <div className="flex items-center justify-center h-64 rounded-xl bg-muted text-muted-foreground">
          <ImageIcon className="w-12 h-12 opacity-40" />
        </div>
      </div>
    );
  }

  // Single-image layout
  if (visibleImages.length === 1) {
    return (
      <div className="mb-12 mt-6">
        <div className="rounded-xl overflow-hidden h-[420px]">
          <Image
            src={visibleImages[0].imageUrl}
            alt={businessName}
            loading="eager"
            fetchPriority="high"
            width={960}
            height={420}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 mt-6 space-y-2">
      {/* Main viewer */}
      <div className="relative rounded-xl overflow-hidden h-[420px] group bg-black">
        <Image
          src={visibleImages[activeIndex].imageUrl}
          alt={`${businessName} – ${activeIndex + 1}`}
          loading={activeIndex === 0 ? "eager" : "lazy"}
          fetchPriority={activeIndex === 0 ? "high" : undefined}
          width={960}
          height={420}
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
        />

        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {/* Prev / Next buttons */}
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("gallery_prev_image")}
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/90 text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("gallery_next_image")}
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/90 text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* Dot indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {visibleImages.map((img, idx) => (
            <button
              key={img.imageUrl}
              onClick={(e) => {
                e.stopPropagation();
                handleThumbnailClick(idx);
              }}
              aria-label={t("gallery_go_to_image", { index: idx + 1 })}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Counter badge */}
        <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
          {activeIndex + 1} / {visibleImages.length}
        </span>
      </div>

      {/* Thumbnail strip */}
      <div className={`grid gap-2 ${gridColsClass}`}>
        {visibleImages.map((img, idx) => (
          <button
            key={img.imageUrl}
            onClick={() => handleThumbnailClick(idx)}
            aria-label={t("gallery_view_image", { index: idx + 1 })}
            className={[
              "relative h-16 sm:h-20 md:h-24 rounded-lg overflow-hidden",
              "focus:outline-none ring-offset-2 transition-all duration-200",
              idx === activeIndex
                ? "ring-2 ring-primary scale-[1.03]"
                : "opacity-70 hover:opacity-100 hover:ring-2 hover:ring-primary/40",
            ].join(" ")}
          >
            <img
              src={img.imageUrl}
              alt={`${businessName} – ${idx + 1}`}
              loading="lazy"
              width={160}
              height={96}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default InlinePhotoGallery;
