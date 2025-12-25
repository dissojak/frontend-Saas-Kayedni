import type { UserRole } from "../../types";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<User>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<User>;
}
