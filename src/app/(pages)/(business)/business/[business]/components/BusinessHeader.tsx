"use client";
import React from "react";
import { Button } from "@components/ui/button";
import type { Business } from "@/(pages)/(business)/businesses/types/business";

const BusinessHeader: React.FC<{ business: Business; onBook?: () => void }> = ({ business, onBook }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold">{business.name}</h1>
        <Button onClick={onBook}>Book Now</Button>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">{business.category}</span>
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          <span>{business.rating}</span>
        </div>
  <span className="text-gray-600">{(business as any)?.address ?? ""}</span>
      </div>
    </div>
  );
};

export default BusinessHeader;
