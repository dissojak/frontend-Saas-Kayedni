"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Layout from '@components/layout/Layout';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { useTracking } from '@global/hooks/useTracking';
import TimeOnPageTracker from '@components/tracking/TimeOnPageTracker';
import ScrollDepthTracker from '@components/tracking/ScrollDepthTracker';
import { 
  Search, 
  MapPin, 
  Star, 
  Filter, 
  Grid, 
  List, 
  ChevronDown,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { searchBusinesses, BusinessSearchResult } from '@global/lib/api/business.api';
import { createBusinessSlug } from '@global/lib/businessSlug';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { trackEvent, trackPageView } = useTracking();
  
  // Get initial values from URL
  const initialQuery = searchParams.get('q') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || '';
  
  // State
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [results, setResults] = useState<BusinessSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'reviews'>('relevance');

  // Perform search on mount and when URL params change
  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const searchResults = await searchBusinesses({
          query: initialQuery || undefined,
          location: initialLocation || undefined,
          categoryId: initialCategory ? parseInt(initialCategory) : undefined,
        });
        
        // Sort results
        let sortedResults = [...searchResults];
        if (sortBy === 'rating') {
          sortedResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'reviews') {
          sortedResults.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        }
        
        setResults(sortedResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [initialQuery, initialLocation, initialCategory, sortBy]);

  // Handle new search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track search query
    trackEvent('search_query', {
      query,
      location,
      category: initialCategory,
      source: 'search_form',
    });

    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
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
      <div className="bg-slate-950 pt-8 pb-12">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for services..."
                  className="pl-12 py-6 text-lg bg-white dark:bg-slate-800 border-0 rounded-xl"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="pl-12 py-6 text-lg bg-white dark:bg-slate-800 border-0 rounded-xl"
                />
              </div>
              <Button 
                type="submit"
                size="lg"
                className="px-8 py-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:shadow-lg rounded-xl"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold dark:text-white">
                {loading ? 'Searching...' : `${results.length} results`}
                {initialQuery && <span className="text-gray-500 dark:text-gray-400"> for "{initialQuery}"</span>}
              </h1>
              {initialLocation && (
                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  {initialLocation}
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
                  <option value="relevance">Most Relevant</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
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
              <Button onClick={() => router.refresh()}>Try Again</Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && results.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2 dark:text-white">No results found</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button onClick={() => router.push('/')}>Back to Home</Button>
            </div>
          )}

          {/* Results Grid */}
          {!loading && !error && results.length > 0 && (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'flex flex-col gap-4'
            }>
              {results.map((business) => (
                <div
                  key={business.id}
                  onClick={() => handleBusinessClick(business)}
                  className={`group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:border-[var(--color-primary)]/50 hover:shadow-xl transition-all ${
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

                    <Button 
                      size="sm" 
                      className="mt-3 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBusinessClick(business);
                      }}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
