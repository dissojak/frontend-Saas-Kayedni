"use client";

import { useEffect, useState } from "react";
import type { Business } from "@/(pages)/(business)/businesses/types/business";
import {
  fetchBusinessById,
  fetchBusinessImages,
  fetchServicesByBusinessId,
  fetchStaffByBusinessId,
} from "@/(pages)/(business)/actions/backend";
import type {
  BusinessImage,
  BusinessService,
  BusinessStaff,
} from "../../types/businessDetailPage";

export const useBusinessBaseData = (businessId?: string | null) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [staff, setStaff] = useState<BusinessStaff[]>([]);
  const [services, setServices] = useState<BusinessService[]>([]);
  const [images, setImages] = useState<BusinessImage[]>([]);
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
      fetchBusinessImages(businessId),
    ])
      .then(([b, s, sv, imgs]) => {
        if (!mounted) return;
        setBusiness(b);
        setStaff(s as BusinessStaff[]);
        setServices(sv as BusinessService[]);
        setImages(imgs as BusinessImage[]);
      })
      .catch((err) => {
        console.error("useBusinessBaseData error:", err);
        if (!mounted) return;
        setError(String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [businessId]);

  return {
    business,
    staff,
    services,
    images,
    loading,
    error,
  } as const;
};
