"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { callBackendRegister } from "../utils";
import type { UserRole } from "../../types";
import { useTracking } from "@global/hooks/useTracking";
import { logAuthEvent } from "@global/lib/authLogger";
import { searchCategories } from "@global/lib/api/business.api";
import { categoryNameFromSlug, normalizeCategorySlug } from "@global/lib/slices";
import { useLocale } from "@global/hooks/useLocale";
import { authT } from "@/(pages)/(auth)/i18n";

interface BusinessCategoryOption {
  id: number;
  name: string;
}

const OTHER_CATEGORY_VALUE = "__OTHER__";
const OTHER_CATEGORY_ID = 25;

export function useRegister(defaultRole: UserRole = "CLIENT") {
  const { trackEvent } = useTracking();
  const { locale } = useLocale();
  const tr = (key: Parameters<typeof authT>[1]) => authT(locale, key);
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [businessName, setBusinessName] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [businessCategoryId, setBusinessCategoryId] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [otherIndustryName, setOtherIndustryName] = useState("");
  const [otherIndustryDescription, setOtherIndustryDescription] = useState("");
  const [categories, setCategories] = useState<BusinessCategoryOption[]>([]);

  const intendedCategorySlug = normalizeCategorySlug(searchParams.get("category"));
  const intendedIndustryLabel = useMemo(
    () => categoryNameFromSlug(intendedCategorySlug) ?? undefined,
    [intendedCategorySlug],
  );
  const landingSourceSlug = useMemo(
    () => (intendedCategorySlug && intendedCategorySlug !== "generic" ? intendedCategorySlug : undefined),
    [intendedCategorySlug],
  );
  const landingSourceName = useMemo(
    () => (landingSourceSlug ? (intendedIndustryLabel ?? categoryNameFromSlug(landingSourceSlug) ?? undefined) : undefined),
    [landingSourceSlug, intendedIndustryLabel],
  );
  const isOtherCategorySelected = businessCategoryId === OTHER_CATEGORY_VALUE;
  const selectedCategoryName = useMemo(() => {
    if (role !== "BUSINESS_OWNER") {
      return undefined;
    }

    if (isOtherCategorySelected) {
      return "Other";
    }

    const parsedCategoryId = Number.parseInt(businessCategoryId, 10);
    if (!parsedCategoryId || Number.isNaN(parsedCategoryId)) {
      return undefined;
    }

    return categories.find((item) => item.id === parsedCategoryId)?.name;
  }, [businessCategoryId, categories, isOtherCategorySelected, role]);

  useEffect(() => {
    if (role !== "BUSINESS_OWNER") {
      setCurrentStep(1);
      return;
    }

    let cancelled = false;

    const loadCategories = async () => {
      try {
        const found = await searchCategories(undefined, 50);
        if (cancelled) {
          return;
        }

        const uniqueById = new Map<number, BusinessCategoryOption>();
        for (const item of found) {
          uniqueById.set(item.id, { id: item.id, name: item.name });
        }
        setCategories(Array.from(uniqueById.values()));
      } catch {
        if (!cancelled) {
          setCategories([]);
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, [role]);

  useEffect(() => {
    if (role !== "BUSINESS_OWNER" || !categories.length || businessCategoryId) {
      return;
    }

    const normalizedIntended = intendedIndustryLabel?.trim().toLowerCase();
    if (normalizedIntended && normalizedIntended !== "generic") {
      const matched = categories.find((item) => item.name.trim().toLowerCase() === normalizedIntended);
      if (matched) {
        setBusinessCategoryId(String(matched.id));
        return;
      }

      // If incoming niche doesn't exist in available categories, route user through Flow B.
      setBusinessCategoryId(OTHER_CATEGORY_VALUE);
      return;
    }

    setBusinessCategoryId(String(categories[0].id));
  }, [businessCategoryId, categories, intendedIndustryLabel, role]);

  const reportValidationError = (message: string, field: string, reason: string) => {
    setError(message);
    trackEvent("signup_validation_error", {
      field,
      reason,
      role,
    });
    logAuthEvent({
      action: "signup_validation_error",
      success: false,
      failReason: reason,
      failStage: "validation",
      email,
      role,
    });
  };

  const validateBasicSignup = (): boolean => {
    if (password !== confirmPassword) {
      reportValidationError(tr("error_register_passwords_mismatch"), "confirm_password", "passwords_dont_match");
      return false;
    }

    if (!acceptedTerms) {
      reportValidationError(tr("error_register_accept_terms"), "terms", "terms_not_accepted");
      return false;
    }

    return true;
  };

  const validateBusinessRequiredStep = (): boolean => {
    if (role !== "BUSINESS_OWNER") {
      return true;
    }

    if (!businessName.trim()) {
      reportValidationError(tr("error_register_business_name_required"), "business_name", "business_name_required");
      return false;
    }

    if (!businessLocation.trim()) {
      reportValidationError(tr("error_register_business_location_required"), "business_location", "business_location_required");
      return false;
    }

    if (!businessCategoryId) {
      reportValidationError(tr("error_register_business_category_required"), "business_category", "business_category_required");
      return false;
    }

    return true;
  };

  const validateOptionalStep = (): boolean => {
    if (businessPhone.trim() && (businessPhone.trim().length < 8 || businessPhone.trim().length > 20)) {
      reportValidationError(tr("error_register_phone_length"), "business_phone", "business_phone_invalid_length");
      return false;
    }

    return true;
  };

  const validateOtherIndustryStep = (): boolean => {
    if (!isOtherCategorySelected) {
      return true;
    }

    if (!otherIndustryName.trim()) {
      reportValidationError(tr("error_register_industry_name_required"), "other_industry_name", "other_industry_name_required");
      return false;
    }

    if (!otherIndustryDescription.trim()) {
      reportValidationError(tr("error_register_industry_description_required"), "other_industry_description", "other_industry_description_required");
      return false;
    }

    if (!businessPhone.trim()) {
      reportValidationError(tr("error_register_phone_required_other"), "business_phone", "other_industry_phone_required");
      return false;
    }

    if (businessPhone.trim().length < 8 || businessPhone.trim().length > 20) {
      reportValidationError(tr("error_register_phone_length"), "business_phone", "other_industry_phone_invalid_length");
      return false;
    }

    return true;
  };

  const goToBusinessStep = () => {
    setError(null);
    if (!validateBasicSignup()) {
      return;
    }

    setCurrentStep(2);
  };

  const goToAccountStep = () => {
    setError(null);
    setCurrentStep(1);
  };

  const goToNextStep = () => {
    setError(null);

    if (role !== "BUSINESS_OWNER") {
      return;
    }

    if (currentStep === 1) {
      goToBusinessStep();
      return;
    }

    if (currentStep === 2) {
      if (!validateBusinessRequiredStep()) {
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!validateOptionalStep()) {
        return;
      }

      if (isOtherCategorySelected) {
        setCurrentStep(4);
      }
    }
  };

  const goToPreviousStep = () => {
    setError(null);

    if (role !== "BUSINESS_OWNER") {
      return;
    }

    if (currentStep === 4) {
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  async function onSubmit(finalize = false) {
    setError(null);

    if (!finalize) {
      if (role === "BUSINESS_OWNER") {
        goToNextStep();
      }
      return;
    }

    if (role === "BUSINESS_OWNER") {
      const isFinalBusinessStep =
        (currentStep === 3 && !isOtherCategorySelected) ||
        (currentStep === 4 && isOtherCategorySelected);

      // Guard against implicit form submits (e.g. Enter key) before final step.
      if (!isFinalBusinessStep) {
        goToNextStep();
        return;
      }

      if (!validateBasicSignup() || !validateBusinessRequiredStep() || !validateOptionalStep()) {
        return;
      }

      if (isOtherCategorySelected && !validateOtherIndustryStep()) {
        return;
      }
    } else if (!validateBasicSignup()) {
      return;
    }

    let selectedCategoryMode: "none" | "standard" | "other" = "none";
    let selectedCategoryId: string | undefined;

    setLoading(true);
    logAuthEvent({ action: 'signup_attempt', success: false, email, role });
    try {
      const resolvedCategoryId = isOtherCategorySelected
        ? OTHER_CATEGORY_ID
        : Number.parseInt(businessCategoryId, 10);

      if (role === "BUSINESS_OWNER") {
        selectedCategoryMode = isOtherCategorySelected ? "other" : "standard";
        selectedCategoryId = isOtherCategorySelected ? OTHER_CATEGORY_VALUE : String(resolvedCategoryId);
      }

      if (role === "BUSINESS_OWNER" && (!resolvedCategoryId || Number.isNaN(resolvedCategoryId))) {
        throw new Error(tr("error_register_no_fallback_category"));
      }

      const payload = {
        name,
        email,
        password,
        role,
        business: role === "BUSINESS_OWNER"
          ? {
              name: businessName.trim(),
              location: businessLocation.trim(),
              categoryId: resolvedCategoryId,
              phone: businessPhone.trim() || undefined,
              email: businessEmail.trim() || undefined,
              description: (businessDescription.trim() || otherIndustryDescription.trim()) || undefined,
              otherIndustryFeedback: isOtherCategorySelected
                ? {
                    industryName: otherIndustryName.trim(),
                    description: otherIndustryDescription.trim(),
                    phoneNumber: businessPhone.trim(),
                    sourceSlug: landingSourceSlug,
                    sourceCategoryName: landingSourceName,
                    contactEmail: email.trim() || undefined,
                  }
                : undefined,
            }
          : undefined,
      };
      const res = await callBackendRegister(payload);
      
      if (res.success && res.user) {
        // Registration successful — do NOT auto-login. User must verify email first.
        setRegistered(true);
        setRegisteredEmail(res.user.email ?? null);
        setRegistrationMessage(res.message ?? tr('register_success_check_email'));
        if (role === "BUSINESS_OWNER" && isOtherCategorySelected) {
          trackEvent("industry_feedback_submitted", {
            source: "signup",
            role,
            sourceSlice: landingSourceSlug ?? "generic",
            landingSourceSlug: landingSourceSlug ?? "generic",
            landingSourceName: landingSourceName ?? "Generic",
            selectedCategoryMode: "other",
            selectedCategoryId: OTHER_CATEGORY_VALUE,
            selectedCategoryName: "Other",
          });
        }
        trackEvent('signup', {
          method: 'email',
          role,
          landingSourceSlug: landingSourceSlug ?? "generic",
          landingSourceName: landingSourceName ?? "Generic",
          selectedCategoryMode,
          selectedCategoryId,
          selectedCategoryName,
        });
        logAuthEvent({ action: 'signup_success', success: true, email, role });
      } else {
        setError(res.message ?? tr("error_register_failed"));
        trackEvent('signup_failed', {
          reason: res.message ?? 'registration_failed',
          role,
          error_type: 'api_error',
          landingSourceSlug: landingSourceSlug ?? "generic",
          landingSourceName: landingSourceName ?? "Generic",
          selectedCategoryMode,
          selectedCategoryName,
        });
        logAuthEvent({ action: 'signup_failed', success: false, failReason: res.message ?? 'registration_failed', failStage: 'api', email, role });
      }
    } catch (err) {
      const msg = (err as Error)?.message ?? "Unknown error";
      setError(msg);

      trackEvent('signup_failed', {
        reason: msg,
        role,
        error_type: 'network_or_server_error',
        landingSourceSlug: landingSourceSlug ?? "generic",
        landingSourceName: landingSourceName ?? "Generic",
        selectedCategoryMode,
        selectedCategoryName,
      });
      logAuthEvent({ action: 'signup_failed', success: false, failReason: msg, failStage: 'network_error', email, role });
    } finally {
      setLoading(false);
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    role,
    setRole,
    acceptedTerms,
    setAcceptedTerms,
    loading,
    error,
    registered,
    registrationMessage,
    registeredEmail,
    currentStep,
    goToBusinessStep,
    goToAccountStep,
    goToNextStep,
    goToPreviousStep,
    businessName,
    setBusinessName,
    businessLocation,
    setBusinessLocation,
    businessCategoryId,
    setBusinessCategoryId,
    businessPhone,
    setBusinessPhone,
    businessEmail,
    setBusinessEmail,
    businessDescription,
    setBusinessDescription,
    otherIndustryName,
    setOtherIndustryName,
    otherIndustryDescription,
    setOtherIndustryDescription,
    isOtherCategorySelected,
    categories,
    intendedIndustryLabel,
    onSubmit,
  } as const;
}
