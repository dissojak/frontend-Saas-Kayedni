import type { LocaleCode } from '@global/lib/locales';

export type StaffServicesKey =
  | 'no_business_linked_title'
  | 'no_business_linked_desc_view'
  | 'no_business_linked_desc_create'
  | 'back_to_dashboard'
  | 'all_business_services_title'
  | 'services_offered_by_business'
  | 'services_offered_by_your_business'
  | 'my_services'
  | 'my_services_title'
  | 'my_services_subtitle_total'
  | 'create_service'
  | 'link_to_service'
  | 'search_your_services'
  | 'search_services'
  | 'no_services_found'
  | 'no_services_yet'
  | 'try_adjust_search'
  | 'create_first_service'
  | 'link_or_create_services'
  | 'inactive_hidden_from_bookings'
  | 'status_active'
  | 'status_inactive'
  | 'no_description_available'
  | 'no_description'
  | 'linking'
  | 'link_dialog_title'
  | 'link_dialog_desc'
  | 'all_services_already_linked'
  | 'showing_services_summary'
  | 'duration_min_short'
  | 'duration_hour_short'
  | 'duration_hours_short'
  | 'create_new_service_title'
  | 'create_new_service_subtitle'
  | 'service_name_label'
  | 'service_name_placeholder'
  | 'description_label'
  | 'description_placeholder'
  | 'duration_minutes_label'
  | 'duration_helper'
  | 'price_label'
  | 'image_url_optional_label'
  | 'image_url_placeholder'
  | 'preview_alt'
  | 'about_creating_services_title'
  | 'about_creating_services_desc'
  | 'cancel'
  | 'creating'
  | 'error_no_business_linked'
  | 'error_missing_business_id'
  | 'error_auth_token_missing'
  | 'error_create_service_failed';

const STAFF_SERVICES_DICTIONARY: Record<LocaleCode, Record<StaffServicesKey, string>> = {
  en: {
    no_business_linked_title: 'No Business Linked',
    no_business_linked_desc_view: 'You need to be linked to a business to view services.',
    no_business_linked_desc_create: 'You need to be linked to a business to create services.',
    back_to_dashboard: 'Back to Dashboard',
    all_business_services_title: 'All Business Services',
    services_offered_by_business: 'Services offered by {business}',
    services_offered_by_your_business: 'All services offered by your business',
    my_services: 'My Services',
    my_services_title: 'My Services',
    my_services_subtitle_total: 'Services you currently provide ({total} total)',
    create_service: 'Create Service',
    link_to_service: 'Link to Service',
    search_your_services: 'Search your services...',
    search_services: 'Search services...',
    no_services_found: 'No services found',
    no_services_yet: 'No services yet',
    try_adjust_search: 'Try adjusting your search terms',
    create_first_service: 'Create your first service to get started',
    link_or_create_services: 'Link to existing services or create your own',
    inactive_hidden_from_bookings: 'INACTIVE - Hidden from bookings',
    status_active: 'Active',
    status_inactive: 'Inactive',
    no_description_available: 'No description available',
    no_description: 'No description',
    linking: 'Linking...',
    link_dialog_title: 'Link to a Service',
    link_dialog_desc: "Select a service you want to provide. You'll be able to receive bookings for this service.",
    all_services_already_linked: "You're already linked to all available services.",
    showing_services_summary: 'Showing {filtered} of {total} services',
    duration_min_short: '{count} min',
    duration_hour_short: '{count}h',
    duration_hours_short: '{hours}h {minutes}m',
    create_new_service_title: 'Create New Service',
    create_new_service_subtitle: 'Add a new service you can provide',
    service_name_label: 'Service Name *',
    service_name_placeholder: 'e.g., Haircut, Massage, Consultation',
    description_label: 'Description',
    description_placeholder: 'Describe what this service includes, any special techniques, materials used...',
    duration_minutes_label: 'Duration (minutes) *',
    duration_helper: 'Common: 15, 30, 45, 60, 90 minutes',
    price_label: 'Price ($) *',
    image_url_optional_label: 'Image URL (optional)',
    image_url_placeholder: 'https://example.com/image.jpg',
    preview_alt: 'Preview',
    about_creating_services_title: 'About creating services',
    about_creating_services_desc:
      "When you create a service, you'll automatically be linked to it as a provider. Clients will be able to book this service with you. You can edit or update your services at any time.",
    cancel: 'Cancel',
    creating: 'Creating...',
    error_no_business_linked: 'No business linked',
    error_missing_business_id: 'Missing business ID',
    error_auth_token_missing: 'Authentication token missing. Please log in again.',
    error_create_service_failed: 'Failed to create service',
  },
  fr: {
    no_business_linked_title: 'Aucun business lie',
    no_business_linked_desc_view: 'Vous devez etre lie a un business pour voir les services.',
    no_business_linked_desc_create: 'Vous devez etre lie a un business pour creer des services.',
    back_to_dashboard: 'Retour au dashboard',
    all_business_services_title: 'Tous les services du business',
    services_offered_by_business: 'Services proposes par {business}',
    services_offered_by_your_business: 'Tous les services proposes par votre business',
    my_services: 'Mes services',
    my_services_title: 'Mes services',
    my_services_subtitle_total: 'Services que vous fournissez actuellement ({total} au total)',
    create_service: 'Creer un service',
    link_to_service: 'Lier a un service',
    search_your_services: 'Rechercher vos services...',
    search_services: 'Rechercher des services...',
    no_services_found: 'Aucun service trouve',
    no_services_yet: 'Aucun service pour le moment',
    try_adjust_search: 'Essayez d ajuster vos termes de recherche',
    create_first_service: 'Creez votre premier service pour commencer',
    link_or_create_services: 'Liez des services existants ou creez les votres',
    inactive_hidden_from_bookings: 'INACTIF - Masque dans les reservations',
    status_active: 'Actif',
    status_inactive: 'Inactif',
    no_description_available: 'Aucune description disponible',
    no_description: 'Aucune description',
    linking: 'Liaison...',
    link_dialog_title: 'Lier a un service',
    link_dialog_desc: 'Selectionnez un service que vous souhaitez fournir. Vous pourrez recevoir des reservations pour ce service.',
    all_services_already_linked: 'Vous etes deja lie a tous les services disponibles.',
    showing_services_summary: '{filtered} services affiches sur {total}',
    duration_min_short: '{count} min',
    duration_hour_short: '{count}h',
    duration_hours_short: '{hours}h {minutes}m',
    create_new_service_title: 'Creer un nouveau service',
    create_new_service_subtitle: 'Ajoutez un nouveau service que vous pouvez assurer',
    service_name_label: 'Nom du service *',
    service_name_placeholder: 'ex : Coupe, Massage, Consultation',
    description_label: 'Description',
    description_placeholder: 'Decrivez ce que comprend ce service, les techniques ou materiaux utilises...',
    duration_minutes_label: 'Duree (minutes) *',
    duration_helper: 'Courant : 15, 30, 45, 60, 90 minutes',
    price_label: 'Prix ($) *',
    image_url_optional_label: 'URL de l image (optionnel)',
    image_url_placeholder: 'https://example.com/image.jpg',
    preview_alt: 'Apercu',
    about_creating_services_title: 'A propos de la creation de services',
    about_creating_services_desc:
      'Quand vous creez un service, vous y etes automatiquement lie comme prestataire. Les clients pourront reserver ce service avec vous. Vous pouvez modifier vos services a tout moment.',
    cancel: 'Annuler',
    creating: 'Creation...',
    error_no_business_linked: 'Aucun business lie',
    error_missing_business_id: 'Identifiant business manquant',
    error_auth_token_missing: 'Jeton d authentification manquant. Reconnectez-vous.',
    error_create_service_failed: 'Echec de creation du service',
  },
  ar: {
    no_business_linked_title: 'لا توجد منشاة مرتبطة',
    no_business_linked_desc_view: 'يجب ربطك بمنشاة لعرض الخدمات.',
    no_business_linked_desc_create: 'يجب ربطك بمنشاة لانشاء الخدمات.',
    back_to_dashboard: 'العودة الى لوحة التحكم',
    all_business_services_title: 'كل خدمات المنشاة',
    services_offered_by_business: 'الخدمات التي تقدمها {business}',
    services_offered_by_your_business: 'كل الخدمات التي تقدمها منشاتك',
    my_services: 'خدماتي',
    my_services_title: 'خدماتي',
    my_services_subtitle_total: 'الخدمات التي تقدمها حاليا ({total} اجمالي)',
    create_service: 'انشاء خدمة',
    link_to_service: 'ربط بخدمة',
    search_your_services: 'ابحث في خدماتك...',
    search_services: 'ابحث في الخدمات...',
    no_services_found: 'لم يتم العثور على خدمات',
    no_services_yet: 'لا توجد خدمات بعد',
    try_adjust_search: 'حاول تعديل كلمات البحث',
    create_first_service: 'انشئ خدمتك الاولى للبدء',
    link_or_create_services: 'اربط خدمات موجودة او انشئ خدماتك الخاصة',
    inactive_hidden_from_bookings: 'غير نشط - مخفي من الحجوزات',
    status_active: 'نشط',
    status_inactive: 'غير نشط',
    no_description_available: 'لا يوجد وصف متاح',
    no_description: 'لا يوجد وصف',
    linking: 'جار الربط...',
    link_dialog_title: 'ربط بخدمة',
    link_dialog_desc: 'اختر خدمة تريد تقديمها. ستتمكن من استقبال الحجوزات لهذه الخدمة.',
    all_services_already_linked: 'انت مرتبط بالفعل بكل الخدمات المتاحة.',
    showing_services_summary: 'عرض {filtered} من اصل {total} خدمة',
    duration_min_short: '{count} دقيقة',
    duration_hour_short: '{count}س',
    duration_hours_short: '{hours}س {minutes}د',
    create_new_service_title: 'انشئ خدمة جديدة',
    create_new_service_subtitle: 'اضف خدمة جديدة يمكنك تقديمها',
    service_name_label: 'اسم الخدمة *',
    service_name_placeholder: 'مثال: قصة شعر، مساج، استشارة',
    description_label: 'الوصف',
    description_placeholder: 'اشرح ما الذي تتضمنه الخدمة واي تقنيات او مواد مستخدمة...',
    duration_minutes_label: 'المدة (بالدقائق) *',
    duration_helper: 'الشائع: 15، 30، 45، 60، 90 دقيقة',
    price_label: 'السعر ($) *',
    image_url_optional_label: 'رابط الصورة (اختياري)',
    image_url_placeholder: 'https://example.com/image.jpg',
    preview_alt: 'معاينة',
    about_creating_services_title: 'عن انشاء الخدمات',
    about_creating_services_desc:
      'عند انشاء خدمة، سيتم ربطك بها تلقائيا كمقدم خدمة. سيتمكن العملاء من حجز هذه الخدمة معك. يمكنك تعديل خدماتك في اي وقت.',
    cancel: 'الغاء',
    creating: 'جار الانشاء...',
    error_no_business_linked: 'لا توجد منشاة مرتبطة',
    error_missing_business_id: 'معرف المنشاة مفقود',
    error_auth_token_missing: 'رمز التحقق مفقود. يرجى تسجيل الدخول مرة اخرى.',
    error_create_service_failed: 'فشل انشاء الخدمة',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function staffServicesT(
  locale: LocaleCode,
  key: StaffServicesKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = STAFF_SERVICES_DICTIONARY[locale] ?? STAFF_SERVICES_DICTIONARY.en;
  const value = dictionary[key] ?? STAFF_SERVICES_DICTIONARY.en[key];
  return interpolate(value, params);
}
