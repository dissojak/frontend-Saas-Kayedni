import { Booking } from '../types/Booking';

export const filterBookings = (
  bookings: Booking[],
  searchTerm: string,
  statusFilter: string
): Booking[] => {
  let filtered = [...bookings];

  if (searchTerm) {
    filtered = filtered.filter(booking =>
      booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (statusFilter !== 'all') {
    filtered = filtered.filter(booking =>
      booking.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }

  return filtered;
};
