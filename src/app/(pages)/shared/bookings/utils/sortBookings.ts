import { Booking } from '../types/Booking';

export const sortBookings = (bookings: Booking[], sortBy: string): Booking[] => {
  return [...bookings].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'price':
        return a.price - b.price;
      case 'client':
        return a.clientName.localeCompare(b.clientName);
      default:
        return 0;
    }
  });
};
