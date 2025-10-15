"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
// fallback: if you already have businesses in BookingContext you can still use it.
import { useBooking } from "@/(pages)/(booking)/context/BookingContext";
import useBusinessFilter from "./hooks/useBusinessFilter";
import useBusinesses from "./hooks/useBusinesses";
import BusinessList from "./components/BusinessList";
import SearchFilter from "./components/SearchFilter";
import type { Business } from "./types/business";
import { fetchCategories } from "../actions/backend";

const BusinessesPage: React.FC = () => {
  const bookingCtx = useBooking?.();
  const bookingBusinesses = (bookingCtx && (bookingCtx.businesses as Business[])) || [];

  const { businesses: fetchedBusinesses, loading } = useBusinesses();
  const [categories, setCategories] = useState<string[] | undefined>(undefined);

  // prefer real fetched businesses, then booking context, then empty
  const businesses = fetchedBusinesses.length ? fetchedBusinesses : bookingBusinesses;

  useEffect(() => {
    let mounted = true;
    fetchCategories().then((cats) => mounted && setCategories(cats));
    return () => {
      mounted = false;
    };
  }, []);


  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filtered,
  } = useBusinessFilter(businesses as Business[], categories);

  // If a ?category=... query param exists, try to set the initial selected category
  useEffect(() => {
    if (!categories) return;
    // read from window.location.search on the client to avoid SSR/suspense issues
    const catParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('category') : null;
    if (!catParam) return;
    const match = categories.find((c) => String(c).toLowerCase() === String(catParam).toLowerCase());
    if (match) setSelectedCategory(match as any);
  }, [categories]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Find Businesses</h1>

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories ?? ["All"]}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <BusinessList
          businesses={filtered}
          onClearFilters={() => {
            setSearchTerm("");
            setSelectedCategory("All");
          }}
        />

        {loading && <p className="mt-6 text-gray-500">Loading businesses...</p>}
      </div>
    </Layout>
  );
};

export default BusinessesPage;
