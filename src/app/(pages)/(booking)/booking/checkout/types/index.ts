import type { Booking as GlobalBooking } from '@global/types';

export type TimeSlot = {
  id: string;
  startTime: Date;
  endTime: Date;
  isAvailable?: boolean;
};

export type BookingPayload = Omit<GlobalBooking, 'id'>;
