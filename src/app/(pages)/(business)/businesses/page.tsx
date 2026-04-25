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
import { useTracking } from "@global/hooks/useTracking";
import TimeOnPageTracker from "@components/tracking/TimeOnPageTracker";
import ScrollDepthTracker from "@components/tracking/ScrollDepthTracker";
import { useLocale } from "@global/hooks/useLocale";
import { businessesT } from "./i18n";

const BusinessesPage: React.FC = () => {
  const bookingCtx = useBooking?.();
  const bookingBusinesses = (bookingCtx && (bookingCtx.businesses as Business[])) || [];
  const { trackEvent } = useTracking();
  const { locale } = useLocale();

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
    const catParam = new URLSearchParams(globalThis.location.search).get('category');
    if (!catParam) return;
    const match = categories.find((c) => String(c).toLowerCase() === String(catParam).toLowerCase());
    if (match) setSelectedCategory(match as any);
  }, [categories]);

  // Reset to first page whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, totalItems]);

  // Track search usage (debounced via searchTerm dependency)
  useEffect(() => {
    if (searchTerm && searchTerm.length >= 2) {
      trackEvent('search_query', { query: searchTerm, source: 'businesses_list', resultCount: filtered.length });
    }
  }, [searchTerm, trackEvent, filtered.length]);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'All') {
      trackEvent('category_browsed', { category: selectedCategory, source: 'businesses_list', resultCount: filtered.length });
    }
  }, [selectedCategory, trackEvent, filtered.length]);

  // Track business impressions — batch all visible into a single event (debounced)
  useEffect(() => {
    if (pagedBusinesses.length === 0) return;
    const timer = setTimeout(() => {
      trackEvent('business_impression', {
        businessIds: pagedBusinesses.map((biz: Business) => String(biz.id)),
        businessNames: pagedBusinesses.map((biz: Business) => biz.name),
        count: pagedBusinesses.length,
        page: currentPage,
        source: 'businesses_list',
      });
    }, 500); // 500ms debounce — avoids flooding during typing
    return () => clearTimeout(timer);
  }, [pagedBusinesses, currentPage, trackEvent]);

  return (
    <Layout>
      {/* Tracking */}
      <TimeOnPageTracker pageName="businesses_list" />
      <ScrollDepthTracker pageName="businesses_list" />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{businessesT(locale, "title_find_businesses")}</h1>

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
            {businessesT(locale, "showing_range", {
              from: totalItems === 0 ? 0 : startIndex + 1,
              to: endIndex,
              total: totalItems,
            })}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">{businessesT(locale, "per_page")}</label>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={pageSize}
              onChange={(e) => {
                const next = Number(e.target.value);
                trackEvent('filter_used', { filter: 'page_size', value: String(next), source: 'businesses_list' });
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
                {businessesT(locale, "prev")}
              </Button>
              <span className="text-sm text-gray-700">
                {businessesT(locale, "page_of", { current: currentPage, total: totalPages })}
              </span>
              <Button
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                {businessesT(locale, "next")}
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

        {loading && <p className="mt-6 text-gray-500">{businessesT(locale, "loading_businesses")}</p>}
      </div>
    </Layout>
  );
};

export default BusinessesPage;
