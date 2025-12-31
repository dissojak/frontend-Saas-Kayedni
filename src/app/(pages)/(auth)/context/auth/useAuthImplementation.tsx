'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { AuthContextType, User } from './types';
import { loadStoredUser, storeUser, loadStoredToken } from './utils';
import { login as backendLogin, register as backendRegister } from './actions';
import { useRouter } from 'next/navigation';

export function useAuthImplementation() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const stored = loadStoredUser();
    const storedToken = loadStoredToken();
    if (stored) setUser(stored);
    if (storedToken) setToken(storedToken);
    // mark that initial load from storage is complete
    setHydrated(true);
  }, []);

  const updateUser = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    storeUser(nextUser);
  }, []);

  const login = async (email: string, password: string, role: User['role']) => {
    try {
      const u = await backendLogin(email, password, role);
      updateUser(u);
      // Load token after login (it's stored by the apiPost function)
      const newToken = loadStoredToken();
      setToken(newToken);
      return u;
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, role: User['role']) => {
    try {
      const u = await backendRegister(name, email, password, role);
      updateUser(u);
      // Load token after register
      const newToken = loadStoredToken();
      setToken(newToken);
      return u;
    } catch (err) {
      console.error('Register failed', err);
      throw err;
    }
  };

  const logout = () => {
    updateUser(null);
    setToken(null);
    storeUser(null);
    router.push('/');
  };

  const api = { user, token, isAuthenticated: !!user, hydrated, login, logout, register, updateUser } as AuthContextType;
  return api;
}
