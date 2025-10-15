"use client";

import { useMemo } from 'react';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';

export default function useStaffDashboard() {
  const { user } = useAuth();

  const upcomingAppointments = useMemo(() => [
    { id: '1', client: 'John Smith', service: 'Haircut & Style', time: '2:00 PM - 3:00 PM', status: 'Confirmed' },
    { id: '2', client: 'Sarah Lee', service: 'Color & Highlights', time: '4:30 PM - 6:30 PM', status: 'Confirmed' },
  ], []);

  const tomorrowAppointments = useMemo(() => [
    { id: '3', client: 'Michael Johnson', service: 'Beard Trim', time: '10:00 AM - 10:30 AM', status: 'Confirmed' },
    { id: '4', client: 'Emily Chen', service: 'Haircut & Style', time: '1:30 PM - 2:30 PM', status: 'Pending' },
  ], []);

  return { user, upcomingAppointments, tomorrowAppointments } as const;
}
