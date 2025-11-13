/**
 * API Client with Authentication
 * Provides utilities for making authenticated API requests
 */

import { getAccessToken, clearTokens } from '../utils/token.utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8088/api';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    requiresAuth = true,
  } = options;

  // Build headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authorization header if required
  if (requiresAuth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  // Build request options
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Add body if present
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

    // Handle 401 Unauthorized - token expired
    if (response.status === 401) {
      clearTokens();
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please login again.');
    }

    // Parse response
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * GET request
 */
export async function apiGet<T = any>(endpoint: string, requiresAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET', requiresAuth });
}

/**
 * POST request
 */
export async function apiPost<T = any>(
  endpoint: string,
  body: any,
  requiresAuth = true
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'POST', body, requiresAuth });
}

/**
 * PUT request
 */
export async function apiPut<T = any>(
  endpoint: string,
  body: any,
  requiresAuth = true
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'PUT', body, requiresAuth });
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(endpoint: string, requiresAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE', requiresAuth });
}

/**
 * PATCH request
 */
export async function apiPatch<T = any>(
  endpoint: string,
  body: any,
  requiresAuth = true
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'PATCH', body, requiresAuth });
}
