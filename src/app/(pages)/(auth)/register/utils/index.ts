import { AuthResponse, roleMapping, reverseRoleMapping } from '../../types';
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
        message: 'Missing required fields' 
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

    // Map backend role to frontend role
    const frontendRole = reverseRoleMapping[backendResponse.role];

    // Registration successful - user needs to activate account via email
    return {
      success: true,
      message: backendResponse.message,
      user: {
        id: backendResponse.userId.toString(),
        name: backendResponse.name,
        email: backendResponse.email,
        role: frontendRole,
        token: backendResponse.token || undefined,
        refreshToken: backendResponse.refreshToken || undefined,
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred during registration',
    };
  }
}
