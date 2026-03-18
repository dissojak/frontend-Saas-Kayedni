"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBooking } from "@/(pages)/(booking)/context/BookingContext";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { extractBusinessIdFromSlug } from "@global/lib/businessSlug";
import { useTracking } from "@global/hooks/useTracking";
import useBusinessDetail from "../useBusinessDetail";
import { fakeReviews } from "../../data/fakeReviews";
import { formatTimeSlot } from "../../utils/date";
import { useBookingCalendar } from "./useBookingCalendar";
import { useBookingFlowActions } from "./useBookingFlowActions";
import { useBusinessRouteTracking } from "./useBusinessRouteTracking";
import { useSlotWarningState } from "./useSlotWarningState";
import { useStaffSelectionEffects } from "./useStaffSelectionEffects";
import { useBusinessDetailPageUiState } from "./useBusinessDetailPageUiState";
import { useBookingSectionAutoScroll } from "./useBookingSectionAutoScroll";

export const useBusinessDetailPageControllerModel = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { trackEvent } = useTracking();
  const { user } = useAuth();

  const businessId = slug ? extractBusinessIdFromSlug(slug) : undefined;

  const {
    selectedStaff,
    setSelectedStaff,
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
  } = useBooking();

  const detail = useBusinessDetail(businessId ?? undefined);

  const {
    business,
    staff,
    staffServices,
    staffAvailability,
    loadServicesForStaff,
    loadAvailabilityForStaff,
    clearStaffAvailability,
    loadTimeSlotsForDate,
    clearSlots,
    slots,
    slotsLoading,
    images,
    loading,
  } = detail;

  const {
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
    clearBookingSelections,
  } = useBusinessDetailPageUiState({
    setSelectedStaff,
    setSelectedService,
    setSelectedDate,
    setSelectedTimeSlot,
  });

  useBusinessRouteTracking({ business, slug, router, trackEvent });

  useEffect(() => {
    return () => {
      clearBookingSelections();
    };
  }, [clearBookingSelections]);

  useStaffSelectionEffects({
    selectedStaff,
    selectedDate,
    selectedService,
    setSelectedService,
    setSelectedTimeSlot,
    clearStaffAvailability,
    clearSlots,
    loadServicesForStaff,
    loadAvailabilityForStaff,
    loadTimeSlotsForDate,
  });

  useBookingSectionAutoScroll(isBookingMode);

  const { availabilityByStatus, disabledDays, canSelectDate } = useBookingCalendar(staffAvailability);

  const {
    currentTime,
    visibleTimeSlots,
    activeWarningSlot,
    warningCountdown,
    highlightWarning,
    triggerWarningFocus,
  } = useSlotWarningState({
    isBookingMode,
    bookingStep,
    selectedDate,
    selectedStaff,
    selectedTimeSlot,
    setSelectedTimeSlot,
    slots,
  });

  const {
    handleCancelBooking,
    handleContinueBooking,
    handleSelectDate,
    handleSelectTimeSlot,
    handleAdvanceToReview,
  } = useBookingFlowActions({
    business,
    selectedService,
    selectedStaff,
    selectedDate,
    selectedTimeSlot,
    setSelectedDate,
    setSelectedTimeSlot,
    setBookingStep,
    setIsCancelAlertOpen,
    setIsBookingMode,
    clearBookingSelections,
    trackEvent,
    router,
    canSelectDate,
    triggerWarningFocus,
  });

  return {
    router,
    user,
    ...detail,
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
  } as const;
};
