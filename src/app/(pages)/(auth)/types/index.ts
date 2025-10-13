export type UserRole = 'client' | 'business' | 'staff' | 'admin';

export interface BaseAuthPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: Record<string, any>;
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
