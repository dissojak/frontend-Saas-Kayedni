'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { AuthContextType, User } from './types';
import { loadStoredUser, storeUser, loadStoredToken, loadStoredActiveMode, storeActiveMode } from './utils';
import { login as backendLogin, register as backendRegister } from './actions';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api';

function parseJwtExpMs(token: string | null): number | null {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;

    const payload = JSON.parse(atob(parts[1]));
    if (!payload?.exp) return null;
    return Number(payload.exp) * 1000;
  } catch {
    return null;
  }
}

export function useAuthImplementation() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'owner' | 'staff'>('owner');
  const [hydrated, setHydrated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const stored = loadStoredUser();
    const storedToken = loadStoredToken();
    const storedMode = loadStoredActiveMode();
    if (stored) setUser(stored);
    if (storedToken) setToken(storedToken);
    if (storedMode) setActiveMode(storedMode);
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
      
      // Reset to owner mode on login (will switch if needed)
      if (u.isAlsoStaff) {
        setActiveMode('owner');
        storeActiveMode('owner');
      }
      
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

  const logout = useCallback(() => {
    updateUser(null);
    setToken(null);
    setActiveMode('owner');
    storeUser(null);
    router.push('/');
  }, [router, updateUser]);

  // Auto-logout when JWT is expired (covers routes not using shared api client)
  useEffect(() => {
    if (!token) return;

    const checkExpiry = () => {
      const expMs = parseJwtExpMs(token);
      if (!expMs) return;

      if (Date.now() >= expMs) {
        logout();
      }
    };

    checkExpiry();
    const timer = globalThis.setInterval(checkExpiry, 15000);
    return () => globalThis.clearInterval(timer);
  }, [token, logout]);

  // Auto-logout when shared API client detects unauthorized/expired token
  useEffect(() => {
    const onSessionExpired = () => {
      logout();
      router.push('/login');
    };

    globalThis.addEventListener('auth:session-expired', onSessionExpired);
    return () => globalThis.removeEventListener('auth:session-expired', onSessionExpired);
  }, [logout, router]);

  const switchMode = async (mode: 'owner' | 'staff') => {
    if (!user?.isAlsoStaff) {
      throw new Error('Cannot switch mode: user is not a staff member');
    }

    try {
      // Call backend to validate and log the switch
      const response = await fetch(`${API_BASE_URL}/v1/auth/switch-context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ activeMode: mode }),
      });

      if (!response.ok) {
        throw new Error('Failed to switch context');
      }

      // Update frontend state
      setActiveMode(mode);
      storeActiveMode(mode);
    } catch (error) {
      console.error('Error switching mode:', error);
      throw error;
    }
  };

  const api = {
    user,
    token,
    isAuthenticated: !!user,
    hydrated,
    activeMode,
    login,
    logout,
    register,
    updateUser,
    switchMode,
  } as AuthContextType;
  return api;
}
