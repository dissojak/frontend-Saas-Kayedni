"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Layout from '@components/layout/Layout';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import SearchResults from '@components/home/SearchResults';
import { useTracking } from '@global/hooks/useTracking';
import { useSearch } from '@global/hooks/useSearch';
import { useLocale } from '@global/hooks/useLocale';
import TimeOnPageTracker from '@components/tracking/TimeOnPageTracker';
import ScrollDepthTracker from '@components/tracking/ScrollDepthTracker';
import { searchT } from '@global/lib/i18n/search';
import { 
  Search, 
  MapPin, 
  Calendar,
  Star, 
  Grid, 
  List, 
  ChevronDown,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { searchBusinessesPage, getBusinessesPage, BusinessSearchResult } from '@global/lib/api/business.api';
import { createBusinessSlug } from '@global/lib/businessSlug';

const PAGE_SIZE = 12;

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale } = useLocale();
  const { trackEvent, trackPageView } = useTracking();
  const searchContainerRef = React.useRef<HTMLDivElement>(null);
  const dateMenuRef = React.useRef<HTMLDivElement>(null);

  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);

  let localeTag = 'en-US';
  if (locale === 'fr') {
    localeTag = 'fr-FR';
  } else if (locale === 'ar') {
    localeTag = 'ar';
  }

  const toIsoDate = (value: Date) => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateLabel = (isoDate: string) => {
    if (!isoDate) return searchT(locale, 'any_time');
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (isoDate === toIsoDate(today)) return searchT(locale, 'today');
    if (isoDate === toIsoDate(tomorrow)) return searchT(locale, 'tomorrow');

    const parsed = new Date(`${isoDate}T00:00:00`);
    return Number.isNaN(parsed.getTime())
      ? searchT(locale, 'any_time')
      : parsed.toLocaleDateString(localeTag, { month: 'short', day: 'numeric' });
  };
  
  // Get initial values from URL
  const initialQuery = searchParams.get('q') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialDate = searchParams.get('date') || '';
  const initialAll = searchParams.get('all') === '1';
  const initialPage = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
  
  // State
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [date, setDate] = useState(initialDate);
  const [results, setResults] = useState<BusinessSearchResult[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'reviews'>('relevance');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const currentPage = Math.min(initialPage, Math.max(totalPages, 1));
  const paginationWindowStart = Math.max(1, currentPage - 2);
  const paginationWindowEnd = Math.min(totalPages, currentPage + 2);

  const {
    setQuery: setLiveQuery,
    setLocation: setLiveLocation,
    setSelectedDate: setLiveDate,
    results: liveResults,
    categoryResults,
    mode: liveMode,
    loading: liveLoading,
    error: liveError,
    hasSearched: liveHasSearched,
    clearResults: clearLiveResults,
    handleQueryFocus,
    handleQueryChange,
    handleLocationChange,
  } = useSearch();

  useEffect(() => {
    trackPageView('/search');
  }, [trackPageView]);

  // Keep form state in sync with URL params
  useEffect(() => {
    setQuery(initialQuery);
    setLocation(initialLocation);
    setDate(initialDate);
    setLiveQuery(initialQuery);
    setLiveLocation(initialLocation);
    setLiveDate(initialDate);
    clearLiveResults();
    setIsSearchDropdownOpen(false);
    setIsDateMenuOpen(false);
  }, [initialQuery, initialLocation, initialDate, setLiveDate, setLiveLocation, setLiveQuery, clearLiveResults]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideSearch = searchContainerRef.current?.contains(target) ?? false;
      const clickedInsideDate = dateMenuRef.current?.contains(target) ?? false;

      if (!clickedInsideDate) {
        setIsDateMenuOpen(false);
      }

      if (!clickedInsideSearch) {
        setIsSearchDropdownOpen(false);
        clearLiveResults();
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [clearLiveResults]);

  // Perform search only when URL params change (or sort changes).
  // This keeps behavior manual: user edits inputs, then clicks Search.
  useEffect(() => {
    const performSearch = async () => {
      const hasAnyFilter = Boolean(initialAll || initialQuery || initialLocation || initialDate || initialCategory);
      if (!hasAnyFilter) {
        setResults([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const currentPage = Math.max(1, initialPage);

        if (initialAll) {
          const paged = await getBusinessesPage(currentPage - 1, PAGE_SIZE);
          setTotalPages(paged.totalPages);
          setTotalElements(paged.totalElements);

          let sortedAll = [...paged.items];
          if (sortBy === 'rating') {
            sortedAll.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          } else if (sortBy === 'reviews') {
            sortedAll.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
          }
          setResults(sortedAll);
          return;
        }

        const pagedSearch = await searchBusinessesPage({
          query: initialQuery || undefined,
          location: initialLocation || undefined,
          categoryId: initialCategory ? Number.parseInt(initialCategory, 10) : undefined,
          date: initialDate || undefined,
        }, currentPage - 1, PAGE_SIZE);
        
        setTotalElements(pagedSearch.totalElements);
        setTotalPages(pagedSearch.totalPages);

        let sortedResults = [...pagedSearch.items];
        if (sortBy === 'rating') {
          sortedResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'reviews') {
          sortedResults.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        }
        setResults(sortedResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : searchT(locale, 'error_search_failed'));
        setResults([]);
        setTotalElements(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [initialAll, initialQuery, initialLocation, initialDate, initialCategory, initialPage, locale, sortBy]);

  // Handle new search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track search query
    trackEvent('search_query', {
      query,
      location,
      date,
      category: initialCategory,
      source: 'search_form',
    });

    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    if (date) params.set('date', date);
    if (!query.trim() && !location.trim() && !date) params.set('all', '1');
    params.set('page', '1');
    setIsSearchDropdownOpen(false);
    setIsDateMenuOpen(false);
    clearLiveResults();
    router.push(`/search?${params.toString()}`);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > Math.max(totalPages, 1) || nextPage === currentPage) {
      return;
    }

    const params = new URLSearchParams();
    if (initialQuery) params.set('q', initialQuery);
    if (initialLocation) params.set('location', initialLocation);
    if (initialDate) params.set('date', initialDate);
    if (initialCategory) params.set('category', initialCategory);
    if (initialAll) params.set('all', '1');
    params.set('page', String(nextPage));

    router.push(`/search?${params.toString()}`);
  };

  // Navigate to business with SEO-friendly slug
  const handleBusinessClick = (business: BusinessSearchResult) => {
    // Track business view
    trackEvent('business_view', {
      businessId: business.id,
      businessName: business.name,
      source: 'search_results',
    });

    const slug = createBusinessSlug(business.name, business.id);
    router.push(`/business/${slug}`);
  };

  return (
    <Layout>
      {/* Tracking Components */}
      <TimeOnPageTracker pageName="search" />
      <ScrollDepthTracker pageName="search" />

      {/* Search Header */}
      <div className="bg-slate-400 dark:bg-slate-950 pt-8 pb-12">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:text-white mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{searchT(locale, 'back')}</span>
          </button>

          {/* Search Form */}
          <div ref={searchContainerRef} className="max-w-4xl mx-auto relative">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={query}
                    onFocus={() => {
                      setIsSearchDropdownOpen(true);
                      handleQueryFocus();
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setQuery(value);
                      setIsSearchDropdownOpen(true);
                      handleQueryChange(value);
                    }}
                    placeholder={searchT(locale, 'search_services_placeholder')}
                    className="pl-12 py-6 text-lg bg-white dark:bg-slate-800 border-0 rounded-xl"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => {
                      const value = e.target.value;
                      setLocation(value);
                      setIsDateMenuOpen(false);
                      setIsSearchDropdownOpen(true);
                      handleLocationChange(value);
                    }}
                    placeholder={searchT(locale, 'location_placeholder')}
                    className="pl-12 py-6 text-lg bg-white dark:bg-slate-800 border-0 rounded-xl"
                  />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <div className="relative flex-1" ref={dateMenuRef}>
                  <button
                    type="button"
                    className="relative w-full h-[52px] pl-12 pr-4 text-lg bg-white dark:bg-slate-800 border-0 rounded-xl text-left"
                    onClick={() => {
                      setIsSearchDropdownOpen(false);
                      clearLiveResults();
                      setIsDateMenuOpen((v) => !v);
                    }}
                  >
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    {formatDateLabel(date)}
                  </button>

                  {isDateMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-full rounded-2xl border border-border bg-card shadow-2xl z-[60] p-3 space-y-2">
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => {
                          setDate('');
                          setLiveDate('');
                          trackEvent('filter_used', {
                            filterType: 'date',
                            value: 'any_time',
                            source: 'search_form',
                          });
                          setIsDateMenuOpen(false);
                        }}
                      >
                        {searchT(locale, 'any_time')}
                      </button>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => {
                          const value = toIsoDate(new Date());
                          setDate(value);
                          setLiveDate(value);
                          trackEvent('filter_used', {
                            filterType: 'date',
                            value,
                            source: 'search_form',
                          });
                          setIsDateMenuOpen(false);
                        }}
                      >
                        {searchT(locale, 'today')}
                      </button>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          const value = toIsoDate(tomorrow);
                          setDate(value);
                          setLiveDate(value);
                          trackEvent('filter_used', {
                            filterType: 'date',
                            value,
                            source: 'search_form',
                          });
                          setIsDateMenuOpen(false);
                        }}
                      >
                        {searchT(locale, 'tomorrow')}
                      </button>

                      <div className="pt-2 border-t border-border">
                        <label htmlFor="search-page-date" className="text-xs text-muted-foreground px-1">
                          {searchT(locale, 'pick_date')}
                        </label>
                        <input
                          id="search-page-date"
                          type="date"
                          className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={date}
                          onChange={(e) => {
                            const value = e.target.value;
                            setDate(value);
                            setLiveDate(value);
                            trackEvent('filter_used', {
                              filterType: 'date',
                              value,
                              source: 'search_form',
                            });
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  type="submit"
                  size="lg"
                  className="px-8 py-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:shadow-lg rounded-xl"
                >
                  <Search className="h-5 w-5 mr-2" />
                  {searchT(locale, 'search')}
                </Button>
              </div>
            </form>

            {isSearchDropdownOpen && !isDateMenuOpen && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2">
                <SearchResults
                  results={liveResults}
                  categories={categoryResults}
                  mode={liveMode}
                  loading={liveLoading}
                  error={liveError ?? null}
                  hasSearched={liveHasSearched}
                  onClose={() => {
                    setIsSearchDropdownOpen(false);
                    clearLiveResults();
                  }}
                  onCategorySelect={(category) => {
                    const params = new URLSearchParams();
                    params.set('category', String(category.id));
                    if (location) params.set('location', location);
                    if (date) params.set('date', date);
                    params.set('page', '1');
                    setIsSearchDropdownOpen(false);
                    clearLiveResults();
                    router.push(`/search?${params.toString()}`);
                  }}
                  searchQuery={query}
                  searchLocation={location}
                  searchDate={date}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold dark:text-white">
                {loading
                  ? searchT(locale, 'searching_short')
                  : searchT(locale, 'showing_results', { shown: results.length, total: totalElements })}
                {initialQuery && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {searchT(locale, 'for_query', { query: initialQuery })}
                  </span>
                )}
              </h1>
              {initialLocation && (
                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  {initialLocation}
                </p>
              )}
              {initialDate && (
                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <Clock className="h-4 w-4" />
                  {initialDate}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const newSort = e.target.value as typeof sortBy;
                    setSortBy(newSort);
                    // Track sort usage
                    trackEvent('sort_used', {
                      sortBy: newSort,
                      resultsCount: results.length,
                    });
                  }}
                  className="appearance-none bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="relevance">{searchT(locale, 'sort_relevance')}</option>
                  <option value="rating">{searchT(locale, 'sort_rating')}</option>
                  <option value="reviews">{searchT(locale, 'sort_reviews')}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-slate-700" />
                  <div className="p-5">
                    <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded mb-3 w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2 w-1/2" />
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-16">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={() => router.refresh()}>{searchT(locale, 'try_again')}</Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && results.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2 dark:text-white">{searchT(locale, 'no_results_found')}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchT(locale, 'no_results_description')}
              </p>
              <Button onClick={() => router.push('/')}>{searchT(locale, 'back_to_home')}</Button>
            </div>
          )}

          {/* Results Grid */}
          {!loading && !error && results.length > 0 && (
            <>
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'flex flex-col gap-4'
              }>
                {results.map((business) => (
                <button
                  type="button"
                  key={business.id}
                  onClick={() => handleBusinessClick(business)}
                  className={`group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:border-[var(--color-primary)]/50 hover:shadow-xl transition-all text-left ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 ${
                    viewMode === 'grid' ? 'h-48' : 'w-48 h-36 flex-shrink-0'
                  }`}>
                    {business.imageUrl ? (
                      <Image
                        src={business.imageUrl}
                        alt={business.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes={viewMode === 'grid' ? '(max-width: 768px) 100vw, 33vw' : '192px'}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-4xl font-bold">
                        {business.name.charAt(0)}
                      </div>
                    )}
                    
                    {/* Location Badge (Overlay) */}
                    {business.location && (
                      <div className="absolute top-3 left-3 bg-white/60 dark:bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm border border-white/20 dark:border-white/10 flex items-center gap-1 text-slate-800 dark:text-white group-hover:bg-white/80 dark:group-hover:bg-black/60 transition-colors z-10">
                        <MapPin className="h-3 w-3 text-[var(--color-primary)]" />
                        {business.location}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-5 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[var(--color-primary)] transition-colors">
                        {business.name}
                      </h3>
                      {business.rating && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{business.rating.toFixed(1)}</span>
                          {business.reviewCount && (
                            <span className="text-xs text-gray-500">({business.reviewCount})</span>
                          )}
                        </div>
                      )}
                    </div>

                    {business.category && (
                      <p className="text-sm text-[var(--color-primary)] font-medium mb-2">
                        {business.category}
                      </p>
                    )}

                    {business.location && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
                        <MapPin className="h-3.5 w-3.5" />
                        {business.location}
                      </p>
                    )}

                    {business.description && viewMode === 'list' && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {business.description}
                      </p>
                    )}

                    <div className="mt-3 w-full rounded-md bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white flex items-center justify-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {searchT(locale, 'book_now')}
                    </div>
                  </div>
                </button>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="h-9 px-3"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: paginationWindowEnd - paginationWindowStart + 1 }, (_, idx) => paginationWindowStart + idx).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="h-9 min-w-9 px-3"
                    >
                      {pageNum}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="h-9 px-3"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
