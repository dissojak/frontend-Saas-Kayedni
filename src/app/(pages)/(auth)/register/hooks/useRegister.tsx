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
  const [registered, setRegistered] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the terms and conditions");
      return;
    }
    setLoading(true);
    try {
      const payload = { name, email, password, role };
      const res = await callBackendRegister(payload);
      
      if (res.success && res.user) {
        // Registration successful — do NOT auto-login. User must verify email first.
        setRegistered(true);
        setRegisteredEmail(res.user.email ?? null);
        setRegistrationMessage(res.message ?? 'Registration successful. Please check your email to activate your account.');
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
    registered,
    registrationMessage,
    registeredEmail,
    onSubmit,
  } as const;
}
