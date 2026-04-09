import type { SliceKey } from '@global/lib/slices';
import { DEFAULT_LOCALE, type LocaleCode } from '@global/lib/locales';

export type DictionaryKey =
  | 'nav_home'
  | 'nav_find_services'
  | 'nav_my_bookings'
  | 'nav_dashboard'
  | 'nav_my_business'
  | 'nav_staff'
  | 'nav_services'
  | 'nav_bookings'
  | 'nav_my_workspace'
  | 'nav_my_schedule'
  | 'nav_businesses'
  | 'nav_users'
  | 'nav_analytics'
  | 'nav_profile'
  | 'nav_settings'
  | 'nav_logout'
  | 'nav_login'
  | 'nav_signup'
  | 'nav_manager'
  | 'nav_enable_client_telegram'
  | 'nav_enable_staff_telegram'
  | 'nav_user'
  | 'nav_toggle_theme'
  | 'nav_language'
  | 'locale_english'
  | 'locale_french'
  | 'locale_arabic'
  | 'footer_brand_tagline'
  | 'footer_product'
  | 'footer_company'
  | 'footer_stay_updated'
  | 'footer_subscribe_desc'
  | 'footer_features'
  | 'footer_pricing'
  | 'footer_find_services'
  | 'footer_integrations'
  | 'footer_about_us'
  | 'footer_careers'
  | 'footer_blog'
  | 'footer_contact'
  | 'footer_faq'
  | 'footer_email_placeholder'
  | 'footer_subscribe'
  | 'footer_all_rights_reserved'
  | 'footer_privacy_policy'
  | 'footer_terms_of_service'
  | 'footer_cookie_settings';

const DEFAULT_DICTIONARY: Record<LocaleCode, Record<DictionaryKey, string>> = {
  en: {
    nav_home: 'Home',
    nav_find_services: 'Find Services',
    nav_my_bookings: 'My Bookings',
    nav_dashboard: 'Dashboard',
    nav_my_business: 'My Business',
    nav_staff: 'Staff',
    nav_services: 'Services',
    nav_bookings: 'Bookings',
    nav_my_workspace: 'My Workspace',
    nav_my_schedule: 'My Schedule',
    nav_businesses: 'Businesses',
    nav_users: 'Users',
    nav_analytics: 'Analytics',
    nav_profile: 'Profile',
    nav_settings: 'Settings',
    nav_logout: 'Logout',
    nav_login: 'Log in',
    nav_signup: 'Sign Up',
    nav_manager: 'Manager',
    nav_enable_client_telegram: 'Enable Client Telegram',
    nav_enable_staff_telegram: 'Enable Staff Telegram',
    nav_user: 'User',
    nav_toggle_theme: 'Toggle theme',
    nav_language: 'Language',
    locale_english: 'English',
    locale_french: 'French',
    locale_arabic: 'Arabic',
    footer_brand_tagline:
      'Simplifying bookings for everyone. The all-in-one platform for modern businesses and clients.',
    footer_product: 'Product',
    footer_company: 'Company',
    footer_stay_updated: 'Stay Updated',
    footer_subscribe_desc: 'Subscribe to our newsletter for the latest updates and offers.',
    footer_features: 'Features',
    footer_pricing: 'Pricing',
    footer_find_services: 'Find Services',
    footer_integrations: 'Integrations',
    footer_about_us: 'About Us',
    footer_careers: 'Careers',
    footer_blog: 'Blog',
    footer_contact: 'Contact',
    footer_faq: 'FAQ',
    footer_email_placeholder: 'Enter your email',
    footer_subscribe: 'Subscribe',
    footer_all_rights_reserved: 'All rights reserved.',
    footer_privacy_policy: 'Privacy Policy',
    footer_terms_of_service: 'Terms of Service',
    footer_cookie_settings: 'Cookie Settings',
  },
  fr: {
    nav_home: 'Accueil',
    nav_find_services: 'Explorer les services',
    nav_my_bookings: 'Mes reservations',
    nav_dashboard: 'Tableau de bord',
    nav_my_business: 'Mon business',
    nav_staff: 'Personnel',
    nav_services: 'Services',
    nav_bookings: 'Reservations',
    nav_my_workspace: 'Mon espace de travail',
    nav_my_schedule: 'Mon agenda',
    nav_businesses: 'Businesses',
    nav_users: 'Utilisateurs',
    nav_analytics: 'Analyses',
    nav_profile: 'Profil',
    nav_settings: 'Parametres',
    nav_logout: 'Deconnexion',
    nav_login: 'Se connecter',
    nav_signup: 'Inscription',
    nav_manager: 'Gestionnaire',
    nav_enable_client_telegram: 'Activer Telegram client',
    nav_enable_staff_telegram: 'Activer Telegram equipe',
    nav_user: 'Utilisateur',
    nav_toggle_theme: 'Basculer le theme',
    nav_language: 'Langue',
    locale_english: 'Anglais',
    locale_french: 'Francais',
    locale_arabic: 'Arabe',
    footer_brand_tagline:
      'Kayedni simplifie la reservation de services pour les clients et les businesses.',
    footer_product: 'Produit',
    footer_company: 'Kayedni',
    footer_stay_updated: 'Restez informe',
    footer_subscribe_desc: 'Recevez les nouveautes et offres de Kayedni.',
    footer_features: 'Fonctionnalites',
    footer_pricing: 'Tarifs',
    footer_find_services: 'Explorer les services',
    footer_integrations: 'Integrations',
    footer_about_us: 'A propos de nous',
    footer_careers: 'Carrieres',
    footer_blog: 'Blog',
    footer_contact: 'Contact',
    footer_faq: 'FAQ',
    footer_email_placeholder: 'Entrez votre e-mail',
    footer_subscribe: 'S’abonner',
    footer_all_rights_reserved: 'Tous droits reserves.',
    footer_privacy_policy: 'Politique de confidentialite',
    footer_terms_of_service: 'Conditions d’utilisation',
    footer_cookie_settings: 'Parametres des cookies',
  },
  ar: {
    nav_home: 'الرئيسية',
    nav_find_services: 'استكشف الخدمات',
    nav_my_bookings: 'حجوزاتي',
    nav_dashboard: 'لوحة التحكم',
    nav_my_business: 'شركتي',
    nav_staff: 'الموظفون',
    nav_services: 'الخدمات',
    nav_bookings: 'الحجوزات',
    nav_my_workspace: 'مساحة الشركة',
    nav_my_schedule: 'جدولي',
    nav_businesses: 'الشركات',
    nav_users: 'المستخدمون',
    nav_analytics: 'التحليلات',
    nav_profile: 'الملف الشخصي',
    nav_settings: 'الاعدادات',
    nav_logout: 'تسجيل الخروج',
    nav_login: 'تسجيل الدخول',
    nav_signup: 'انشاء حساب',
    nav_manager: 'مدير الشركة',
    nav_enable_client_telegram: 'تفعيل تيليجرام للعميل',
    nav_enable_staff_telegram: 'تفعيل تيليجرام للموظف',
    nav_user: 'مستخدم',
    nav_toggle_theme: 'تغيير المظهر',
    nav_language: 'اللغة',
    locale_english: 'الانجليزية',
    locale_french: 'الفرنسية',
    locale_arabic: 'العربية',
    footer_brand_tagline: 'قيدني منصة ذكية تساعد العملاء والشركات على ادارة الحجوزات بسهولة.',
    footer_product: 'المنتج',
    footer_company: 'قيدني',
    footer_stay_updated: 'ابق على اطلاع',
    footer_subscribe_desc: 'اشترك ليصلك جديد قيدني وافضل العروض.',
    footer_features: 'الميزات',
    footer_pricing: 'الاسعار',
    footer_find_services: 'استكشف الخدمات',
    footer_integrations: 'التكاملات',
    footer_about_us: 'من نحن',
    footer_careers: 'الوظائف',
    footer_blog: 'المدونة',
    footer_contact: 'تواصل معنا',
    footer_faq: 'الاسئلة الشائعة',
    footer_email_placeholder: 'ادخل بريدك الالكتروني',
    footer_subscribe: 'اشترك',
    footer_all_rights_reserved: 'جميع الحقوق محفوظة.',
    footer_privacy_policy: 'سياسة الخصوصية',
    footer_terms_of_service: 'شروط الخدمة',
    footer_cookie_settings: 'اعدادات ملفات تعريف الارتباط',
  },
};

const SLICE_DICTIONARY: Record<string, Partial<Record<LocaleCode, Partial<Record<DictionaryKey, string>>>>> = {
  barber: {
    en: {
      nav_services: 'Services',
      nav_bookings: 'Appointments',
    },
    fr: {
      nav_services: 'Services',
      nav_bookings: 'Rendez-vous',
    },
    ar: {
      nav_services: 'الخدمات',
      nav_bookings: 'المواعيد',
    },
  },
  'nail-salon': {
    en: {
      nav_services: 'Services',
      nav_bookings: 'Appointments',
    },
    fr: {
      nav_services: 'Services',
      nav_bookings: 'Rendez-vous',
    },
    ar: {
      nav_services: 'الخدمات',
      nav_bookings: 'المواعيد',
    },
  },
  salon: {
    en: {
      nav_services: 'Treatments',
      nav_bookings: 'Appointments',
    },
    fr: {
      nav_services: 'Soins',
      nav_bookings: 'Rendez-vous',
    },
    ar: {
      nav_services: 'العلاجات',
      nav_bookings: 'المواعيد',
    },
  },
  'health&care': {
    en: {
      nav_services: 'Treatments',
      nav_bookings: 'Consultations',
    },
    fr: {
      nav_services: 'Soins',
      nav_bookings: 'Consultations',
    },
    ar: {
      nav_services: 'العلاجات',
      nav_bookings: 'الاستشارات',
    },
  },
  'beauty&hairstyling': {
    en: {
      nav_services: 'Services',
      nav_bookings: 'Appointments',
    },
    fr: {
      nav_services: 'Services',
      nav_bookings: 'Rendez-vous',
    },
    ar: {
      nav_services: 'الخدمات',
      nav_bookings: 'المواعيد',
    },
  },
};

export function t(sliceKey: SliceKey, key: DictionaryKey, locale: LocaleCode = DEFAULT_LOCALE): string {
  const localeDictionary = DEFAULT_DICTIONARY[locale] ?? DEFAULT_DICTIONARY[DEFAULT_LOCALE];
  const sliceDictionary =
    SLICE_DICTIONARY[sliceKey]?.[locale] ??
    SLICE_DICTIONARY[sliceKey]?.[DEFAULT_LOCALE] ??
    {};

  return (
    sliceDictionary[key] ??
    localeDictionary[key] ??
    DEFAULT_DICTIONARY[DEFAULT_LOCALE][key]
  );
}
