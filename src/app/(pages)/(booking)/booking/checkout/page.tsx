"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@components/layout/Layout';
import BookingSummary from './components/BookingSummary';
import ContactForm from './components/ContactForm';
import type { User as ContactUser } from './components/ContactForm';
import PaymentSummary from './components/PaymentSummary';
import { apiGet } from '@/(pages)/(auth)/api/client';
import useCheckout from './hooks/useCheckout';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { useTracking } from '@global/hooks/useTracking';
import TimeOnPageTracker from '@components/tracking/TimeOnPageTracker';
import { useLocale } from '@global/hooks/useLocale';
import { bookingT } from '@/(pages)/(booking)/i18n';

type BookingData = {
  business: any;
  service: any;
  staff: any;
  date: string;
  timeSlot: any;
};

const BookingCheckoutPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { loading, submit } = useCheckout();
  const { trackEvent } = useTracking();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [displayUser, setDisplayUser] = useState<ContactUser | null>(null);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const { locale } = useLocale();

  // Check if user is authenticated, if not redirect to login
  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/booking/checkout')}`);
    }
  }, [user, router]);

  // Wrap submit to track booking_completed
  const handleSubmit = async (paymentMethod: string) => {
    await submit(paymentMethod);
    // If submit didn't throw, booking was successful
    setBookingCompleted(true);
    trackEvent('booking_completed', {
      businessId: String(bookingData?.business?.id),
      businessName: bookingData?.business?.name,
      serviceId: String(bookingData?.service?.id),
      serviceName: bookingData?.service?.name,
      staffId: String(bookingData?.staff?.id),
      price: bookingData?.service?.price,
    });
  };

  // Use a ref for tracking abandoned
  const completedRef = React.useRef(false);
  useEffect(() => { completedRef.current = bookingCompleted; }, [bookingCompleted]);
  const bookingDataRef = React.useRef(bookingData);
  useEffect(() => { bookingDataRef.current = bookingData; }, [bookingData]);

  useEffect(() => {
    return () => {
      if (!completedRef.current && bookingDataRef.current) {
        trackEvent('booking_abandoned', {
          businessId: String(bookingDataRef.current?.business?.id),
          businessName: bookingDataRef.current?.business?.name,
          serviceId: String(bookingDataRef.current?.service?.id),
          serviceName: bookingDataRef.current?.service?.name,
          stage: 'checkout',
        });
      }
    };
  }, [trackEvent]);

  // Load booking data from localStorage directly
  useEffect(() => {
    console.log('[Checkout] Page mounted, checking localStorage...');
    try {
      const stored = localStorage.getItem('bookingData');
      console.log('[Checkout] localStorage.getItem result:', stored ? 'Found data' : 'No data');
      
      if (!stored) {
        console.log('[Checkout] No booking data in localStorage, will redirect');
        setIsLoading(false);
        return;
      }

      const data = JSON.parse(stored);
      console.log('[Checkout] Parsed booking data:', {
        hasBusiness: !!data.business,
        businessName: data.business?.name,
        hasStaff: !!data.staff,
        staffName: data.staff?.name,
        hasService: !!data.service,
        serviceName: data.service?.name,
        hasDate: !!data.date,
        hasTimeSlot: !!data.timeSlot,
      });

      // Validate all required fields exist
      if (!data.business || !data.service || !data.staff || !data.date || !data.timeSlot) {
        console.log('[Checkout] VALIDATION FAILED - Missing fields:', {
          business: data.business ? 'ok' : 'MISSING',
          service: data.service ? 'ok' : 'MISSING',
          staff: data.staff ? 'ok' : 'MISSING',
          date: data.date ? 'ok' : 'MISSING',
          timeSlot: data.timeSlot ? 'ok' : 'MISSING',
        });
        setIsLoading(false);
        return;
      }

      console.log('[Checkout] All validations passed, setting state');
      setBookingData(data);
      setSelectedDate(new Date(data.date));
      setIsLoading(false);
    } catch (err) {
      console.error('[Checkout] Error loading booking data:', err);
      setIsLoading(false);
    }
  }, []);

  // Ensure phone is present: if missing, fetch profile from backend
  useEffect(() => {
    const ensurePhone = async () => {
      try {
        if (user && !user.phone) {
          const profile = await apiGet('/v1/auth/me', true);
          const phone = profile?.phoneNumber ?? '';
          if (phone) {
            setDisplayUser({ ...user, phone });
            return;
          }
        }
        if (user) setDisplayUser(user);
      } catch (err) {
        console.warn('[Checkout] Failed to fetch /me profile for phone:', err);
        if (user) setDisplayUser(user);
      }
    };
    ensurePhone();
  }, [user]);

  // Redirect if data is invalid
  useEffect(() => {
    console.log('[Checkout] Checking redirect condition:', {
      isLoading,
      hasBookingData: !!bookingData,
    });
    
    if (!isLoading && !bookingData) {
      console.log('[Checkout] Conditions met for redirect - redirecting to /businesses');
      router.push('/businesses');
    } else if (!isLoading && bookingData) {
      console.log('[Checkout] Data loaded successfully, not redirecting');
    }
  }, [bookingData, isLoading, router]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">{bookingT(locale, 'checkout_loading_details')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!bookingData || !selectedDate) {
    return null;
  }

  const contactUser: ContactUser = {
    name: (displayUser?.name as string) ?? (user?.name as string) ?? '',
    email: (displayUser?.email as string) ?? (user?.email as string) ?? '',
    phone: (displayUser?.phone as string) ?? (user?.phone as string) ?? '',
  };

  return (
    <Layout>
      {/* Tracking */}
      <TimeOnPageTracker pageName="checkout" />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{bookingT(locale, 'checkout_title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BookingSummary
              business={bookingData.business}
              service={bookingData.service}
              staff={bookingData.staff}
              date={selectedDate}
              timeSlot={bookingData.timeSlot}
            />

            <ContactForm user={contactUser} />

            <div>
              <div className="p-4 bg-white border rounded">
                <label className="block text-sm font-medium text-gray-700">{bookingT(locale, 'checkout_special_requests_label')}</label>
                <textarea
                  className="w-full border rounded-md p-2 min-h-[100px] resize-none mt-2"
                  placeholder={bookingT(locale, 'checkout_special_requests_placeholder')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <PaymentSummary service={bookingData.service} loading={loading} onConfirm={handleSubmit} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingCheckoutPage;
