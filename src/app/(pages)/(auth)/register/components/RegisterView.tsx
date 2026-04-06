"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";
import { Textarea } from "@components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import type { RegisterViewProps } from "../types";
import { useSearchParams } from "next/navigation";
import { withCategoryQuery } from "@global/lib/slices";
import { useLocale } from "@global/hooks/useLocale";
import { authT } from "@/(pages)/(auth)/i18n";

export default function RegisterView({
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
  onSubmit,
  currentStep,
  goToBusinessStep,
  goToAccountStep,
  goToNextStep,
  goToPreviousStep,
  registered,
  registrationMessage,
  registeredEmail,
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
}: Readonly<RegisterViewProps>) {
  const { locale } = useLocale();
  const tr = (key: Parameters<typeof authT>[1]) => authT(locale, key);
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const loginHref = categoryParam ? withCategoryQuery("/login", categoryParam) : "/login";

  const isBusinessOwner = role === "BUSINESS_OWNER";
  const isStep1 = !isBusinessOwner || currentStep === 1;
  const isStep2 = isBusinessOwner && currentStep === 2;
  const isStep3 = isBusinessOwner && currentStep === 3;
  const isStep4 = isBusinessOwner && currentStep === 4;
  const isFinalBusinessStep = isBusinessOwner && ((currentStep === 3 && !isOtherCategorySelected) || currentStep === 4);
  const visibleSteps = isOtherCategorySelected ? [1, 2, 3, 4] : [1, 2, 3];
  const stepGridClass = visibleSteps.length === 4 ? "grid-cols-4" : "grid-cols-3";

  type StepStatus = "active" | "done" | "upcoming";

  const resolveStepStatus = (stepNumber: number): StepStatus => {
    if (stepNumber === currentStep) {
      return "active";
    }

    if (currentStep > stepNumber) {
      return "done";
    }

    return "upcoming";
  };

  const getStepChipClass = (status: StepStatus): string => {
    if (status === "active") {
      return "border-[var(--color-primary)] bg-[var(--color-primary)]/28 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)]";
    }

    if (status === "done") {
      return "border-emerald-300/70 bg-emerald-500/24 text-emerald-100";
    }

    return "border-white/25 bg-white/10 text-white/80";
  };

  const getStepBadgeClass = (status: StepStatus): string => {
    if (status === "active") {
      return "bg-white/25 text-white";
    }

    if (status === "done") {
      return "bg-emerald-500 text-white";
    }

    return "bg-white/18 text-white/75";
  };

  const getStepLabel = (stepNumber: number): string => {
    if (stepNumber === 1) {
      return tr("register_step_owner");
    }
    if (stepNumber === 2) {
      return tr("register_step_business");
    }
    if (stepNumber === 3) {
      return tr("register_step_optional");
    }
    return tr("register_step_request");
  };

  const getPrimaryActionLabel = (): string => {
    if (loading) {
      return tr("register_creating_account");
    }
    if (isFinalBusinessStep) {
      return tr("register_create_owner_business");
    }
    return tr("register_create_account");
  };

  return (
    <div className="text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[28px] shadow-[0_25px_80px_rgba(15,23,42,0.35)] border border-white/10 dark:border-slate-800 bg-white/5 backdrop-blur-xl">
          <div className="relative h-full min-h-[300px] flex items-center order-2">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b]" />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.28), transparent 32%), radial-gradient(circle at 80% 25%, rgba(56, 189, 248, 0.24), transparent 32%), radial-gradient(circle at 60% 70%, rgba(244, 114, 182, 0.24), transparent 30%), radial-gradient(circle at 30% 80%, rgba(14, 165, 233, 0.18), transparent 35%)",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.08),transparent_32%)]" />
            <div className="relative z-10 flex flex-col gap-10 px-10 py-12 text-white">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                  <Image src="/assets/KayedniLogo.png" alt="kayedni Logo" width={28} height={28} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">{tr("auth_brand_os")}</p>
                  <h1 className="text-2xl font-semibold">{tr("register_hero_title")}</h1>
                </div>
              </div>

              <div className="space-y-4 max-w-lg">
                <p className="text-4xl sm:text-5xl font-bold leading-tight">{tr("register_start_confidence")}</p>
                <p className="text-sm text-white/80">
                  {tr("register_hero_desc")}
                </p>
                {isBusinessOwner && !registered && (
                  <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                    <div className={`grid w-full gap-2 text-xs sm:text-sm font-medium text-white/90 ${stepGridClass}`}>
                      {visibleSteps.map((stepNumber) => {
                        const label = getStepLabel(stepNumber);
                        const status = resolveStepStatus(stepNumber);

                        return (
                          <span
                            key={stepNumber}
                            className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-2 py-1.5 transition-colors ${getStepChipClass(status)}`}
                          >
                            <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${getStepBadgeClass(status)}`}>
                              {status === "done" ? "✓" : stepNumber}
                            </span>
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-white/80">
                  <span className="rounded-full bg-white/10 px-3 py-1">{tr("register_step_flow")}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">{tr("login_secure_design")}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">{tr("register_fast_onboarding")}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-white/75">
                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">★</div>
                <div>
                  <p className="font-semibold">{tr("auth_trusted_title")}</p>
                  <p className="text-white/60">{tr("auth_trusted_desc")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 order-1">
            <div className="h-full p-8 sm:p-10 flex flex-col justify-center">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{tr("register_create_account")}</p>
                  <h2 className="text-2xl font-semibold">{tr("register_join_kayedni")}</h2>
                </div>
                <Link
                  href={loginHref}
                  className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:text-slate-100 dark:hover:border-slate-700"
                >
                  {tr("register_have_one")}{" "}
                  <span className="text-[var(--color-primary)]">{tr("login_submit")}</span>
                </Link>
              </div>

              {registered ? (
                <div>
                  {isBusinessOwner && (
                    <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/70 dark:bg-emerald-900/25">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                          ✓
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">{tr("register_steps_completed")}</p>
                          <p className="text-xs text-emerald-700/90 dark:text-emerald-300/90">{tr("register_owner_details_complete")}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold">{tr("register_check_email")}</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {registrationMessage ?? tr("register_verify_email")}
                    </p>
                    {registeredEmail && (
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {tr("register_sent_to")} <strong>{registeredEmail}</strong>
                      </p>
                    )}
                    <div className="mt-6 flex justify-center gap-3">
                      <Link
                        href={loginHref}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-primary)] text-white shadow-md"
                      >
                        {tr("common_go_to_login")}
                      </Link>
                      <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:text-slate-200"
                      >
                        {tr("register_home")}
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-900/30 dark:text-red-200" role="alert" aria-live="assertive">
                      {error}
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                    className="space-y-5"
                  >
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-medium text-slate-800 dark:text-white">{tr("register_account_type")}</span>
                      <button
                        type="button"
                        onClick={() => setRole("CLIENT")}
                        className={`rounded-full border px-3 py-1 transition ${role === "CLIENT" ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700"}`}
                      >
                        {tr("register_personal")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("BUSINESS_OWNER")}
                        className={`rounded-full border px-3 py-1 transition ${role === "BUSINESS_OWNER" ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700"}`}
                      >
                        {tr("register_business")}
                      </button>
                    </div>

                    {isStep1 && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">{tr("register_full_name")}</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder={tr("register_name_placeholder")}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">{tr("login_email")}</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={tr("login_email_placeholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">{tr("login_password")}</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              minLength={8}
                              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">{tr("register_confirm")}</Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              placeholder="••••••••"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="flex items-start gap-3 pt-1">
                          <Checkbox
                            id="terms"
                            checked={acceptedTerms}
                            onCheckedChange={(checked) => setAcceptedTerms(Boolean(checked))}
                            className="mt-1 border-slate-300 data-[state=checked]:bg-[var(--color-primary)] data-[state=checked]:text-white dark:border-slate-700"
                          />
                          <Label htmlFor="terms" className="text-sm leading-relaxed">
                            {tr("register_terms_prefix")} {" "}
                            <Link href="/terms" className="text-[var(--color-primary)] hover:underline">
                              {tr("register_terms")}
                            </Link>{" "}
                            {tr("register_and")} {" "}
                            <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">
                              {tr("register_privacy")}
                            </Link>
                          </Label>
                        </div>
                      </>
                    )}

                    {isStep2 && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="businessName" className="text-sm font-medium">{tr("register_business_name")}</Label>
                          <Input
                            id="businessName"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder={tr("register_business_name_placeholder")}
                            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessLocation" className="text-sm font-medium">{tr("register_business_location")}</Label>
                          <Input
                            id="businessLocation"
                            value={businessLocation}
                            onChange={(e) => setBusinessLocation(e.target.value)}
                            placeholder={tr("register_business_location_placeholder")}
                            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessCategory" className="text-sm font-medium">{tr("register_business_category")}</Label>
                          <Select value={businessCategoryId} onValueChange={setBusinessCategoryId}>
                            <SelectTrigger
                              id="businessCategory"
                              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                              <SelectValue placeholder={tr("register_select_category")} />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={String(category.id)}>
                                  {category.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="__OTHER__">{tr("register_other_not_listed")}</SelectItem>
                            </SelectContent>
                          </Select>
                          {intendedIndustryLabel && intendedIndustryLabel.toLowerCase() !== "generic" && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {tr("register_preselected_prefix")} <strong>{intendedIndustryLabel}</strong> {tr("register_preselected_suffix")}
                            </p>
                          )}
                          {isOtherCategorySelected && (
                            <p className="text-xs text-amber-600 dark:text-amber-300">
                              {tr("register_category_not_found")}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {isStep3 && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="businessPhone" className="text-sm font-medium">{tr("register_phone_optional")}</Label>
                          <Input
                            id="businessPhone"
                            value={businessPhone}
                            onChange={(e) => setBusinessPhone(e.target.value)}
                            placeholder={tr("register_phone_placeholder")}
                            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessEmail" className="text-sm font-medium">{tr("register_business_email_optional")}</Label>
                          <Input
                            id="businessEmail"
                            type="email"
                            value={businessEmail}
                            onChange={(e) => setBusinessEmail(e.target.value)}
                            placeholder={tr("register_business_email_placeholder")}
                            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessDescription" className="text-sm font-medium">{tr("register_description_optional")}</Label>
                          <Textarea
                            id="businessDescription"
                            value={businessDescription}
                            onChange={(e) => setBusinessDescription(e.target.value)}
                            placeholder={tr("register_description_placeholder")}
                            className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>
                      </>
                    )}

                    {isStep4 && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="otherIndustryName" className="text-sm font-medium">{tr("register_actual_industry_name")}</Label>
                          <Input
                            id="otherIndustryName"
                            value={otherIndustryName}
                            onChange={(e) => setOtherIndustryName(e.target.value)}
                            placeholder={tr("register_actual_industry_placeholder")}
                            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="otherIndustryDescription" className="text-sm font-medium">{tr("register_describe_industry")}</Label>
                          <Textarea
                            id="otherIndustryDescription"
                            value={otherIndustryDescription}
                            onChange={(e) => setOtherIndustryDescription(e.target.value)}
                            placeholder={tr("register_describe_industry_placeholder")}
                            className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessPhone" className="text-sm font-medium">{tr("register_phone_required_followup")}</Label>
                          <Input
                            id="businessPhone"
                            value={businessPhone}
                            onChange={(e) => setBusinessPhone(e.target.value)}
                            placeholder={tr("register_phone_placeholder")}
                            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            required
                          />
                        </div>
                      </>
                    )}

                    <div className="flex items-center gap-3">
                      {isBusinessOwner && currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={goToPreviousStep}
                          disabled={loading}
                          className="h-12 rounded-full px-5"
                        >
                          {tr("register_back")}
                        </Button>
                      )}

                      {isBusinessOwner && currentStep < 3 && (
                        <Button
                          type="button"
                          onClick={goToNextStep}
                          disabled={loading}
                          className="w-full h-12 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-lg shadow-[var(--color-primary)]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--color-primary)]/35 disabled:opacity-70"
                        >
                          {currentStep === 1 ? tr("register_continue_business_details") : tr("register_continue_optional_details")}
                        </Button>
                      )}

                      {isBusinessOwner && currentStep === 3 && isOtherCategorySelected && (
                        <Button
                          type="button"
                          onClick={goToNextStep}
                          disabled={loading}
                          className="w-full h-12 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-lg shadow-[var(--color-primary)]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--color-primary)]/35 disabled:opacity-70"
                        >
                          {tr("register_continue_industry_request")}
                        </Button>
                      )}

                      {(!isBusinessOwner || currentStep > 3 || (isBusinessOwner && currentStep === 3 && !isOtherCategorySelected)) && (
                        <Button
                          type="button"
                          onClick={async () => {
                            await onSubmit(true);
                          }}
                          disabled={loading}
                          className="w-full h-12 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-lg shadow-[var(--color-primary)]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--color-primary)]/35 disabled:opacity-70"
                        >
                          {getPrimaryActionLabel()}
                        </Button>
                      )}
                    </div>
                  </form>

                  <div className="mt-8 flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-8 rounded-full bg-[var(--color-primary)]/70" aria-hidden />{" "}
                      {tr("register_smooth_onboarding")}
                    </div>
                    <div className="text-center">
                      {tr("register_already_have_account")}{" "}
                        <Link href={loginHref} className="font-semibold text-[var(--color-primary)] hover:underline">
                        {tr("login_submit")}
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
