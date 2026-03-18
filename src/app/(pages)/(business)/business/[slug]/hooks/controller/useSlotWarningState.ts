"use client";

import {
  useSlotWarningStateModel,
  type UseSlotWarningStateParams,
} from "./slotWarningStateModel";

export const useSlotWarningState = (params: UseSlotWarningStateParams) => useSlotWarningStateModel(params);
