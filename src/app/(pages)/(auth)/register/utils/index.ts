import { AuthResponse, roleMapping, reverseRoleMapping, BackendUserRole } from '../../types';
import type { RegisterPayload } from '../types';
import { signupAPI } from '../../api/auth.api';

/**
 * Call backend registration endpoint with proper role mapping
 */
export async function callBackendRegister(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    // Basic client-side validation
    if (!payload.email || !payload.password || !payload.name) {
      return {
        success: false,
        message: 'Missing required fields',
      };
    }

    // Map frontend role to backend role format
    const backendRole = roleMapping[payload.role];

    // Call the backend API
    const backendResponse = await signupAPI({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: backendRole,
    });

    const status = backendResponse.status;
    const data = backendResponse.data || {};

    // If backend created the user but requires activation (common pattern uses 403 or 202)
    if (status === 403 || status === 202) {
      return {
        success: true,
        message: data.message || 'Account created. Please verify your email to activate your account.',
        user: {
          id: (data.userId ?? data.id ?? '')?.toString?.() ?? '',
          name: data.name ?? payload.name,
          email: data.email ?? payload.email,
          role: reverseRoleMapping[(data.role as BackendUserRole) ?? 'CLIENT'] ?? payload.role,
        },
        error: undefined,
      };
    }

    // Successful immediate activation/creation
    if (status >= 200 && status < 300) {
      const frontendRole = reverseRoleMapping[(data.role as BackendUserRole) ?? 'CLIENT'];
      return {
        success: true,
        message: data.message,
        user: {
          id: data.userId?.toString?.() ?? (data.id?.toString?.() ?? ''),
          name: data.name,
          email: data.email,
          role: frontendRole,
          token: data.token || undefined,
          refreshToken: data.refreshToken || undefined,
        },
      };
    }

    // Other non-success statuses
    return {
      success: false,
      message: data.message || `Signup failed with status ${status}`,
      error: data.error || undefined,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred during registration',
    };
  }
}
