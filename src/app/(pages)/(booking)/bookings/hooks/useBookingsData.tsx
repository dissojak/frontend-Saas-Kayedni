"use client";

import { useMemo, useState } from 'react';
import { useBooking } from '@/(pages)/(booking)/context/BookingContext';
import type { Booking, Business, Staff, Service } from '../types';
import { formatDate, formatTime } from '../utils/format';

export default function useBookingsData() {
  const { bookings, getBookingsForUser, businesses, staff, services, cancelBooking } = useBooking();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const getBusinessName = (businessId: string) => businesses.find((b: Business) => b.id === businessId)?.name ?? 'Unknown Business';
  const getStaffName = (staffId: string) => staff.find((s: Staff) => s.id === staffId)?.name ?? 'Unknown Staff';
  const getServiceDetails = (serviceId: string) => services.find((s: Service) => s.id === serviceId) ?? { name: 'Unknown Service', price: 0, duration: 0 };

  const handleCancelBooking = (bookingId: string) => {
    setCancellingId(bookingId);
    setTimeout(() => {
      cancelBooking(bookingId);
      setCancellingId(null);
    }, 1000);
  };

  return {
    bookings,
    getBookingsForUser,
    getBusinessName,
    getStaffName,
    getServiceDetails,
    formatDate,
    formatTime,
    cancellingId,
    handleCancelBooking,
  } as const;
}
