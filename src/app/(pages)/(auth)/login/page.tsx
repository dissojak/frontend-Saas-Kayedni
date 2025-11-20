import LoginForm from './components/LoginForm';

export default function Login() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="w-full max-w-3xl px-4">
        <LoginForm />
      </div>
    </div>
  );
}
