import ForgotPasswordForm from './components/ForgotPasswordForm';
import AuthBackdrop from '../components/AuthBackdrop';

export default function ForgotPassword() {
  return (
    <AuthBackdrop>
      <div className="h-[70vh] flex items-center justify-center min-h-screen">
        <div className="w-full max-w-6xl">
          <ForgotPasswordForm />
        </div>
      </div>
    </AuthBackdrop>
  );
}
