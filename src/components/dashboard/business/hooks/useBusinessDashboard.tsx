"use client";

import { useMemo } from 'react';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';

export default function useBusinessDashboard() {
  const { user } = useAuth();

  const stats = useMemo(() => [
    { name: 'Total Bookings', value: '248', change: '+12% from last month' },
    { name: 'Revenue', value: '$5,628', change: '+18% from last month' },
    { name: 'New Clients', value: '36', change: '+8% from last month' },
    { name: 'Completion Rate', value: '94%', change: '+2% from last month' },
  ], []);

  const recentBookings = useMemo(() => [
    { id: '1', client: 'John Smith', service: 'Haircut & Style', staff: 'Alex Morgan', date: 'Today, 2:00 PM', status: 'Confirmed' },
    { id: '2', client: 'Sarah Lee', service: 'Color & Highlights', staff: 'Jamie Lee', date: 'Today, 4:30 PM', status: 'Confirmed' },
  ], []);

  const topStaff = useMemo(() => [
    { name: 'Alex Morgan', bookings: 87, revenue: '$4,350', rating: 4.9 },
    { name: 'Jamie Lee', bookings: 72, revenue: '$3,600', rating: 4.8 },
  ], []);

  return { user, stats, recentBookings, topStaff } as const;
}
