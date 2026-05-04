import React from 'react';
import Link from 'next/link';

interface Props {
  email?: string | null;
  phone?: string | null;
}

export default function AdminContactBanner({ email, phone }: Props) {
  const mail = email ?? process.env.NEXT_PUBLIC_ADMIN_CONTACT_EMAIL ?? 'dissojak@icloud.com';
  const tel = phone ?? process.env.NEXT_PUBLIC_ADMIN_CONTACT_PHONE ?? '+21623039320';

  return (
    <div className="mt-3 rounded-lg border border-black-700 bg-white/6 p-4 text-sm text-black-700">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-[var(--color-primary)]/12 flex items-center justify-center text-[var(--color-primary)] font-bold">⚡</div>
        <div className="flex-1">
          <p className="font-semibold text-black-700">Need an invite token?</p>
          <p className="mt-1 text-xs text-black-800">Invite tokens are issued by admins outside the app. Contact an admin to receive your one-time token — they will provide a 6–8 digit code.</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {mail && (
              <Link href={`mailto:${mail}`} className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-3 py-2 text-sm text-white shadow-sm">
                Contact admin
              </Link>
            )}

            {mail && (
              <button
                type="button"
                onClick={() => void navigator.clipboard?.writeText(mail)}
                className="inline-flex items-center gap-2 rounded-full border border-black-700 px-3 py-2 text-sm text-black-700 hover:bg-white/3 hover:cursor-pointer"
              >
                Copy admin email
              </button>
            )}

            {tel && (
              <Link href={`tel:${tel}`} className="inline-flex items-center gap-2 rounded-full border border-black-700 px-3 py-2 text-sm text-black-700 hover:bg-white/3">
                Call admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
