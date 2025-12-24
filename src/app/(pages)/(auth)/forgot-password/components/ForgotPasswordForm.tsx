"use client";

import React from 'react';
import ForgotPasswordView from './ForgotPasswordView';
import { useForgotPassword } from '../hooks/useForgotPassword';

export default function ForgotPasswordForm() {
  const props = useForgotPassword();

  return (
    <ForgotPasswordView
      {...props}
      onSubmit={props.submit}
    />
  );
}
