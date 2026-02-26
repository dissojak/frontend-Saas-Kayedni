"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import Link from "next/link";
import Image from "next/image";

interface ForgotPasswordViewProps {
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  error: string | null;
  success: boolean;
  onSubmit: () => Promise<void>;
}

export default function ForgotPasswordView({
  email,
  setEmail,
  loading,
  error,
  success,
  onSubmit,
}: Readonly<ForgotPasswordViewProps>) {
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
                  <Image src="/assets/KayedniLogo.png" alt="Bookify Logo" width={28} height={28} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Bookify OS</p>
                  <h1 className="text-2xl font-semibold">Scheduling that feels smooth</h1>
                </div>
              </div>

              <div className="space-y-4 max-w-lg">
                <p className="text-4xl sm:text-5xl font-bold leading-tight">Password reset.</p>
                <p className="text-sm text-white/80">
                  Don't worry, we'll help you reset your password and get back to booking. Enter your email and we'll send you a reset code.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-white/80">
                  <span className="rounded-full bg-white/10 px-3 py-1">Secure process</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">Fast recovery</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">Email verification</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-white/75">
                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">★</div>
                <div>
                  <p className="font-semibold">Account recovery made easy</p>
                  <p className="text-white/60">Your account security is our priority.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <div className="h-full p-8 sm:p-10 flex flex-col justify-center">
              <div className="mb-8">
                <p className="text-sm text-slate-500 dark:text-slate-400">Reset password</p>
                <h2 className="text-2xl font-semibold">Recover your account</h2>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-900/30 dark:text-red-200" role="alert" aria-live="assertive">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/70 dark:bg-green-900/30 dark:text-green-200" role="alert" aria-live="assertive">
                  <p className="font-medium">✓ Reset code sent successfully!</p>
                  <p className="mt-1">Check your inbox and spam folder. Redirecting to reset password...</p>
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
                  <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@bookify.com"
                    required
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We'll send a 6-digit reset code to this email address.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || success}
                  className="w-full h-12 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-lg shadow-[var(--color-primary)]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--color-primary)]/35 disabled:opacity-70"
                >
                  {loading ? "Sending code..." : success ? "Code sent! ✓" : "Send reset code"}
                </Button>
              </form>

              <div className="mt-8 flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-8 rounded-full bg-[var(--color-primary)]/70" aria-hidden />
                  We protect your account with secure verification.
                </div>
                <div className="text-center">
                  Remember your password? {" "}
                  <Link href="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
                    Sign in
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
