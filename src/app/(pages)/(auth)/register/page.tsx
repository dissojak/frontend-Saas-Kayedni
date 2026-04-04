"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RegisterForm from './RegisterForm';
import AuthBackdrop from '../components/AuthBackdrop';

function RegisterContent() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('type');

  return (
    <AuthBackdrop>
      <div className="h-[70vh] flex items-center justify-center min-h-screen">
        <div className="w-full max-w-6xl">
          <RegisterForm defaultRole={userType === 'business' ? 'BUSINESS_OWNER' : 'CLIENT'} />
        </div>
      </div>
    </AuthBackdrop>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}