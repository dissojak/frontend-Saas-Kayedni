"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import type { LoginViewProps } from "../types/index";
import Link from "next/link";
import Image from "next/image";

export default function LoginView({
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  loading,
  error,
  onSubmit,
}: Readonly<LoginViewProps>) {
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
                <p className="text-4xl sm:text-5xl font-bold leading-tight">Welcome back.</p>
                <p className="text-sm text-white/80">
                  Keep bookings, clients, and staff in sync. Fast, focused, and ready for your next busy day.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-white/80">
                  <span className="rounded-full bg-white/10 px-3 py-1">Live updates</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">Role-based control</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">Secure by design</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-white/75">
                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">★</div>
                <div>
                  <p className="font-semibold">Trusted by busy teams</p>
                  <p className="text-white/60">Optimized for mobile and desktop, day or night.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <div className="h-full p-8 sm:p-10 flex flex-col justify-center">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Sign in</p>
                  <h2 className="text-2xl font-semibold">Welcome to Bookify</h2>
                </div>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:text-slate-100 dark:hover:border-slate-700"
                >
                  New here?
                  <span className="text-[var(--color-primary)]">Create account</span>
                </Link>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-900/30 dark:text-red-200" role="alert" aria-live="assertive">
                  {error}
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
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@bookify.com"
                    required
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Link 
                      href="/forgot-password" 
                      className="text-sm text-[var(--color-primary)] hover:underline"
                      onClick={() => {
                        if (email) {
                          localStorage.setItem('bookify_reset_email', email);
                        }
                      }}
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    required
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <input type="hidden" name="role" value={role} />

                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-medium text-slate-800 dark:text-white">Sign in as</span>
                  <button
                    type="button"
                    onClick={() => setRole("CLIENT")}
                    className={`rounded-full border px-3 py-1 transition ${role === "CLIENT" ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700"}`}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("BUSINESS_OWNER")}
                    className={`rounded-full border px-3 py-1 transition ${role === "BUSINESS_OWNER" ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700"}`}
                  >
                    Business
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-lg shadow-[var(--color-primary)]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--color-primary)]/35 disabled:opacity-70"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="mt-8 flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-8 rounded-full bg-[var(--color-primary)]/70" aria-hidden />
                  Quick, responsive, and secure for every role.
                </div>
                <div className="text-center">
                  Don't have an account? {" "}
                  <Link href="/register" className="font-semibold text-[var(--color-primary)] hover:underline">
                    Create account
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
