"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import type { AuthContextType } from './auth/types';
import type { UserRole } from '../types';
import { useAuthImplementation } from './auth/useAuthImplementation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const impl = useAuthImplementation();
  return <AuthContext.Provider value={impl}>{children}</AuthContext.Provider>;
};

export type { UserRole };
