"use client";

import { useMemo, useState } from "react";
import { useSlotWarningEffects } from "./useSlotWarningEffects";
import {
  formatWarningCountdown,
  getActiveWarningSlot,
  getFilteredTimeSlots,
  getVisibleTimeSlots,
} from "./slotWarningLogic";
import type {
  BusinessStaff,
  BusinessTimeSlot,
  EntityId,
  NullableSelectionSetter,
  TimedSlot,
} from "../../types/businessDetailPage";

export interface UseSlotWarningStateParams {
  isBookingMode: boolean;
  bookingStep: number;
  selectedDate: Date | null;
  selectedStaff: BusinessStaff | null;
  selectedTimeSlot: BusinessTimeSlot | null;
  setSelectedTimeSlot: NullableSelectionSetter<BusinessTimeSlot>;
  slots: BusinessTimeSlot[];
}

export const useSlotWarningStateModel = ({
  isBookingMode,
  bookingStep,
  selectedDate,
  selectedStaff,
  selectedTimeSlot,
  setSelectedTimeSlot,
  slots,
}: UseSlotWarningStateParams) => {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [activeWarningSlotId, setActiveWarningSlotId] = useState<EntityId | null>(null);
  const [highlightWarning, setHighlightWarning] = useState(false);

  const filteredTimeSlots = useMemo(() => (
    getFilteredTimeSlots(selectedDate, selectedStaff, slots)
  ), [selectedDate, selectedStaff, slots]);

  const visibleTimeSlots = useMemo<TimedSlot[]>(() => (
    getVisibleTimeSlots(filteredTimeSlots, currentTime, selectedDate)
  ), [filteredTimeSlots, currentTime, selectedDate]);

  useSlotWarningEffects({
    isBookingMode,
    bookingStep,
    selectedDate,
    selectedStaffId: selectedStaff?.id,
    selectedTimeSlot,
    currentTime,
    setCurrentTime,
    visibleTimeSlots,
    setSelectedTimeSlot,
    activeWarningSlotId,
    setActiveWarningSlotId,
    highlightWarning,
    setHighlightWarning,
  });

  const activeWarningSlot = useMemo(
    () => getActiveWarningSlot(selectedDate, currentTime, activeWarningSlotId, visibleTimeSlots),
    [selectedDate, currentTime, activeWarningSlotId, visibleTimeSlots],
  );

  const warningCountdown = useMemo(
    () => formatWarningCountdown(activeWarningSlot),
    [activeWarningSlot],
  );

  const triggerWarningFocus = (slotId: EntityId) => {
    setActiveWarningSlotId(slotId);
    setHighlightWarning(false);
    globalThis.requestAnimationFrame(() => {
      setHighlightWarning(true);
    });
  };

  return {
    currentTime,
    visibleTimeSlots,
    activeWarningSlot,
    warningCountdown,
    highlightWarning,
    triggerWarningFocus,
  } as const;
};
