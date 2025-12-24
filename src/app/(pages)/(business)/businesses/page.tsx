"use client";

import React, { useEffect, useMemo, useState } from "react";
import Layout from "@components/layout/Layout";
// fallback: if you already have businesses in BookingContext you can still use it.
import { useBooking } from "@/(pages)/(booking)/context/BookingContext";
import useBusinessFilter from "./hooks/useBusinessFilter";
import useBusinesses from "./hooks/useBusinesses";
import BusinessList from "./components/BusinessList";
import SearchFilter from "./components/SearchFilter";
import type { Business } from "./types/business";
import { fetchCategories } from "../actions/backend";
import { Button } from "@components/ui/button";

const BusinessesPage: React.FC = () => {
  const bookingCtx = useBooking?.();
  const bookingBusinesses = (bookingCtx && (bookingCtx.businesses as Business[])) || [];

  const { businesses: fetchedBusinesses, loading } = useBusinesses();
  const [categories, setCategories] = useState<string[] | undefined>(undefined);
  const [pageSize, setPageSize] = useState<number>(9);
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  // Compute pagination
  const totalItems = filtered.length;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / pageSize)), [totalItems, pageSize]);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pagedBusinesses = useMemo(() => filtered.slice(startIndex, endIndex), [filtered, startIndex, endIndex]);

  // If a ?category=... query param exists, try to set the initial selected category
  useEffect(() => {
    if (!categories) return;
    // read from window.location.search on the client to avoid SSR/suspense issues
    const catParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('category') : null;
    if (!catParam) return;
    const match = categories.find((c) => String(c).toLowerCase() === String(catParam).toLowerCase());
    if (match) setSelectedCategory(match as any);
  }, [categories]);

  // Reset to first page whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, totalItems]);

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

        {/* Pagination Controls */}
        <div className="mt-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{totalItems === 0 ? 0 : startIndex + 1}</span>
            –<span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalItems}</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">Per page:</label>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={pageSize}
              onChange={(e) => {
                const next = Number(e.target.value);
                setPageSize(next);
                setCurrentPage(1);
              }}
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <span className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
              </span>
              <Button
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        <BusinessList
          businesses={pagedBusinesses}
          onClearFilters={() => {
            setSearchTerm("");
            setSelectedCategory("All");
            setCurrentPage(1);
          }}
        />

        {loading && <p className="mt-6 text-gray-500">Loading businesses...</p>}
      </div>
    </Layout>
  );
};

export default BusinessesPage;
