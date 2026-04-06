import type { LocaleCode } from '@global/lib/locales';

export type BusinessesKey =
  | 'title_find_businesses'
  | 'search_businesses_placeholder'
  | 'advanced_filters'
  | 'showing_range'
  | 'per_page'
  | 'prev'
  | 'next'
  | 'page_of'
  | 'loading_businesses'
  | 'no_businesses_found'
  | 'adjust_search_criteria'
  | 'clear_filters'
  | 'view_details'
  | 'category_all';

const BUSINESSES_DICTIONARY: Record<LocaleCode, Record<BusinessesKey, string>> = {
  en: {
    title_find_businesses: 'Find Businesses',
    search_businesses_placeholder: 'Search businesses...',
    advanced_filters: 'Advanced Filters',
    showing_range: 'Showing {from}-{to} of {total}',
    per_page: 'Per page:',
    prev: 'Prev',
    next: 'Next',
    page_of: 'Page {current} / {total}',
    loading_businesses: 'Loading businesses...',
    no_businesses_found: 'No businesses found',
    adjust_search_criteria: 'Try adjusting your search criteria',
    clear_filters: 'Clear Filters',
    view_details: 'View Details',
    category_all: 'All',
  },
  fr: {
    title_find_businesses: 'Trouver des entreprises',
    search_businesses_placeholder: 'Rechercher des entreprises...',
    advanced_filters: 'Filtres avances',
    showing_range: 'Affichage de {from} a {to} sur {total}',
    per_page: 'Par page :',
    prev: 'Precedent',
    next: 'Suivant',
    page_of: 'Page {current} / {total}',
    loading_businesses: 'Chargement des entreprises...',
    no_businesses_found: 'Aucune entreprise trouvee',
    adjust_search_criteria: 'Essayez de modifier vos criteres de recherche',
    clear_filters: 'Effacer les filtres',
    view_details: 'Voir les details',
    category_all: 'Tous',
  },
  ar: {
    title_find_businesses: 'ابحث عن الشركات',
    search_businesses_placeholder: 'ابحث عن الشركات...',
    advanced_filters: 'فلاتر متقدمة',
    showing_range: 'عرض {from} الى {to} من {total}',
    per_page: 'لكل صفحة:',
    prev: 'السابق',
    next: 'التالي',
    page_of: 'الصفحة {current} / {total}',
    loading_businesses: 'جاري تحميل الشركات...',
    no_businesses_found: 'لم يتم العثور على أي شركة',
    adjust_search_criteria: 'حاول تعديل معايير البحث',
    clear_filters: 'مسح الفلاتر',
    view_details: 'عرض التفاصيل',
    category_all: 'الكل',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function businessesT(
  locale: LocaleCode,
  key: BusinessesKey,
  params?: Record<string, string | number>,
): string {
  const localeDictionary = BUSINESSES_DICTIONARY[locale] ?? BUSINESSES_DICTIONARY.en;
  const value = localeDictionary[key] ?? BUSINESSES_DICTIONARY.en[key];
  return interpolate(value, params);
}