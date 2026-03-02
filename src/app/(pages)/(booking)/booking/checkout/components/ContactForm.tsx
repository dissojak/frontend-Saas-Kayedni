"use client";

import React from 'react';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';

export interface User {
  name: string;
  email: string;
  phone?: string;
};


export default function ContactForm({ user }: { user: User }) {
  return (
    <div>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={user?.name ?? ''} readOnly disabled/>
      </div>
      <div className="space-y-2 mt-4">
        <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user?.email ?? ''} readOnly disabled/>
      </div>
      <div className="space-y-2 mt-4">
        <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" value={user?.phone ?? ''} readOnly disabled/>
      </div>
    </div>
  );
}
