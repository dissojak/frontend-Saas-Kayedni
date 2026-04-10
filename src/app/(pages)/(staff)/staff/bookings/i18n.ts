import type { LocaleCode } from '@global/lib/locales';

export type StaffBookingsKey =
  | 'loading_bookings'
  | 'session_expired_error'
  | 'failed_load_error'
  | 'reminder_sent_title'
  | 'reminder_sent_desc'
  | 'reminder_failed_title'
  | 'reminder_failed_desc'
  | 'error_title'
  | 'try_again'
  | 'log_in_again'
  | 'title'
  | 'walk_in_title'
  | 'walk_in_desc'
  | 'today_schedule_title'
  | 'appointments_count'
  | 'time_to'
  | 'now_badge'
  | 'next_badge'
  | 'confirm'
  | 'complete'
  | 'sending'
  | 'call_client_now'
  | 'no_show'
  | 'reject'
  | 'cancel'
  | 'no_appointments_today_title'
  | 'no_appointments_today_desc'
  | 'search_placeholder'
  | 'status_placeholder'
  | 'sort_placeholder'
  | 'status_all'
  | 'status_pending'
  | 'status_confirmed'
  | 'status_completed'
  | 'status_cancelled'
  | 'status_rejected'
  | 'status_no_show'
  | 'sort_date'
  | 'sort_price'
  | 'sort_client'
  | 'tab_upcoming'
  | 'tab_upcoming_mobile'
  | 'tab_pending'
  | 'tab_pending_mobile'
  | 'tab_completed'
  | 'tab_completed_mobile'
  | 'tab_cancelled'
  | 'tab_cancelled_mobile'
  | 'tab_rejected'
  | 'tab_rejected_mobile'
  | 'no_upcoming_title'
  | 'no_upcoming_desc'
  | 'no_pending_title'
  | 'no_pending_desc'
  | 'no_completed_title'
  | 'no_completed_desc'
  | 'no_cancelled_title'
  | 'no_cancelled_desc'
  | 'no_rejected_title'
  | 'no_rejected_desc'
  | 'walkin_button'
  | 'walkin_step_select_title'
  | 'walkin_step_create_title'
  | 'walkin_step_book_title'
  | 'walkin_step_select_desc'
  | 'walkin_step_create_desc'
  | 'walkin_step_book_desc'
  | 'walkin_error_load_clients'
  | 'walkin_error_active_bookings'
  | 'walkin_error_check_client_bookings'
  | 'walkin_error_delete_client'
  | 'walkin_error_name_phone_required'
  | 'walkin_error_create_client'
  | 'walkin_error_required_fields'
  | 'walkin_error_service_not_found'
  | 'walkin_error_create_booking'
  | 'walkin_existing_clients'
  | 'walkin_no_clients_title'
  | 'walkin_no_clients_desc'
  | 'walkin_or'
  | 'walkin_create_new_client'
  | 'walkin_name_label'
  | 'walkin_phone_label'
  | 'walkin_notes_optional'
  | 'walkin_client_name_placeholder'
  | 'walkin_phone_placeholder'
  | 'walkin_client_notes_placeholder'
  | 'walkin_back'
  | 'walkin_creating'
  | 'walkin_create_continue'
  | 'walkin_service_label'
  | 'walkin_select_service'
  | 'walkin_no_services_available'
  | 'walkin_service_option'
  | 'walkin_date_label'
  | 'walkin_start_time_label'
  | 'walkin_end_time_label'
  | 'walkin_booking_notes_label'
  | 'walkin_booking_notes_placeholder'
  | 'walkin_create_booking'
  | 'walkin_delete_client_title'
  | 'walkin_delete_client_confirm'
  | 'walkin_delete_completed_warning_title'
  | 'walkin_delete_completed_warning_desc'
  | 'walkin_delete_previous_warning_title'
  | 'walkin_delete_previous_warning_desc'
  | 'walkin_delete_no_bookings_desc'
  | 'walkin_deleting'
  | 'walkin_delete_client_action';

const STAFF_BOOKINGS_DICTIONARY: Record<LocaleCode, Record<StaffBookingsKey, string>> = {
  en: {
    loading_bookings: 'Loading bookings...',
    session_expired_error: 'Session expired. Please log in again.',
    failed_load_error: 'Failed to load bookings. Please try again.',
    reminder_sent_title: 'Reminder sent',
    reminder_sent_desc: 'Telegram reminder was sent to the client.',
    reminder_failed_title: 'Failed to send reminder',
    reminder_failed_desc: 'Please try again.',
    error_title: 'Something went wrong',
    try_again: 'Try again',
    log_in_again: 'Log in again',
    title: 'My bookings',
    walk_in_title: 'Walk-in client booking',
    walk_in_desc: 'Quickly book a service for walk-in clients. Select an existing client or create a new one.',
    today_schedule_title: "Today's schedule",
    appointments_count: '{count} appointments',
    time_to: 'to',
    now_badge: 'Now',
    next_badge: 'Next',
    confirm: 'Confirm',
    complete: 'Complete',
    sending: 'Sending...',
    call_client_now: 'Call client now',
    no_show: 'No show',
    reject: 'Reject',
    cancel: 'Cancel',
    no_appointments_today_title: 'No appointments today',
    no_appointments_today_desc: 'Enjoy your free day! Check the upcoming tab for future bookings.',
    search_placeholder: 'Search by client or service...',
    status_placeholder: 'Status',
    sort_placeholder: 'Sort',
    status_all: 'All status',
    status_pending: 'Pending',
    status_confirmed: 'Confirmed',
    status_completed: 'Completed',
    status_cancelled: 'Cancelled',
    status_rejected: 'Rejected',
    status_no_show: 'No show',
    sort_date: 'By date',
    sort_price: 'By price',
    sort_client: 'By client',
    tab_upcoming: 'Upcoming',
    tab_upcoming_mobile: 'Active',
    tab_pending: 'Pending',
    tab_pending_mobile: 'Wait',
    tab_completed: 'Completed',
    tab_completed_mobile: 'Done',
    tab_cancelled: 'Cancelled',
    tab_cancelled_mobile: 'Canceled',
    tab_rejected: 'Rejected',
    tab_rejected_mobile: 'Reject',
    no_upcoming_title: 'No upcoming bookings',
    no_upcoming_desc: 'New bookings will appear here',
    no_pending_title: 'No pending bookings',
    no_pending_desc: 'Pending requests will appear here waiting for confirmation',
    no_completed_title: 'No completed bookings yet',
    no_completed_desc: 'Completed sessions will appear here',
    no_cancelled_title: 'No cancelled bookings',
    no_cancelled_desc: 'Cancelled bookings will appear here',
    no_rejected_title: 'No rejected bookings',
    no_rejected_desc: 'Rejected requests will appear here',
    walkin_button: 'Book for walk-in client',
    walkin_step_select_title: 'Select or add client',
    walkin_step_create_title: 'Create new client',
    walkin_step_book_title: 'Book service for {name}',
    walkin_step_select_desc: 'Choose an existing client or create a new one',
    walkin_step_create_desc: 'Enter the client information',
    walkin_step_book_desc: 'Select a service and time slot',
    walkin_error_load_clients: 'Failed to load clients',
    walkin_error_active_bookings: 'Cannot delete client with active bookings',
    walkin_error_check_client_bookings: 'Failed to check client bookings',
    walkin_error_delete_client: 'Failed to delete client',
    walkin_error_name_phone_required: 'Name and phone are required',
    walkin_error_create_client: 'Failed to create client',
    walkin_error_required_fields: 'Please fill in all required fields',
    walkin_error_service_not_found: 'Service not found',
    walkin_error_create_booking: 'Failed to create booking',
    walkin_existing_clients: 'Existing clients ({count})',
    walkin_no_clients_title: 'No clients yet',
    walkin_no_clients_desc: 'Create your first one.',
    walkin_or: 'OR',
    walkin_create_new_client: 'Create new client',
    walkin_name_label: 'Name *',
    walkin_phone_label: 'Phone *',
    walkin_notes_optional: 'Notes (optional)',
    walkin_client_name_placeholder: 'Client name',
    walkin_phone_placeholder: '+1234567890',
    walkin_client_notes_placeholder: 'Any special notes about this client...',
    walkin_back: 'Back',
    walkin_creating: 'Creating...',
    walkin_create_continue: 'Create and continue',
    walkin_service_label: 'Service *',
    walkin_select_service: 'Select a service',
    walkin_no_services_available: 'No services available',
    walkin_service_option: '{name} - {price} ({duration} min)',
    walkin_date_label: 'Date *',
    walkin_start_time_label: 'Start time *',
    walkin_end_time_label: 'End time *',
    walkin_booking_notes_label: 'Notes (optional)',
    walkin_booking_notes_placeholder: 'Any special requests or notes...',
    walkin_create_booking: 'Create booking',
    walkin_delete_client_title: 'Delete client',
    walkin_delete_client_confirm: 'Are you sure you want to delete "{name}"?',
    walkin_delete_completed_warning_title: 'This client has completed bookings',
    walkin_delete_completed_warning_desc: 'They will also be deleted. This action cannot be undone.',
    walkin_delete_previous_warning_title: 'This client has previous bookings',
    walkin_delete_previous_warning_desc: '(cancelled/no-show) that will also be deleted. This action cannot be undone.',
    walkin_delete_no_bookings_desc: 'This client has no bookings. This action cannot be undone.',
    walkin_deleting: 'Deleting...',
    walkin_delete_client_action: 'Delete client',
  },
  fr: {
    loading_bookings: 'Chargement des reservations...',
    session_expired_error: 'Session expiree. Veuillez vous reconnecter.',
    failed_load_error: 'Echec du chargement des reservations. Veuillez reessayer.',
    reminder_sent_title: 'Rappel envoye',
    reminder_sent_desc: 'Le rappel Telegram a ete envoye au client.',
    reminder_failed_title: 'Echec de l envoi du rappel',
    reminder_failed_desc: 'Veuillez reessayer.',
    error_title: 'Une erreur est survenue',
    try_again: 'Reessayer',
    log_in_again: 'Se reconnecter',
    title: 'Mes reservations',
    walk_in_title: 'Reservation client sans rendez-vous',
    walk_in_desc: 'Reserve rapidement un service pour les clients sans rendez-vous. Selectionnez un client existant ou creez-en un nouveau.',
    today_schedule_title: 'Planning du jour',
    appointments_count: '{count} rendez-vous',
    time_to: 'a',
    now_badge: 'Maintenant',
    next_badge: 'Suivant',
    confirm: 'Confirmer',
    complete: 'Terminer',
    sending: 'Envoi...',
    call_client_now: 'Appeler le client maintenant',
    no_show: 'Absent',
    reject: 'Refuser',
    cancel: 'Annuler',
    no_appointments_today_title: 'Aucun rendez-vous aujourd hui',
    no_appointments_today_desc: 'Profitez de votre journee libre ! Consultez l onglet a venir pour les prochaines reservations.',
    search_placeholder: 'Rechercher par client ou service...',
    status_placeholder: 'Statut',
    sort_placeholder: 'Tri',
    status_all: 'Tous les statuts',
    status_pending: 'En attente',
    status_confirmed: 'Confirme',
    status_completed: 'Termine',
    status_cancelled: 'Annule',
    status_rejected: 'Rejete',
    status_no_show: 'Absent',
    sort_date: 'Par date',
    sort_price: 'Par prix',
    sort_client: 'Par client',
    tab_upcoming: 'A venir',
    tab_upcoming_mobile: 'Actif',
    tab_pending: 'En attente',
    tab_pending_mobile: 'Attente',
    tab_completed: 'Termines',
    tab_completed_mobile: 'Fait',
    tab_cancelled: 'Annules',
    tab_cancelled_mobile: 'Annules',
    tab_rejected: 'Rejetes',
    tab_rejected_mobile: 'Rejetes',
    no_upcoming_title: 'Aucune reservation a venir',
    no_upcoming_desc: 'Les nouvelles reservations apparaitront ici',
    no_pending_title: 'Aucune reservation en attente',
    no_pending_desc: 'Les demandes en attente apparaitront ici pour confirmation',
    no_completed_title: 'Aucune reservation terminee pour le moment',
    no_completed_desc: 'Les sessions terminees apparaitront ici',
    no_cancelled_title: 'Aucune reservation annulee',
    no_cancelled_desc: 'Les reservations annulees apparaitront ici',
    no_rejected_title: 'Aucune reservation rejetee',
    no_rejected_desc: 'Les demandes rejetees apparaitront ici',
    walkin_button: 'Reserver pour un client sans rendez-vous',
    walkin_step_select_title: 'Selectionner ou ajouter un client',
    walkin_step_create_title: 'Creer un nouveau client',
    walkin_step_book_title: 'Reserver un service pour {name}',
    walkin_step_select_desc: 'Choisissez un client existant ou creez-en un nouveau',
    walkin_step_create_desc: 'Saisissez les informations du client',
    walkin_step_book_desc: 'Selectionnez un service et un horaire',
    walkin_error_load_clients: 'Echec du chargement des clients',
    walkin_error_active_bookings: 'Impossible de supprimer un client avec des reservations actives',
    walkin_error_check_client_bookings: 'Echec de verification des reservations du client',
    walkin_error_delete_client: 'Echec de suppression du client',
    walkin_error_name_phone_required: 'Le nom et le telephone sont obligatoires',
    walkin_error_create_client: 'Echec de creation du client',
    walkin_error_required_fields: 'Veuillez remplir tous les champs obligatoires',
    walkin_error_service_not_found: 'Service introuvable',
    walkin_error_create_booking: 'Echec de creation de la reservation',
    walkin_existing_clients: 'Clients existants ({count})',
    walkin_no_clients_title: 'Aucun client pour le moment',
    walkin_no_clients_desc: 'Creez votre premier client.',
    walkin_or: 'OU',
    walkin_create_new_client: 'Creer un nouveau client',
    walkin_name_label: 'Nom *',
    walkin_phone_label: 'Telephone *',
    walkin_notes_optional: 'Notes (optionnel)',
    walkin_client_name_placeholder: 'Nom du client',
    walkin_phone_placeholder: '+1234567890',
    walkin_client_notes_placeholder: 'Notes speciales sur ce client...',
    walkin_back: 'Retour',
    walkin_creating: 'Creation...',
    walkin_create_continue: 'Creer et continuer',
    walkin_service_label: 'Service *',
    walkin_select_service: 'Selectionner un service',
    walkin_no_services_available: 'Aucun service disponible',
    walkin_service_option: '{name} - {price} ({duration} min)',
    walkin_date_label: 'Date *',
    walkin_start_time_label: 'Heure de debut *',
    walkin_end_time_label: 'Heure de fin *',
    walkin_booking_notes_label: 'Notes (optionnel)',
    walkin_booking_notes_placeholder: 'Demandes speciales ou notes...',
    walkin_create_booking: 'Creer la reservation',
    walkin_delete_client_title: 'Supprimer le client',
    walkin_delete_client_confirm: 'Voulez-vous vraiment supprimer "{name}" ?',
    walkin_delete_completed_warning_title: 'Ce client a des reservations terminees',
    walkin_delete_completed_warning_desc: 'Elles seront aussi supprimees. Cette action est irreversible.',
    walkin_delete_previous_warning_title: 'Ce client a des reservations precedentes',
    walkin_delete_previous_warning_desc: '(annulees/absence) qui seront aussi supprimees. Cette action est irreversible.',
    walkin_delete_no_bookings_desc: 'Ce client n a aucune reservation. Cette action est irreversible.',
    walkin_deleting: 'Suppression...',
    walkin_delete_client_action: 'Supprimer le client',
  },
  ar: {
    loading_bookings: 'جار تحميل الحجوزات...',
    session_expired_error: 'انتهت الجلسة. يرجى تسجيل الدخول مرة اخرى.',
    failed_load_error: 'فشل تحميل الحجوزات. يرجى المحاولة مرة اخرى.',
    reminder_sent_title: 'تم ارسال التذكير',
    reminder_sent_desc: 'تم ارسال تذكير تيليجرام الى العميل.',
    reminder_failed_title: 'فشل ارسال التذكير',
    reminder_failed_desc: 'يرجى المحاولة مرة اخرى.',
    error_title: 'حدث خطا ما',
    try_again: 'حاول مرة اخرى',
    log_in_again: 'سجل الدخول مجددا',
    title: 'حجوزاتي',
    walk_in_title: 'حجز عميل بدون موعد',
    walk_in_desc: 'احجز خدمة بسرعة للعملاء بدون موعد. اختر عميلا موجودا او انشئ عميلا جديدا.',
    today_schedule_title: 'جدول اليوم',
    appointments_count: '{count} موعد',
    time_to: 'الى',
    now_badge: 'الان',
    next_badge: 'التالي',
    confirm: 'تاكيد',
    complete: 'اكمال',
    sending: 'جار الارسال...',
    call_client_now: 'اتصل بالعميل الان',
    no_show: 'لم يحضر',
    reject: 'رفض',
    cancel: 'الغاء',
    no_appointments_today_title: 'لا توجد مواعيد اليوم',
    no_appointments_today_desc: 'استمتع بيومك الحر! تحقق من تبويب القادم للحجوزات المستقبلية.',
    search_placeholder: 'ابحث باسم العميل او الخدمة...',
    status_placeholder: 'الحالة',
    sort_placeholder: 'ترتيب',
    status_all: 'كل الحالات',
    status_pending: 'قيد الانتظار',
    status_confirmed: 'موكد',
    status_completed: 'مكتمل',
    status_cancelled: 'ملغي',
    status_rejected: 'مرفوض',
    status_no_show: 'لم يحضر',
    sort_date: 'حسب التاريخ',
    sort_price: 'حسب السعر',
    sort_client: 'حسب العميل',
    tab_upcoming: 'القادم',
    tab_upcoming_mobile: 'نشط',
    tab_pending: 'في الانتظار',
    tab_pending_mobile: 'انتظار',
    tab_completed: 'مكتمل',
    tab_completed_mobile: 'تم',
    tab_cancelled: 'ملغي',
    tab_cancelled_mobile: 'ملغي',
    tab_rejected: 'مرفوض',
    tab_rejected_mobile: 'رفض',
    no_upcoming_title: 'لا توجد حجوزات قادمة',
    no_upcoming_desc: 'ستظهر الحجوزات الجديدة هنا',
    no_pending_title: 'لا توجد حجوزات قيد الانتظار',
    no_pending_desc: 'ستظهر الطلبات المنتظرة هنا بانتظار التاكيد',
    no_completed_title: 'لا توجد حجوزات مكتملة بعد',
    no_completed_desc: 'ستظهر الجلسات المكتملة هنا',
    no_cancelled_title: 'لا توجد حجوزات ملغاة',
    no_cancelled_desc: 'ستظهر الحجوزات الملغاة هنا',
    no_rejected_title: 'لا توجد حجوزات مرفوضة',
    no_rejected_desc: 'ستظهر الطلبات المرفوضة هنا',
    walkin_button: 'احجز لعميل بدون موعد',
    walkin_step_select_title: 'اختر او اضف عميلا',
    walkin_step_create_title: 'انشئ عميلا جديدا',
    walkin_step_book_title: 'احجز خدمة للعميل {name}',
    walkin_step_select_desc: 'اختر عميلا موجودا او انشئ عميلا جديدا',
    walkin_step_create_desc: 'ادخل بيانات العميل',
    walkin_step_book_desc: 'اختر خدمة وموعدا زمنيا',
    walkin_error_load_clients: 'فشل تحميل العملاء',
    walkin_error_active_bookings: 'لا يمكن حذف عميل لديه حجوزات نشطة',
    walkin_error_check_client_bookings: 'فشل التحقق من حجوزات العميل',
    walkin_error_delete_client: 'فشل حذف العميل',
    walkin_error_name_phone_required: 'الاسم ورقم الهاتف مطلوبان',
    walkin_error_create_client: 'فشل انشاء العميل',
    walkin_error_required_fields: 'يرجى تعبئة كل الحقول المطلوبة',
    walkin_error_service_not_found: 'الخدمة غير موجودة',
    walkin_error_create_booking: 'فشل انشاء الحجز',
    walkin_existing_clients: 'العملاء المحليون ({count})',
    walkin_no_clients_title: 'لا يوجد عملاء بعد',
    walkin_no_clients_desc: 'انشئ اول عميل لك.',
    walkin_or: 'او',
    walkin_create_new_client: 'انشئ عميلا جديدا',
    walkin_name_label: 'الاسم *',
    walkin_phone_label: 'الهاتف *',
    walkin_notes_optional: 'ملاحظات (اختياري)',
    walkin_client_name_placeholder: 'اسم العميل',
    walkin_phone_placeholder: '+1234567890',
    walkin_client_notes_placeholder: 'اي ملاحظات خاصة عن هذا العميل...',
    walkin_back: 'رجوع',
    walkin_creating: 'جار الانشاء...',
    walkin_create_continue: 'انشاء ومتابعة',
    walkin_service_label: 'الخدمة *',
    walkin_select_service: 'اختر خدمة',
    walkin_no_services_available: 'لا توجد خدمات متاحة',
    walkin_service_option: '{name} - {price} ({duration} دقيقة)',
    walkin_date_label: 'التاريخ *',
    walkin_start_time_label: 'وقت البداية *',
    walkin_end_time_label: 'وقت النهاية *',
    walkin_booking_notes_label: 'ملاحظات (اختياري)',
    walkin_booking_notes_placeholder: 'اي طلبات او ملاحظات خاصة...',
    walkin_create_booking: 'انشئ الحجز',
    walkin_delete_client_title: 'حذف العميل',
    walkin_delete_client_confirm: 'هل انت متاكد من حذف "{name}"؟',
    walkin_delete_completed_warning_title: 'هذا العميل لديه حجوزات مكتملة',
    walkin_delete_completed_warning_desc: 'سيتم حذفها ايضا. لا يمكن التراجع عن هذا الاجراء.',
    walkin_delete_previous_warning_title: 'هذا العميل لديه حجوزات سابقة',
    walkin_delete_previous_warning_desc: '(ملغاة/عدم حضور) وسيتم حذفها ايضا. لا يمكن التراجع عن هذا الاجراء.',
    walkin_delete_no_bookings_desc: 'هذا العميل ليس لديه حجوزات. لا يمكن التراجع عن هذا الاجراء.',
    walkin_deleting: 'جار الحذف...',
    walkin_delete_client_action: 'حذف العميل',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function staffBookingsT(
  locale: LocaleCode,
  key: StaffBookingsKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = STAFF_BOOKINGS_DICTIONARY[locale] ?? STAFF_BOOKINGS_DICTIONARY.en;
  const value = dictionary[key] ?? STAFF_BOOKINGS_DICTIONARY.en[key];
  return interpolate(value, params);
}

export function staffBookingsLocaleTag(locale: LocaleCode): string {
  if (locale === 'fr') {
    return 'fr-FR';
  }

  if (locale === 'ar') {
    return 'ar-TN';
  }

  return 'en-US';
}
