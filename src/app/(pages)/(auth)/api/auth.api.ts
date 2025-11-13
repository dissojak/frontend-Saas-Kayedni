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
}

export interface LoginRequestPayload {
  email: string;
  password: string;
}

/**
 * Signup - Register a new user
 * POST /api/v1/auth/signup
 */
export async function signupAPI(payload: SignupRequestPayload): Promise<BackendAuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return data;
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
