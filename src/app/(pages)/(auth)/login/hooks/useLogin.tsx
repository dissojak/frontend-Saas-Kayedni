"use client";

import { useState } from 'react';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { callBackendLogin } from '../utils/index';
import type { LoginPayload } from '../types/index';
import { UserRole } from '../../types';
import { useRouter } from 'next/navigation';
import { useTracking } from '@global/hooks/useTracking';

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
    try {
      const payload: LoginPayload = { email, password, role };
      const result = await callBackendLogin(payload);
      
      if (result.success && result.user) {
        // Login successful with backend
        await auth.login(email, password, role);
        trackEvent('login', { method: 'email', role });
        router.push("/");
        return;
      }

      // Login failed - show error message
      setError(result.message || 'Login failed');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
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
