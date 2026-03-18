"use client";
import { useBusinessBaseData } from "./detail/useBusinessBaseData";
import { useBusinessSchedulingData } from "./detail/useBusinessSchedulingData";

export default function useBusinessDetail(businessId?: string | null) {
  const baseData = useBusinessBaseData(businessId);
  const schedulingData = useBusinessSchedulingData();

  return {
    ...baseData,
    ...schedulingData,
  } as const;
}
