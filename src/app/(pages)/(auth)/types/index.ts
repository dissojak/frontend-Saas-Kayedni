// Backend uses uppercase roles: CLIENT, BUSINESS_OWNER, STAFF, ADMIN
export type BackendUserRole = 'CLIENT' | 'BUSINESS_OWNER' | 'STAFF' | 'ADMIN';
export type UserRole = 'client' | 'business' | 'staff' | 'admin';

// Map frontend roles to backend roles
export const roleMapping: Record<UserRole, BackendUserRole> = {
  client: 'CLIENT',
  business: 'BUSINESS_OWNER',
  staff: 'STAFF',
  admin: 'ADMIN',
};

// Map backend roles to frontend roles
export const reverseRoleMapping: Record<BackendUserRole, UserRole> = {
  CLIENT: 'client',
  BUSINESS_OWNER: 'business',
  STAFF: 'staff',
  ADMIN: 'admin',
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
