"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { Star, MapPin, X, ArrowRight } from 'lucide-react';
import type { BusinessSearchResult } from '@global/lib/api/business.api';
import { createBusinessSlug } from '@global/lib/businessSlug';

interface SearchResultsProps {
  results: BusinessSearchResult[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  onClose: () => void;
  searchQuery?: string;
  searchLocation?: string;
}

export function SearchResults({ results, loading, error, hasSearched, onClose, searchQuery, searchLocation }: SearchResultsProps) {
  const router = useRouter();

  // Navigate to search page with current query
  const handleViewAll = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    onClose();
    router.push(`/search?${params.toString()}`);
  };

  if (!hasSearched) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-h-[70vh] overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold dark:text-white">
          {loading ? 'Searching...' : `${results.length} Results Found`}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
        {loading && (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="h-5 w-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
              <span>Searching for services...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No services found matching your search.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Try different keywords or location.</p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {results.map((business) => (
              <div
                key={business.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading && results.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <Button
            className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
            onClick={handleViewAll}
          >
            View All Results
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
