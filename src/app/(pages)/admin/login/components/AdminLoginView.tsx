"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import Link from "next/link";
import { Shield, Lock, Mail } from "lucide-react";
import { useLocale } from '@global/hooks/useLocale';
import { adminT } from '@components/dashboard/admin/i18n';

interface AdminLoginViewProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  error: string | null;
  onSubmit: () => Promise<void> | void;
}

export default function AdminLoginView({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  onSubmit,
}: Readonly<AdminLoginViewProps>) {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="max-w-md w-full">
        {/* Admin Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full">
            <Shield className="h-5 w-5 text-purple-400" />
            <span className="text-purple-200 font-semibold">{adminT(locale, 'admin_access')}</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
              <Lock className="h-8 w-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{adminT(locale, 'admin_login')}</h2>
            <p className="text-gray-300 text-sm">
              {adminT(locale, 'secure_access_subtitle')}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-lg mb-6"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onSubmit();
            }}
            className="space-y-6"
          >
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-sm font-medium text-gray-200">
                {adminT(locale, 'email_address')}
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="admin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder={adminT(locale, 'email_address')}
                  required
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password" className="text-sm font-medium text-gray-200">
                  {adminT(locale, 'password')}
                </Label>
                <Link
                  href="/admin/forgot-password"
                  className="text-sm text-purple-400 hover:text-purple-300 hover:underline"
                >
                  {adminT(locale, 'forgot_password')}
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="admin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {adminT(locale, 'signing_in')}
                </span>
              ) : (
                adminT(locale, 'sign_in')
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-300 hover:text-white hover:underline"
            >
              {isArabic ? `${adminT(locale, 'back_to_home')} →` : `← ${adminT(locale, 'back_to_home')}`}
            </Link>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            <Lock className="inline h-4 w-4 mr-1" />
            {adminT(locale, 'security_note')}
          </p>
        </div>
      </div>
    </div>
  );
}
