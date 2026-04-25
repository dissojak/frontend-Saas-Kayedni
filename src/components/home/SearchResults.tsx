"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { Star, MapPin, X, ArrowRight, Grid2x2, Search as SearchIcon } from 'lucide-react';
import type { BusinessSearchResult, CategorySearchResult } from '@global/lib/api/business.api';
import type { SearchMode } from '@global/hooks/useSearch';
import { createBusinessSlug } from '@global/lib/businessSlug';
import { useLocale } from '@global/hooks/useLocale';
import { searchT } from '@global/lib/i18n/search';

interface SearchResultsProps {
  results: BusinessSearchResult[];
  categories: CategorySearchResult[];
  mode: SearchMode;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  onClose: () => void;
  onCategorySelect: (category: CategorySearchResult) => void;
  searchQuery?: string;
  searchLocation?: string;
  searchDate?: string;
}

export function SearchResults({
  results,
  categories,
  mode,
  loading,
  error,
  hasSearched,
  onClose,
  onCategorySelect,
  searchQuery,
  searchLocation,
  searchDate,
}: Readonly<SearchResultsProps>) {
  const router = useRouter();
  const { locale } = useLocale();
  const showCategories = mode === 'categories' || mode === 'mixed';
  const showBusinesses = mode === 'businesses' || mode === 'mixed';

  let headerTitle = searchT(locale, 'all_treatments_and_venues');
  if (loading && showBusinesses) {
    headerTitle = searchT(locale, 'searching_short');
  } else if (showBusinesses) {
    headerTitle = searchT(locale, 'results_found', { count: results.length });
  }

  // Navigate to search page with current query
  const handleViewAll = () => {
    const params = new URLSearchParams();
    if (mode !== 'categories' && searchQuery) params.set('q', searchQuery);
    params.set('page', '1');
    if (searchLocation) params.set('location', searchLocation);
    if (searchDate) params.set('date', searchDate);
    onClose();
    router.push(`/search?${params.toString()}`);
  };

  const handleViewAllTreatments = () => {
    const params = new URLSearchParams();
    params.set('all', '1');
    params.set('page', '1');
    if (searchLocation) params.set('location', searchLocation);
    if (searchDate) params.set('date', searchDate);
    onClose();
    router.push(`/search?${params.toString()}`);
  };

  if (!hasSearched) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-h-[70vh] flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-10">
        <h3 className="text-lg font-semibold dark:text-white">
          {headerTitle}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-white dark:bg-slate-900 border-x border-gray-100 dark:border-slate-800">
        {loading && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-medium">
            {searchT(locale, 'searching_services')}
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && showCategories && categories.length > 0 && (
          <div className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 px-2">
              {mode === 'mixed' ? searchT(locale, 'matching_categories') : searchT(locale, 'top_categories')}
            </div>

            <div className="space-y-1">
              <button
                type="button"
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-left transition-colors"
                onClick={handleViewAllTreatments}
              >
                <span className="h-10 w-10 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center bg-white dark:bg-slate-900">
                  <Grid2x2 className="h-4 w-4 text-primary" />
                </span>
                <span className="font-medium text-gray-900 dark:text-white">{searchT(locale, 'all_treatments')}</span>
              </button>

              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-left transition-colors"
                  onClick={() => onCategorySelect(category)}
                >
                  <span className="h-10 w-10 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center bg-white dark:bg-slate-900 text-primary">
                    {category.icon ? (
                      <span className="text-base leading-none">{category.icon}</span>
                    ) : (
                      <SearchIcon className="h-4 w-4" />
                    )}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && showBusinesses && results.length === 0 && categories.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">{searchT(locale, 'no_services_found')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">{searchT(locale, 'try_keywords_or_location')}</p>
          </div>
        )}

        {!loading && !error && showBusinesses && results.length > 0 && (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {results.map((business) => (
              <button
                type="button"
                key={business.id}
                className="w-full p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors text-left"
                onClick={() => {
                  onClose();
                  router.push(`/business/${createBusinessSlug(business.name, business.id)}`);
                }}
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                    {business.imageUrl ? (
                      <Image
                        src={business.imageUrl}
                        alt={business.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-2xl font-bold">
                        {business.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {business.name}
                      </h4>
                      {business.rating && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {business.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {business.categoryName && (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        {business.categoryName}
                      </span>
                    )}

                    {business.location && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{business.location}</span>
                      </div>
                    )}

                    {business.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {business.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading && showBusinesses && results.length > 0 && (
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 relative z-10">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            onClick={handleViewAll}
            size="lg"
          >
            {searchT(locale, 'view_all_results')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
