"use client";
import React from "react";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { getLogo, formatRating } from "../utils/format";
import type { Business } from "../types/business";
import { useRouter } from "next/navigation";
import { createBusinessSlug } from "@global/lib/businessSlug";
import { useTracking } from "@global/hooks/useTracking";

const BusinessCard: React.FC<{ business: Business }> = ({ business }) => {
  const router = useRouter();
  const { trackEvent } = useTracking();
  return (
    <Card key={business.id} className="overflow-hidden card-hover">
      <div className="h-48 overflow-hidden">
        <img src={getLogo(business)} alt={business.name} className="w-full h-full object-cover" />
      </div>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-2">{business.name}</h2>
        <p className="text-gray-600 mb-3">{business.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">{business.category}</span>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{formatRating(business.rating)}</span>
          </div>
        </div>
        <Button className="w-full" onClick={() => { trackEvent('business_view', { businessId: String(business.id), businessName: business.name, category: business.category, source: 'businesses_list' }); router.push(`/business/${createBusinessSlug(business.name, business.id)}`); }}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;
