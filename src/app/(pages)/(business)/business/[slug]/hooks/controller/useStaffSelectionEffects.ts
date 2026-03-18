"use client";

import { useEffect } from "react";
import { formatDateKey } from "../../utils/date";
import type {
  BusinessService,
  BusinessStaff,
  BusinessTimeSlot,
  NullableSelectionSetter,
} from "../../types/businessDetailPage";

interface UseStaffSelectionEffectsParams {
  selectedStaff: BusinessStaff | null;
  selectedDate: Date | null;
  selectedService: BusinessService | null;
  setSelectedService: NullableSelectionSetter<BusinessService>;
  setSelectedTimeSlot: NullableSelectionSetter<BusinessTimeSlot>;
  clearStaffAvailability: () => void;
  clearSlots: () => void;
  loadServicesForStaff: (staffId: string) => void;
  loadAvailabilityForStaff: (staffId: string, from: string, to: string) => void;
  loadTimeSlotsForDate: (staffId: string, date: Date, serviceDuration: number) => void;
}

export const useStaffSelectionEffects = ({
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
}: UseStaffSelectionEffectsParams) => {
  useEffect(() => {
    if (!selectedStaff?.id) {
      setSelectedService(null);
      clearStaffAvailability();
      clearSlots();
      return;
    }

    const staffId = String(selectedStaff.id);
    loadServicesForStaff(staffId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const to = new Date(today);
    to.setDate(today.getDate() + 30);

    loadAvailabilityForStaff(staffId, formatDateKey(today), formatDateKey(to));
    setSelectedService(null);
    setSelectedTimeSlot(null);
    clearSlots();
  }, [selectedStaff, setSelectedService, setSelectedTimeSlot, clearStaffAvailability, clearSlots, loadServicesForStaff, loadAvailabilityForStaff]);

  useEffect(() => {
    if (!selectedStaff?.id || !selectedDate) {
      return;
    }

    const staffId = String(selectedStaff.id);
    const serviceDuration = selectedService?.duration || 30;
    loadTimeSlotsForDate(staffId, selectedDate, serviceDuration);
  }, [selectedStaff, selectedDate, selectedService, loadTimeSlotsForDate]);
};
