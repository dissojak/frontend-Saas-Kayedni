'use client';

import React from 'react';
import RegisterView from './components/RegisterView';
import { useRegister } from './hooks/useRegister';

export default function RegisterForm() {
  const props = useRegister();
  return <RegisterView {...props} />;
}
