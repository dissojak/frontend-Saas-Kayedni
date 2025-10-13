"use client";
import { useEffect, useState } from "react";
import type { Business } from "@/(pages)/(business)/businesses/types/business";
import {
  fetchBusinessById,
  fetchStaffByBusinessId,
  fetchServicesByBusinessId,
  fetchAvailableSlots,
} from "@/(pages)/(business)/actions/backend";

export default function useBusinessDetail(businessId?: string | null) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) return;
    let mounted = true;
    setLoading(true);
    Promise.all([
      fetchBusinessById(businessId),
      fetchStaffByBusinessId(businessId),
      fetchServicesByBusinessId(businessId),
      fetchAvailableSlots(businessId),
    ])
      .then(([b, s, sv, sl]) => {
        if (!mounted) return;
        setBusiness(b as Business | null);
        setStaff(s as any[]);
        setServices(sv as any[]);
        setSlots(sl as any[]);
      })
      .catch((err) => {
        console.error("useBusinessDetail error:", err);
        if (!mounted) return;
        setError(String(err));
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [businessId]);

  return { business, staff, services, slots, loading, error } as const;
}
