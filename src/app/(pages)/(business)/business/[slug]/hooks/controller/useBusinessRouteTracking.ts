"use client";

import { useEffect } from "react";
import { createBusinessSlug } from "@global/lib/businessSlug";
import type {
  BusinessDetailBusiness,
  TrackingEventName,
  TrackingPayload,
} from "../../types/businessDetailPage";

interface UseBusinessRouteTrackingParams {
  business: BusinessDetailBusiness | null;
  slug: string | undefined;
  router: { replace: (path: string) => void };
  trackEvent: (eventName: TrackingEventName, payload?: TrackingPayload) => void;
}

export const useBusinessRouteTracking = ({
  business,
  slug,
  router,
  trackEvent,
}: UseBusinessRouteTrackingParams) => {
  useEffect(() => {
    if (business) {
      trackEvent("business_view", {
        businessId: String(business.id),
        businessName: business.name,
        category: business.category ?? "unknown",
        source: "direct",
      });
    }
  }, [business, trackEvent]);

  useEffect(() => {
    if (business && slug) {
      const correctSlug = createBusinessSlug(business.name, business.id);
      if (slug !== correctSlug) {
        router.replace(`/business/${correctSlug}`);
      }
    }
  }, [business, slug, router]);
};
