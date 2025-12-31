"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@components/layout/Layout';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { Button } from '@components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';
import { ReviewDialog, type ReviewBookingInfo } from '@components/reviews';
import useBookingsData from './hooks/useBookingsData';
import UpcomingList from './components/UpcomingList';
import PastList from './components/PastList';

const BookingsPage = () => {
  const { user, token } = useAuth();
  const router = useRouter();
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

  if (!user) {
    router.push('/login');
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
    // Optionally refresh bookings data here if needed
    setSelectedBookingForReview(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Bookings</h1>
          <Button onClick={() => router.push('/businesses')} className="mt-4 md:mt-0">Book New Appointment</Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
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
                <h3 className="text-xl font-semibold mb-2">No upcoming bookings</h3>
                <p className="text-gray-500 mb-6">You don't have any upcoming appointments scheduled.</p>
                <Button onClick={() => router.push('/businesses')}>Book an Appointment</Button>
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
                <h3 className="text-xl font-semibold mb-2">No past bookings</h3>
                <p className="text-gray-500 mb-6">You don't have any past appointments.</p>
                <Button onClick={() => router.push('/businesses')}>Book an Appointment</Button>
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
