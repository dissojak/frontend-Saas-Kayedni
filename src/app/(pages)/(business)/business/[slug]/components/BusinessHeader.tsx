"use client";
import React from "react";
import { Button } from "@components/ui/button";
import type { Business } from "@/(pages)/(business)/businesses/types/business";
import { MapPin, QrCode, Share2, Star, Tag } from "lucide-react";
import { useLocale } from "@global/hooks/useLocale";
import { businessQrT } from "@global/lib/i18n/businessQr";
import {
  businessDetailReviewCountLabel,
  businessDetailT,
} from "../i18n";

const BusinessHeader: React.FC<{
  business: Business;
  onBook?: () => void;
  onShareBusiness?: () => void;
  onShowQr?: () => void;
}> = ({ business, onBook, onShareBusiness, onShowQr }) => {
  const { locale } = useLocale();

  const t = (key: Parameters<typeof businessDetailT>[1], params?: Record<string, string | number>) =>
    businessDetailT(locale, key, params);

  // Format rating to 1 decimal place
  const formatRating = (rating: number | string | undefined | null): string => {
    if (rating === null || rating === undefined) return t("rating_no_reviews");
    const numRating = typeof rating === 'string' ? Number.parseFloat(rating) : rating;
    if (Number.isNaN(numRating)) return t("rating_no_reviews");
    return numRating.toFixed(1);
  };

  const hasRating = business.rating !== null && business.rating !== undefined && business.rating !== 0;

  return (
    <div className="mb-8 bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-8 shadow-skeuo">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">{business.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            {business.category && (
              <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                <Tag className="w-4 h-4" />
                {business.category}
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 fill-brand-orange" />
              <span className="font-bold">{formatRating(business.rating)}</span>
              {hasRating && business.reviewCount !== undefined && business.reviewCount > 0 && (
                <span className="opacity-80 ml-1">
                  ({business.reviewCount} {businessDetailReviewCountLabel(locale, business.reviewCount)})
                </span>
              )}
            </div>
            {business.location && (
              <div className="flex items-center gap-1.5 text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                <MapPin className="w-4 h-4" />
                {business.location}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <Button 
            onClick={onBook} 
            size="xl" 
            variant="skeuo-primary"
            className="w-full shadow-premium hover:shadow-premium-hover"
          >
            {t("book_appointment")}
          </Button>
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-14 rounded-xl border-border bg-background/80 px-4 sm:px-6 font-semibold shadow-sm"
              onClick={onShareBusiness}
              disabled={!onShareBusiness}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {businessQrT(locale, 'action_share_business')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-14 rounded-xl border-border bg-background/80 px-4 sm:px-6 font-semibold shadow-sm"
              onClick={onShowQr}
              disabled={!onShowQr || !business.qrCodeUrl}
            >
              <QrCode className="w-4 h-4 mr-2" />
              {businessQrT(locale, 'action_view_qr')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHeader;
