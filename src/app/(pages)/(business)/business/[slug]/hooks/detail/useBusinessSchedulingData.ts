"use client";

import { useCallback, useRef, useState } from "react";
import {
  fetchAvailableTimeSlotsForStaffDate,
  fetchServicesByStaffId,
  fetchStaffAvailability,
} from "@/(pages)/(business)/actions/backend";
import { formatDateKey } from "../../utils/date";
import type {
  BusinessService,
  BusinessTimeSlot,
  StaffAvailabilityEntry,
} from "../../types/businessDetailPage";

export const useBusinessSchedulingData = () => {
  const [slots, setSlots] = useState<BusinessTimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [staffServices, setStaffServices] = useState<BusinessService[]>([]);
  const [staffAvailability, setStaffAvailability] = useState<StaffAvailabilityEntry[]>([]);

  const slotRequestRef = useRef(0);

  const loadServicesForStaff = useCallback(async (staffId: string) => {
    try {
      const svcs = await fetchServicesByStaffId(staffId);
      setStaffServices(svcs as BusinessService[]);
    } catch {
      setStaffServices([]);
    }
  }, []);

  const loadAvailabilityForStaff = useCallback(async (staffId: string, from: string, to: string) => {
    try {
      const avail = await fetchStaffAvailability(staffId, from, to);
      setStaffAvailability(avail as StaffAvailabilityEntry[]);
    } catch {
      setStaffAvailability([]);
    }
  }, []);

  const clearStaffAvailability = useCallback(() => {
    setStaffAvailability([]);
  }, []);

  const loadTimeSlotsForDate = useCallback(async (staffId: string, date: Date, serviceDuration: number) => {
    const requestId = ++slotRequestRef.current;
    setSlotsLoading(true);

    try {
      const dateStr = formatDateKey(date);
      const timeSlots = await fetchAvailableTimeSlotsForStaffDate(staffId, dateStr, serviceDuration);

      if (requestId === slotRequestRef.current) {
        setSlots(timeSlots as BusinessTimeSlot[]);
        setSlotsLoading(false);
      }
    } catch {
      if (requestId === slotRequestRef.current) {
        setSlots([]);
        setSlotsLoading(false);
      }
    }
  }, []);

  const clearSlots = useCallback(() => {
    slotRequestRef.current += 1;
    setSlots([]);
  }, []);

  return {
    staffServices,
    staffAvailability,
    loadServicesForStaff,
    loadAvailabilityForStaff,
    clearStaffAvailability,
    loadTimeSlotsForDate,
    clearSlots,
    slots,
    slotsLoading,
  } as const;
};
