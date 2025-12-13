"use client";

import React from 'react';
import AdminLoginView from './components/AdminLoginView';
import { useAdminLogin } from './hooks/useAdminLogin';

export default function AdminLoginPage() {
  const { email, setEmail, password, setPassword, loading, error, submit } = useAdminLogin();

  return (
    <AdminLoginView
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      loading={loading}
      error={error}
      onSubmit={submit}
    />
  );
}
