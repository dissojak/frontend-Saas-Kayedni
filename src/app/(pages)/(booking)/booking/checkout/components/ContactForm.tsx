"use client";

import React from 'react';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { useLocale } from '@global/hooks/useLocale';
import { bookingT } from '@/(pages)/(booking)/i18n';

export interface User {
  name: string;
  email: string;
  phone?: string;
};


export default function ContactForm({ user }: Readonly<{ user: User }>) {
  const { locale } = useLocale();

  return (
    <div>
      <div className="space-y-2">
        <Label htmlFor="name">{bookingT(locale, 'checkout_contact_full_name')}</Label>
          <Input id="name" value={user?.name ?? ''} readOnly disabled/>
      </div>
      <div className="space-y-2 mt-4">
        <Label htmlFor="email">{bookingT(locale, 'checkout_contact_email')}</Label>
          <Input id="email" type="email" value={user?.email ?? ''} readOnly disabled/>
      </div>
      <div className="space-y-2 mt-4">
        <Label htmlFor="phone">{bookingT(locale, 'checkout_contact_phone')}</Label>
          <Input id="phone" type="tel" value={user?.phone ?? ''} readOnly disabled/>
      </div>
    </div>
  );
}
