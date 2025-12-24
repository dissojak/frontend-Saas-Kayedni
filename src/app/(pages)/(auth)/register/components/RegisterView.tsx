"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";
import type { RegisterViewProps } from "../types";

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
  registered,
  registrationMessage,
  registeredEmail,
}: Readonly<RegisterViewProps>) {
  const submitStyle = {
    backgroundColor: role === "CLIENT" ? undefined : undefined,
  } as React.CSSProperties;

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr] rounded-[32px] overflow-hidden shadow-[0_25px_80px_rgba(15,23,42,0.25)] bg-white/70 backdrop-blur-xl border border-white/60 dark:bg-slate-950/70 dark:border-slate-800">
          {/* Form column (light) */}
          <div className="relative bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <div className="absolute inset-y-0 right-[-1.4rem] hidden md:block pointer-events-none">
              <svg
                viewBox="0 0 120 800"
                className="h-full w-16 text-white dark:text-slate-950"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M0 0 C55 80 55 160 0 240 C55 320 55 400 0 480 C55 560 55 640 0 720 L0 800 L120 800 L120 0 Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="relative z-10 h-full p-8 sm:p-10 flex flex-col justify-center">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Get started free</p>
                  <h2 className="text-2xl font-semibold">Create your Bookify account</h2>
                </div>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:text-slate-100 dark:hover:border-slate-700"
                >
                  Have one?
                  <span className="text-[var(--color-primary)]">Sign in</span>
                </Link>
              </div>

              {registered ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white font-bold">
                    B
                  </div>
                  <h3 className="text-lg font-semibold">Check your email</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {registrationMessage ?? "Please verify your email to activate your account."}
                  </p>
                  {registeredEmail && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Sent to <strong>{registeredEmail}</strong>
                    </p>
                  )}
                  <div className="mt-6 flex justify-center gap-3">
                    <Link
                      href="/login"
                      className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-primary)] text-white shadow-md"
                    >
                      Go to Login
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:text-slate-200"
                    >
                      Home
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                    Free forever for individuals. Switch plans anytime.
                  </div>

                  <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium text-slate-800 dark:text-white">Account type</span>
                    <button
                      type="button"
                      onClick={() => setRole("CLIENT")}
                      className={`rounded-full border px-3 py-1 transition ${
                        role === "CLIENT"
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      Personal
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("BUSINESS_OWNER")}
                      className={`rounded-full border px-3 py-1 transition ${
                        role === "BUSINESS_OWNER"
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      Business
                    </button>
                  </div>

                  {error && (
                    <div
                      className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-900/30 dark:text-red-200"
                      role="alert"
                      aria-live="assertive"
                    >
                      {error}
                    </div>
                  )}

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await onSubmit();
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Alex Morgan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="mail@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
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
                        <Label htmlFor="confirmPassword">Confirm</Label>
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

                    <div className="flex items-start gap-3 pt-2">
                      <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => setAcceptedTerms(Boolean(checked))}
                        className="mt-1 border-slate-300 data-[state=checked]:bg-[var(--color-primary)] data-[state=checked]:text-white dark:border-slate-700"
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-[var(--color-primary)] hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-[var(--color-primary)] hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-lg shadow-[var(--color-primary)]/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--color-primary)]/35 disabled:opacity-70"
                      style={submitStyle}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>

                  <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-[var(--color-primary)] hover:underline"
                    >
                      Sign in
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Visual hero column */}
          <div className="relative hidden md:block">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.25), transparent 30%), radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.25), transparent 28%), radial-gradient(circle at 40% 70%, rgba(236, 72, 153, 0.23), transparent 30%), radial-gradient(circle at 70% 80%, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85) 36%)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1f2937] opacity-95" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_30%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center font-semibold">
                  B
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/60">Bookify OS</p>
                  <h3 className="text-2xl font-semibold">Built for modern teams</h3>
                </div>
              </div>

              <div className="space-y-4 max-w-lg">
                <p className="text-4xl font-bold leading-tight">Design-forward onboarding.</p>
                <p className="text-sm text-white/80">
                  Crisp visuals, dark/light harmony, and frictionless steps so new users feel at
                  home instantly.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-white/75">
                  <span className="rounded-full bg-white/10 px-3 py-1">One-click verification</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">Guided roles</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">Secure by default</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-white/70">
                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                  ★
                </div>
                <div>
                  <p className="font-semibold">Loved by operators</p>
                  <p className="text-white/60">Fast to launch, delightful to use every day.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
