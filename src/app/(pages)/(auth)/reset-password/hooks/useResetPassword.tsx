"use client";

import { useState, useEffect } from 'react';
import { resetPasswordAPI } from '../../api/auth.api';
import { useRouter } from 'next/navigation';
import { useTracking } from '@global/hooks/useTracking';
import { logAuthEvent } from '@global/lib/authLogger';

export function useResetPassword() {
  const router = useRouter();
  const { trackEvent } = useTracking();
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
        trackEvent('reset_password_failed', { reason: 'no_email', stage: 'validation' });
        logAuthEvent({ action: 'reset_password_failed', success: false, failReason: 'no_email', failStage: 'validation' });
        setLoading(false);
        return;
      }

      if (!resetCode || resetCode.length !== 6) {
        setError('Please enter a valid 6-digit reset code');
        trackEvent('reset_password_failed', { reason: 'invalid_code_format', stage: 'validation' });
        logAuthEvent({ action: 'reset_password_failed', success: false, failReason: 'invalid_code_format', failStage: 'validation', email: emailToUse });
        setLoading(false);
        return;
      }

      if (!newPassword || newPassword.length < 8) {
        setError('Password must be at least 8 characters');
        trackEvent('reset_password_failed', { reason: 'password_too_short', stage: 'validation' });
        logAuthEvent({ action: 'reset_password_failed', success: false, failReason: 'password_too_short', failStage: 'validation', email: emailToUse });
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        trackEvent('reset_password_failed', { reason: 'passwords_dont_match', stage: 'validation' });
        logAuthEvent({ action: 'reset_password_failed', success: false, failReason: 'passwords_dont_match', failStage: 'validation', email: emailToUse });
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
        trackEvent('reset_password_completed', {});
        logAuthEvent({ action: 'reset_password_success', success: true, email: emailToUse });
        // Clear the stored email from localStorage
        localStorage.removeItem('kayedni_reset_email');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError('Failed to reset password. Please try again.');
        trackEvent('reset_password_failed', { reason: 'api_no_message', stage: 'api' });
        logAuthEvent({ action: 'reset_password_failed', success: false, failReason: 'api_no_message', failStage: 'api', email: emailToUse });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setError(msg);
      trackEvent('reset_password_failed', { reason: msg, stage: 'network_error' });
      logAuthEvent({ action: 'reset_password_failed', success: false, failReason: msg, failStage: 'network_error', email });
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
