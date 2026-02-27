"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPasswordAPI } from '../../api/auth.api';
import { useTracking } from '@global/hooks/useTracking';
import { logAuthEvent } from '@global/lib/authLogger';

export function useForgotPassword() {
  const router = useRouter();
  const { trackEvent } = useTracking();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load email from localStorage on mount (if user came from login page)
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
      if (!email) {
        setError('Please enter your email address');
        trackEvent('forgot_password_failed', { reason: 'no_email_provided', stage: 'validation' });
        logAuthEvent({ action: 'forgot_password_failed', success: false, failReason: 'no_email_provided', failStage: 'validation' });
        setLoading(false);
        return;
      }

      const result = await forgotPasswordAPI({ email });

      if (result.message) {
        // Save email to localStorage for reset-password page
        localStorage.setItem('kayedni_reset_email', email);
        setSuccess(true);
        trackEvent('forgot_password_requested', { method: 'email' });
        logAuthEvent({ action: 'forgot_password_requested', success: true, email });
        
        // Auto-redirect to reset-password page after 2 seconds
        setTimeout(() => {
          router.push('/reset-password');
        }, 2000);
      } else {
        setError('Failed to send reset code. Please try again.');
        trackEvent('forgot_password_failed', { reason: 'api_no_message', stage: 'api' });
        logAuthEvent({ action: 'forgot_password_failed', success: false, failReason: 'api_no_message', failStage: 'api', email });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setError(msg);
      trackEvent('forgot_password_failed', { reason: msg, stage: 'network_error' });
      logAuthEvent({ action: 'forgot_password_failed', success: false, failReason: msg, failStage: 'network_error', email });
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
