"use client";

import RegisterForm from './RegisterForm';
import AuthBackdrop from '../components/AuthBackdrop';

export default function Page() {
  return (
    <AuthBackdrop>
      <div className="h-[70vh] flex items-center justify-center min-h-screen">
        <div className="w-full">
          <RegisterForm />
        </div>
      </div>
    </AuthBackdrop>
  );
}