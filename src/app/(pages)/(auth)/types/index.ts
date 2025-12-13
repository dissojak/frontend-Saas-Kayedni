// Backend uses uppercase roles: CLIENT, BUSINESS_OWNER, STAFF, ADMIN
export type BackendUserRole = 'CLIENT' | 'BUSINESS_OWNER' | 'STAFF' | 'ADMIN';
// Frontend will now use the same uppercase role values as the backend
export type UserRole = 'CLIENT' | 'BUSINESS_OWNER' | 'STAFF' | 'ADMIN';

// Map frontend roles to backend roles (identity for most, kept explicit for clarity)
export const roleMapping: Record<UserRole, BackendUserRole> = {
  CLIENT: 'CLIENT',
  BUSINESS_OWNER: 'BUSINESS_OWNER',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
};

// Map backend roles to frontend roles (identity mapping)
export const reverseRoleMapping: Record<BackendUserRole, UserRole> = {
  CLIENT: 'CLIENT',
  BUSINESS_OWNER: 'BUSINESS_OWNER',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
};

export interface BaseAuthPayload {
  email: string;
  password: string;
  role: UserRole;
}

// Backend API Response structure
export interface BackendAuthResponse {
  token: string | null;
  refreshToken: string | null;
  userId: number;
  name: string;
  email: string;
  role: BackendUserRole;
  message: string;
}

// Frontend Auth Response
export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    token?: string;
    refreshToken?: string;
  };
  error?: string;
}

export interface BaseAuthViewProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  role: UserRole;
  setRole: (r: UserRole) => void;
  loading: boolean;
  error: string | null;
  onSubmit: () => Promise<void> | void;
}
