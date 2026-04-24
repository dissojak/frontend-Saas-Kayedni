import type { LocaleCode } from '@global/lib/locales';

export type ClientDashboardKey =
  | 'status_pending'
  | 'status_confirmed'
  | 'status_completed'
  | 'status_cancelled'
  | 'status_no_show'
  | 'card_label_date'
  | 'card_label_time'
  | 'card_label_staff'
  | 'card_label_price'
  | 'card_duration_min'
  | 'card_note'
  | 'card_action_reschedule'
  | 'card_action_cancel'
  | 'card_action_edit_review'
  | 'card_action_leave_review'
  | 'card_action_book_again'
  | 'quick_link_soon'
  | 'header_welcome_back'
  | 'header_fallback_name'
  | 'header_upcoming_summary'
  | 'header_upcoming_summary_plural'
  | 'header_ready_to_book'
  | 'header_book_new'
  | 'section_upcoming_title'
  | 'section_upcoming_empty'
  | 'section_browse_services'
  | 'section_view_all_bookings'
  | 'section_past_title'
  | 'section_past_more_count'
  | 'section_past_empty'
  | 'section_favorites_title'
  | 'section_recommended_title'
  | 'section_recommended_from_history'
  | 'section_recommended_top_rated'
  | 'section_recommended_empty'
  | 'section_explore_all'
  | 'section_near_you_title'
  | 'section_coming_soon'
  | 'section_near_you_desc'
  | 'section_near_you_hint'
  | 'section_quick_actions_title'
  | 'quick_saved_businesses'
  | 'quick_help_support'
  | 'quick_payment_methods'
  | 'cancel_dialog_title'
  | 'cancel_dialog_desc'
  | 'cancel_dialog_keep'
  | 'cancel_dialog_confirm'
  | 'cancel_dialog_submitting'
  | 'reschedule_dialog_title'
  | 'reschedule_dialog_desc'
  | 'reschedule_dialog_current'
  | 'reschedule_dialog_new_date'
  | 'reschedule_dialog_new_time'
  | 'reschedule_dialog_loading_slots'
  | 'reschedule_dialog_select_time'
  | 'reschedule_dialog_no_slots'
  | 'reschedule_dialog_pick_date_first'
  | 'reschedule_dialog_cancel'
  | 'reschedule_dialog_confirm'
  | 'reschedule_dialog_submitting'
  | 'error_load_bookings_prefix'
  | 'error_dashboard_load_failed'
  | 'error_failed_cancel'
  | 'error_failed_reschedule';

const CLIENT_DASHBOARD_DICTIONARY: Record<LocaleCode, Record<ClientDashboardKey, string>> = {
  en: {
    status_pending: 'Pending',
    status_confirmed: 'Confirmed',
    status_completed: 'Completed',
    status_cancelled: 'Cancelled',
    status_no_show: 'No Show',
    card_label_date: 'Date',
    card_label_time: 'Time',
    card_label_staff: 'Staff',
    card_label_price: 'Price',
    card_duration_min: '{count} min service',
    card_note: 'Note:',
    card_action_reschedule: 'Reschedule',
    card_action_cancel: 'Cancel',
    card_action_edit_review: 'Edit Review',
    card_action_leave_review: 'Leave Review',
    card_action_book_again: 'Book Again',
    quick_link_soon: 'Soon',
    header_welcome_back: 'Welcome back, {name}! 👋',
    header_fallback_name: 'there',
    header_upcoming_summary: 'You have {count} upcoming appointment',
    header_upcoming_summary_plural: 'You have {count} upcoming appointments',
    header_ready_to_book: 'Ready to book your next appointment?',
    header_book_new: 'Book New Appointment',
    section_upcoming_title: 'Upcoming Appointments',
    section_upcoming_empty: 'No upcoming appointments',
    section_browse_services: 'Browse Services',
    section_view_all_bookings: 'View All Bookings',
    section_past_title: 'Past Appointments',
    section_past_more_count: '+{count} more past appointments',
    section_past_empty: 'No past appointments yet',
    section_favorites_title: 'Your Favorites',
    section_recommended_title: 'Recommended for You',
    section_recommended_from_history: 'Based on your booking history',
    section_recommended_top_rated: 'Top-rated businesses',
    section_recommended_empty: 'No recommendations yet',
    section_explore_all: 'Explore All Services',
    section_near_you_title: 'Near You',
    section_coming_soon: 'Coming Soon',
    section_near_you_desc: 'Location-based recommendations',
    section_near_you_hint: 'Find great services near your location',
    section_quick_actions_title: 'Quick Actions',
    quick_saved_businesses: 'Saved Businesses',
    quick_help_support: 'Help & Support',
    quick_payment_methods: 'Payment Methods',
    cancel_dialog_title: 'Cancel Appointment?',
    cancel_dialog_desc:
      'Are you sure you want to cancel your appointment at {business} for {service}? This action cannot be undone.',
    cancel_dialog_keep: 'Keep Appointment',
    cancel_dialog_confirm: 'Yes, Cancel',
    cancel_dialog_submitting: 'Cancelling...',
    reschedule_dialog_title: 'Reschedule Appointment',
    reschedule_dialog_desc: 'Select a new date and time for your appointment',
    reschedule_dialog_current: 'Current: {date}',
    reschedule_dialog_new_date: 'New Date',
    reschedule_dialog_new_time: 'New Time',
    reschedule_dialog_loading_slots: 'Loading available times...',
    reschedule_dialog_select_time: 'Select a time',
    reschedule_dialog_no_slots: 'No available time slots for this date. Please select another date.',
    reschedule_dialog_pick_date_first: 'Please select a date first to see available times',
    reschedule_dialog_cancel: 'Cancel',
    reschedule_dialog_confirm: 'Confirm Reschedule',
    reschedule_dialog_submitting: 'Rescheduling...',
    error_load_bookings_prefix: 'Could not load your bookings',
    error_dashboard_load_failed: 'Failed to load dashboard',
    error_failed_cancel: 'Failed to cancel booking',
    error_failed_reschedule: 'Failed to reschedule booking',
  },
  fr: {
    status_pending: 'En attente',
    status_confirmed: 'Confirmee',
    status_completed: 'Terminee',
    status_cancelled: 'Annulee',
    status_no_show: 'Absent',
    card_label_date: 'Date',
    card_label_time: 'Heure',
    card_label_staff: 'Personnel',
    card_label_price: 'Prix',
    card_duration_min: 'Service de {count} min',
    card_note: 'Note :',
    card_action_reschedule: 'Reprogrammer',
    card_action_cancel: 'Annuler',
    card_action_edit_review: 'Modifier l avis',
    card_action_leave_review: 'Laisser un avis',
    card_action_book_again: 'Reserver a nouveau',
    quick_link_soon: 'Bientot',
    header_welcome_back: 'Bon retour, {name} ! 👋',
    header_fallback_name: 'vous',
    header_upcoming_summary: 'Vous avez {count} rendez-vous a venir',
    header_upcoming_summary_plural: 'Vous avez {count} rendez-vous a venir',
    header_ready_to_book: 'Pret a reserver votre prochain rendez-vous ?',
    header_book_new: 'Nouvelle reservation',
    section_upcoming_title: 'Rendez-vous a venir',
    section_upcoming_empty: 'Aucun rendez-vous a venir',
    section_browse_services: 'Parcourir les services',
    section_view_all_bookings: 'Voir toutes les reservations',
    section_past_title: 'Anciens rendez-vous',
    section_past_more_count: '+{count} autres anciens rendez-vous',
    section_past_empty: 'Aucun ancien rendez-vous pour le moment',
    section_favorites_title: 'Vos favoris',
    section_recommended_title: 'Recommande pour vous',
    section_recommended_from_history: 'Base sur votre historique de reservations',
    section_recommended_top_rated: 'Businesses les mieux notes',
    section_recommended_empty: 'Pas encore de recommandations',
    section_explore_all: 'Explorer tous les services',
    section_near_you_title: 'Pres de vous',
    section_coming_soon: 'Bientot disponible',
    section_near_you_desc: 'Recommandations basees sur la localisation',
    section_near_you_hint: 'Trouvez de bons services pres de chez vous',
    section_quick_actions_title: 'Actions rapides',
    quick_saved_businesses: 'Businesses sauvegardes',
    quick_help_support: 'Aide et support',
    quick_payment_methods: 'Moyens de paiement',
    cancel_dialog_title: 'Annuler le rendez-vous ?',
    cancel_dialog_desc:
      'Voulez-vous vraiment annuler votre rendez-vous chez {business} pour {service} ? Cette action est irreversible.',
    cancel_dialog_keep: 'Garder le rendez-vous',
    cancel_dialog_confirm: 'Oui, annuler',
    cancel_dialog_submitting: 'Annulation...',
    reschedule_dialog_title: 'Reprogrammer le rendez-vous',
    reschedule_dialog_desc: 'Selectionnez une nouvelle date et heure pour votre rendez-vous',
    reschedule_dialog_current: 'Actuel : {date}',
    reschedule_dialog_new_date: 'Nouvelle date',
    reschedule_dialog_new_time: 'Nouvelle heure',
    reschedule_dialog_loading_slots: 'Chargement des heures disponibles...',
    reschedule_dialog_select_time: 'Selectionnez une heure',
    reschedule_dialog_no_slots: 'Aucun horaire disponible pour cette date. Veuillez choisir une autre date.',
    reschedule_dialog_pick_date_first: 'Veuillez d abord choisir une date pour voir les horaires disponibles',
    reschedule_dialog_cancel: 'Annuler',
    reschedule_dialog_confirm: 'Confirmer la reprogrammation',
    reschedule_dialog_submitting: 'Reprogrammation...',
    error_load_bookings_prefix: 'Impossible de charger vos reservations',
    error_dashboard_load_failed: 'Echec du chargement du tableau de bord',
    error_failed_cancel: 'Echec de l annulation de la reservation',
    error_failed_reschedule: 'Echec de la reprogrammation de la reservation',
  },
  ar: {
    status_pending: 'قيد الانتظار',
    status_confirmed: 'موكد',
    status_completed: 'مكتمل',
    status_cancelled: 'ملغي',
    status_no_show: 'عدم حضور',
    card_label_date: 'التاريخ',
    card_label_time: 'الوقت',
    card_label_staff: 'الموظف',
    card_label_price: 'السعر',
    card_duration_min: 'خدمة لمدة {count} دقيقة',
    card_note: 'ملاحظة:',
    card_action_reschedule: 'اعادة الجدولة',
    card_action_cancel: 'الغاء',
    card_action_edit_review: 'تعديل التقييم',
    card_action_leave_review: 'اضافة تقييم',
    card_action_book_again: 'احجز مرة اخرى',
    quick_link_soon: 'قريبا',
    header_welcome_back: 'اهلا بعودتك، {name}! 👋',
    header_fallback_name: 'صديقي',
    header_upcoming_summary: 'لديك {count} موعد قادم',
    header_upcoming_summary_plural: 'لديك {count} مواعيد قادمة',
    header_ready_to_book: 'جاهز لحجز موعدك القادم؟',
    header_book_new: 'احجز موعدا جديدا',
    section_upcoming_title: 'المواعيد القادمة',
    section_upcoming_empty: 'لا توجد مواعيد قادمة',
    section_browse_services: 'تصفح الخدمات',
    section_view_all_bookings: 'عرض كل الحجوزات',
    section_past_title: 'المواعيد السابقة',
    section_past_more_count: '+{count} مواعيد سابقة اخرى',
    section_past_empty: 'لا توجد مواعيد سابقة بعد',
    section_favorites_title: 'مفضلاتك',
    section_recommended_title: 'موصى به لك',
    section_recommended_from_history: 'بناء على سجل حجوزاتك',
    section_recommended_top_rated: 'افضل الانشطة تقييما',
    section_recommended_empty: 'لا توجد توصيات بعد',
    section_explore_all: 'استكشف كل الخدمات',
    section_near_you_title: 'بالقرب منك',
    section_coming_soon: 'قريبا',
    section_near_you_desc: 'توصيات حسب الموقع',
    section_near_you_hint: 'اعثر على خدمات رائعة بالقرب من موقعك',
    section_quick_actions_title: 'اجراءات سريعة',
    quick_saved_businesses: 'الانشطة المحفوظة',
    quick_help_support: 'المساعدة والدعم',
    quick_payment_methods: 'وسائل الدفع',
    cancel_dialog_title: 'الغاء الموعد؟',
    cancel_dialog_desc:
      'هل انت متاكد من الغاء موعدك في {business} لخدمة {service}؟ لا يمكن التراجع عن هذا الاجراء.',
    cancel_dialog_keep: 'الابقاء على الموعد',
    cancel_dialog_confirm: 'نعم، الغاء',
    cancel_dialog_submitting: 'جار الالغاء...',
    reschedule_dialog_title: 'اعادة جدولة الموعد',
    reschedule_dialog_desc: 'اختر تاريخا ووقتا جديدين لموعدك',
    reschedule_dialog_current: 'الحالي: {date}',
    reschedule_dialog_new_date: 'التاريخ الجديد',
    reschedule_dialog_new_time: 'الوقت الجديد',
    reschedule_dialog_loading_slots: 'جار تحميل الاوقات المتاحة...',
    reschedule_dialog_select_time: 'اختر وقتا',
    reschedule_dialog_no_slots: 'لا توجد اوقات متاحة لهذا التاريخ. يرجى اختيار تاريخ اخر.',
    reschedule_dialog_pick_date_first: 'يرجى اختيار التاريخ اولا لعرض الاوقات المتاحة',
    reschedule_dialog_cancel: 'الغاء',
    reschedule_dialog_confirm: 'تاكيد اعادة الجدولة',
    reschedule_dialog_submitting: 'جار اعادة الجدولة...',
    error_load_bookings_prefix: 'تعذر تحميل حجوزاتك',
    error_dashboard_load_failed: 'فشل تحميل لوحة التحكم',
    error_failed_cancel: 'فشل الغاء الحجز',
    error_failed_reschedule: 'فشلت اعادة جدولة الحجز',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, token: string) => String(params[token] ?? `{${token}}`));
}

export function clientDashboardT(
  locale: LocaleCode,
  key: ClientDashboardKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = CLIENT_DASHBOARD_DICTIONARY[locale] ?? CLIENT_DASHBOARD_DICTIONARY.en;
  const value = dictionary[key] ?? CLIENT_DASHBOARD_DICTIONARY.en[key];
  return interpolate(value, params);
}

export function clientDashboardLocaleTag(locale: LocaleCode): string {
  if (locale === 'fr') {
    return 'fr-FR';
  }

  if (locale === 'ar') {
    return 'ar-TN';
  }

  return 'en-US';
}
