import type { LocaleCode } from '@global/lib/locales';

export type StaffKey =
  | 'stats_loading'
  | 'stats_title'
  | 'stats_subtitle'
  | 'stats_badge_analytics'
  | 'back_to_dashboard';

const STAFF_DICTIONARY: Record<LocaleCode, Record<StaffKey, string>> = {
  en: {
    stats_loading: 'Loading your stats...',
    stats_title: 'Performance Stats',
    stats_subtitle: 'Your booking analytics and insights',
    stats_badge_analytics: 'Analytics',
    back_to_dashboard: 'Back to dashboard',
  },
  fr: {
    stats_loading: 'Chargement de vos statistiques...',
    stats_title: 'Statistiques de performance',
    stats_subtitle: 'Vos analyses et indicateurs de reservation',
    stats_badge_analytics: 'Analytique',
    back_to_dashboard: 'Retour au tableau de bord',
  },
  ar: {
    stats_loading: 'جار تحميل احصاءاتك...',
    stats_title: 'احصاءات الاداء',
    stats_subtitle: 'تحليلات وموشرات حجوزاتك',
    stats_badge_analytics: 'التحليلات',
    back_to_dashboard: 'العودة الى لوحة التحكم',
  },
};

export function staffT(locale: LocaleCode, key: StaffKey): string {
  const dictionary = STAFF_DICTIONARY[locale] ?? STAFF_DICTIONARY.en;
  return dictionary[key] ?? STAFF_DICTIONARY.en[key];
}
