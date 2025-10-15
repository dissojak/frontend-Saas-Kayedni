'use client';

import React, { useEffect, useState } from 'react';
import type { AuthContextType, User } from './types';
import { loadStoredUser, storeUser } from './utils';
import { fakeLogin, fakeRegister } from './actions';
import { useRouter } from 'next/navigation';

export function useAuthImplementation() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = loadStoredUser();
    if (stored) setUser(stored);
  }, []);

  const login = async (email: string, password: string, role: User['role']) => {
    const u = await fakeLogin(email, password, role);
    setUser(u);
    storeUser(u);
  };

  const register = async (name: string, email: string, password: string, role: User['role']) => {
    const u = await fakeRegister(name, email, password, role);
    setUser(u);
    storeUser(u);
  };

  const logout = () => {
    setUser(null);
    storeUser(null);
    router.push('/');
  };

  const api = { user, isAuthenticated: !!user, login, logout, register } as AuthContextType;
  return api;
}
