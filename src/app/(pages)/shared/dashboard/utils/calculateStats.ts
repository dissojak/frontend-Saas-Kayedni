import type { Booking, DashboardStats } from '../types';

/**
 * Calculate dashboard statistics from bookings
 */
export function calculateStats(bookings: Booking[]): DashboardStats {
  const completed = bookings.filter(b => b.status === 'COMPLETED').length;
  const cancelled = bookings.filter(b => b.status === 'CANCELLED').length;
  const noShow = bookings.filter(b => b.status === 'NO_SHOW').length;
  const pending = bookings.filter(b => b.status === 'PENDING').length;
  const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;
  const total = bookings.length;

  const totalRevenue = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (b.price || 0), 0);

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const cancellationRate = total > 0 ? Math.round(((cancelled + noShow) / total) * 100) : 0;

  return {
    completed,
    cancelled,
    noShow,
    pending,
    confirmed,
    total,
    totalRevenue,
    completionRate,
    cancellationRate,
    upcoming: pending + confirmed
  };
}
