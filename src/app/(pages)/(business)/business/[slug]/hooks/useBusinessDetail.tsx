"use client";
import { useEffect, useState } from "react";
import type { Business } from "@/(pages)/(business)/businesses/types/business";
import {
  fetchBusinessById,
  fetchStaffByBusinessId,
  fetchServicesByBusinessId,
  fetchAvailableSlots,
  fetchBusinessImages,
  fetchServicesByStaffId,
  fetchStaffAvailability,
} from "@/(pages)/(business)/actions/backend";

export default function useBusinessDetail(businessId?: string | null) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [staffServices, setStaffServices] = useState<any[]>([]);
  const [staffAvailability, setStaffAvailability] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
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
      fetchBusinessImages(businessId),
    ])
      .then(([b, s, sv, sl, imgs]) => {
        if (!mounted) return;
        setBusiness(b as Business | null);
        setStaff(s as any[]);
        setServices(sv as any[]);
        setSlots(sl as any[]);
        setImages(imgs as any[]);
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

  // Expose a loader to fetch services by staff id
  const loadServicesForStaff = async (staffId: string) => {
    try {
      const svcs = await fetchServicesByStaffId(staffId);
      setStaffServices(svcs as any[]);
    } catch {
      setStaffServices([]);
    }
  };

  const loadAvailabilityForStaff = async (staffId: string, from: string, to: string) => {
    try {
      const avail = await fetchStaffAvailability(staffId, from, to);
      setStaffAvailability(avail as any[]);
    } catch {
      setStaffAvailability([]);
    }
  };

  const clearStaffAvailability = () => setStaffAvailability([]);

  return {
    business,
    staff,
    services,
    staffServices,
    staffAvailability,
    loadServicesForStaff,
    loadAvailabilityForStaff,
    clearStaffAvailability,
    slots,
    images,
    loading,
    error,
  } as const;
}
