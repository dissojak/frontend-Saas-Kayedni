import ResetPasswordForm from './components/ResetPasswordForm';
import AuthBackdrop from '../components/AuthBackdrop';

export default function ResetPassword() {
  return (
    <AuthBackdrop>
      <div className="h-[70vh] flex items-center justify-center min-h-screen">
        <div className="w-full max-w-6xl">
          <ResetPasswordForm />
        </div>
      </div>
    </AuthBackdrop>
  );
}
