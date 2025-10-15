"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  user?: any;
};

export default function ContactForm({ user }: Props) {
  return (
    <div>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" defaultValue={user?.name} />
      </div>
      <div className="space-y-2 mt-4">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue={user?.email} />
      </div>
      <div className="space-y-2 mt-4">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" placeholder="Your phone number" />
      </div>
    </div>
  );
}
