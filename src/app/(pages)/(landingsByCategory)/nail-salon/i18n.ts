import type { LocaleCode } from '@global/lib/locales';

type NailLandingContent = {
  badge: string;
  title: string;
  description: string;
  ctaStartWith: string;
  ctaView: string;
  quickPreview: string;
  live: string;
  sampleServices: string;
  sampleBookings: string;
};

const NAIL_CONTENT: Record<LocaleCode, NailLandingContent> = {
  en: {
    badge: 'Nails Salon',
    title: 'Grow your nails business with elegant, fast booking flows',
    description:
      'Launch your branded page, take appointments 24/7, and keep your calendar full with a setup tailored for nails studios.',
    ctaStartWith: 'Start with',
    ctaView: 'View',
    quickPreview: 'Quick Preview',
    live: 'Live',
    sampleServices: 'Gel Set, Nail Art, Manicure',
    sampleBookings: 'Today: 14 confirmed',
  },
  fr: {
    badge: 'Salon d ongles',
    title: 'Developpez votre business nails avec des reservations rapides et elegantes',
    description:
      'Lancez votre page a votre image, acceptez des reservations 24/7 et gardez votre agenda toujours rempli.',
    ctaStartWith: 'Demarrer avec',
    ctaView: 'Voir',
    quickPreview: 'Apercu rapide',
    live: 'En direct',
    sampleServices: 'Gel, Nail Art, Manucure',
    sampleBookings: 'Aujourd hui: 14 confirms',
  },
  ar: {
    badge: 'صالون اظافر',
    title: 'نمِّ نشاط الاظافر لديك بحجوزات سريعة وانيقة',
    description:
      'اطلق صفحتك الخاصة، استقبل الحجوزات 24/7، وابق جدولك ممتلئا بنظام مناسب لاستوديوهات الاظافر.',
    ctaStartWith: 'ابدأ مع',
    ctaView: 'عرض',
    quickPreview: 'معاينة سريعة',
    live: 'مباشر',
    sampleServices: 'جل، نقش اظافر، مانيكير',
    sampleBookings: 'اليوم: 14 حجز مؤكد',
  },
};

export function getNailLandingContent(locale: LocaleCode): NailLandingContent {
  return NAIL_CONTENT[locale] ?? NAIL_CONTENT.en;
}
