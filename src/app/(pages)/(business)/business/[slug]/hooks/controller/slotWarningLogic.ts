import { getSlotTimingMeta } from "../../utils/slotTiming";
import { isSameLocalDate } from "../../utils/date";
import type {
  BusinessStaff,
  BusinessTimeSlot,
  EntityId,
  TimedSlot,
} from "../../types/businessDetailPage";

export { LIVE_SLOT_TICK_MS as slotLiveTickMs } from "../../utils/slotTiming";

export const shouldRunLiveClock = (
  isBookingMode: boolean,
  bookingStep: number,
  selectedDate: Date | null,
  selectedStaffId: unknown,
) => Boolean(
  isBookingMode
  && bookingStep === 2
  && selectedDate
  && selectedStaffId
  && isSameLocalDate(selectedDate, new Date()),
);

export const getFilteredTimeSlots = (
  selectedDate: Date | null,
  selectedStaff: BusinessStaff | null,
  slots: BusinessTimeSlot[],
) => (
  selectedDate && selectedStaff
    ? slots.filter((slot) => slot.isAvailable !== false)
    : []
);

export const getVisibleTimeSlots = (
  filteredTimeSlots: BusinessTimeSlot[],
  currentTime: Date,
  selectedDate: Date | null,
): TimedSlot[] => (
  filteredTimeSlots
    .map((slot) => ({
      slot,
      meta: getSlotTimingMeta(slot, currentTime, selectedDate),
    }))
    .filter(({ meta }) => !meta.isPast)
);

export const shouldClearSelectedSlot = (
  selectedTimeSlot: BusinessTimeSlot | null,
  selectedDate: Date | null,
  currentTime: Date,
  visibleTimeSlots: TimedSlot[],
) => {
  if (!selectedTimeSlot || !selectedDate) return false;

  const selectedMeta = getSlotTimingMeta(selectedTimeSlot, currentTime, selectedDate);
  const slotStillVisible = visibleTimeSlots.some(({ slot }) => slot.id === selectedTimeSlot.id);

  return selectedMeta.isPast || selectedMeta.isCriticalSoon || !slotStillVisible;
};

const isWarningDateActive = (selectedDate: Date | null, currentTime: Date) => (
  Boolean(selectedDate && isSameLocalDate(selectedDate, currentTime))
);

const getActiveSlotById = (
  activeWarningSlotId: EntityId | null,
  visibleTimeSlots: TimedSlot[],
) => {
  if (!activeWarningSlotId) return null;
  const matched = visibleTimeSlots.find(({ slot }) => slot.id === activeWarningSlotId);
  return matched?.meta?.isSoon ? matched : null;
};

const getFallbackWarningSlot = (visibleTimeSlots: TimedSlot[]) => (
  visibleTimeSlots.find(({ meta }) => meta.isCriticalSoon)
  || visibleTimeSlots.find(({ meta }) => meta.isSoon)
  || null
);

export const getActiveWarningSlot = (
  selectedDate: Date | null,
  currentTime: Date,
  activeWarningSlotId: EntityId | null,
  visibleTimeSlots: TimedSlot[],
) => {
  if (!isWarningDateActive(selectedDate, currentTime)) return null;

  const activeSlot = getActiveSlotById(activeWarningSlotId, visibleTimeSlots);
  return activeSlot ?? getFallbackWarningSlot(visibleTimeSlots);
};

export const formatWarningCountdown = (activeWarningSlot: TimedSlot | null) => {
  const minutes = activeWarningSlot?.meta.minutesUntilStart;
  if (minutes == null) return "";
  if (minutes <= 1) return "less than 1 minute";
  return `${minutes} minutes`;
};
