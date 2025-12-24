"use client";
import { useEffect, useState } from "react";
import type { Business } from "../types/business";
import { fetchBusinesses } from "../../actions/backend";

export default function useBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchBusinesses()
      .then((data) => {
        if (!mounted) return;
        setBusinesses(data);
      })
      .catch((err) => {
        console.error("Failed to fetch businesses:", err);
        if (!mounted) return;
        setError(String(err));
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return { businesses, loading, error } as const;
}
