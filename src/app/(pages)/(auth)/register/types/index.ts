import { BaseAuthPayload, BaseAuthViewProps } from '../../types';

export interface RegisterPayload extends BaseAuthPayload {
  name: string;
  business?: {
    name: string;
    location: string;
    phone?: string;
    email?: string;
    description?: string;
    categoryId: number;
    otherIndustryFeedback?: {
      industryName: string;
      description: string;
      phoneNumber: string;
      sourceSlug?: string;
      sourceCategoryName?: string;
      contactEmail?: string;
    };
  };
}

export interface RegisterBusinessCategory {
  id: number;
  name: string;
}

export interface RegisterViewProps extends BaseAuthViewProps {
  onSubmit: (finalize?: boolean) => Promise<void>;
  name: string;
  setName: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  acceptedTerms: boolean;
  setAcceptedTerms: (v: boolean) => void;
  currentStep: 1 | 2 | 3 | 4;
  goToBusinessStep: () => void;
  goToAccountStep: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  registered?: boolean;
  registrationMessage?: string | null;
  registeredEmail?: string | null;
  businessName: string;
  setBusinessName: (v: string) => void;
  businessLocation: string;
  setBusinessLocation: (v: string) => void;
  businessCategoryId: string;
  setBusinessCategoryId: (v: string) => void;
  businessPhone: string;
  setBusinessPhone: (v: string) => void;
  businessEmail: string;
  setBusinessEmail: (v: string) => void;
  businessDescription: string;
  setBusinessDescription: (v: string) => void;
  otherIndustryName: string;
  setOtherIndustryName: (v: string) => void;
  otherIndustryDescription: string;
  setOtherIndustryDescription: (v: string) => void;
  isOtherCategorySelected: boolean;
  categories: RegisterBusinessCategory[];
  intendedIndustryLabel?: string;
}
