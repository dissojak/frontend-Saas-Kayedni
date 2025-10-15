"use client";

import { useMemo } from 'react';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';

export default function useAdminDashboard() {
  const { user } = useAuth();

  const systemStats = useMemo(() => [
    { name: 'Active Users', value: '5,832', change: '+12% from last month' },
    { name: 'Businesses', value: '847', change: '+8% from last month' },
    { name: 'Total Bookings', value: '24,628', change: '+18% from last month' },
    { name: 'Revenue', value: '$124,892', change: '+15% from last month' },
  ], []);

  const recentBusinesses = useMemo(() => [
    { id: '1', name: 'Style Studio', owner: 'Diana Prince', category: 'Barber', staff: 4, status: 'Active' },
    { id: '2', name: 'Tech Tutors', owner: 'Bruce Wayne', category: 'Education', staff: 6, status: 'Active' },
    { id: '3', name: 'GameZone', owner: 'Clark Kent', category: 'Gaming', staff: 3, status: 'Pending' },
    { id: '4', name: 'Fitness First', owner: 'Barry Allen', category: 'Fitness', staff: 8, status: 'Active' },
  ], []);

  const recentUsers = useMemo(() => [
    { id: '1', name: 'John Smith', email: 'john@example.com', role: 'Client', registered: 'May 15, 2023', bookings: 12 },
    { id: '2', name: 'Sarah Lee', email: 'sarah@example.com', role: 'Client', registered: 'May 17, 2023', bookings: 8 },
    { id: '3', name: 'Diana Prince', email: 'diana@stylestudio.com', role: 'Business', registered: 'April 28, 2023', bookings: 0 },
    { id: '4', name: 'Alex Morgan', email: 'alex@stylestudio.com', role: 'Staff', registered: 'April 30, 2023', bookings: 0 },
  ], []);

  return { user, systemStats, recentBusinesses, recentUsers } as const;
}
