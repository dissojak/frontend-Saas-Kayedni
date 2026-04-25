import type { LocaleCode } from '@global/lib/locales';

export type BusinessServicesKey =
  | 'loading_services'
  | 'title'
  | 'subtitle'
  | 'services_count'
  | 'add_service'
  | 'edit_service'
  | 'create_service'
  | 'edit_service_desc'
  | 'create_service_desc'
  | 'service_name'
  | 'service_name_placeholder'
  | 'description'
  | 'description_placeholder'
  | 'duration_minutes'
  | 'price'
  | 'image_url'
  | 'image_url_placeholder'
  | 'assign_staff_optional'
  | 'cancel'
  | 'saving'
  | 'update_service'
  | 'search_services'
  | 'empty_search'
  | 'empty_services'
  | 'create_first_service'
  | 'active'
  | 'minutes'
  | 'edit'
  | 'delete'
  | 'confirm_delete'
  | 'error_save_service'
  | 'error_delete_service'
  | 'about_title'
  | 'about_1'
  | 'about_2'
  | 'about_3'
  | 'about_4';

const BUSINESS_SERVICES_DICTIONARY: Record<LocaleCode, Record<BusinessServicesKey, string>> = {
  en: {
    loading_services: 'Loading services...',
    title: 'Services Management',
    subtitle: 'Manage your business offerings and pricing',
    services_count: '{count} Services',
    add_service: 'Add Service',
    edit_service: 'Edit Service',
    create_service: 'Create New Service',
    edit_service_desc: 'Update the details of your service',
    create_service_desc: 'Add a new service to your business offerings',
    service_name: 'Service Name *',
    service_name_placeholder: 'e.g., Haircut & Styling',
    description: 'Description',
    description_placeholder: 'Describe your service...',
    duration_minutes: 'Duration (minutes) *',
    price: 'Price ($) *',
    image_url: 'Image URL',
    image_url_placeholder: 'https://example.com/image.jpg',
    assign_staff_optional: 'Assign Staff (Optional)',
    cancel: 'Cancel',
    saving: 'Saving...',
    update_service: 'Update Service',
    search_services: 'Search services...',
    empty_search: 'No services found matching your search',
    empty_services: 'No services yet',
    create_first_service: 'Create Your First Service',
    active: 'Active',
    minutes: '{count} minutes',
    edit: 'Edit',
    delete: 'Delete',
    confirm_delete: 'Are you sure you want to delete this service?',
    error_save_service: 'Failed to save service',
    error_delete_service: 'Failed to delete service',
    about_title: 'About Services',
    about_1: 'Create and manage services your business offers',
    about_2: 'Set duration and pricing for each service',
    about_3: 'Assign staff members who can provide each service',
    about_4: 'Services can be edited or removed at any time',
  },
  fr: {
    loading_services: 'Chargement des services...',
    title: 'Gestion des services',
    subtitle: 'Gerez vos offres et vos tarifs',
    services_count: '{count} services',
    add_service: 'Ajouter un service',
    edit_service: 'Modifier le service',
    create_service: 'Creer un service',
    edit_service_desc: 'Mettez a jour les details du service',
    create_service_desc: 'Ajoutez un nouveau service a vos offres',
    service_name: 'Nom du service *',
    service_name_placeholder: 'ex : Coupe & styling',
    description: 'Description',
    description_placeholder: 'Decrivez votre service...',
    duration_minutes: 'Duree (minutes) *',
    price: 'Prix ($) *',
    image_url: 'URL image',
    image_url_placeholder: 'https://example.com/image.jpg',
    assign_staff_optional: 'Assigner du staff (optionnel)',
    cancel: 'Annuler',
    saving: 'Enregistrement...',
    update_service: 'Mettre a jour',
    search_services: 'Rechercher des services...',
    empty_search: 'Aucun service ne correspond a votre recherche',
    empty_services: 'Aucun service pour le moment',
    create_first_service: 'Creer votre premier service',
    active: 'Actif',
    minutes: '{count} min',
    edit: 'Modifier',
    delete: 'Supprimer',
    confirm_delete: 'Voulez-vous vraiment supprimer ce service ?',
    error_save_service: 'Impossible d\'enregistrer le service',
    error_delete_service: 'Impossible de supprimer le service',
    about_title: 'A propos des services',
    about_1: 'Creez et gerez les services proposes par votre business',
    about_2: 'Definissez la duree et le prix de chaque service',
    about_3: 'Assignez les membres du staff pour chaque service',
    about_4: 'Les services peuvent etre modifies ou supprimes a tout moment',
  },
  ar: {
    loading_services: 'جار تحميل الخدمات...',
    title: 'ادارة الخدمات',
    subtitle: 'ادِر عروض منشأتك وتسعيرها',
    services_count: '{count} خدمات',
    add_service: 'اضافة خدمة',
    edit_service: 'تعديل الخدمة',
    create_service: 'انشاء خدمة جديدة',
    edit_service_desc: 'حدّث تفاصيل الخدمة',
    create_service_desc: 'اضف خدمة جديدة الى عروض منشأتك',
    service_name: 'اسم الخدمة *',
    service_name_placeholder: 'مثال: قص وتصفيف',
    description: 'الوصف',
    description_placeholder: 'اكتب وصف الخدمة...',
    duration_minutes: 'المدة (بالدقائق) *',
    price: 'السعر ($) *',
    image_url: 'رابط الصورة',
    image_url_placeholder: 'https://example.com/image.jpg',
    assign_staff_optional: 'تعيين موظفين (اختياري)',
    cancel: 'الغاء',
    saving: 'جار الحفظ...',
    update_service: 'تحديث الخدمة',
    search_services: 'ابحث عن الخدمات...',
    empty_search: 'لا توجد خدمات مطابقة لبحثك',
    empty_services: 'لا توجد خدمات بعد',
    create_first_service: 'انشئ اول خدمة',
    active: 'نشط',
    minutes: '{count} دقيقة',
    edit: 'تعديل',
    delete: 'حذف',
    confirm_delete: 'هل تريد حذف هذه الخدمة بالتأكيد؟',
    error_save_service: 'تعذر حفظ الخدمة',
    error_delete_service: 'تعذر حذف الخدمة',
    about_title: 'وصف الخدمات',
    about_1: 'انشئ وادِر الخدمات التي تقدمها منشأتك',
    about_2: 'حدّد مدة كل خدمة وسعرها',
    about_3: 'عيّن الموظفين القادرين على تقديم كل خدمة',
    about_4: 'يمكن تعديل الخدمات او حذفها في اي وقت',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function businessServicesT(
  locale: LocaleCode,
  key: BusinessServicesKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = BUSINESS_SERVICES_DICTIONARY[locale] ?? BUSINESS_SERVICES_DICTIONARY.en;
  const value = dictionary[key] ?? BUSINESS_SERVICES_DICTIONARY.en[key];
  return interpolate(value, params);
}
