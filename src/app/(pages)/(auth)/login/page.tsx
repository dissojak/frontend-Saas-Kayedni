import { Suspense } from 'react';
import LoginForm from './components/LoginForm';
import AuthBackdrop from '../components/AuthBackdrop';
import { authT } from '../i18n';
import { DEFAULT_LOCALE } from '@global/lib/locales';

export default function Login() {
  return (
    <AuthBackdrop>
      <div className="h-[70vh] flex items-center justify-center min-h-screen">
        <div className="w-full max-w-6xl">
          <Suspense fallback={<div>{authT(DEFAULT_LOCALE, 'common_loading')}</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </AuthBackdrop>
  );
}
