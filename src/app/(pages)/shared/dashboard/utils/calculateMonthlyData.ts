import type { Booking, MonthlyData } from '../types';

/**
 * Calculate monthly booking data for the last N months
 */
export function calculateMonthlyData(bookings: Booking[], monthsCount: number = 6): MonthlyData[] {
  const months: MonthlyData[] = [];
  const now = new Date();

  for (let i = monthsCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthBookings = bookings.filter(b => {
      const bookingDate = new Date(b.date);
      return bookingDate.getMonth() === month && bookingDate.getFullYear() === year;
    });

    months.push({
      month: monthName,
      completed: monthBookings.filter(b => b.status === 'COMPLETED').length,
      cancelled: monthBookings.filter(b => b.status === 'CANCELLED').length,
      noShow: monthBookings.filter(b => b.status === 'NO_SHOW').length,
      upcoming: monthBookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED').length,
      total: monthBookings.length
    });
  }

  return months;
}
