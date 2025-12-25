"use client";
import { useEffect, useState, useRef } from "react";
import type { Business } from "@/(pages)/(business)/businesses/types/business";
import {
  fetchBusinessById,
  fetchStaffByBusinessId,
  fetchServicesByBusinessId,
  fetchBusinessImages,
  fetchServicesByStaffId,
  fetchStaffAvailability,
  fetchAvailableTimeSlotsForStaffDate,
} from "@/(pages)/(business)/actions/backend";

export default function useBusinessDetail(businessId?: string | null) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [staffServices, setStaffServices] = useState<any[]>([]);
  const [staffAvailability, setStaffAvailability] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track the current slot request to avoid race conditions
  const slotRequestRef = useRef(0);

  useEffect(() => {
    if (!businessId) return;
    let mounted = true;
    setLoading(true);
    Promise.all([
      fetchBusinessById(businessId),
      fetchStaffByBusinessId(businessId),
      fetchServicesByBusinessId(businessId),
      // Don't fetch generic slots here - we only want staff-specific slots
      fetchBusinessImages(businessId),
    ])
      .then(([b, s, sv, imgs]) => {
        if (!mounted) return;
        setBusiness(b as Business | null);
        setStaff(s as any[]);
        setServices(sv as any[]);
        // Don't set slots here - let loadTimeSlotsForDate handle it
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
      console.log(`[loadAvailabilityForStaff] Fetching for staff=${staffId}, from=${from}, to=${to}`);
      const avail = await fetchStaffAvailability(staffId, from, to);
      console.log(`[loadAvailabilityForStaff] Got ${avail.length} availability records:`, avail.map(a => `${a.date}:${a.status}`));
      setStaffAvailability(avail as any[]);
    } catch (error) {
      console.error('[loadAvailabilityForStaff] Error:', error);
      setStaffAvailability([]);
    }
  };

  const clearStaffAvailability = () => setStaffAvailability([]);

  // Load available time slots for a specific date and staff member
  // This fetches slots AND filters out already-booked times
  const loadTimeSlotsForDate = async (staffId: string, date: Date, serviceDuration: number) => {
    // Increment request ID to track this specific request
    const requestId = ++slotRequestRef.current;
    setSlotsLoading(true);
    
    try {
      // Format date in local timezone (not UTC) to avoid +/-1 day shifting
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      console.log(`[loadTimeSlotsForDate] Fetching slots for staff=${staffId}, date=${dateStr}, duration=${serviceDuration}`);
      
      const timeSlots = await fetchAvailableTimeSlotsForStaffDate(staffId, dateStr, serviceDuration);
      
      // Only update state if this is still the latest request (avoid race conditions)
      if (requestId === slotRequestRef.current) {
        console.log(`[loadTimeSlotsForDate] Got ${timeSlots.length} slots`);
        setSlots(timeSlots as any[]);
        setSlotsLoading(false);
      } else {
        console.log(`[loadTimeSlotsForDate] Ignoring stale response (request ${requestId}, current ${slotRequestRef.current})`);
      }
    } catch (error) {
      console.error('[loadTimeSlotsForDate] Error:', error);
      if (requestId === slotRequestRef.current) {
        setSlots([]);
        setSlotsLoading(false);
      }
    }
  };

  // Clear slots when staff/service/date changes
  const clearSlots = () => {
    slotRequestRef.current++; // Cancel any pending requests
    setSlots([]);
  };

  return {
    business,
    staff,
    services,
    staffServices,
    staffAvailability,
    loadServicesForStaff,
    loadAvailabilityForStaff,
    clearStaffAvailability,
    loadTimeSlotsForDate,
    clearSlots,
    slots,
    slotsLoading,
    images,
    loading,
    error,
  } as const;
}
