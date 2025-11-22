"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAPI } from '@/(pages)/(auth)/api/auth.api';
import { setAccessToken, setRefreshToken } from '@/(pages)/(auth)/utils/token.utils';
import { reverseRoleMapping } from '@/(pages)/(auth)/types';

export function useAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // Call backend login API
      const backendResponse = await loginAPI({
        email,
        password,
      });

      // Check if account needs activation
      if (!backendResponse.token && backendResponse.message.includes('activate')) {
        setError(backendResponse.message);
        setLoading(false);
        return;
      }

      // Check if login was successful
      if (backendResponse.token) {
        // Verify user has admin role
        if (backendResponse.role !== 'ADMIN') {
          setError('Access denied. Admin privileges required.');
          setLoading(false);
          return;
        }

        // Store tokens
        setAccessToken(backendResponse.token);
        if (backendResponse.refreshToken) {
          setRefreshToken(backendResponse.refreshToken);
        }

        // Store user data in localStorage
        const frontendRole = reverseRoleMapping[backendResponse.role];
        const userData = {
          id: backendResponse.userId.toString(),
          name: backendResponse.name,
          email: backendResponse.email,
          role: frontendRole,
        };
        localStorage.setItem('user', JSON.stringify(userData));

        // Redirect to admin control panel
        router.push('/admin/control-panel');
      } else {
        setError(backendResponse.message || 'Login failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    submit,
  } as const;
}
