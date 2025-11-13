/**
 * Authentication Module Exports
 * Central export point for all auth-related utilities
 */

// API Services
export { signupAPI, loginAPI, activateAccountAPI } from './api/auth.api';
export type { SignupRequestPayload, LoginRequestPayload } from './api/auth.api';

// API Client
export {
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPatch,
} from './api/client';

// Token Management
export {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
  getAuthHeader,
} from './utils/token.utils';

// Types
export type {
  UserRole,
  BackendUserRole,
  BaseAuthPayload,
  BackendAuthResponse,
  AuthResponse,
  BaseAuthViewProps,
} from './types';
export { roleMapping, reverseRoleMapping } from './types';

// Context
export { useAuth, AuthProvider } from './context/AuthContext';
export type { User, AuthContextType } from './context/auth/types';
