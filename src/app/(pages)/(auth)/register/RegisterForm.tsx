'use client';

import React from 'react';
import RegisterView from './components/RegisterView';
import { useRegister } from './hooks/useRegister';
import type { UserRole } from '../../types';

interface RegisterFormProps {
  defaultRole?: UserRole;
}

export default function RegisterForm({ defaultRole = 'CLIENT' }: RegisterFormProps) {
  const props = useRegister(defaultRole);
  return <RegisterView {...props} />;
}

