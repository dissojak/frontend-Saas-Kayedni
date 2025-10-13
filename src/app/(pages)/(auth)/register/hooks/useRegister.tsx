"use client";

import { useState } from "react";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { callBackendRegister } from "../utils";
import type { UserRole } from "../../types";
import { useRouter } from "next/navigation";

export function useRegister() {
  const auth = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const payload = { name, email, password, role };
      const res = await callBackendRegister(payload);
      if (res.success && res.user) {
        // If AuthContext exists, use it to persist the user (dummy)
        await auth.register?.(
          res.user.name ?? res.user.email,
          res.user.email,
          password,
          res.user.role,
        );
        console.log("Registered user:", res.user);
        router.push("/");
      } else {
        setError(res.message ?? "Registration failed");
      }
    } catch (err) {
      setError((err as Error)?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    role,
    setRole,
    acceptedTerms,
    setAcceptedTerms,
    loading,
    error,
    onSubmit,
  } as const;
}
