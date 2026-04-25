"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@components/layout/Layout';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { Button } from '@components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';
import { ReviewDialog, type ReviewBookingInfo } from '@components/reviews';
import useBookingsData from './hooks/useBookingsData';
import UpcomingList from './components/UpcomingList';
import PastList from './components/PastList';
import { useTracking } from '@global/hooks/useTracking';
import TimeOnPageTracker from '@components/tracking/TimeOnPageTracker';
import TelegramOnboardingPrompt from '@components/telegram/TelegramOnboardingPrompt';
import { useLocale } from '@global/hooks/useLocale';
import { bookingT } from '@/(pages)/(booking)/i18n';

const BookingsPage = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const { trackEvent } = useTracking();
  const {
    getBookingsForUser,
    getBusinessName,
    getStaffName,
    getServiceDetails,
    formatDate,
    formatTime,
    cancellingId,
    handleCancelBooking,
  } = useBookingsData();

  // Review dialog state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<ReviewBookingInfo | null>(null);
  const { locale } = useLocale();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const userBookings = getBookingsForUser(user.id);

  const upcomingBookings = userBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = userBookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  const handleReview = (bookingInfo: ReviewBookingInfo) => {
    setSelectedBookingForReview(bookingInfo);
    setReviewDialogOpen(true);
  };

  const handleReviewSuccess = () => {
    // Track review_submitted
    if (selectedBookingForReview) {
      trackEvent('review_submitted', {
        bookingId: String(selectedBookingForReview.id),
        businessName: selectedBookingForReview.businessName,
        source: 'bookings_page',
      });
    }
    // Optionally refresh bookings data here if needed
    setSelectedBookingForReview(null);
  };

  return (
    <Layout>
      {/* Tracking */}
      <TimeOnPageTracker pageName="bookings" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{bookingT(locale, 'bookings_title')}</h1>
          <Button onClick={() => router.push('/businesses')} className="mt-4 md:mt-0">
            {bookingT(locale, 'bookings_new_appointment')}
          </Button>
        </div>

        <div className="mb-6">
          <TelegramOnboardingPrompt
            audience="client"
            userId={user?.id}
            phone={user?.phone}
            botLabel="KayedniBot"
            botUrl="https://t.me/KayedniBot"
            firstPromptStorageKey={`telegram_onboarding:client:${user?.id}:first-booking-prompt`}
          />
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">{bookingT(locale, 'bookings_tab_upcoming')}</TabsTrigger>
            <TabsTrigger value="past">{bookingT(locale, 'bookings_tab_past')}</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingBookings.length > 0 ? (
              <UpcomingList
                items={upcomingBookings}
                getService={getServiceDetails}
                getBusinessName={getBusinessName}
                getStaffName={getStaffName}
                formatDate={formatDate}
                formatTime={formatTime}
                cancellingId={cancellingId}
                onCancel={handleCancelBooking}
              />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">{bookingT(locale, 'bookings_empty_upcoming_title')}</h3>
                <p className="text-gray-500 mb-6">{bookingT(locale, 'bookings_empty_upcoming_desc')}</p>
                <Button onClick={() => router.push('/businesses')}>{bookingT(locale, 'bookings_book_appointment')}</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastBookings.length > 0 ? (
              <PastList
                items={pastBookings}
                getService={getServiceDetails}
                getBusinessName={getBusinessName}
                getStaffName={getStaffName}
                formatDate={formatDate}
                formatTime={formatTime}
                onReview={handleReview}
              />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">{bookingT(locale, 'bookings_empty_past_title')}</h3>
                <p className="text-gray-500 mb-6">{bookingT(locale, 'bookings_empty_past_desc')}</p>
                <Button onClick={() => router.push('/businesses')}>{bookingT(locale, 'bookings_book_appointment')}</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Dialog */}
      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        booking={selectedBookingForReview}
        token={token}
        onSuccess={handleReviewSuccess}
      />
    </Layout>
  );
};

export default BookingsPage;
