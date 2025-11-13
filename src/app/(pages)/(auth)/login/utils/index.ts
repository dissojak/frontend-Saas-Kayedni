import { AuthResponse, reverseRoleMapping } from '../../types';
import { LoginPayload } from '../types';
import { loginAPI } from '../../api/auth.api';
import { setAccessToken, setRefreshToken } from '../../utils/token.utils';

/**
 * Call backend login endpoint with proper role mapping
 */
export async function callBackendLogin(payload: LoginPayload): Promise<AuthResponse> {
  try {
    // Call the backend API (role is not needed for login, backend determines it)
    const backendResponse = await loginAPI({
      email: payload.email,
      password: payload.password,
    });

    // Check if account needs activation
    if (!backendResponse.token && backendResponse.message.includes('activate')) {
      return {
        success: false,
        message: backendResponse.message,
      };
    }

    // Check if login was successful
    if (backendResponse.token) {
      // Store tokens using token management utilities
      setAccessToken(backendResponse.token);
      if (backendResponse.refreshToken) {
        setRefreshToken(backendResponse.refreshToken);
      }

      // Map backend role to frontend role
      const frontendRole = reverseRoleMapping[backendResponse.role];

      return {
        success: true,
        message: backendResponse.message,
        user: {
          id: backendResponse.userId.toString(),
          name: backendResponse.name,
          email: backendResponse.email,
          role: frontendRole,
          token: backendResponse.token,
          refreshToken: backendResponse.refreshToken || undefined,
        },
      };
    }

    // Fallback error
    return {
      success: false,
      message: backendResponse.message || 'Login failed',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred during login',
    };
  }
}
