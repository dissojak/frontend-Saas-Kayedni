"use client";

import { useState } from 'react';
import { useToast } from '@global/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { useBooking } from '../../../context/BookingContext';
import type { BookingPayload } from '../types';

export default function useCheckout() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const { selectedBusiness, selectedService, selectedStaff, selectedDate, selectedTimeSlot, createBooking } = useBooking();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!user) {
      toast({ title: 'Authentication Required', description: 'Please log in to complete your booking.', variant: 'destructive' });
      router.push('/login');
      return;
    }

    if (!selectedBusiness || !selectedService || !selectedStaff || !selectedDate || !selectedTimeSlot) {
      router.push('/businesses');
      return;
    }

    setLoading(true);
    try {
      const payload: BookingPayload = {
        businessId: selectedBusiness.id,
        serviceId: selectedService.id,
        staffId: selectedStaff.id,
        userId: user.id,
        date: selectedDate,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        price: selectedService.price,
        status: 'confirmed',
      };

      createBooking(payload);

      toast({ title: 'Booking Confirmed!', description: 'Your appointment has been successfully booked.' });
      router.push('/bookings');
    } catch (err) {
      console.error('Booking failed:', err);
      toast({ title: 'Booking Failed', description: 'There was an error processing your booking. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return { loading, submit } as const;
}
