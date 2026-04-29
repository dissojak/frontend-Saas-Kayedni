"use client";

import React, { useState } from "react";
import Layout from "@components/layout/Layout";
import TimeOnPageTracker from "@components/tracking/TimeOnPageTracker";
import ScrollDepthTracker from "@components/tracking/ScrollDepthTracker";

import BusinessHeader from "./components/BusinessHeader";
import BusinessQrDialog from "@components/business/BusinessQrDialog";
import BookingFlow from "./components/BookingFlow";
import BookingWarningStyles from "./components/BookingWarningStyles";
import BusinessLoadingSkeleton from "./components/BusinessLoadingSkeleton";
import BusinessNotFound from "./components/BusinessNotFound";
import BusinessProfileContent from "./components/BusinessProfileContent";
import CancelBookingAlert from "./components/CancelBookingAlert";
import ReviewsModal from "./components/ReviewsModal";
import { useBusinessDetailPageController } from "./hooks/useBusinessDetailPageController";

const BusinessDetailPage = () => {
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const {
    router,
    user,
    business,
    staff,
    staffServices,
    slotsLoading,
    images,
    loading,
    selectedStaff,
    selectedService,
    selectedDate,
    selectedTimeSlot,
    setSelectedStaff,
    setSelectedService,
    bookingStep,
    setBookingStep,
    isReviewsModalOpen,
    setIsReviewsModalOpen,
    reviewText,
    setReviewText,
    isBookingMode,
    setIsBookingMode,
    isCancelAlertOpen,
    setIsCancelAlertOpen,
    currentTime,
    visibleTimeSlots,
    availabilityByStatus,
    disabledDays,
    activeWarningSlot,
    warningCountdown,
    highlightWarning,
    triggerWarningFocus,
    fakeReviews,
    handleSelectDate,
    handleSelectTimeSlot,
    handleAdvanceToReview,
    handleContinueBooking,
    handleCancelBooking,
    formatTimeSlot,
  } = useBusinessDetailPageController();

  if (loading) {
    return (
      <Layout>
        <BusinessLoadingSkeleton />
      </Layout>
    );
  }

  if (!business) {
    return (
      <Layout>
        <BusinessNotFound onBack={() => router.push("/businesses")} />
      </Layout>
    );
  }

  const showBusinessProfile = !isBookingMode;
  const loginRedirectPath = `/login?redirect=${encodeURIComponent(globalThis.location.pathname)}`;

  return (
    <Layout>
      <TimeOnPageTracker pageName="business_detail" />
      <ScrollDepthTracker pageName="business_detail" />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <BusinessHeader
          business={business}
          onBook={() => setIsBookingMode(true)}
          onShareBusiness={() => setIsQrDialogOpen(true)}
          onShowQr={() => setIsQrDialogOpen(true)}
        />

        <BusinessQrDialog
          open={isQrDialogOpen}
          onOpenChange={setIsQrDialogOpen}
          business={business}
        />

        {showBusinessProfile ? (
          <BusinessProfileContent
            business={business}
            images={images}
            staff={staff}
            reviews={fakeReviews}
            reviewText={reviewText}
            onReviewTextChange={setReviewText}
            user={user}
            onOpenReviews={() => setIsReviewsModalOpen(true)}
            onStartBooking={() => setIsBookingMode(true)}
            onLoginToReview={() => router.push(loginRedirectPath)}
          />
        ) : (
          <BookingFlow
            bookingStep={bookingStep}
            setBookingStep={setBookingStep}
            selectedStaff={selectedStaff}
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            staff={staff}
            staffServices={staffServices}
            disabledDays={disabledDays}
            availabilityByStatus={availabilityByStatus}
            onSelectDate={handleSelectDate}
            slotsLoading={slotsLoading}
            visibleTimeSlots={visibleTimeSlots}
            activeWarningSlot={activeWarningSlot}
            warningCountdown={warningCountdown}
            highlightWarning={highlightWarning}
            currentTime={currentTime}
            onSelectStaff={setSelectedStaff}
            onSelectService={setSelectedService}
            onSelectTimeSlot={handleSelectTimeSlot}
            onTriggerWarningFocus={triggerWarningFocus}
            onOpenCancelAlert={() => setIsCancelAlertOpen(true)}
            onBackToProfile={() => setIsBookingMode(false)}
            formatTimeSlot={formatTimeSlot}
            onAdvanceToReview={handleAdvanceToReview}
            onContinueBooking={handleContinueBooking}
          />
        )}
      </div>

      <ReviewsModal
        open={isReviewsModalOpen}
        onOpenChange={setIsReviewsModalOpen}
        reviews={fakeReviews}
        reviewText={reviewText}
        onReviewTextChange={setReviewText}
        user={user}
        onLoginClick={() => router.push("/login")}
      />

      <CancelBookingAlert
        open={isCancelAlertOpen}
        onOpenChange={setIsCancelAlertOpen}
        onConfirm={handleCancelBooking}
      />

      <BookingWarningStyles />
    </Layout>
  );
};

export default BusinessDetailPage;
