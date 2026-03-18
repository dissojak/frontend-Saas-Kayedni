"use client";

import { useEffect } from "react";
import type {
  BusinessTimeSlot,
  EntityId,
  NullableSelectionSetter,
  TimedSlot,
} from "../../types/businessDetailPage";
import {
  shouldClearSelectedSlot,
  shouldRunLiveClock,
  slotLiveTickMs,
} from "./slotWarningLogic";

interface UseSlotWarningEffectsParams {
  isBookingMode: boolean;
  bookingStep: number;
  selectedDate: Date | null;
  selectedStaffId: EntityId | undefined;
  selectedTimeSlot: BusinessTimeSlot | null;
  currentTime: Date;
  setCurrentTime: (value: Date) => void;
  visibleTimeSlots: TimedSlot[];
  setSelectedTimeSlot: NullableSelectionSetter<BusinessTimeSlot>;
  activeWarningSlotId: EntityId | null;
  setActiveWarningSlotId: (id: EntityId | null) => void;
  highlightWarning: boolean;
  setHighlightWarning: (value: boolean) => void;
}

export const useSlotWarningEffects = ({
  isBookingMode,
  bookingStep,
  selectedDate,
  selectedStaffId,
  selectedTimeSlot,
  currentTime,
  setCurrentTime,
  visibleTimeSlots,
  setSelectedTimeSlot,
  activeWarningSlotId,
  setActiveWarningSlotId,
  highlightWarning,
  setHighlightWarning,
}: UseSlotWarningEffectsParams) => {
  useEffect(() => {
    if (!shouldRunLiveClock(isBookingMode, bookingStep, selectedDate, selectedStaffId)) return;

    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, slotLiveTickMs);

    return () => clearInterval(timer);
  }, [isBookingMode, bookingStep, selectedDate, selectedStaffId, setCurrentTime]);

  useEffect(() => {
    if (!shouldClearSelectedSlot(selectedTimeSlot, selectedDate, currentTime, visibleTimeSlots)) return;
    setSelectedTimeSlot(null);
  }, [selectedTimeSlot, selectedDate, currentTime, visibleTimeSlots, setSelectedTimeSlot]);

  useEffect(() => {
    if (!activeWarningSlotId) return;
    const exists = visibleTimeSlots.some(({ slot }) => slot.id === activeWarningSlotId);
    if (!exists) {
      setActiveWarningSlotId(null);
    }
  }, [activeWarningSlotId, visibleTimeSlots, setActiveWarningSlotId]);

  useEffect(() => {
    if (!highlightWarning) return;
    const timer = setTimeout(() => setHighlightWarning(false), 1200);
    return () => clearTimeout(timer);
  }, [highlightWarning, setHighlightWarning]);
};
