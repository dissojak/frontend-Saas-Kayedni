"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPasswordAPI } from '../../api/auth.api';

export function useForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load email from localStorage on mount (if user came from login page)
  useEffect(() => {
    const savedEmail = localStorage.getItem('bookify_reset_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const submit = async () => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      if (!email) {
        setError('Please enter your email address');
        setLoading(false);
        return;
      }

      const result = await forgotPasswordAPI({ email });

      if (result.message) {
        // Save email to localStorage for reset-password page
        localStorage.setItem('bookify_reset_email', email);
        setSuccess(true);
        
        // Auto-redirect to reset-password page after 2 seconds
        setTimeout(() => {
          router.push('/reset-password');
        }, 2000);
      } else {
        setError('Failed to send reset code. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    error,
    success,
    submit,
  } as const;
}
