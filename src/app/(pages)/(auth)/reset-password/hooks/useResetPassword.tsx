"use client";

import { useState, useEffect } from 'react';
import { resetPasswordAPI } from '../../api/auth.api';
import { useRouter } from 'next/navigation';

export function useResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load email from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('kayedni_reset_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const submit = async () => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Get email from state (loaded from localStorage)
      const emailToUse = email || localStorage.getItem('kayedni_reset_email') || '';
      
      // Validation
      if (!emailToUse) {
        setError('Email not found. Please go back to forgot password page.');
        setLoading(false);
        return;
      }

      if (!resetCode || resetCode.length !== 6) {
        setError('Please enter a valid 6-digit reset code');
        setLoading(false);
        return;
      }

      if (!newPassword || newPassword.length < 8) {
        setError('Password must be at least 8 characters');
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const result = await resetPasswordAPI({
        email: emailToUse,
        resetCode,
        newPassword,
      });

      if (result.message) {
        setSuccess(true);
        // Clear the stored email from localStorage
        localStorage.removeItem('kayedni_reset_email');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError('Failed to reset password. Please try again.');
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
    resetCode,
    setResetCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    success,
    submit,
  } as const;
}
