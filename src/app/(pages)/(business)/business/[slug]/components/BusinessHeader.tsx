"use client";
import React from "react";
import { Button } from "@components/ui/button";
import type { Business } from "@/(pages)/(business)/businesses/types/business";

const BusinessHeader: React.FC<{ business: Business; onBook?: () => void }> = ({ business, onBook }) => {
  // Format rating to 1 decimal place
  const formatRating = (rating: number | string | undefined | null): string => {
    if (rating === null || rating === undefined) return "No reviews";
    const numRating = typeof rating === 'string' ? Number.parseFloat(rating) : rating;
    if (Number.isNaN(numRating)) return "No reviews";
    return numRating.toFixed(1);
  };

  const hasRating = business.rating !== null && business.rating !== undefined && business.rating !== 0;

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold">{business.name}</h1>
        <Button onClick={onBook}>Book Now</Button>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        {business.category && <span className="text-gray-600">{business.category}</span>}
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          <span>{formatRating(business.rating)}</span>
          {hasRating && business.reviewCount !== undefined && business.reviewCount > 0 && (
            <span className="text-gray-500 ml-1">({business.reviewCount} {business.reviewCount === 1 ? 'review' : 'reviews'})</span>
          )}
        </div>
        {business.location && <span className="text-gray-600">{business.location}</span>}
      </div>
    </div>
  );
};

export default BusinessHeader;
