"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@global/hooks/useLocale";
import { authT } from "@/(pages)/(auth)/i18n";

interface ResetPasswordViewProps {
  email: string;
  setEmail: (v: string) => void;
  resetCode: string;
  setResetCode: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  loading: boolean;
  error: string | null;
  success: boolean;
  onSubmit: () => Promise<void>;
}

export default function ResetPasswordView({
  email,
  setEmail,
  resetCode,
  setResetCode,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  error,
  success,
  onSubmit,
}: Readonly<ResetPasswordViewProps>) {
  const { locale } = useLocale();
  const tr = (key: Parameters<typeof authT>[1]) => authT(locale, key);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const isFormValid = resetCode && newPassword && confirmPassword && passwordsMatch;
  let submitLabel = tr("reset_submit");
  if (success) {
    submitLabel = tr("reset_success_button");
  }
  if (loading) {
    submitLabel = tr("reset_submitting");
  }

  return (
    <div className="text-slate-100 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[28px] shadow-[0_25px_80px_rgba(15,23,42,0.35)] border border-white/10 dark:border-slate-800 bg-white/5 backdrop-blur-xl">
          {/* Hero column */}
          <div className="relative h-full min-h-[300px] flex items-center">
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
                  <h1 className="text-2xl font-semibold">{tr("auth_hero_title")}</h1>
                </div>
              </div>

              <div className="space-y-4 max-w-lg">
                <p className="text-4xl sm:text-5xl font-bold leading-tight">{tr("reset_hero_title")}</p>
                <p className="text-sm text-white/80">
                  {tr("reset_hero_desc")}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-white/80">
                  <span className="rounded-full bg-white/10 px-3 py-1">{tr("reset_secure_password")}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">{tr("reset_code_verification")}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">{tr("reset_account_recovery")}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-white/75">
                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">★</div>
                <div>
                  <p className="font-semibold">{tr("reset_strong_password_title")}</p>
                  <p className="text-white/60">{tr("reset_strong_password_desc")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <div className="h-full p-8 sm:p-10 flex flex-col justify-center">
              <div className="mb-8">
                <p className="text-sm text-slate-500 dark:text-slate-400">{tr("reset_verify_and_reset")}</p>
                <h2 className="text-2xl font-semibold">{tr("reset_set_new_password")}</h2>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-900/30 dark:text-red-200" role="alert" aria-live="assertive">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/70 dark:bg-green-900/30 dark:text-green-200" role="alert" aria-live="assertive">
                  <p className="font-medium">✓ {tr("reset_success_title")}</p>
                  <p className="mt-1">{tr("reset_success_desc")}</p>
                </div>
              )}

              {/* Show email indicator if available */}
              {email && !success && (
                <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{tr("reset_code_sent_to")}</p>
                  <p className="font-medium">{email}</p>
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await onSubmit();
                }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="resetCode" className="text-sm font-medium">{tr("reset_code_label")}</Label>
                  <Input
                    id="resetCode"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replaceAll(/\D/g, '').slice(0, 6))}
                    type="text"
                    placeholder="000000"
                    required
                    maxLength={6}
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white text-center font-mono text-lg tracking-widest"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tr("reset_code_help")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">{tr("reset_new_password")}</Label>
                  <Input
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    required
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tr("reset_password_help")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">{tr("reset_confirm_password")}</Label>
                  <Input
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    required
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                  {newPassword && confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {tr("reset_password_mismatch")}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || !isFormValid || success}
                  className="w-full h-12 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-lg shadow-[var(--color-primary)]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--color-primary)]/35 disabled:opacity-70"
                >
                  {submitLabel}
                </Button>
              </form>

              <div className="mt-8 flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-8 rounded-full bg-[var(--color-primary)]/70" aria-hidden />
                  {tr("reset_security_note")}
                </div>
                <div className="text-center">
                  {tr("reset_no_code")}{" "}
                  <Link href="/forgot-password" className="font-semibold text-[var(--color-primary)] hover:underline">
                    {tr("reset_request_again")}
                  </Link>
                </div>
                <div className="text-center">
                  {tr("reset_remember_password")}{" "}
                  <Link href="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
                    {tr("login_submit")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
