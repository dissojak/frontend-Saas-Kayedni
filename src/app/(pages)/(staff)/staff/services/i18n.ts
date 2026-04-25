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
  | 'error_create_service_failed'
  | 'error_service_not_found'
  | 'error_failed_load_service'
  | 'error_failed_update_service'
  | 'error_failed_link_service'
  | 'error_error_link_service'
  | 'error_failed_unlink_service'
  | 'error_error_unlink_service'
  | 'error_failed_check_delete_safety'
  | 'error_error_check_delete_safety'
  | 'error_failed_delete_service'
  | 'error_error_delete_service'
  | 'error_failed_deactivate_service'
  | 'error_error_deactivate_service'
  | 'error_failed_reactivate_service'
  | 'error_error_reactivate_service'
  | 'na'
  | 'duration_minutes_long'
  | 'duration_hour_long'
  | 'duration_hours_long'
  | 'service_not_found_desc'
  | 'back_to_services'
  | 'edit_service'
  | 'service_details'
  | 'update_service_information'
  | 'view_service_information'
  | 'link_me_to_service'
  | 'unlink_me'
  | 'reactivate'
  | 'delete'
  | 'save_changes'
  | 'linked_to_service_notice'
  | 'image_url_label'
  | 'service_information'
  | 'active_status_label'
  | 'active_status_desc'
  | 'duration_label'
  | 'staff_providers_label'
  | 'staff_count'
  | 'no_staff_assigned'
  | 'join_as_provider'
  | 'service_info'
  | 'created_by'
  | 'created'
  | 'last_updated'
  | 'you_suffix'
  | 'can_edit_notice'
  | 'delete_service_title'
  | 'delete_confirm_question'
  | 'delete_cannot_undo'
  | 'check_related_bookings'
  | 'checking'
  | 'check_now'
  | 'delete_safe'
  | 'delete_not_recommended'
  | 'delete_caution'
  | 'total_label'
  | 'active_label'
  | 'deactivate_recommended_title'
  | 'deactivate_bullet_hidden'
  | 'deactivate_bullet_preserved'
  | 'deactivate_bullet_reactivate'
  | 'delete_permanently_title'
  | 'delete_bullet_links_removed'
  | 'delete_bullet_stats_lost'
  | 'delete_bullet_cannot_undo'
  | 'deactivating'
  | 'deactivate'
  | 'deleting';

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
    error_service_not_found: 'Service not found',
    error_failed_load_service: 'Failed to load service',
    error_failed_update_service: 'Failed to update service',
    error_failed_link_service: 'Failed to link to service',
    error_error_link_service: 'Error linking to service',
    error_failed_unlink_service: 'Failed to unlink from service',
    error_error_unlink_service: 'Error unlinking from service',
    error_failed_check_delete_safety: 'Failed to check delete safety',
    error_error_check_delete_safety: 'Error checking delete safety',
    error_failed_delete_service: 'Failed to delete service',
    error_error_delete_service: 'Error deleting service',
    error_failed_deactivate_service: 'Failed to deactivate service',
    error_error_deactivate_service: 'Error deactivating service',
    error_failed_reactivate_service: 'Failed to reactivate service',
    error_error_reactivate_service: 'Error reactivating service',
    na: 'N/A',
    duration_minutes_long: '{count} minutes',
    duration_hour_long: '{count} hour',
    duration_hours_long: '{count} hours',
    service_not_found_desc: 'The service you are looking for could not be found.',
    back_to_services: 'Back to services',
    edit_service: 'Edit service',
    service_details: 'Service details',
    update_service_information: 'Update service information',
    view_service_information: 'View service information',
    link_me_to_service: 'Link me to service',
    unlink_me: 'Unlink me',
    reactivate: 'Reactivate',
    delete: 'Delete',
    save_changes: 'Save changes',
    linked_to_service_notice: 'You are linked to this service - clients can book you for it',
    image_url_label: 'Image URL',
    service_information: 'Service information',
    active_status_label: 'Active status',
    active_status_desc: 'When active, this service is available for booking',
    duration_label: 'Duration',
    staff_providers_label: 'Staff providers',
    staff_count: '{count} staff',
    no_staff_assigned: 'No staff assigned yet',
    join_as_provider: 'Join as provider',
    service_info: 'Service info',
    created_by: 'Created by',
    created: 'Created',
    last_updated: 'Last updated',
    you_suffix: '(You)',
    can_edit_notice: 'You created this service and can edit it',
    delete_service_title: 'Delete service',
    delete_confirm_question: 'Are you sure you want to delete {name}?',
    delete_cannot_undo: 'This action cannot be undone.',
    check_related_bookings: 'Check for related bookings',
    checking: 'Checking...',
    check_now: 'Check now',
    delete_safe: 'Safe to delete',
    delete_not_recommended: 'Not recommended',
    delete_caution: 'Proceed with caution',
    total_label: 'Total',
    active_label: 'Active',
    deactivate_recommended_title: 'Deactivate (recommended if bookings exist)',
    deactivate_bullet_hidden: 'Service hidden from new bookings',
    deactivate_bullet_preserved: 'All data and history preserved',
    deactivate_bullet_reactivate: 'Can be reactivated later',
    delete_permanently_title: 'Delete permanently',
    delete_bullet_links_removed: 'All staff links removed',
    delete_bullet_stats_lost: 'Service statistics lost',
    delete_bullet_cannot_undo: 'Cannot be undone',
    deactivating: 'Deactivating...',
    deactivate: 'Deactivate',
    deleting: 'Deleting...',
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
    error_service_not_found: 'Service introuvable',
    error_failed_load_service: 'Echec du chargement du service',
    error_failed_update_service: 'Echec de mise a jour du service',
    error_failed_link_service: 'Echec de liaison au service',
    error_error_link_service: 'Erreur lors de la liaison au service',
    error_failed_unlink_service: 'Echec de suppression de la liaison du service',
    error_error_unlink_service: 'Erreur lors de la suppression de la liaison',
    error_failed_check_delete_safety: 'Echec de verification de suppression',
    error_error_check_delete_safety: 'Erreur lors de la verification de suppression',
    error_failed_delete_service: 'Echec de suppression du service',
    error_error_delete_service: 'Erreur lors de la suppression du service',
    error_failed_deactivate_service: 'Echec de desactivation du service',
    error_error_deactivate_service: 'Erreur lors de la desactivation du service',
    error_failed_reactivate_service: 'Echec de reactivation du service',
    error_error_reactivate_service: 'Erreur lors de la reactivation du service',
    na: 'N/A',
    duration_minutes_long: '{count} minutes',
    duration_hour_long: '{count} heure',
    duration_hours_long: '{count} heures',
    service_not_found_desc: 'Le service que vous cherchez est introuvable.',
    back_to_services: 'Retour aux services',
    edit_service: 'Modifier le service',
    service_details: 'Details du service',
    update_service_information: 'Mettre a jour les informations du service',
    view_service_information: 'Voir les informations du service',
    link_me_to_service: 'Me lier au service',
    unlink_me: 'Supprimer ma liaison',
    reactivate: 'Reactiver',
    delete: 'Supprimer',
    save_changes: 'Enregistrer les modifications',
    linked_to_service_notice: 'Vous etes lie a ce service - les clients peuvent reserver ce service avec vous',
    image_url_label: 'URL de l image',
    service_information: 'Informations du service',
    active_status_label: 'Statut actif',
    active_status_desc: 'Quand il est actif, ce service est disponible a la reservation',
    duration_label: 'Duree',
    staff_providers_label: 'Prestataires',
    staff_count: '{count} prestataire(s)',
    no_staff_assigned: 'Aucun prestataire assigne pour le moment',
    join_as_provider: 'Rejoindre comme prestataire',
    service_info: 'Infos service',
    created_by: 'Cree par',
    created: 'Cree',
    last_updated: 'Derniere mise a jour',
    you_suffix: '(Vous)',
    can_edit_notice: 'Vous avez cree ce service et pouvez le modifier',
    delete_service_title: 'Supprimer le service',
    delete_confirm_question: 'Voulez-vous vraiment supprimer {name} ?',
    delete_cannot_undo: 'Cette action est irreversible.',
    check_related_bookings: 'Verifier les reservations liees',
    checking: 'Verification...',
    check_now: 'Verifier',
    delete_safe: 'Suppression sure',
    delete_not_recommended: 'Non recommande',
    delete_caution: 'Proceder avec prudence',
    total_label: 'Total',
    active_label: 'Actif',
    deactivate_recommended_title: 'Desactiver (recommande si des reservations existent)',
    deactivate_bullet_hidden: 'Service masque pour les nouvelles reservations',
    deactivate_bullet_preserved: 'Toutes les donnees et l historique sont preserves',
    deactivate_bullet_reactivate: 'Peut etre reactive plus tard',
    delete_permanently_title: 'Supprimer definitivement',
    delete_bullet_links_removed: 'Tous les liens prestataires sont supprimes',
    delete_bullet_stats_lost: 'Les statistiques du service sont perdues',
    delete_bullet_cannot_undo: 'Impossible a annuler',
    deactivating: 'Desactivation...',
    deactivate: 'Desactiver',
    deleting: 'Suppression...',
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
    error_service_not_found: 'الخدمة غير موجودة',
    error_failed_load_service: 'فشل تحميل الخدمة',
    error_failed_update_service: 'فشل تحديث الخدمة',
    error_failed_link_service: 'فشل الربط بالخدمة',
    error_error_link_service: 'حدث خطا اثناء الربط بالخدمة',
    error_failed_unlink_service: 'فشل الغاء الربط من الخدمة',
    error_error_unlink_service: 'حدث خطا اثناء الغاء الربط من الخدمة',
    error_failed_check_delete_safety: 'فشل التحقق من امان الحذف',
    error_error_check_delete_safety: 'حدث خطا اثناء التحقق من امان الحذف',
    error_failed_delete_service: 'فشل حذف الخدمة',
    error_error_delete_service: 'حدث خطا اثناء حذف الخدمة',
    error_failed_deactivate_service: 'فشل تعطيل الخدمة',
    error_error_deactivate_service: 'حدث خطا اثناء تعطيل الخدمة',
    error_failed_reactivate_service: 'فشل اعادة تفعيل الخدمة',
    error_error_reactivate_service: 'حدث خطا اثناء اعادة تفعيل الخدمة',
    na: 'غير متاح',
    duration_minutes_long: '{count} دقيقة',
    duration_hour_long: '{count} ساعة',
    duration_hours_long: '{count} ساعات',
    service_not_found_desc: 'الخدمة التي تبحث عنها غير موجودة.',
    back_to_services: 'العودة الى الخدمات',
    edit_service: 'تعديل الخدمة',
    service_details: 'تفاصيل الخدمة',
    update_service_information: 'تحديث معلومات الخدمة',
    view_service_information: 'عرض معلومات الخدمة',
    link_me_to_service: 'اربطني بالخدمة',
    unlink_me: 'الغاء ربطي',
    reactivate: 'اعادة تفعيل',
    delete: 'حذف',
    save_changes: 'حفظ التغييرات',
    linked_to_service_notice: 'انت مرتبط بهذه الخدمة - يمكن للعملاء حجزها معك',
    image_url_label: 'رابط الصورة',
    service_information: 'معلومات الخدمة',
    active_status_label: 'حالة التفعيل',
    active_status_desc: 'عند التفعيل، تكون هذه الخدمة متاحة للحجز',
    duration_label: 'المدة',
    staff_providers_label: 'مقدمو الخدمة',
    staff_count: '{count} مقدم',
    no_staff_assigned: 'لا يوجد مقدمو خدمة بعد',
    join_as_provider: 'انضم كمقدم خدمة',
    service_info: 'معلومات الخدمة',
    created_by: 'انشئت بواسطة',
    created: 'تاريخ الانشاء',
    last_updated: 'اخر تحديث',
    you_suffix: '(انت)',
    can_edit_notice: 'لقد انشات هذه الخدمة ويمكنك تعديلها',
    delete_service_title: 'حذف الخدمة',
    delete_confirm_question: 'هل انت متاكد انك تريد حذف {name}؟',
    delete_cannot_undo: 'لا يمكن التراجع عن هذا الاجراء.',
    check_related_bookings: 'تحقق من الحجوزات المرتبطة',
    checking: 'جار التحقق...',
    check_now: 'تحقق الان',
    delete_safe: 'الحذف امن',
    delete_not_recommended: 'غير موصى به',
    delete_caution: 'تابع بحذر',
    total_label: 'الاجمالي',
    active_label: 'نشط',
    deactivate_recommended_title: 'تعطيل (يوصى به عند وجود حجوزات)',
    deactivate_bullet_hidden: 'سيتم اخفاء الخدمة عن الحجوزات الجديدة',
    deactivate_bullet_preserved: 'سيتم حفظ كل البيانات والسجل',
    deactivate_bullet_reactivate: 'يمكن اعادة تفعيلها لاحقا',
    delete_permanently_title: 'حذف نهائي',
    delete_bullet_links_removed: 'سيتم ازالة كل روابط مقدمي الخدمة',
    delete_bullet_stats_lost: 'ستفقد احصاءات الخدمة',
    delete_bullet_cannot_undo: 'لا يمكن التراجع',
    deactivating: 'جار التعطيل...',
    deactivate: 'تعطيل',
    deleting: 'جار الحذف...',
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

export function staffServicesLocaleTag(locale: LocaleCode): string {
  if (locale === 'fr') {
    return 'fr-FR';
  }

  if (locale === 'ar') {
    return 'ar-TN';
  }

  return 'en-US';
}
