"use client";

import { useSearchParams } from 'next/navigation';
import RegisterForm from './RegisterForm';
import AuthBackdrop from '../components/AuthBackdrop';

export default function Page() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('type');
  
  return (
    <AuthBackdrop>
      <div className="h-[70vh] flex items-center justify-center min-h-screen">
        <div className="w-full">
          <RegisterForm defaultRole={userType === 'business' ? 'BUSINESS_OWNER' : 'CLIENT'} />
        </div>
      </div>
    </AuthBackdrop>
  );
}