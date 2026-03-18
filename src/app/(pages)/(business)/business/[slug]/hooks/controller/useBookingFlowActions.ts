"use client";

import { getSlotTimingMeta } from "../../utils/slotTiming";
import type {
  BusinessDetailBusiness,
  BusinessService,
  BusinessStaff,
  BusinessTimeSlot,
  NullableSelectionSetter,
  TrackingEventName,
  TrackingPayload,
} from "../../types/businessDetailPage";

const isValidBookingData = (
  business: BusinessDetailBusiness | null,
  service: BusinessService | null,
  staff: BusinessStaff | null,
  date: Date | null,
  timeSlot: BusinessTimeSlot | null
) => {
  return Boolean(business && service && staff && date && timeSlot);
};

const formatTimeSlotForStorage = (slot: BusinessTimeSlot) => ({
  id: slot.id,
  staffId: slot.staffId,
  startTime: slot.startTime instanceof Date ? slot.startTime.toISOString() : slot.startTime,
  endTime: slot.endTime instanceof Date ? slot.endTime.toISOString() : slot.endTime,
  isAvailable: slot.isAvailable,
});

interface UseBookingFlowActionsParams {
  business: BusinessDetailBusiness | null;
  selectedService: BusinessService | null;
  selectedStaff: BusinessStaff | null;
  selectedDate: Date | null;
  selectedTimeSlot: BusinessTimeSlot | null;
  setSelectedDate: (value: Date | null) => void;
  setSelectedTimeSlot: NullableSelectionSetter<BusinessTimeSlot>;
  setBookingStep: (step: number) => void;
  setIsCancelAlertOpen: (value: boolean) => void;
  setIsBookingMode: (value: boolean) => void;
  clearBookingSelections: () => void;
  trackEvent: (name: TrackingEventName, payload?: TrackingPayload) => void;
  router: { push: (path: string) => void };
  canSelectDate: (date: Date) => boolean;
  triggerWarningFocus: (slotId: BusinessTimeSlot["id"]) => void;
}

export const useBookingFlowActions = ({
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
}: UseBookingFlowActionsParams) => {
  const handleCancelBooking = () => {
    setIsCancelAlertOpen(false);
    setIsBookingMode(false);
    clearBookingSelections();
    setBookingStep(1);
  };

  const handleContinueBooking = () => {
    if (!isValidBookingData(business, selectedService, selectedStaff, selectedDate, selectedTimeSlot)) return;

    const validTimeSlot = selectedTimeSlot as BusinessTimeSlot;
    const validDate = selectedDate as Date;
    const validBusiness = business as BusinessDetailBusiness;
    const validService = selectedService as BusinessService;
    const validStaff = selectedStaff as BusinessStaff;

    const selectedSlotMeta = getSlotTimingMeta(validTimeSlot, new Date(), validDate);
    
    if (selectedSlotMeta.isPast || selectedSlotMeta.isCriticalSoon) {
      setSelectedTimeSlot(null);
      return;
    }

    trackEvent("booking_started", {
      businessId: String(validBusiness.id),
      businessName: validBusiness.name,
      serviceId: String(validService.id),
      serviceName: validService.name,
      staffId: String(validStaff.id),
      staffName: validStaff.name,
      price: validService.price,
    });

    const bookingData = {
      business: validBusiness,
      staff: validStaff,
      service: validService,
      date: validDate.toISOString(),
      timeSlot: formatTimeSlotForStorage(validTimeSlot),
    };

    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    router.push("/booking/checkout");
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(null);
      return;
    }

    if (!canSelectDate(date)) return;
    setSelectedDate(date);
  };

  const handleSelectTimeSlot = (slot: BusinessTimeSlot, isSoon: boolean, isDisabled: boolean) => {
    if (isDisabled) {
      triggerWarningFocus(slot.id);
      return;
    }

    setSelectedTimeSlot(slot);
    if (isSoon) triggerWarningFocus(slot.id);
  };

  const handleAdvanceToReview = () => {
    setBookingStep(3);
    setTimeout(() => {
      const bookingSection = document.getElementById("booking-section");
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  return {
    handleCancelBooking,
    handleContinueBooking,
    handleSelectDate,
    handleSelectTimeSlot,
    handleAdvanceToReview,
  };
};
