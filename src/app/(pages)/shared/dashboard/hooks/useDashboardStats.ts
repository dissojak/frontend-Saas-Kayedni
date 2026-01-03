import { useMemo } from 'react';
import type { Booking } from '../types';
import { calculateStats, calculateMonthlyData, calculateServiceBreakdown, getMaxMonthlyValue, getMaxServiceCount } from '../utils';

export function useDashboardStats(bookings: Booking[]) {
  const stats = useMemo(() => calculateStats(bookings), [bookings]);
  const monthlyData = useMemo(() => calculateMonthlyData(bookings, 6), [bookings]);
  const serviceBreakdown = useMemo(() => calculateServiceBreakdown(bookings, 5), [bookings]);
  const maxMonthlyTotal = useMemo(() => getMaxMonthlyValue(monthlyData), [monthlyData]);
  const maxServiceCount = useMemo(() => getMaxServiceCount(serviceBreakdown), [serviceBreakdown]);

  return {
    stats,
    monthlyData,
    serviceBreakdown,
    maxMonthlyTotal,
    maxServiceCount
  };
}
