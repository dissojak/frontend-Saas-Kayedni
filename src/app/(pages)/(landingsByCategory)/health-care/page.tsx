"use client";

import Layout from '@components/layout/Layout';
import { useLocale } from '@global/hooks/useLocale';
import { getHealthLandingContent } from './i18n';

export default function HealthClinicPage() {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  const content = getHealthLandingContent(locale);

  return (
    <Layout>
      <section
        dir={isArabic ? 'rtl' : 'ltr'}
        className="relative overflow-hidden px-6 py-20 md:px-10 md:py-28"
        style={{
          background:
            'radial-gradient(circle at 10% 10%, rgba(125, 211, 252, 0.25), transparent 40%), radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.22), transparent 42%), linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)',
        }}
      >
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/80 bg-white/80 p-10 text-center shadow-xl backdrop-blur md:p-14">
          <h1 className="text-4xl font-black uppercase tracking-tight text-[#0f3d3e] md:text-6xl">
            {content.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#285a5b] md:text-lg">
            {content.description}
          </p>
          <p className="mt-8 inline-flex rounded-full bg-[#0f3d3e] px-5 py-2 text-sm font-semibold text-white">
            {content.comingSoon}
          </p>
        </div>
      </section>
    </Layout>
  );
}
