"use client";
import React from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useLocale } from "@global/hooks/useLocale";
import { businessesT } from "../i18n";

const SearchFilter: React.FC<{
  searchTerm: string;
  onSearchChange: (v: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
}> = ({ searchTerm, onSearchChange, categories, selectedCategory, onCategoryChange }) => {
  const { locale } = useLocale();

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder={businessesT(locale, "search_businesses_placeholder")}
          className="md:w-96"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button variant="outline" className="md:w-auto">
          {businessesT(locale, "advanced_filters")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category ? "bg-primary text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category === "All" ? businessesT(locale, "category_all") : category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
