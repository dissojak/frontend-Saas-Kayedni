import type {
  BusinessTimeSlot,
  SlotTimingMeta,
} from "../types/businessDetailPage";
import { isSameLocalDate, toDate } from "./date";

export const CRITICAL_MINUTES_THRESHOLD = 3;
export const SOON_MINUTES_THRESHOLD = 10;
export const LIVE_SLOT_TICK_MS = 15_000;

export const getSlotTimingMeta = (slot: BusinessTimeSlot, now: Date, bookingDate: Date | null): SlotTimingMeta => {
  const slotStart = toDate(slot.startTime);

  if (!bookingDate || !isSameLocalDate(slotStart, bookingDate)) {
    return {
      isPast: false,
      isSoon: false,
      isCriticalSoon: false,
      minutesUntilStart: null,
    };
  }

  const diffMs = slotStart.getTime() - now.getTime();
  const isPast = diffMs < 0;
  const isCriticalSoon = !isPast && diffMs <= CRITICAL_MINUTES_THRESHOLD * 60 * 1000;
  const isSoon = !isPast && diffMs <= SOON_MINUTES_THRESHOLD * 60 * 1000;
  const minutesUntilStart = isPast ? 0 : Math.ceil(diffMs / (60 * 1000));

  return {
    isPast,
    isSoon,
    isCriticalSoon,
    minutesUntilStart,
  };
};
