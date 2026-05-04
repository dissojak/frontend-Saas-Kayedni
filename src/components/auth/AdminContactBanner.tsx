import React from 'react';
import Link from 'next/link';

interface Props {
  email?: string | null;
  phone?: string | null;
}

export default function AdminContactBanner({ email, phone }: Props) {
  const mail = email ?? process.env.NEXT_PUBLIC_ADMIN_CONTACT_EMAIL ?? null;
  const tel = phone ?? process.env.NEXT_PUBLIC_ADMIN_CONTACT_PHONE ?? null;

  return (
    <div className="mt-3 rounded-md border border-slate-200 bg-white/5 p-3 text-sm text-slate-200">
      <p className="font-semibold">Need an invite token?</p>
      <p className="mt-1 text-xs text-slate-300">Invite tokens are issued by admins outside the app. Please contact them to receive your one-time token.</p>
      <div className="mt-2 flex gap-3">
        {mail && (
          <Link href={`mailto:${mail}`} className="text-[var(--color-primary)] hover:underline">
            Email: {mail}
          </Link>
        )}
        {tel && (
          <Link href={`tel:${tel}`} className="text-[var(--color-primary)] hover:underline">
            Call: {tel}
          </Link>
        )}
      </div>
    </div>
  );
}
