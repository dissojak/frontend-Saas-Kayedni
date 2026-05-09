/**
 * Authentication API Service
 * Handles all backend authentication API calls
 */

import type { BackendAuthResponse, BackendUserRole, TwoFactorMethod } from '../types';

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

const API_BASE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8088/api/v1/auth');

export interface SignupRequestPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: BackendUserRole;
  business?: {
    name: string;
    location: string;
    phone?: string;
    email?: string;
    categoryId: number;
    description?: string;
    otherIndustryFeedback?: {
      industryName: string;
      description: string;
      phoneNumber: string;
      sourceSlug?: string;
      sourceCategoryName?: string;
      contactEmail?: string;
    };
  };
  inviteKey?: string;
}

export interface LoginRequestPayload {
  email: string;
  password: string;
}

export interface VerifyTwoFactorLoginPayload {
  twoFactorToken: string;
  code: string;
  method?: TwoFactorMethod;
}

export interface TwoFactorCodePayload {
  code: string;
  method?: TwoFactorMethod;
}

export interface TwoFactorSendCodePayload {
  method: Exclude<TwoFactorMethod, 'APP' | 'BACKUP_CODE'>;
}

export interface TwoFactorLoginSendCodePayload {
  twoFactorToken: string;
  method: Exclude<TwoFactorMethod, 'APP' | 'BACKUP_CODE'>;
}

export interface TwoFactorBackupCodesResponse {
  backupCodes: string[];
  message?: string;
}

/**
 * Signup - Register a new user
 * POST /api/v1/auth/signup
 */
export async function signupAPI(payload: SignupRequestPayload): Promise<{ status: number; data?: any }> {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data: any = undefined;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        // non-JSON response
        data = text;
      }
    }

    return { status: response.status, data };
  } catch (error) {
    console.error('Signup API Error:', error);
    throw error;
  }
}

/**
 * Validate invite key before signup
 * POST /v1/auth/validate-invite-key
 */
export async function validateInviteKeyAPI(inviteKey: string): Promise<{ status: number; data?: any }> {
  try {
    const response = await fetch(`${API_BASE_URL}/validate-invite-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inviteKey }),
    });

    const text = await response.text();
    let data: any = undefined;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    return { status: response.status, data };
  } catch (error) {
    console.error('Validate Invite Key API Error:', error);
    throw error;
  }
}

/**
 * Login - Authenticate a user
 * POST /api/v1/auth/login
 */
export async function loginAPI(payload: LoginRequestPayload): Promise<BackendAuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
}

/**
 * Verify two-factor login challenge and complete authentication.
 * POST /api/v1/auth/verify-2fa
 */
export async function verifyTwoFactorLoginAPI(payload: VerifyTwoFactorLoginPayload): Promise<BackendAuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Two-factor verification failed');
    }

    return data;
  } catch (error) {
    console.error('Two-Factor Verification API Error:', error);
    throw error;
  }
}

export async function sendTwoFactorLoginCodeAPI(payload: TwoFactorLoginSendCodePayload): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/verify-2fa/send-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to send two-factor verification code');
  }
  return data;
}

/**
 * Setup two-factor authentication for the current user.
 * POST /api/v1/auth/2fa/setup
 */
export async function setupTwoFactorAPI(accessToken: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/2fa/setup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to setup two-factor authentication');
  }

  return data;
}

/**
 * Enable two-factor authentication after verifying the code.
 * POST /api/v1/auth/2fa/enable
 */
export async function enableTwoFactorAPI(accessToken: string, payload: TwoFactorCodePayload): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/2fa/enable`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to enable two-factor authentication');
  }

  return data;
}

/**
 * Disable two-factor authentication after verifying the code.
 * POST /api/v1/auth/2fa/disable
 */
export async function disableTwoFactorAPI(accessToken: string, payload: TwoFactorCodePayload): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/2fa/disable`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to disable two-factor authentication');
  }

  return data;
}

export async function sendTwoFactorSetupCodeAPI(accessToken: string, payload: TwoFactorSendCodePayload): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/2fa/send-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to send setup verification code');
  }
  return data;
}

export async function regenerateBackupCodesAPI(accessToken: string, payload: TwoFactorCodePayload): Promise<TwoFactorBackupCodesResponse> {
  const response = await fetch(`${API_BASE_URL}/2fa/backup-codes/regenerate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to regenerate backup codes');
  }
  return data;
}

/**
 * Activate account using token from email
 * GET /api/v1/auth/activate?token=<uuid>
 */
export async function activateAccountAPI(token: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/activate?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Activation failed');
    }

    return data;
  } catch (error) {
    console.error('Activation API Error:', error);
    throw error;
  }
}

/**
 * Forgot password - Send 6-digit reset code via email
 * POST /api/v1/auth/forgot-password
 */
export interface ForgotPasswordRequestPayload {
  email: string;
}

export async function forgotPasswordAPI(payload: ForgotPasswordRequestPayload): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send reset code');
    }

    return data;
  } catch (error) {
    console.error('Forgot Password API Error:', error);
    throw error;
  }
}

/**
 * Reset password - Verify reset code and update password
 * POST /api/v1/auth/reset-password
 */
export interface ResetPasswordRequestPayload {
  email: string;
  resetCode: string;
  newPassword: string;
}

export async function resetPasswordAPI(payload: ResetPasswordRequestPayload): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
    }

    return data;
  } catch (error) {
    console.error('Reset Password API Error:', error);
    throw error;
  }
}
