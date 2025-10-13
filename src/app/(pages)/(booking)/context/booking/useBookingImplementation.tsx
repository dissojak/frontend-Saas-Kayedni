'use client';

import { useState } from 'react';
import type { BookingContextType, Business, Staff, Service, Booking, TimeSlot } from '../../../../types/types';
import { generateTimeSlots } from './utils';
import { mockBusinesses, mockStaff, mockServices } from '../../../../data';

export function useBookingImplementation(): BookingContextType {
  const [businesses] = useState<Business[]>(mockBusinesses);
  const [staff] = useState<Staff[]>(mockStaff);
  const [services] = useState<Service[]>(mockServices);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  const availableSlots = selectedStaff ? generateTimeSlots(selectedStaff.id) : [];

  const getBusinessById = (id: string) => businesses.find((b) => b.id === id);
  const getStaffByBusinessId = (businessId: string) => staff.filter((s) => s.businessId === businessId);
  const getServicesByBusinessId = (businessId: string) => services.filter((s) => s.businessId === businessId);

  const createBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking: Booking = { ...booking, id: `booking-${Math.random().toString(36).substring(2, 9)}` };
    setBookings((prev) => [...prev, newBooking]);
  };

  const getBookingsForUser = (userId: string) => bookings.filter((b) => b.userId === userId);
  const getBookingsForBusiness = (businessId: string) => bookings.filter((b) => b.businessId === businessId);
  const getBookingsForStaff = (staffId: string) => bookings.filter((b) => b.staffId === staffId);

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.map((bk) => (bk.id === bookingId ? { ...bk, status: 'cancelled' } : bk)));
  };

  const completeBooking = (bookingId: string) => {
    setBookings((prev) => prev.map((bk) => (bk.id === bookingId ? { ...bk, status: 'completed' } : bk)));
  };

  return {
    businesses,
    staff,
    services,
    bookings,
    availableSlots,
    selectedBusiness,
    selectedStaff,
    selectedService,
    selectedDate,
    selectedTimeSlot,
    setSelectedBusiness,
    setSelectedStaff,
    setSelectedService,
    setSelectedDate,
    setSelectedTimeSlot,
    getBusinessById,
    getStaffByBusinessId,
    getServicesByBusinessId,
    createBooking,
    getBookingsForUser,
    getBookingsForBusiness,
    getBookingsForStaff,
    cancelBooking,
    completeBooking,
  };
}
