"use client";

import React from 'react';
import Layout from '@/components/layout/Layout';
import BookingSummary from './components/BookingSummary';
import ContactForm from './components/ContactForm';
import PaymentSummary from './components/PaymentSummary';
import useCheckout from './hooks/useCheckout';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';

const BookingCheckoutPage = () => {
  const { loading, submit } = useCheckout();
  const { selectedBusiness, selectedService, selectedStaff, selectedDate, selectedTimeSlot } = useBooking();
  const { user } = useAuth();

  // Redirect handled inside the hook; if missing selections, don't render
  if (!selectedBusiness || !selectedService || !selectedStaff || !selectedDate || !selectedTimeSlot) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BookingSummary
              business={selectedBusiness}
              service={selectedService}
              staff={selectedStaff}
              date={selectedDate}
              timeSlot={selectedTimeSlot}
            />

            <ContactForm user={user} />

            <div>
              <div className="p-4 bg-white border rounded">
                <label className="block text-sm font-medium text-gray-700">Special Requests (Optional)</label>
                <textarea className="w-full border rounded-md p-2 min-h-[100px] resize-none mt-2" placeholder="Any specific requirements or notes for your appointment" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <PaymentSummary service={selectedService} loading={loading} onConfirm={submit} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingCheckoutPage;
