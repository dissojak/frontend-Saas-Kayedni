import type { LocaleCode } from '@global/lib/locales';

export type BusinessBookingsKey =
  | 'loading_bookings'
  | 'error_title'
  | 'error_retry'
  | 'error_load_bookings'
  | 'title'
  | 'qr_panel_title'
  | 'qr_panel_desc'
  | 'qr_panel_updated'
  | 'qr_view'
  | 'qr_share_business'
  | 'qr_unavailable'
  | 'today_schedule'
  | 'appointments_count'
  | 'no_appointments_today_title'
  | 'no_appointments_today_desc'
  | 'search_placeholder'
  | 'status_placeholder'
  | 'status_all'
  | 'status_pending'
  | 'status_confirmed'
  | 'status_completed'
  | 'status_cancelled'
  | 'status_no_show'
  | 'status_rejected'
  | 'status_unknown'
  | 'sort_placeholder'
  | 'sort_date'
  | 'sort_price'
  | 'sort_client'
  | 'tab_upcoming'
  | 'tab_active_short'
  | 'tab_completed'
  | 'tab_done_short'
  | 'tab_cancelled'
  | 'tab_canceled_short'
  | 'empty_upcoming_title'
  | 'empty_upcoming_desc'
  | 'empty_completed_title'
  | 'empty_completed_desc'
  | 'empty_cancelled_title'
  | 'empty_cancelled_desc'
  | 'quick_today'
  | 'quick_all_upcoming'
  | 'quick_completed'
  | 'banner_in_session_now'
  | 'banner_up_next'
  | 'banner_starting_soon'
  | 'time_booking_from_to'
  | 'time_to'
  | 'staff_label'
  | 'note_label'
  | 'card_client'
  | 'card_contact'
  | 'card_date'
  | 'card_time'
  | 'card_price'
  | 'card_today'
  | 'action_confirm_booking'
  | 'action_complete_session'
  | 'action_mark_complete'
  | 'action_call_client_now'
  | 'action_no_show'
  | 'action_cancel'
  | 'action_reject'
  | 'card_notes_label'
  | 'dialog_mark_no_show'
  | 'dialog_reject_booking'
  | 'dialog_cancel_booking'
  | 'dialog_cancel_message'
  | 'dialog_no_show_message'
  | 'dialog_client_notified'
  | 'dialog_no_show_hint'
  | 'dialog_choose_saved_reason'
  | 'dialog_custom_reason'
  | 'dialog_manage_reasons'
  | 'dialog_list_of_reasons'
  | 'dialog_select_reason_edit'
  | 'dialog_delete_selected_reason'
  | 'dialog_write_reason'
  | 'dialog_save'
  | 'dialog_add'
  | 'dialog_done'
  | 'dialog_go_back'
  | 'dialog_yes_reject'
  | 'dialog_yes_cancel'
  | 'dialog_yes_no_show';

const BUSINESS_BOOKINGS_DICTIONARY: Record<LocaleCode, Record<BusinessBookingsKey, string>> = {
  en: {
    loading_bookings: 'Loading bookings...',
    error_title: 'Something went wrong',
    error_retry: 'Try Again',
    error_load_bookings: 'Failed to load bookings. Please try again.',
    title: 'Business Bookings',
    qr_panel_title: 'Business QR',
    qr_panel_desc: 'Use the QR panel to share or print the active business link.',
    qr_panel_updated: 'Last updated',
    qr_view: 'View QR',
    qr_share_business: 'Share Business',
    qr_unavailable: 'QR not available yet.',
    today_schedule: "Today's Schedule",
    appointments_count: '{count} appointments',
    no_appointments_today_title: 'No appointments today',
    no_appointments_today_desc: 'Check the upcoming tab for future bookings.',
    search_placeholder: 'Search by client, service, or staff...',
    status_placeholder: 'Status',
    status_all: 'All Status',
    status_pending: 'Pending',
    status_confirmed: 'Confirmed',
    status_completed: 'Completed',
    status_cancelled: 'Cancelled',
    status_no_show: 'No Show',
    status_rejected: 'Rejected',
    status_unknown: 'Unknown',
    sort_placeholder: 'Sort',
    sort_date: 'By Date',
    sort_price: 'By Price',
    sort_client: 'By Client',
    tab_upcoming: 'Upcoming',
    tab_active_short: 'Active',
    tab_completed: 'Completed',
    tab_done_short: 'Done',
    tab_cancelled: 'Cancelled',
    tab_canceled_short: 'Canceled',
    empty_upcoming_title: 'No upcoming bookings',
    empty_upcoming_desc: 'New bookings will appear here',
    empty_completed_title: 'No completed bookings yet',
    empty_completed_desc: 'Completed sessions will appear here',
    empty_cancelled_title: 'No cancelled bookings',
    empty_cancelled_desc: 'Cancelled bookings will appear here',
    quick_today: 'Today',
    quick_all_upcoming: 'All Upcoming',
    quick_completed: 'Completed',
    banner_in_session_now: 'In Session Now',
    banner_up_next: 'Up Next',
    banner_starting_soon: 'Starting Soon',
    time_booking_from_to: 'from {from} to {to}',
    time_to: 'to',
    staff_label: 'Staff',
    note_label: 'Note',
    card_client: 'Client',
    card_contact: 'Contact',
    card_date: 'Date',
    card_time: 'Time',
    card_price: 'Price',
    card_today: 'Today',
    action_confirm_booking: 'Confirm Booking',
    action_complete_session: 'Complete Session',
    action_mark_complete: 'Mark Complete',
    action_call_client_now: 'Call Client Now',
    action_no_show: 'No Show',
    action_cancel: 'Cancel',
    action_reject: 'Reject',
    card_notes_label: 'Notes',
    dialog_mark_no_show: 'Mark as No-Show?',
    dialog_reject_booking: 'Reject Booking?',
    dialog_cancel_booking: 'Cancel Booking?',
    dialog_cancel_message: 'Are you sure you want to {action} the booking for {name}?',
    dialog_no_show_message: 'Mark {name} as a no-show?',
    dialog_client_notified: 'The client will be notified.',
    dialog_no_show_hint: 'This indicates the client did not attend their scheduled appointment.',
    dialog_choose_saved_reason: 'Choose a saved reason...',
    dialog_custom_reason: 'Custom reason...',
    dialog_manage_reasons: 'Manage your predefined reasons list',
    dialog_list_of_reasons: 'List of reasons',
    dialog_select_reason_edit: 'Select a reason to edit...',
    dialog_delete_selected_reason: 'Delete selected reason',
    dialog_write_reason: 'Write reason here...',
    dialog_save: 'Save',
    dialog_add: 'Add',
    dialog_done: 'Done',
    dialog_go_back: 'Go Back',
    dialog_yes_reject: 'Yes, Reject Booking',
    dialog_yes_cancel: 'Yes, Cancel Booking',
    dialog_yes_no_show: 'Yes, Mark No-Show',
  },
  fr: {
    loading_bookings: 'Chargement des reservations...',
    error_title: 'Une erreur est survenue',
    error_retry: 'Reessayer',
    error_load_bookings: 'Impossible de charger les reservations. Reessayez.',
    title: 'Reservations business',
    qr_panel_title: 'QR du business',
    qr_panel_desc: 'Utilisez le panneau QR pour partager ou imprimer le lien du business actif.',
    qr_panel_updated: 'Derniere mise a jour',
    qr_view: 'Voir le QR',
    qr_share_business: 'Partager le business',
    qr_unavailable: 'QR pas encore disponible.',
    today_schedule: 'Planning du jour',
    appointments_count: '{count} rendez-vous',
    no_appointments_today_title: 'Aucun rendez-vous aujourd\'hui',
    no_appointments_today_desc: 'Consultez l\'onglet a venir pour les prochaines reservations.',
    search_placeholder: 'Rechercher par client, service ou staff...',
    status_placeholder: 'Statut',
    status_all: 'Tous les statuts',
    status_pending: 'En attente',
    status_confirmed: 'Confirme',
    status_completed: 'Termine',
    status_cancelled: 'Annule',
    status_no_show: 'Absence',
    status_rejected: 'Rejete',
    status_unknown: 'Inconnu',
    sort_placeholder: 'Tri',
    sort_date: 'Par date',
    sort_price: 'Par prix',
    sort_client: 'Par client',
    tab_upcoming: 'A venir',
    tab_active_short: 'Actif',
    tab_completed: 'Terminees',
    tab_done_short: 'Fait',
    tab_cancelled: 'Annulees',
    tab_canceled_short: 'Annulees',
    empty_upcoming_title: 'Aucune reservation a venir',
    empty_upcoming_desc: 'Les nouvelles reservations apparaitront ici',
    empty_completed_title: 'Aucune reservation terminee',
    empty_completed_desc: 'Les sessions terminees apparaitront ici',
    empty_cancelled_title: 'Aucune reservation annulee',
    empty_cancelled_desc: 'Les reservations annulees apparaitront ici',
    quick_today: 'Aujourd\'hui',
    quick_all_upcoming: 'Toutes a venir',
    quick_completed: 'Terminees',
    banner_in_session_now: 'Session en cours',
    banner_up_next: 'Prochaine',
    banner_starting_soon: 'Demarre bientot',
    time_booking_from_to: 'de {from} a {to}',
    time_to: 'a',
    staff_label: 'Staff',
    note_label: 'Note',
    card_client: 'Client',
    card_contact: 'Contact',
    card_date: 'Date',
    card_time: 'Heure',
    card_price: 'Prix',
    card_today: 'Aujourd\'hui',
    action_confirm_booking: 'Confirmer la reservation',
    action_complete_session: 'Terminer la session',
    action_mark_complete: 'Marquer terminee',
    action_call_client_now: 'Appeler le client',
    action_no_show: 'Absence',
    action_cancel: 'Annuler',
    action_reject: 'Refuser',
    card_notes_label: 'Notes',
    dialog_mark_no_show: 'Marquer en absence ?',
    dialog_reject_booking: 'Refuser la reservation ?',
    dialog_cancel_booking: 'Annuler la reservation ?',
    dialog_cancel_message: 'Voulez-vous vraiment {action} la reservation de {name} ?',
    dialog_no_show_message: 'Marquer {name} en absence ?',
    dialog_client_notified: 'Le client sera notifie.',
    dialog_no_show_hint: 'Cela indique que le client ne s\'est pas presente au rendez-vous.',
    dialog_choose_saved_reason: 'Choisir une raison enregistree...',
    dialog_custom_reason: 'Raison personnalisee...',
    dialog_manage_reasons: 'Gerer la liste des raisons predefinies',
    dialog_list_of_reasons: 'Liste des raisons',
    dialog_select_reason_edit: 'Selectionnez une raison a modifier...',
    dialog_delete_selected_reason: 'Supprimer la raison selectionnee',
    dialog_write_reason: 'Ecrivez la raison ici...',
    dialog_save: 'Enregistrer',
    dialog_add: 'Ajouter',
    dialog_done: 'Termine',
    dialog_go_back: 'Retour',
    dialog_yes_reject: 'Oui, refuser la reservation',
    dialog_yes_cancel: 'Oui, annuler la reservation',
    dialog_yes_no_show: 'Oui, marquer en absence',
  },
  ar: {
    loading_bookings: 'جار تحميل الحجوزات...',
    error_title: 'حدث خطأ ما',
    error_retry: 'حاول مجددا',
    error_load_bookings: 'تعذر تحميل الحجوزات. حاول مرة اخرى.',
    title: 'حجوزات المنشأة',
    qr_panel_title: 'رمز QR للنشاط',
    qr_panel_desc: 'استخدم لوحة QR لمشاركة او طباعة رابط النشاط الحالي.',
    qr_panel_updated: 'آخر تحديث',
    qr_view: 'عرض QR',
    qr_share_business: 'مشاركة النشاط',
    qr_unavailable: 'رمز QR غير متاح بعد.',
    today_schedule: 'جدول اليوم',
    appointments_count: '{count} مواعيد',
    no_appointments_today_title: 'لا توجد مواعيد اليوم',
    no_appointments_today_desc: 'تحقق من تبويب القادمة لمعرفة الحجوزات المقبلة.',
    search_placeholder: 'ابحث بالعميل او الخدمة او الموظف...',
    status_placeholder: 'الحالة',
    status_all: 'كل الحالات',
    status_pending: 'قيد الانتظار',
    status_confirmed: 'مؤكد',
    status_completed: 'مكتمل',
    status_cancelled: 'ملغي',
    status_no_show: 'عدم حضور',
    status_rejected: 'مرفوض',
    status_unknown: 'غير معروف',
    sort_placeholder: 'الترتيب',
    sort_date: 'حسب التاريخ',
    sort_price: 'حسب السعر',
    sort_client: 'حسب العميل',
    tab_upcoming: 'القادمة',
    tab_active_short: 'نشط',
    tab_completed: 'المكتملة',
    tab_done_short: 'تم',
    tab_cancelled: 'الملغاة',
    tab_canceled_short: 'الملغاة',
    empty_upcoming_title: 'لا توجد حجوزات قادمة',
    empty_upcoming_desc: 'ستظهر الحجوزات الجديدة هنا',
    empty_completed_title: 'لا توجد حجوزات مكتملة بعد',
    empty_completed_desc: 'ستظهر الجلسات المكتملة هنا',
    empty_cancelled_title: 'لا توجد حجوزات ملغاة',
    empty_cancelled_desc: 'ستظهر الحجوزات الملغاة هنا',
    quick_today: 'اليوم',
    quick_all_upcoming: 'كل القادمة',
    quick_completed: 'مكتملة',
    banner_in_session_now: 'جلسة جارية الان',
    banner_up_next: 'التالي',
    banner_starting_soon: 'سيبدأ قريبا',
    time_booking_from_to: 'من {from} الى {to}',
    time_to: 'الى',
    staff_label: 'الموظف',
    note_label: 'ملاحظة',
    card_client: 'العميل',
    card_contact: 'التواصل',
    card_date: 'التاريخ',
    card_time: 'الوقت',
    card_price: 'السعر',
    card_today: 'اليوم',
    action_confirm_booking: 'تأكيد الحجز',
    action_complete_session: 'انهاء الجلسة',
    action_mark_complete: 'تعيين كمكتمل',
    action_call_client_now: 'استدعاء العميل الان',
    action_no_show: 'عدم حضور',
    action_cancel: 'الغاء',
    action_reject: 'رفض',
    card_notes_label: 'ملاحظات',
    dialog_mark_no_show: 'تعيين كعدم حضور؟',
    dialog_reject_booking: 'رفض الحجز؟',
    dialog_cancel_booking: 'الغاء الحجز؟',
    dialog_cancel_message: 'هل تريد {action} حجز {name}؟',
    dialog_no_show_message: 'تعيين {name} كعدم حضور؟',
    dialog_client_notified: 'سيتم اشعار العميل.',
    dialog_no_show_hint: 'هذا يعني ان العميل لم يحضر الموعد المجدول.',
    dialog_choose_saved_reason: 'اختر سببا محفوظا...',
    dialog_custom_reason: 'سبب مخصص...',
    dialog_manage_reasons: 'ادارة قائمة الاسباب الجاهزة',
    dialog_list_of_reasons: 'قائمة الاسباب',
    dialog_select_reason_edit: 'اختر سببا للتعديل...',
    dialog_delete_selected_reason: 'حذف السبب المحدد',
    dialog_write_reason: 'اكتب السبب هنا...',
    dialog_save: 'حفظ',
    dialog_add: 'اضافة',
    dialog_done: 'تم',
    dialog_go_back: 'رجوع',
    dialog_yes_reject: 'نعم، رفض الحجز',
    dialog_yes_cancel: 'نعم، الغاء الحجز',
    dialog_yes_no_show: 'نعم، تعيين كعدم حضور',
  },
};

const STATUS_KEY_BY_CODE: Record<string, BusinessBookingsKey> = {
  PENDING: 'status_pending',
  CONFIRMED: 'status_confirmed',
  COMPLETED: 'status_completed',
  CANCELLED: 'status_cancelled',
  NO_SHOW: 'status_no_show',
  REJECTED: 'status_rejected',
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function businessBookingsT(
  locale: LocaleCode,
  key: BusinessBookingsKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = BUSINESS_BOOKINGS_DICTIONARY[locale] ?? BUSINESS_BOOKINGS_DICTIONARY.en;
  const value = dictionary[key] ?? BUSINESS_BOOKINGS_DICTIONARY.en[key];
  return interpolate(value, params);
}

export function businessBookingStatusT(locale: LocaleCode, status: string | null | undefined): string {
  if (!status) {
    return businessBookingsT(locale, 'status_unknown');
  }

  const normalized = status.toUpperCase();
  const key = STATUS_KEY_BY_CODE[normalized];
  return key ? businessBookingsT(locale, key) : businessBookingsT(locale, 'status_unknown');
}

export function businessBookingsDateLocale(locale: LocaleCode): string {
  if (locale === 'fr') {
    return 'fr-FR';
  }

  if (locale === 'ar') {
    return 'ar-TN';
  }

  return 'en-US';
}
