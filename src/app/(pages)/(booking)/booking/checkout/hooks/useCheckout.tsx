"use client";

import { useState } from 'react';
import { useToast } from '@global/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { createBooking as createBookingAPI, type CreateBookingRequest } from '@/(pages)/(business)/actions/backend';

export default function useCheckout() {
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
      
      // Build the backend request payload
      const request: CreateBookingRequest = {
        serviceId: Number(bookingData.service.id),
        staffId: Number(bookingData.staff.id),
        clientId: Number(user.id),
        date: bookingData.date, // Already in YYYY-MM-DD format
        startTime: bookingData.timeSlot.startTime,
        endTime: bookingData.timeSlot.endTime,
        price: bookingData.service.price,
      };

      // Call the backend API (server-side validation handles conflicts)
      await createBookingAPI(request, token || undefined);

      const successMessage = paymentMethod === 'pay_on_place' 
        ? 'Your appointment has been successfully booked. Please pay when you arrive.'
        : 'Your appointment has been successfully booked.';
      
      toast({ title: 'Booking Confirmed!', description: successMessage });
      
      // Clear booking data from localStorage after successful booking
      localStorage.removeItem('bookingData');
      
      router.push('/bookings');
    } catch (err: any) {
      console.error('Booking failed:', err);
      const errorMessage = err?.message || 'There was an error processing your booking. Please try again.';
      toast({ title: 'Booking Failed', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return { loading, submit } as const;
}
