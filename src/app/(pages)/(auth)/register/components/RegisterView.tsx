'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
// card components removed — using custom layout for fresha-like look
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Checkbox } from '@components/ui/checkbox';
import type { RegisterViewProps } from '../types';

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
  backgroundColor: role === 'CLIENT' ? undefined : undefined,
  } as React.CSSProperties;

  return (
  <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-5xl w-full rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
  {/* left side  */}
  <div className="hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] text-white relative">
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z"/></svg>
            </div>
            <h2 className="text-2xl font-bold">Create your account</h2>
            <p className="mt-3 text-sm text-white/90">Create an account to manage bookings and services quickly.</p>
          </div>
        </div>

  {/* right side  */}
  <div className="bg-white relative p-8 md:p-12 flex items-center justify-center">
          <svg viewBox="0 0 80 400" className="hidden md:block absolute left-0 top-0 h-full w-20 -ml-10" preserveAspectRatio="none" aria-hidden>
            <path d="M80 0 C60 30 30 40 0 60 L0 340 C30 360 60 370 80 400 Z" fill="white" />
          </svg>

          <div className="relative z-10 max-w-md w-full flex flex-col justify-center h-full">
            {registered ? (
              <div className="bg-white p-6 rounded-md shadow-sm text-center">
                <div className="h-12 w-12 rounded-md bg-[var(--color-primary)] mx-auto flex items-center justify-center text-white font-bold mb-4">B</div>
                <h3 className="text-lg font-semibold">Check your email</h3>
                <p className="mt-2 text-sm text-gray-600">{registrationMessage ?? 'Please check your email and follow the link to verify your account before you can login.'}</p>
                {registeredEmail && <p className="mt-2 text-sm text-gray-500">Sent to <strong>{registeredEmail}</strong></p>}
                <div className="mt-6 flex justify-center gap-3">
                  <Link href="/login" className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-primary)] text-white">Go to Login</Link>
                  <Link href="/" className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200">Home</Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-md bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">B</div>
                  <div>
                    <h3 className="text-lg font-semibold">Create your account</h3>
                    <p className="text-sm text-gray-500">It only takes a couple of minutes.</p>
                  </div>
                </div>

                {/* Role selector: keep UI subtle and stable — two pill buttons */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-sm text-gray-600 mr-2">Account type</span>
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('CLIENT')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none ${role === 'CLIENT' ? 'bg-[var(--color-primary)] text-white' : 'bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                      Personal
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('BUSINESS_OWNER')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none ${role === 'BUSINESS_OWNER' ? 'bg-[var(--color-primary)] text-white' : 'bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                      Business
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4" role="alert" aria-live="assertive">
                    {error}
                  </div>
                )}

                <form onSubmit={async (e) => { e.preventDefault(); await onSubmit(); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="py-3 border-b border-gray-200 rounded-none focus:ring-0" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="mail@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="py-3 border-b border-gray-200 rounded-none focus:ring-0" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="py-3 border-b border-gray-200 rounded-none focus:ring-0" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm</Label>
                      <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="py-3 border-b border-gray-200 rounded-none focus:ring-0" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <input id="terms" type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="h-4 w-4 rounded" />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{' '}
                      <Link href="/terms" className="text-[var(--color-primary)] hover:underline">Terms of Service</Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">Privacy Policy</Link>
                    </Label>
                  </div>

                  <div className="mt-4">
                    <Button type="submit" disabled={loading} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-full">
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 text-center text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">Sign in</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
