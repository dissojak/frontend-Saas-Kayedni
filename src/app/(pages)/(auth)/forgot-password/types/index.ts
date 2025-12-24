export interface ForgotPasswordViewProps {
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  error: string | null;
  success: boolean;
  onSubmit: () => Promise<void>;
}

export interface ForgotPasswordPayload {
  email: string;
}
