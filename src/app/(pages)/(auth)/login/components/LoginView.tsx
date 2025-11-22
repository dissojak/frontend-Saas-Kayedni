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
  // Design closely matching the reference: left gradient panel + scallop divider + right form
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-5xl w-full rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left gradient panel */}
  <div className="hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] dark:from-black-pearl-900 dark:to-smalt-blue-500 text-white relative">
          <div className="flex flex-col items-center text-center max-w-xs">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <svg
                className="h-8 w-8 text-white dark:text-black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Welcome to Bookify</h2>
            <p className="mt-3 text-sm text-white/90">
              Book services with confidence — manage bookings, clients and schedules from one place.
            </p>
          </div>
        </div>

        {/* Right form panel with scalloped left edge */}
  <div className="bg-white relative p-8 md:p-12 dark:bg-black-pearl-950 dark:text-white">
          {/* Scallop SVG to visually separate panels */}
          <svg
            viewBox="0 0 80 400"
            className="hidden md:block absolute left-0 top-0 h-full w-20 -ml-10 text-white dark:text-black-pearl-950"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path d="M80 0 C60 30 30 40 0 60 L0 340 C30 360 60 370 80 400 Z" fill="currentColor" />
          </svg>

          <div className="relative z-10 max-w-md w-full flex flex-col justify-center h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-md bg-black-light-800 dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">
                <Image src="/assets/BookifyLogo.png" alt="Bookify Logo" width={28} height={28} className="ml-0.5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Sign in</h3>
                <p className="text-sm text-gray-500">Enter your email and password</p>
              </div>
            </div>
            {error && (
              <div
                className="bg-red-50 text-red-600 p-3 rounded-md mb-4"
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
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@company.com"
                  required
                  className="py-3 border-b border-[var(--color-primary)] rounded-none focus:ring-0 focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] placeholder-gray-400 dark:border-smalt-blue-700 dark:bg-transparent dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[var(--color-primary)] hover:underline dark:text-black-pearl-900"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="py-3 border-b border-[var(--color-primary)] rounded-none focus:ring-0 focus:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] placeholder-gray-400 dark:border-smalt-blue-700 dark:bg-transparent dark:text-white"
                />
              </div>

              <input type="hidden" name="role" value={role} />

              <div className="mt-6 flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[var(--color-primary)] text-white py-3 rounded-full dark:bg-vivid-tangerine-400 dark:text-black"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>

              {/* social buttons removed per design preference */}
            </form>

              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[var(--color-primary)] font-medium hover:underline dark:text-black-pearl-900"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
