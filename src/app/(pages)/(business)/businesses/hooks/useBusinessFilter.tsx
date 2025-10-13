"use client";
import { useMemo, useState } from "react";
import type { Business, Category } from "../types/business";
import { DEFAULT_CATEGORIES } from "../lib/categories";

export default function useBusinessFilter(initialBusinesses: Business[] = [], externalCategories?: string[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const categories = useMemo(() => {
    if (externalCategories && externalCategories.length > 0) return externalCategories;
    const set = new Set<string>(DEFAULT_CATEGORIES);
    initialBusinesses.forEach((b) => b.category && set.add(b.category as string));
    return Array.from(set);
  }, [initialBusinesses]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return initialBusinesses.filter((business) => {
      const matchesSearch = business.name.toLowerCase().includes(term);
      const matchesCategory = selectedCategory === "All" || business.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialBusinesses, searchTerm, selectedCategory]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
    filtered,
  } as const;
}
