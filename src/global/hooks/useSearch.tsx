"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  searchBusinesses,
  searchCategories,
  BusinessSearchResult,
  CategorySearchResult,
  SearchParams,
} from '@global/lib/api/business.api';
import { useLocale } from '@global/hooks/useLocale';
import { searchT } from '@global/lib/i18n/search';

// Debounce delay in milliseconds (300ms is optimal for typeahead)
const DEBOUNCE_DELAY = 300;
// Minimum characters before triggering search
const MIN_SEARCH_LENGTH = 2;

export type SearchMode = 'categories' | 'businesses' | 'mixed';

export interface UseSearchReturn {
  query: string;
  setQuery: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  results: BusinessSearchResult[];
  categoryResults: CategorySearchResult[];
  mode: SearchMode;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  search: () => Promise<void>;
  searchWithParams: (params: SearchParams) => Promise<void>;
  clearResults: () => void;
  // New: Real-time search handlers
  handleQueryFocus: () => void;
  handleQueryChange: (value: string) => void;
  handleLocationChange: (value: string) => void;
  isTyping: boolean;
}

export function useSearch(): UseSearchReturn {
  const { locale } = useLocale();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [results, setResults] = useState<BusinessSearchResult[]>([]);
  const [categoryResults, setCategoryResults] = useState<CategorySearchResult[]>([]);
  const [mode, setMode] = useState<SearchMode>('categories');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Refs for debouncing
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const performBusinessSearch = useCallback(async (
    searchQuery: string,
    searchLocation: string,
    date: string,
    categoryId?: number,
    nextMode: SearchMode = 'businesses',
  ) => {
    const cleanQuery = searchQuery.trim();
    const cleanLocation = searchLocation.trim();

    if (cleanQuery.length > 0 && cleanQuery.length < MIN_SEARCH_LENGTH && !cleanLocation) {
      setResults([]);
      setHasSearched(true);
      setMode('categories');
      return;
    }

    if (!cleanQuery && !cleanLocation && !categoryId) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setMode(nextMode);
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setIsTyping(false);

    try {
      const searchResults = await searchBusinesses({
        query: cleanQuery || undefined,
        location: cleanLocation || undefined,
        categoryId,
        date: date || undefined,
      });
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : searchT(locale, 'error_search_retry'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  const performCategorySearch = useCallback(async (
    categoryQuery: string,
    nextMode: SearchMode = 'categories',
    withLoading = true,
  ) => {
    setMode(nextMode);
    if (withLoading) {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      setIsTyping(false);
    }

    try {
      const categoryData = await searchCategories(categoryQuery.trim() || undefined, 12);
      setCategoryResults(categoryData);
    } catch (err) {
      if (withLoading) {
        setError(err instanceof Error ? err.message : searchT(locale, 'error_load_categories'));
      }
      setCategoryResults([]);
    } finally {
      if (withLoading) {
        setLoading(false);
      }
    }
  }, [locale]);

  const triggerDebouncedCategorySearch = useCallback((categoryQuery: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setIsTyping(true);
    debounceTimerRef.current = setTimeout(() => {
      performCategorySearch(categoryQuery);
    }, DEBOUNCE_DELAY);
  }, [performCategorySearch]);

  const triggerDebouncedBusinessSearch = useCallback((newQuery: string, newLocation: string, date: string, nextMode: SearchMode = 'businesses') => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setLoading(true);
    setError(null);
    setIsTyping(true);
    debounceTimerRef.current = setTimeout(() => {
      performBusinessSearch(newQuery, newLocation, date, undefined, nextMode);
    }, DEBOUNCE_DELAY);
  }, [performBusinessSearch]);

  const handleQueryFocus = useCallback(() => {
    if (query.trim()) {
      return;
    }
    setResults([]);
    performCategorySearch('');
  }, [performCategorySearch, query]);

  // Handle query change with real-time search
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);

    const clean = value.trim();
    if (!clean) {
      setResults([]);
      performCategorySearch('');
      return;
    }

    if (clean.length < MIN_SEARCH_LENGTH) {
      setResults([]);
      triggerDebouncedCategorySearch(clean);
      return;
    }

    setMode('mixed');
    setHasSearched(true);
    setError(null);
    void performCategorySearch(clean, 'mixed', false);
    triggerDebouncedBusinessSearch(value, location, selectedDate, 'mixed');
  }, [location, performCategorySearch, selectedDate, triggerDebouncedBusinessSearch, triggerDebouncedCategorySearch]);

  // Handle location change with real-time search
  const handleLocationChange = useCallback((value: string) => {
    setLocation(value);

    if (query.trim().length >= MIN_SEARCH_LENGTH || value.trim()) {
      if (query.trim().length >= MIN_SEARCH_LENGTH) {
        setMode('mixed');
        void performCategorySearch(query.trim(), 'mixed', false);
        triggerDebouncedBusinessSearch(query, value, selectedDate, 'mixed');
      } else {
        triggerDebouncedBusinessSearch(query, value, selectedDate, 'businesses');
      }
    } else {
      setResults([]);
      setHasSearched(false);
      setIsTyping(false);
    }
  }, [performCategorySearch, query, selectedDate, triggerDebouncedBusinessSearch]);

  // Manual search (for form submit / button click)
  const search = useCallback(async () => {
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length > 0 && query.trim().length < MIN_SEARCH_LENGTH && !location.trim()) {
      setError(searchT(locale, 'error_min_chars'));
      return;
    }

    if (!query.trim() && !location.trim()) {
      setError(searchT(locale, 'error_enter_term_or_location'));
      return;
    }

    await performBusinessSearch(query, location, selectedDate);
  }, [location, locale, performBusinessSearch, query, selectedDate]);

  const searchWithParams = useCallback(async (params: SearchParams) => {
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!params.query && !params.location && !params.categoryId) {
      setError(searchT(locale, 'error_enter_term_or_location'));
      return;
    }

    // Update state with params
    if (params.query !== undefined) setQuery(params.query);
    if (params.location !== undefined) setLocation(params.location);
    if (params.date !== undefined) setSelectedDate(params.date);

    await performBusinessSearch(
      params.query ?? '',
      params.location ?? '',
      params.date ?? '',
      params.categoryId,
    );
  }, [locale, performBusinessSearch]);

  const clearResults = useCallback(() => {
    setResults([]);
    setCategoryResults([]);
    setMode('categories');
    setHasSearched(false);
    setError(null);
    setIsTyping(false);
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!query.trim() && !location.trim()) {
      setResults([]);
      setMode('categories');
    }
  }, [location, query]);

  return {
    query,
    setQuery,
    location,
    setLocation,
    selectedDate,
    setSelectedDate,
    results,
    categoryResults,
    mode,
    loading,
    error,
    hasSearched,
    search,
    searchWithParams,
    clearResults,
    // New real-time search handlers
    handleQueryFocus,
    handleQueryChange,
    handleLocationChange,
    isTyping,
  };
}
