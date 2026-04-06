"use client";
import React from "react";
import BusinessCard from "./BusinessCard";
import type { Business } from "../types/business";
import { Button } from "@components/ui/button";
import { useLocale } from "@global/hooks/useLocale";
import { businessesT } from "../i18n";

const BusinessList: React.FC<{ businesses: Business[]; onClearFilters?: () => void }>
  = ({ businesses, onClearFilters }) => {
  const { locale } = useLocale();

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">{businessesT(locale, "no_businesses_found")}</h3>
        <p className="text-gray-500 mb-6">{businessesT(locale, "adjust_search_criteria")}</p>
        <Button variant="outline" onClick={onClearFilters}>
          {businessesT(locale, "clear_filters")}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((b) => (
        <BusinessCard business={b} key={b.id} />
      ))}
    </div>
  );
};

export default BusinessList;
