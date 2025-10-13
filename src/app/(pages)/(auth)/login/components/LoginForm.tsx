"use client";

import React from 'react';
import LoginView from './LoginView';
import { useLogin } from '../hooks/useLogin';

export default function LoginForm() {
  const props = useLogin();

  return (
    <LoginView
      {...props}
      onSubmit={props.submit}
    />
  );
}
