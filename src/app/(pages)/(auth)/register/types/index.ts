import { BaseAuthPayload, BaseAuthViewProps } from '../../types';

export interface RegisterPayload extends BaseAuthPayload {
  name: string;
}

export interface RegisterViewProps extends BaseAuthViewProps {
  name: string;
  setName: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  acceptedTerms: boolean;
  setAcceptedTerms: (v: boolean) => void;
  registered?: boolean;
  registrationMessage?: string | null;
  registeredEmail?: string | null;
}
