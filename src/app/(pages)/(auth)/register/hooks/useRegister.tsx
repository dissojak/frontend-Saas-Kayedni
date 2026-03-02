"use client";

import { useState } from "react";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { callBackendRegister } from "../utils";
import type { UserRole } from "../../types";
import { useRouter } from "next/navigation";
import { useTracking } from "@global/hooks/useTracking";
import { logAuthEvent } from "@global/lib/authLogger";

export function useRegister(defaultRole: UserRole = "CLIENT") {
  const auth = useAuth();
  const router = useRouter();
  const { trackEvent } = useTracking();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>(defaultRole);
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
      trackEvent('signup_validation_error', {
        field: 'confirm_password',
        reason: 'passwords_dont_match',
        role,
      });
      logAuthEvent({ action: 'signup_validation_error', success: false, failReason: 'passwords_dont_match', failStage: 'validation', email, role });
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the terms and conditions");
      trackEvent('signup_validation_error', {
        field: 'terms',
        reason: 'terms_not_accepted',
        role,
      });
      logAuthEvent({ action: 'signup_validation_error', success: false, failReason: 'terms_not_accepted', failStage: 'validation', email, role });
      return;
    }
    setLoading(true);
    logAuthEvent({ action: 'signup_attempt', success: false, email, role });
    try {
      const payload = { name, email, password, role };
      const res = await callBackendRegister(payload);
      
      if (res.success && res.user) {
        // Registration successful — do NOT auto-login. User must verify email first.
        setRegistered(true);
        setRegisteredEmail(res.user.email ?? null);
        setRegistrationMessage(res.message ?? 'Registration successful. Please check your email to activate your account.');
        trackEvent('signup', { method: 'email', role });
        logAuthEvent({ action: 'signup_success', success: true, email, role });
      } else {
        setError(res.message ?? "Registration failed");
        trackEvent('signup_failed', {
          reason: res.message ?? 'registration_failed',
          role,
          error_type: 'api_error',
        });
        logAuthEvent({ action: 'signup_failed', success: false, failReason: res.message ?? 'registration_failed', failStage: 'api', email, role });
      }
    } catch (err) {
      const msg = (err as Error)?.message ?? "Unknown error";
      setError(msg);
      trackEvent('signup_failed', {
        reason: msg,
        role,
        error_type: 'network_or_server_error',
      });
      logAuthEvent({ action: 'signup_failed', success: false, failReason: msg, failStage: 'network_error', email, role });
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
