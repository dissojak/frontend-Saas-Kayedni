import type { Booking } from './Booking';

export interface ActiveBookingBannerProps {
  booking: Booking;
  onStatusUpdate: (bookingId: number, newStatus: string) => void;
  onCancel: (bookingId: number, clientName: string) => void;
  onMarkNoShow: (bookingId: number, clientName: string) => void;
}
