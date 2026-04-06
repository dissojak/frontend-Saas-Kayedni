import type { LocaleCode } from '@global/lib/locales';

export type SearchKey =
  | 'any_time'
  | 'today'
  | 'tomorrow'
  | 'pick_date'
  | 'back'
  | 'search_services_placeholder'
  | 'location_placeholder'
  | 'search'
  | 'searching_short'
  | 'searching_services'
  | 'showing_results'
  | 'for_query'
  | 'sort_relevance'
  | 'sort_rating'
  | 'sort_reviews'
  | 'try_again'
  | 'no_results_found'
  | 'no_results_description'
  | 'back_to_home'
  | 'book_now'
  | 'all_treatments_and_venues'
  | 'results_found'
  | 'matching_categories'
  | 'top_categories'
  | 'all_treatments'
  | 'no_services_found'
  | 'try_keywords_or_location'
  | 'view_all_results'
  | 'error_search_failed'
  | 'error_search_retry'
  | 'error_load_categories'
  | 'error_min_chars'
  | 'error_enter_term_or_location';

const SEARCH_DICTIONARY: Record<LocaleCode, Record<SearchKey, string>> = {
  en: {
    any_time: 'Any time',
    today: 'Today',
    tomorrow: 'Tomorrow',
    pick_date: 'Pick a date',
    back: 'Back',
    search_services_placeholder: 'Search for services...',
    location_placeholder: 'Location',
    search: 'Search',
    searching_short: 'Searching...',
    searching_services: 'Searching for services...',
    showing_results: 'Showing {shown} of {total} results',
    for_query: ' for "{query}"',
    sort_relevance: 'Most Relevant',
    sort_rating: 'Highest Rated',
    sort_reviews: 'Most Reviewed',
    try_again: 'Try Again',
    no_results_found: 'No results found',
    no_results_description: 'Try adjusting your search or filters to find what you\'re looking for.',
    back_to_home: 'Back to Home',
    book_now: 'Book Now',
    all_treatments_and_venues: 'All treatments and venues',
    results_found: '{count} Results Found',
    matching_categories: 'Matching categories',
    top_categories: 'Top categories',
    all_treatments: 'All treatments',
    no_services_found: 'No services found matching your search.',
    try_keywords_or_location: 'Try different keywords or location.',
    view_all_results: 'View All Results',
    error_search_failed: 'Search failed',
    error_search_retry: 'Search failed. Please try again.',
    error_load_categories: 'Failed to load categories.',
    error_min_chars: 'Type at least 2 characters to search businesses',
    error_enter_term_or_location: 'Please enter a search term or location',
  },
  fr: {
    any_time: 'A tout moment',
    today: 'Aujourd\'hui',
    tomorrow: 'Demain',
    pick_date: 'Choisir une date',
    back: 'Retour',
    search_services_placeholder: 'Rechercher des services...',
    location_placeholder: 'Lieu',
    search: 'Rechercher',
    searching_short: 'Recherche en cours...',
    searching_services: 'Recherche de services...',
    showing_results: 'Affichage de {shown} sur {total} resultats',
    for_query: ' pour "{query}"',
    sort_relevance: 'Le plus pertinent',
    sort_rating: 'Mieux notes',
    sort_reviews: 'Le plus d\'avis',
    try_again: 'Reessayer',
    no_results_found: 'Aucun resultat trouve',
    no_results_description: 'Essayez d\'ajuster votre recherche ou vos filtres.',
    back_to_home: 'Retour a l\'accueil',
    book_now: 'Reserver maintenant',
    all_treatments_and_venues: 'Tous les soins et etablissements',
    results_found: '{count} resultats trouves',
    matching_categories: 'Categories correspondantes',
    top_categories: 'Meilleures categories',
    all_treatments: 'Tous les soins',
    no_services_found: 'Aucun service ne correspond a votre recherche.',
    try_keywords_or_location: 'Essayez d\'autres mots-cles ou un autre lieu.',
    view_all_results: 'Voir tous les resultats',
    error_search_failed: 'La recherche a echoue',
    error_search_retry: 'La recherche a echoue. Veuillez reessayer.',
    error_load_categories: 'Impossible de charger les categories.',
    error_min_chars: 'Saisissez au moins 2 caracteres pour rechercher des entreprises',
    error_enter_term_or_location: 'Veuillez saisir un terme de recherche ou un lieu',
  },
  ar: {
    any_time: 'اي وقت',
    today: 'اليوم',
    tomorrow: 'غدا',
    pick_date: 'اختر تاريخا',
    back: 'رجوع',
    search_services_placeholder: 'ابحث عن الخدمات...',
    location_placeholder: 'الموقع',
    search: 'بحث',
    searching_short: 'جاري البحث...',
    searching_services: 'جاري البحث عن الخدمات...',
    showing_results: 'عرض {shown} من {total} نتيجة',
    for_query: ' لعبارة "{query}"',
    sort_relevance: 'الاكثر صلة',
    sort_rating: 'الاعلى تقييما',
    sort_reviews: 'الاكثر مراجعات',
    try_again: 'حاول مرة اخرى',
    no_results_found: 'لم يتم العثور على نتائج',
    no_results_description: 'حاول تعديل البحث او الفلاتر للعثور على ما تريد.',
    back_to_home: 'العودة الى الرئيسية',
    book_now: 'احجز الان',
    all_treatments_and_venues: 'كل العلاجات والاماكن',
    results_found: 'تم العثور على {count} نتيجة',
    matching_categories: 'الفئات المطابقة',
    top_categories: 'اهم الفئات',
    all_treatments: 'كل العلاجات',
    no_services_found: 'لم يتم العثور على خدمات مطابقة لبحثك.',
    try_keywords_or_location: 'جرب كلمات مفتاحية مختلفة او موقعا اخر.',
    view_all_results: 'عرض كل النتائج',
    error_search_failed: 'فشل البحث',
    error_search_retry: 'فشل البحث. يرجى المحاولة مرة اخرى.',
    error_load_categories: 'تعذر تحميل الفئات.',
    error_min_chars: 'اكتب حرفين على الاقل للبحث عن الاعمال',
    error_enter_term_or_location: 'يرجى ادخال كلمة بحث او موقع',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function searchT(
  locale: LocaleCode,
  key: SearchKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = SEARCH_DICTIONARY[locale] ?? SEARCH_DICTIONARY.en;
  const value = dictionary[key] ?? SEARCH_DICTIONARY.en[key];
  return interpolate(value, params);
}