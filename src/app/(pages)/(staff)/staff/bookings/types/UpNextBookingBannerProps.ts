import type { Booking } from './Booking';

export interface UpNextBookingBannerProps {
  booking: Booking;
  onStatusUpdate: (bookingId: number, newStatus: string) => void;
}
