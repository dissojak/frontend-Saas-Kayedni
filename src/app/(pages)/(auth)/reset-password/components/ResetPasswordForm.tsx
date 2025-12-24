"use client";

import React from 'react';
import ResetPasswordView from './ResetPasswordView';
import { useResetPassword } from '../hooks/useResetPassword';

export default function ResetPasswordForm() {
  const props = useResetPassword();

  return (
    <ResetPasswordView
      {...props}
      onSubmit={props.submit}
    />
  );
}
