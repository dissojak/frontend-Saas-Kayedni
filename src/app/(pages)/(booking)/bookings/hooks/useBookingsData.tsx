"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { fetchMyBookings, cancelBooking as cancelBookingAPI, type BookingResponse } from '@/(pages)/(business)/actions/backend';
import type { Booking } from '../types';
import { formatDate, formatTime } from '../utils/format';
import { useLocale } from '@global/hooks/useLocale';
import { bookingT } from '@/(pages)/(booking)/i18n';

function toBooking(b: BookingResponse): Booking {
  // Map backend booking into UI Booking type
  return {
    id: String(b.id),
    businessId: String(b.businessId ?? ''),
    staffId: String(b.staffId),
    serviceId: String(b.serviceId),
    userId: String(b.clientId),
    date: b.date as unknown as Date, // formatting utils accept string as well
    startTime: b.startTime as unknown as Date,
    endTime: b.endTime as unknown as Date,
    status: (b.status || '').toLowerCase() as Booking['status'],
    price: Number(b.price ?? 0),
  };
}

export default function useBookingsData() {
  const { token } = useAuth();
  const { locale } = useLocale();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [bizMap, setBizMap] = useState<Record<string, string>>({});
  const [staffMap, setStaffMap] = useState<Record<string, string>>({});
  const [serviceMap, setServiceMap] = useState<Record<string, { name: string; price: number }>>({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token) return;
      const list = await fetchMyBookings(token);
      if (!mounted) return;
      setBookings(list.map(toBooking));
      // Build lookup maps
      const biz: Record<string, string> = {};
      const staff: Record<string, string> = {};
      const svc: Record<string, { name: string; price: number }> = {};
      for (const item of list) {
        if (item.businessId) biz[String(item.businessId)] = item.businessName || '—';
        staff[String(item.staffId)] = item.staffName || '—';
        svc[String(item.serviceId)] = { name: item.serviceName, price: Number(item.price ?? 0) };
      }
      setBizMap(biz);
      setStaffMap(staff);
      setServiceMap(svc);
    }
    load();
    return () => { mounted = false; };
  }, [token]);

  const getBookingsForUser = (userId: string) => bookings; // already scoped to authenticated user
  const getBusinessName = (businessId: string) => bizMap[businessId] ?? bookingT(locale, 'bookings_unknown_business');
  const getStaffName = (staffId: string) => staffMap[staffId] ?? bookingT(locale, 'bookings_unknown_staff');
  const getServiceDetails = (serviceId: string) =>
    serviceMap[serviceId] ?? { name: bookingT(locale, 'bookings_unknown_service'), price: 0 };

  const handleCancelBooking = async (bookingId: string) => {
    if (!token) return;
    setCancellingId(bookingId);
    try {
      await cancelBookingAPI(Number(bookingId), undefined, token);
      setBookings((prev) => prev.map((bk) => (bk.id === bookingId ? { ...bk, status: 'cancelled' } : bk)));
    } finally {
      setCancellingId(null);
    }
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
