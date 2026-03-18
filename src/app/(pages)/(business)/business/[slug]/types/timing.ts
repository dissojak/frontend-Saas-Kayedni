import type { BusinessTimeSlot } from "./entities";

export interface SlotTimingMeta {
  isPast: boolean;
  isSoon: boolean;
  isCriticalSoon: boolean;
  minutesUntilStart: number | null;
}

export interface TimedSlot {
  slot: BusinessTimeSlot;
  meta: SlotTimingMeta;
}
