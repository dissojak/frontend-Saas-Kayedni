import { Booking } from '../types/Booking';
import { isToday } from './isToday';

export const categorizeBookings = (bookings: Booking[], currentTime: Date = new Date()) => {
  const upcomingBookings = bookings.filter(booking => 
    ['pending', 'confirmed'].includes(booking.status.toLowerCase())
  );

  const todayBookings = upcomingBookings
    .filter(booking => isToday(booking.date, currentTime))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const pastBookings = bookings
    .filter(booking => ['completed', 'no_show'].includes(booking.status.toLowerCase()))
    .sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.startTime.localeCompare(a.startTime);
    });

  const cancelledBookings = bookings
    .filter(booking => ['cancelled', 'rejected'].includes(booking.status.toLowerCase()))
    .sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.startTime.localeCompare(a.startTime);
    });

  return {
    upcomingBookings,
    todayBookings,
    pastBookings,
    cancelledBookings
  };
};
