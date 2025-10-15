'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/card';
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
}: Readonly<RegisterViewProps>) {
  const submitStyle = {
    backgroundColor: role === 'client' ? undefined : undefined,
  } as React.CSSProperties;

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card className="shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Enter your details to create your account</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <Tabs defaultValue={role} onValueChange={(v) => setRole(v as any)} className="mb-6">
            <TabsList className="grid grid-cols-4 mb-2">
              <TabsTrigger value="client" className="data-[state=active]:bg-client data-[state=active]:text-white">Client</TabsTrigger>
              <TabsTrigger value="business" className="data-[state=active]:bg-business data-[state=active]:text-white">Business</TabsTrigger>
              <TabsTrigger value="staff" className="data-[state=active]:bg-staff data-[state=active]:text-white">Staff</TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-admin data-[state=active]:text-white">Admin</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={(e) => { e.preventDefault(); void onSubmit(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="mail@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </Label>
            </div>

            <Button type="submit" disabled={loading} className="w-full" style={submitStyle}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
