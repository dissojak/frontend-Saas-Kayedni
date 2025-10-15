"use client";

import { useMemo } from 'react';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import type { ClientBooking, RecommendedBusiness } from '../types';

export default function useClientDashboard() {
  const { user } = useAuth();

  const upcomingBookings: ClientBooking[] = useMemo(
    () => [
      { id: '1', business: 'Style Studio', service: 'Haircut & Style', staff: 'Alex Morgan', date: 'Today', time: '2:00 PM' },
      { id: '2', business: 'Tech Tutors', service: 'Private Coding Lesson', staff: 'Taylor Swift', date: 'May 25', time: '10:00 AM' },
    ],
    []
  );

  const pastBookings: ClientBooking[] = useMemo(
    () => [
      { id: '3', business: 'GameZone', service: 'VR Gaming Session', staff: 'Chris Evans', date: 'May 15', time: '4:00 PM', reviewed: true },
      { id: '4', business: 'Style Studio', service: 'Haircut & Style', staff: 'Jamie Lee', date: 'May 2', time: '11:30 AM', reviewed: false },
    ],
    []
  );

  const recommendedBusinesses: RecommendedBusiness[] = useMemo(
    () => [
      { id: 'biz-1', name: 'Style Studio', category: 'Barber', rating: 4.8, image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=200&auto=format&fit=crop' },
      { id: 'biz-2', name: 'Tech Tutors', category: 'Education', rating: 4.9, image: 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?q=80&w=200&auto=format&fit=crop' },
    ],
    []
  );

  return { user, upcomingBookings, pastBookings, recommendedBusinesses } as const;
}
