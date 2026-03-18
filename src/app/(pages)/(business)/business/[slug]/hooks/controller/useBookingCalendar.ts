"use client";

import { useMemo } from "react";
import { formatDateKey } from "../../utils/date";
import type {
  BookingCalendarDisabledDay,
  StaffAvailabilityEntry,
} from "../../types/businessDetailPage";

export const useBookingCalendar = (staffAvailability: StaffAvailabilityEntry[]) => {
  const { availabilityByStatus, statusByDate } = useMemo(() => {
    const acc: Record<string, Date[]> = {
      AVAILABLE: [],
      FULL: [],
      CLOSED: [],
      SICK: [],
      VACATION: [],
      DAY_OFF: [],
      UNAVAILABLE: [],
    };
    const map = new Map<string, string>();

    staffAvailability.forEach((a) => {
      if (!a?.date) return;
      const d = new Date(`${a.date}T00:00:00`);
      const key: string = a.status || "UNAVAILABLE";
      if (!acc[key]) acc[key] = [];
      acc[key].push(d);
      map.set(a.date, key);
    });

    return {
      availabilityByStatus: acc,
      statusByDate: map,
    };
  }, [staffAvailability]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 30);
    return d;
  }, [today]);

  const disabledDays = useMemo<BookingCalendarDisabledDay[]>(() => ([{ before: today }, { after: maxDate }]), [today, maxDate]);

  const canSelectDate = (date: Date) => {
    const key = formatDateKey(date);
    const status = statusByDate.get(key);
    return !status || status === "AVAILABLE";
  };

  return {
    availabilityByStatus,
    disabledDays,
    canSelectDate,
  } as const;
};
