import type { Booking } from './Booking';

export interface BookingCardProps {
  booking: Booking;
  variant?: 'default' | 'past' | 'cancelled';
  currentTime?: Date;
  onStatusUpdate: (bookingId: number, newStatus: string) => void;
  onCancel: (bookingId: number, clientName: string) => void;
  onMarkNoShow: (bookingId: number, clientName: string) => void;
}
