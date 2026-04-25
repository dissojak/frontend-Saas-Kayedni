import type { LocaleCode } from '@global/lib/locales';

type HealthLandingContent = {
  title: string;
  description: string;
  comingSoon: string;
};

const HEALTH_CONTENT: Record<LocaleCode, HealthLandingContent> = {
  en: {
    title: 'Health & Care',
    description: 'Smart scheduling and patient flow tools for clinics and care providers.',
    comingSoon: 'This landing page is coming soon.',
  },
  fr: {
    title: 'Sante & Care',
    description: 'Des outils intelligents de planification et de flux patient pour cliniques et centres de soin.',
    comingSoon: 'Cette page arrive bientot.',
  },
  ar: {
    title: 'الصحة والرعاية',
    description: 'ادوات ذكية لجدولة المواعيد وتنظيم مسار المرضى للعيادات ومراكز الرعاية.',
    comingSoon: 'هذه الصفحة قادمة قريبا.',
  },
};

export function getHealthLandingContent(locale: LocaleCode): HealthLandingContent {
  return HEALTH_CONTENT[locale] ?? HEALTH_CONTENT.en;
}
