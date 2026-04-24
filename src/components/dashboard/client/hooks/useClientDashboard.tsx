"use client";

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { getAllBusinesses, type BusinessSearchResult } from '@global/lib/api/business.api';
import { fetchMyBookings, type BookingResponse } from '@/(pages)/(business)/actions/backend';
import type { ClientBooking, RecommendedBusiness } from '../types';
import { clientDashboardT } from '../i18n';
import type { LocaleCode } from '@global/lib/locales';

function toClientBooking(b: BookingResponse): ClientBooking {
  const status = (b.status || '').toLowerCase() as ClientBooking['status'];
  return {
    id: String(b.id),
    businessId: String(b.businessId || ''),
    businessName: b.businessName || '—',
    businessImage: undefined,
    serviceId: String(b.serviceId || ''),
    serviceName: b.serviceName || '—',
    servicePrice: b.price || 0,
    serviceDuration: b.serviceDuration || b.duration || undefined,
    staffId: String(b.staffId || ''),
    staffName: b.staffName || '—',
    staffAvatar: undefined,
    date: typeof b.date === 'string' ? b.date : String(b.date),
    startTime: typeof b.startTime === 'string' ? b.startTime : String(b.startTime),
    endTime: typeof b.endTime === 'string' ? b.endTime : String(b.endTime || ''),
    status: status || 'pending',
    notes: b.notes || undefined,
    reviewed: status === 'completed' ? false : undefined,
  };
}

// Helper to get recommendations based on user's booking history
function getSmartRecommendations(
  allBusinesses: BusinessSearchResult[],
  userBookings: BookingResponse[]
): RecommendedBusiness[] {
  // Extract categories and business IDs from user's past bookings
  const bookedBusinessIds = new Set(userBookings.map(b => String(b.businessId)));
  const bookedCategories = new Set<string>();
  
  // Try to extract categories from booking data
  userBookings.forEach(booking => {
    // Try to find the business and get its category
    const business = allBusinesses.find(b => String(b.id) === String(booking.businessId));
    if (business) {
      const category = business.categoryName || business.category;
      if (category) bookedCategories.add(category.toLowerCase());
    }
  });

  // Score businesses based on relevance
  const scoredBusinesses = allBusinesses.map(business => {
    let score = 0;
    const category = (business.categoryName || business.category || '').toLowerCase();
    
    // Higher score for businesses in same category as past bookings
    if (bookedCategories.has(category)) {
      score += 50;
    }
    
    // Bonus for highly rated businesses
    if (business.rating) {
      score += business.rating * 10;
    }
    
    // Penalty for businesses user has already booked (they might want something new)
    if (bookedBusinessIds.has(String(business.id))) {
      score -= 20; // Still show them but lower priority
    }
    
    return { business, score };
  });

  // Sort by score descending, then by rating
  scoredBusinesses.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.business.rating ?? 0) - (a.business.rating ?? 0);
  });

  // Take top 6 recommendations
  return scoredBusinesses.slice(0, 6).map(({ business }) => ({
    id: String(business.id),
    name: business.name,
    category: business.categoryName ?? business.category ?? '—',
    rating: business.rating ?? null,
    image: business.imageUrl || undefined,
    location: business.location || undefined,
  }));
}

export default function useClientDashboard(locale: LocaleCode = 'en') {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingsRaw, setBookingsRaw] = useState<BookingResponse[]>([]);
  const [allBusinesses, setAllBusinesses] = useState<BusinessSearchResult[]>([]);
  const [recommended, setRecommended] = useState<RecommendedBusiness[]>([]);

  const refreshBookings = useCallback(async () => {
    if (!token) return;
    try {
      const myBookings = await fetchMyBookings(token);
      setBookingsRaw(myBookings);
      // Also update recommendations when bookings change
      if (allBusinesses.length > 0) {
        setRecommended(getSmartRecommendations(allBusinesses, myBookings));
      }
    } catch (e: any) {
      console.error('Failed to refresh bookings:', e);
    }
  }, [token, allBusinesses]);

  useEffect(() => {
    let mounted = true;
    
    async function load() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all businesses first (works without auth)
        const businesses: BusinessSearchResult[] = await getAllBusinesses();
        if (!mounted) return;
        setAllBusinesses(businesses);
        
        // Fetch user bookings if authenticated
        let userBookings: BookingResponse[] = [];
        if (token) {
          try {
            userBookings = await fetchMyBookings(token);
            if (!mounted) return;
            setBookingsRaw(userBookings);
          } catch (bookingError: any) {
            console.error('Booking fetch error:', bookingError);
            // Don't fail the whole dashboard if bookings fail
            // Just show empty bookings
            if (!mounted) return;
            setBookingsRaw([]);
            // Only set error if it's not a "no bookings" situation
            if (bookingError.message && !bookingError.message.includes('401')) {
              setError(`${clientDashboardT(locale, 'error_load_bookings_prefix')}: ${bookingError.message}`);
            }
          }
        }
        
        // Generate smart recommendations
        if (!mounted) return;
        const recommendations = getSmartRecommendations(businesses, userBookings);
        setRecommended(recommendations);
        
      } catch (e: any) {
        if (!mounted) return;
        console.error('Dashboard load error:', e);
        setError(e?.message || clientDashboardT(locale, 'error_dashboard_load_failed'));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    load();
    return () => {
      mounted = false;
    };
  }, [token, locale]);

  const upcomingBookings: ClientBooking[] = useMemo(
    () => bookingsRaw
      .filter((b) => {
        const s = (b.status || '').toLowerCase();
        return s === 'pending' || s === 'confirmed';
      })
      .map(toClientBooking)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [bookingsRaw]
  );

  const pastBookings: ClientBooking[] = useMemo(
    () => bookingsRaw
      .filter((b) => {
        const s = (b.status || '').toLowerCase();
        return s === 'completed' || s === 'cancelled' || s === 'no_show';
      })
      .map(toClientBooking)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [bookingsRaw]
  );

  // Get unique categories from user's bookings for "Your Categories" feature
  const userCategories = useMemo(() => {
    const categories = new Set<string>();
    bookingsRaw.forEach(booking => {
      const business = allBusinesses.find(b => String(b.id) === String(booking.businessId));
      if (business) {
        const category = business.categoryName || business.category;
        if (category) categories.add(category);
      }
    });
    return Array.from(categories);
  }, [bookingsRaw, allBusinesses]);

  return { 
    user, 
    upcomingBookings, 
    pastBookings, 
    recommendedBusinesses: recommended, 
    userCategories,
    loading, 
    error,
    refreshBookings 
  } as const;
}
