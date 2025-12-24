"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { searchBusinesses, BusinessSearchResult, SearchParams } from '@global/lib/api/business.api';

// Debounce delay in milliseconds (300ms is optimal for typeahead)
const DEBOUNCE_DELAY = 300;
// Minimum characters before triggering search
const MIN_SEARCH_LENGTH = 2;

export interface UseSearchReturn {
  query: string;
  setQuery: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  results: BusinessSearchResult[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  search: () => Promise<void>;
  searchWithParams: (params: SearchParams) => Promise<void>;
  clearResults: () => void;
  // New: Real-time search handlers
  handleQueryChange: (value: string) => void;
  handleLocationChange: (value: string) => void;
  isTyping: boolean;
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState<BusinessSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Refs for debouncing
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Core search function (internal)
  const performSearchInternal = useCallback(async (searchQuery: string, searchLocation: string) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Don't search if query is too short (but allow location-only search)
    if (searchQuery.length < MIN_SEARCH_LENGTH && !searchLocation.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setIsTyping(false);

    try {
      const searchResults = await searchBusinesses({
        query: searchQuery.trim() || undefined,
        location: searchLocation.trim() || undefined,
      });
      setResults(searchResults);
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search trigger
  const triggerDebouncedSearch = useCallback((newQuery: string, newLocation: string) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsTyping(true);

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      performSearchInternal(newQuery, newLocation);
    }, DEBOUNCE_DELAY);
  }, [performSearchInternal]);

  // Handle query change with real-time search
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    
    // Clear results if empty
    if (!value.trim() && !location.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsTyping(false);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      return;
    }

    triggerDebouncedSearch(value, location);
  }, [location, triggerDebouncedSearch]);

  // Handle location change with real-time search
  const handleLocationChange = useCallback((value: string) => {
    setLocation(value);
    
    // Only trigger search if we have some query text or location
    if (query.trim() || value.trim()) {
      triggerDebouncedSearch(query, value);
    } else {
      setResults([]);
      setHasSearched(false);
      setIsTyping(false);
    }
  }, [query, triggerDebouncedSearch]);

  // Manual search (for form submit / button click)
  const search = useCallback(async () => {
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (!query.trim() && !location.trim()) {
      setError('Please enter a search term or location');
      return;
    }

    await performSearchInternal(query, location);
  }, [query, location, performSearchInternal]);

  const searchWithParams = useCallback(async (params: SearchParams) => {
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!params.query && !params.location && !params.categoryId) {
      setError('Please enter a search term or location');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setIsTyping(false);

    // Update state with params
    if (params.query !== undefined) setQuery(params.query);
    if (params.location !== undefined) setLocation(params.location);

    try {
      const searchResults = await searchBusinesses(params);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setHasSearched(false);
    setError(null);
    setIsTyping(false);
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  return {
    query,
    setQuery,
    location,
    setLocation,
    results,
    loading,
    error,
    hasSearched,
    search,
    searchWithParams,
    clearResults,
    // New real-time search handlers
    handleQueryChange,
    handleLocationChange,
    isTyping,
  };
}
