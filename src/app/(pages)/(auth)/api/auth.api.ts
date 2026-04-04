/**
 * Authentication API Service
 * Handles all backend authentication API calls
 */

import type { BackendAuthResponse, BackendUserRole } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8088/api/v1/auth';

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
}

export interface LoginRequestPayload {
  email: string;
  password: string;
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
      } catch (err) {
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
