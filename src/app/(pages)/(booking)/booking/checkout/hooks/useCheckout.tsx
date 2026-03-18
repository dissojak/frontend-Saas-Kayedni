"use client";

import { useState } from 'react';
import { useToast } from '@global/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import {
  BookingApiError,
  createBooking as createBookingAPI,
  fetchMyBookings,
  type CreateBookingRequest,
} from '@/(pages)/(business)/actions/backend';
import { apiGet } from '@/(pages)/(auth)/api/client';

export default function useCheckout() {
  const MIN_BOOKING_LEAD_MINUTES = 3;
  const { toast } = useToast();
  const router = useRouter();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);

  const submit = async (paymentMethod: string) => {
    if (!user) {
      toast({ title: 'Authentication Required', description: 'Please log in to complete your booking.', variant: 'destructive' });
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      // Load booking data from localStorage
      const stored = localStorage.getItem('bookingData');
      if (!stored) {
        throw new Error('Booking data not found. Please start over.');
      }

      const bookingData = JSON.parse(stored);

      // Normalize date/time formats for backend (LocalDate/LocalTime)
      const toDateString = (d: string | Date) => {
        const dateObj = typeof d === 'string' ? new Date(d) : d;
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };
      const toTimeString = (t: string | Date) => {
        const timeObj = typeof t === 'string' ? new Date(t) : t;
        const h = String(timeObj.getHours()).padStart(2, '0');
        const m = String(timeObj.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
      };

      const isSlotTooSoon = (dateStr: string, startTimeStr: string) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hour, minute] = startTimeStr.split(':').map(Number);
        const slotStart = new Date(year, month - 1, day, hour, minute, 0, 0);
        const minAllowed = new Date(Date.now() + MIN_BOOKING_LEAD_MINUTES * 60 * 1000);
        return slotStart.getTime() <= minAllowed.getTime();
      };

      // Resolve numeric clientId (fallback to /me if local/non-numeric)
      const parsedId = Number(user.id);
      let clientId = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : undefined;
      
      console.log('[useCheckout] Initial clientId resolution:', { userId: user.id, parsedId, clientId });
      
      if (!clientId) {
        console.log('[useCheckout] Attempting to fetch clientId from /me endpoint');
        try {
          const profile = await apiGet('/v1/auth/me', true);
          clientId = Number(profile?.userId);
          console.log('[useCheckout] Got clientId from /me:', clientId);
        } catch (e) {
          console.warn('[useCheckout] Failed to resolve clientId from /me:', e);
        }
      }
      
      if (!clientId || !Number.isFinite(clientId) || clientId <= 0) {
        throw new Error('Unable to resolve client identity. Please log in again.');
      }

      console.log('[useCheckout] Final resolved clientId:', clientId);
      
      let hadPreviousBookings = false;
      if (token) {
        try {
          const existingBookings = await fetchMyBookings(token);
          hadPreviousBookings = existingBookings.length > 0;
        } catch (error) {
          console.warn('[useCheckout] Unable to pre-check existing bookings:', error);
        }
      }

      // Build the backend request payload
      const request: CreateBookingRequest = {
        serviceId: Number(bookingData.service.id),
        staffId: Number(bookingData.timeSlot?.staffId ?? bookingData.staff.id),
        clientId: clientId,
        date: toDateString(bookingData.date),
        startTime: toTimeString(bookingData.timeSlot.startTime),
        endTime: toTimeString(bookingData.timeSlot.endTime),
        price: bookingData.service.price,
      };

      if (isSlotTooSoon(request.date, request.startTime)) {
        const tooSoonError = new BookingApiError(
          'This slot starts too soon. Please choose a time at least 3 minutes from now.',
          'BOOKING_TOO_SOON',
          MIN_BOOKING_LEAD_MINUTES,
        );
        throw tooSoonError;
      }

      console.log('[useCheckout] Submitting booking request:', request);

      // Call the backend API (server-side validation handles conflicts)
      await createBookingAPI(request, token || undefined);

      const successMessage = paymentMethod === 'pay_on_place' 
        ? 'Your appointment has been successfully booked. Please pay when you arrive.'
        : 'Your appointment has been successfully booked.';
      
      toast({ title: 'Booking Confirmed!', description: successMessage });

      if (!hadPreviousBookings) {
        localStorage.setItem(`telegram_onboarding:client:${user.id}:first-booking-prompt`, '1');
      }
      
      // Clear booking data from localStorage after successful booking
      localStorage.removeItem('bookingData');
      
      router.push('/bookings');
    } catch (err: any) {
      console.error('Booking failed:', err);
      const minLead = Number(err?.minLeadMinutes) || MIN_BOOKING_LEAD_MINUTES;
      const errorMessage = err?.code === 'BOOKING_TOO_SOON'
        ? `This time is too close to now. Please choose a slot at least ${minLead} minutes ahead.`
        : (err?.message || 'There was an error processing your booking. Please try again.');
      toast({ title: 'Booking Failed', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return { loading, submit } as const;
}
