"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import type { BookingContextType } from './booking/types';
import { useBookingImplementation } from './booking/useBookingImplementation';

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const impl = useBookingImplementation();
  return <BookingContext.Provider value={impl}>{children}</BookingContext.Provider>;
};
