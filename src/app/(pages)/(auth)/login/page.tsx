import { Suspense } from 'react';
import LoginForm from './components/LoginForm';
import AuthBackdrop from '../components/AuthBackdrop';

export default function Login() {
  return (
    <AuthBackdrop>
      <div className="h-[70vh] flex items-center justify-center min-h-screen">
        <div className="w-full max-w-6xl">
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </AuthBackdrop>
  );
}
