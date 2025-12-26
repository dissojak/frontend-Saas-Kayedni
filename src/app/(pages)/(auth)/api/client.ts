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
  // Controls fetch credentials mode. If not provided, fetch will not send credentials.
  // Use 'include' when your backend relies on cookies for auth (not the default here).
  credentials?: RequestCredentials;
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
    // Only set credentials when explicitly provided in options
    ...(options.credentials ? { credentials: options.credentials } : {}),
  } as RequestInit;

  // Add body if present
  if (body) {
    if (typeof FormData !== 'undefined' && body instanceof FormData) {
      requestOptions.body = body;
    } else {
      requestHeaders['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
  }

  try {
    // Build final URL: allow callers to pass a full URL or a path
    const url = endpoint.match(/^https?:\/\//i)
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    const response = await fetch(url, requestOptions);

    // Read response text once and attempt to parse JSON
    const text = await response.text();
    let data: any = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (err) {
        // If JSON parse fails, keep raw text in `dataText` for messages
        // and for successful non-JSON responses return the raw text below
      }
    }

    // Handle 401 Unauthorized - token expired
    if (response.status === 401) {
      clearTokens();
      // Redirect to login
      if (typeof globalThis !== 'undefined') {
        try { globalThis.location.href = '/login'; } catch (e) { /* ignore */ }
      }
      throw new Error((data && data.message) || 'Session expired. Please login again.');
    }

    // Handle 403 Forbidden - permission denied
    if (response.status === 403) {
      const message = (data && (data.message || data.error)) || text || `Forbidden (403)`;
      console.warn('API Request Forbidden:', message);
      const err = new Error(message);
      // @ts-ignore
      err.status = 403;
      throw err;
    }

    // For non-JSON successful responses, return raw text
    if (!data && response.ok && text) {
      return text as unknown as T;
    }

    // Handle other error responses
    if (!response.ok) {
      const message = (data && (data.message || data.error)) || `API Error: ${response.status}`;
      const err = new Error(message);
      // @ts-ignore
      err.status = response.status;
      throw err;
    }

    return data as T;
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
