import type { UserRole } from "../../types";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  // Business owner specific fields
  businessId?: string;
  businessName?: string;
  hasBusiness?: boolean;
  // BO acting as staff
  isAlsoStaff?: boolean;
  staffId?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // Whether initial auth state from storage has been loaded
  hydrated: boolean;
  // Active mode for users who are both BO and staff ('owner' | 'staff')
  activeMode: 'owner' | 'staff';
  login: (email: string, password: string, role: UserRole) => Promise<User>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<User>;
  updateUser: (user: User | null) => void;
  switchMode: (mode: 'owner' | 'staff') => Promise<void>;
}
