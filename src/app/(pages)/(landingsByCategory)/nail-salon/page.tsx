
"use client";

import Link from 'next/link';
import Layout from '@components/layout/Layout';
import { useLocale } from '@global/hooks/useLocale';
import { t } from '@global/lib/dictionaryService';
import { getNailLandingContent } from './i18n';

const SLICE_KEY = 'nails-salon';

export default function NailsSalonPage() {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  const content = getNailLandingContent(locale);
  const servicesLabel = t(SLICE_KEY, 'nav_services', locale);
  const bookingsLabel = t(SLICE_KEY, 'nav_bookings', locale);

  return (
    <Layout>
      <section
        className="relative overflow-hidden px-6 py-16 md:px-10 md:py-24"
        dir={isArabic ? 'rtl' : 'ltr'}
        style={{
          background:
            'radial-gradient(circle at 15% 20%, color-mix(in srgb, var(--brand-accent) 32%, white) 0%, transparent 45%), radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--brand-primary) 22%, white) 0%, transparent 40%), linear-gradient(180deg, #fff7fb 0%, #fff 100%)',
        }}
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span
              className="inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{
                color: 'var(--brand-primary-dark)',
                backgroundColor: 'color-mix(in srgb, var(--brand-primary) 12%, white)',
              }}
            >
              {content.badge}
            </span>

            <h1
              className="max-w-2xl text-4xl font-black uppercase leading-[0.95] md:text-6xl"
              style={{ color: 'var(--brand-primary-dark)' }}
            >
              {content.title}
            </h1>

            <p className="max-w-xl text-base text-[#5c4758] md:text-lg">
              {content.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/register?type=business&category=nails-salon"
                className="rounded-full px-6 py-3 text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: 'var(--brand-primary-foreground)',
                }}
              >
                {content.ctaStartWith} {servicesLabel}
              </Link>

              <Link
                href="/businesses?category=Nails%20Salon"
                className="rounded-full border px-6 py-3 text-sm font-semibold"
                style={{
                  borderColor: 'color-mix(in srgb, var(--brand-primary) 40%, #ffffff)',
                  color: 'var(--brand-primary-dark)',
                  backgroundColor: '#ffffff',
                }}
              >
                {content.ctaView} {bookingsLabel}
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/70 p-6 shadow-xl backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: 'var(--brand-primary-dark)' }}>
                {content.quickPreview}
              </p>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--brand-accent) 30%, white)',
                  color: 'var(--brand-primary-dark)',
                }}
              >
                {content.live}
              </span>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border bg-white p-4" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <p className="text-xs uppercase tracking-wide text-[#7a6975]">{servicesLabel}</p>
                <p className="mt-2 text-sm font-semibold text-[#312330]">{content.sampleServices}</p>
              </div>
              <div className="rounded-2xl border bg-white p-4" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <p className="text-xs uppercase tracking-wide text-[#7a6975]">{bookingsLabel}</p>
                <p className="mt-2 text-sm font-semibold text-[#312330]">{content.sampleBookings}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
