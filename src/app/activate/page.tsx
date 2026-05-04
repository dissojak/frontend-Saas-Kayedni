"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const [status, setStatus] = useState("Processing activation...");

  useEffect(() => {
    if (!token) {
      setStatus("Missing activation token.");
      return;
    }

    const url = `/api/v1/auth/activate?token=${encodeURIComponent(token)}`;
    fetch(url, { method: "GET" })
      .then(async (res) => {
        if (res.ok) {
          setStatus("Account activated. You can now sign in.");
        } else {
          const json = await res.json().catch(() => null);
          setStatus(json?.message || "Activation failed. Please try again.");
        }
      })
      .catch(() => setStatus("Network error while activating. Try again later."));
  }, [token]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-2xl font-semibold mb-4">Activation</h1>
        <p className="text-gray-700">{status}</p>
      </div>
    </main>
  );
}
