"use client";

import { useState } from 'react';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { callBackendLogin } from '../utils/index';
import type { LoginPayload } from '../types/index';
import { UserRole } from '../../types';
import { useRouter } from 'next/navigation';
import { useTracking } from '@global/hooks/useTracking';
import { logAuthEvent } from '@global/lib/authLogger';

export function useLogin() {
  const auth = useAuth();
  const router = useRouter();
  const { trackEvent } = useTracking();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CLIENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setLoading(true);
    trackEvent('login_attempt', { role });
    // success is intentionally omitted — outcome is unknown at attempt time
    logAuthEvent({ action: 'login_attempt', email, role });
    try {
      const payload: LoginPayload = { email, password, role };
      const result = await callBackendLogin(payload);
      
      if (result.success && result.user) {
        // Login successful with backend
        await auth.login(email, password, role);
        trackEvent('login', { method: 'email', role });
        logAuthEvent({ action: 'login_success', success: true, email, role });
        router.push("/");
        return;
      }

      // Login failed - show error message
      setError(result.message || 'Login failed');
      trackEvent('login_failed', {
        reason: result.message || 'invalid_credentials',
        role,
        error_type: 'invalid_credentials',
      });
      logAuthEvent({
        action: 'login_failed',
        success: false,
        failReason: result.message || 'invalid_credentials',
        failStage: 'api',
        email,
        role,
        metadata: {
          // Password forensics: never store the value, only shape characteristics
          // Useful to detect credential stuffing (long/complex) vs dumb brute-force (short/simple)
          passwordLength: password.length,
          passwordHasUpper: /[A-Z]/.test(password),
          passwordHasDigit: /[0-9]/.test(password),
          passwordHasSpecial: /[^a-zA-Z0-9]/.test(password),
          serverMessage: result.message || null,
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      trackEvent('login_failed', {
        reason: msg,
        role,
        error_type: 'network_or_server_error',
      });
      logAuthEvent({
        action: 'login_failed',
        success: false,
        failReason: msg,
        failStage: 'network_error',
        email,
        role,
        metadata: {
          passwordLength: password.length,
          passwordHasUpper: /[A-Z]/.test(password),
          passwordHasDigit: /[0-9]/.test(password),
          passwordHasSpecial: /[^a-zA-Z0-9]/.test(password),
          errorMessage: msg,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    loading,
    error,
    submit,
  } as const;
}
