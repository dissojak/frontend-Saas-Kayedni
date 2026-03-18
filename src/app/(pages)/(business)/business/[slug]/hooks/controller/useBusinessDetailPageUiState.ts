"use client";

import { useCallback, useState } from "react";
import type {
  BusinessService,
  BusinessStaff,
  BusinessTimeSlot,
  NullableSelectionSetter,
} from "../../types/businessDetailPage";

interface UseBusinessDetailPageUiStateParams {
  setSelectedStaff: NullableSelectionSetter<BusinessStaff>;
  setSelectedService: NullableSelectionSetter<BusinessService>;
  setSelectedDate: (value: Date | null) => void;
  setSelectedTimeSlot: NullableSelectionSetter<BusinessTimeSlot>;
}

export const useBusinessDetailPageUiState = ({
  setSelectedStaff,
  setSelectedService,
  setSelectedDate,
  setSelectedTimeSlot,
}: UseBusinessDetailPageUiStateParams) => {
  const [bookingStep, setBookingStep] = useState(1);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);

  const clearBookingSelections = useCallback(() => {
    setSelectedStaff(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  }, [setSelectedStaff, setSelectedService, setSelectedDate, setSelectedTimeSlot]);

  return {
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
  } as const;
};
