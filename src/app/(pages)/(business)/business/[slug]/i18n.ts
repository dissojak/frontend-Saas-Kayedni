import type { LocaleCode } from '@global/lib/locales';

export type BusinessDetailI18nKey =
  | 'rating_no_reviews'
  | 'review_singular'
  | 'review_plural'
  | 'book_appointment'
  | 'share_business'
  | 'view_qr'
  | 'qr_panel_title'
  | 'qr_panel_desc'
  | 'qr_panel_unavailable'
  | 'business_not_found_title'
  | 'business_not_found_desc'
  | 'back_to_businesses'
  | 'about_business'
  | 'meet_our_team'
  | 'reviews'
  | 'view_all_reviews'
  | 'reply'
  | 'leave_a_review'
  | 'share_experience_placeholder'
  | 'post_review'
  | 'join_conversation'
  | 'login_required_review_desc'
  | 'login_to_review'
  | 'ready_to_book'
  | 'schedule_quick_desc'
  | 'book_now'
  | 'business_hours'
  | 'weekday_monday_friday'
  | 'weekday_saturday'
  | 'weekday_sunday'
  | 'closed'
  | 'gallery_prev_image'
  | 'gallery_next_image'
  | 'gallery_go_to_image'
  | 'gallery_view_image'
  | 'back_to_business_profile'
  | 'book_an_appointment'
  | 'select_professional'
  | 'select_service'
  | 'service_duration_min'
  | 'no_services_for_staff'
  | 'cancel'
  | 'confirm_and_pick_date'
  | 'choose_date_time'
  | 'back'
  | 'available_times'
  | 'warning_critical_slot'
  | 'warning_soon_slot'
  | 'select_date_on_calendar'
  | 'no_slots_for_date'
  | 'slot_too_close_hint'
  | 'slot_starts_in_minutes'
  | 'review_booking'
  | 'confirm_details'
  | 'service'
  | 'professional'
  | 'date_time'
  | 'total_amount'
  | 'confirm_checkout'
  | 'cancel_booking_title'
  | 'cancel_booking_desc'
  | 'no_continue_booking'
  | 'yes_cancel'
  | 'all_reviews'
  | 'review_date_2_days_ago'
  | 'review_date_1_week_ago'
  | 'review_date_2_weeks_ago'
  | 'review_date_1_month_ago'
  | 'review_date_2_months_ago';

const BUSINESS_DETAIL_DICTIONARY: Record<LocaleCode, Record<BusinessDetailI18nKey, string>> = {
  en: {
    rating_no_reviews: 'No reviews',
    review_singular: 'review',
    review_plural: 'reviews',
    book_appointment: 'Book Appointment',
    share_business: 'Share Business',
    view_qr: 'View QR',
    qr_panel_title: 'Business QR',
    qr_panel_desc: 'Share the business link or open the QR panel for quick access.',
    qr_panel_unavailable: 'QR is not available yet.',
    business_not_found_title: 'Business Not Found',
    business_not_found_desc: "The business you're looking for doesn't exist or has been removed.",
    back_to_businesses: 'Back to Businesses',
    about_business: 'About {name}',
    meet_our_team: 'Meet Our Team',
    reviews: 'Reviews',
    view_all_reviews: 'View All Reviews',
    reply: 'Reply',
    leave_a_review: 'Leave a Review',
    share_experience_placeholder: 'Share your experience...',
    post_review: 'Post Review',
    join_conversation: 'Join the conversation',
    login_required_review_desc: 'You need to be logged in to leave a review and share your experience.',
    login_to_review: 'Login to Review',
    ready_to_book: 'Ready to book?',
    schedule_quick_desc: 'Schedule your appointment in just a few clicks.',
    book_now: 'Book Now',
    business_hours: 'Business Hours',
    weekday_monday_friday: 'Monday - Friday',
    weekday_saturday: 'Saturday',
    weekday_sunday: 'Sunday',
    closed: 'Closed',
    gallery_prev_image: 'Previous image',
    gallery_next_image: 'Next image',
    gallery_go_to_image: 'Go to image {index}',
    gallery_view_image: 'View image {index}',
    back_to_business_profile: 'Back to Business Profile',
    book_an_appointment: 'Book an Appointment',
    select_professional: 'Select Professional',
    select_service: 'Select Service',
    service_duration_min: '{duration} min',
    no_services_for_staff: 'No services available for {name}.',
    cancel: 'Cancel',
    confirm_and_pick_date: 'Confirm and pick a date',
    choose_date_time: 'Choose Date & Time',
    back: 'Back',
    available_times: 'Available Times',
    warning_critical_slot:
      'This appointment starts in {countdown}. This time is very close. If you are near the business, go now. This slot is free right now but cannot be booked online.',
    warning_soon_slot:
      'This appointment starts in {countdown}. You can still book it, but keep this in mind and be ready to go soon.',
    select_date_on_calendar: 'Select a date on the calendar',
    no_slots_for_date: 'No slots available for this date',
    slot_too_close_hint: 'Too close: go now if nearby',
    slot_starts_in_minutes: 'Starts in {minutes} min',
    review_booking: 'Review Booking',
    confirm_details: 'Confirm Details',
    service: 'Service',
    professional: 'Professional',
    date_time: 'Date & Time',
    total_amount: 'Total Amount',
    confirm_checkout: 'Confirm & Checkout',
    cancel_booking_title: 'Cancel Booking?',
    cancel_booking_desc: 'Are you sure you want to cancel? All your selected details will be lost and you will need to start over.',
    no_continue_booking: 'No, continue booking',
    yes_cancel: 'Yes, cancel',
    all_reviews: 'All Reviews',
    review_date_2_days_ago: '2 days ago',
    review_date_1_week_ago: '1 week ago',
    review_date_2_weeks_ago: '2 weeks ago',
    review_date_1_month_ago: '1 month ago',
    review_date_2_months_ago: '2 months ago',
  },
  fr: {
    rating_no_reviews: 'Aucun avis',
    review_singular: 'avis',
    review_plural: 'avis',
    book_appointment: 'Prendre rendez-vous',
    share_business: 'Partager le business',
    view_qr: 'Voir le QR',
    qr_panel_title: 'QR du business',
    qr_panel_desc: 'Partagez le lien du business ou ouvrez le panneau QR pour un acces rapide.',
    qr_panel_unavailable: 'Le QR n est pas encore disponible.',
    business_not_found_title: 'Business introuvable',
    business_not_found_desc: 'Le business recherche n\'existe pas ou a ete supprime.',
    back_to_businesses: 'Retour aux business',
    about_business: 'A propos de {name}',
    meet_our_team: 'Rencontrez notre equipe',
    reviews: 'Avis',
    view_all_reviews: 'Voir tous les avis',
    reply: 'Repondre',
    leave_a_review: 'Laisser un avis',
    share_experience_placeholder: 'Partagez votre experience...',
    post_review: 'Publier l\'avis',
    join_conversation: 'Rejoindre la conversation',
    login_required_review_desc: 'Vous devez etre connecte pour laisser un avis et partager votre experience.',
    login_to_review: 'Se connecter pour laisser un avis',
    ready_to_book: 'Pret a reserver ?',
    schedule_quick_desc: 'Planifiez votre rendez-vous en quelques clics.',
    book_now: 'Reserver maintenant',
    business_hours: 'Horaires du business',
    weekday_monday_friday: 'Lundi - Vendredi',
    weekday_saturday: 'Samedi',
    weekday_sunday: 'Dimanche',
    closed: 'Ferme',
    gallery_prev_image: 'Image precedente',
    gallery_next_image: 'Image suivante',
    gallery_go_to_image: 'Aller a l\'image {index}',
    gallery_view_image: 'Voir l\'image {index}',
    back_to_business_profile: 'Retour au profil business',
    book_an_appointment: 'Prendre un rendez-vous',
    select_professional: 'Selectionner un professionnel',
    select_service: 'Selectionner un service',
    service_duration_min: '{duration} min',
    no_services_for_staff: 'Aucun service disponible pour {name}.',
    cancel: 'Annuler',
    confirm_and_pick_date: 'Confirmer et choisir une date',
    choose_date_time: 'Choisir date et heure',
    back: 'Retour',
    available_times: 'Heures disponibles',
    warning_critical_slot:
      'Ce rendez-vous commence dans {countdown}. L\'heure est tres proche. Si vous etes pres du business, partez maintenant. Ce creneau est libre mais ne peut pas etre reserve en ligne.',
    warning_soon_slot:
      'Ce rendez-vous commence dans {countdown}. Vous pouvez encore reserver, mais preparez-vous a y aller rapidement.',
    select_date_on_calendar: 'Selectionnez une date dans le calendrier',
    no_slots_for_date: 'Aucun creneau disponible pour cette date',
    slot_too_close_hint: 'Trop proche : partez maintenant si vous etes a cote',
    slot_starts_in_minutes: 'Commence dans {minutes} min',
    review_booking: 'Verifier la reservation',
    confirm_details: 'Confirmer les details',
    service: 'Service',
    professional: 'Professionnel',
    date_time: 'Date et heure',
    total_amount: 'Montant total',
    confirm_checkout: 'Confirmer et payer',
    cancel_booking_title: 'Annuler la reservation ?',
    cancel_booking_desc: 'Voulez-vous vraiment annuler ? Tous les details selectionnes seront perdus et vous devrez recommencer.',
    no_continue_booking: 'Non, continuer la reservation',
    yes_cancel: 'Oui, annuler',
    all_reviews: 'Tous les avis',
    review_date_2_days_ago: 'Il y a 2 jours',
    review_date_1_week_ago: 'Il y a 1 semaine',
    review_date_2_weeks_ago: 'Il y a 2 semaines',
    review_date_1_month_ago: 'Il y a 1 mois',
    review_date_2_months_ago: 'Il y a 2 mois',
  },
  ar: {
    rating_no_reviews: 'لا توجد مراجعات',
    review_singular: 'مراجعة',
    review_plural: 'مراجعات',
    book_appointment: 'احجز موعدا',
    share_business: 'مشاركة النشاط',
    view_qr: 'عرض QR',
    qr_panel_title: 'رمز QR للنشاط',
    qr_panel_desc: 'شارك رابط النشاط او افتح لوحة QR للوصول السريع.',
    qr_panel_unavailable: 'رمز QR غير متاح بعد.',
    business_not_found_title: 'المنشاة غير موجودة',
    business_not_found_desc: 'المنشاة التي تبحث عنها غير موجودة او تمت ازالتها.',
    back_to_businesses: 'العودة الى المنشات',
    about_business: 'وصف {name}',
    meet_our_team: 'تعرف على فريقنا',
    reviews: 'المراجعات',
    view_all_reviews: 'عرض كل المراجعات',
    reply: 'رد',
    leave_a_review: 'اترك مراجعة',
    share_experience_placeholder: 'شارك تجربتك...',
    post_review: 'نشر المراجعة',
    join_conversation: 'انضم الى المحادثة',
    login_required_review_desc: 'تحتاج الى تسجيل الدخول لترك مراجعة ومشاركة تجربتك.',
    login_to_review: 'تسجيل الدخول للمراجعة',
    ready_to_book: 'جاهز للحجز؟',
    schedule_quick_desc: 'حدد موعدك خلال بضع نقرات فقط.',
    book_now: 'احجز الان',
    business_hours: 'ساعات العمل',
    weekday_monday_friday: 'الاثنين - الجمعة',
    weekday_saturday: 'السبت',
    weekday_sunday: 'الاحد',
    closed: 'مغلق',
    gallery_prev_image: 'الصورة السابقة',
    gallery_next_image: 'الصورة التالية',
    gallery_go_to_image: 'اذهب الى الصورة {index}',
    gallery_view_image: 'عرض الصورة {index}',
    back_to_business_profile: 'العودة الى ملف المنشاة',
    book_an_appointment: 'احجز موعدا',
    select_professional: 'اختر المختص',
    select_service: 'اختر الخدمة',
    service_duration_min: '{duration} دقيقة',
    no_services_for_staff: 'لا توجد خدمات متاحة لـ {name}.',
    cancel: 'الغاء',
    confirm_and_pick_date: 'تأكيد واختيار التاريخ',
    choose_date_time: 'اختر التاريخ والوقت',
    back: 'عودة',
    available_times: 'الاوقات المتاحة',
    warning_critical_slot:
      'يبدأ هذا الموعد خلال {countdown}. الوقت قريب جدا. اذا كنت قريبا من المنشاة فتوجه الان. هذا الموعد متاح حاليا لكنه غير قابل للحجز عبر الانترنت.',
    warning_soon_slot:
      'يبدأ هذا الموعد خلال {countdown}. ما زال بإمكانك الحجز، لكن خذ ذلك في الاعتبار واستعد للذهاب قريبا.',
    select_date_on_calendar: 'اختر تاريخا من التقويم',
    no_slots_for_date: 'لا توجد اوقات متاحة لهذا التاريخ',
    slot_too_close_hint: 'الوقت قريب جدا: اذهب الان اذا كنت قريبا',
    slot_starts_in_minutes: 'يبدأ خلال {minutes} دقيقة',
    review_booking: 'مراجعة الحجز',
    confirm_details: 'تأكيد التفاصيل',
    service: 'الخدمة',
    professional: 'المختص',
    date_time: 'التاريخ والوقت',
    total_amount: 'المبلغ الاجمالي',
    confirm_checkout: 'تأكيد والمتابعة للدفع',
    cancel_booking_title: 'الغاء الحجز؟',
    cancel_booking_desc: 'هل انت متاكد من الالغاء؟ سيتم فقدان كل التفاصيل التي اخترتها وستحتاج للبدء من جديد.',
    no_continue_booking: 'لا، اكمل الحجز',
    yes_cancel: 'نعم، الغاء',
    all_reviews: 'كل المراجعات',
    review_date_2_days_ago: 'منذ يومين',
    review_date_1_week_ago: 'منذ اسبوع',
    review_date_2_weeks_ago: 'منذ اسبوعين',
    review_date_1_month_ago: 'منذ شهر',
    review_date_2_months_ago: 'منذ شهرين',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function businessDetailT(
  locale: LocaleCode,
  key: BusinessDetailI18nKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = BUSINESS_DETAIL_DICTIONARY[locale] ?? BUSINESS_DETAIL_DICTIONARY.en;
  const value = dictionary[key] ?? BUSINESS_DETAIL_DICTIONARY.en[key];
  return interpolate(value, params);
}

export function businessDetailDateLocale(locale: LocaleCode): string {
  if (locale === 'fr') {
    return 'fr-FR';
  }

  if (locale === 'ar') {
    return 'ar-TN';
  }

  return 'en-US';
}

export function businessDetailReviewCountLabel(locale: LocaleCode, count: number): string {
  return businessDetailT(locale, count === 1 ? 'review_singular' : 'review_plural');
}

const REVIEW_DATE_KEY_BY_ENGLISH_TEXT: Record<string, BusinessDetailI18nKey> = {
  '2 days ago': 'review_date_2_days_ago',
  '1 week ago': 'review_date_1_week_ago',
  '2 weeks ago': 'review_date_2_weeks_ago',
  '1 month ago': 'review_date_1_month_ago',
  '2 months ago': 'review_date_2_months_ago',
};

export function businessDetailReviewDateLabel(locale: LocaleCode, rawDate: string): string {
  const key = REVIEW_DATE_KEY_BY_ENGLISH_TEXT[rawDate];
  return key ? businessDetailT(locale, key) : rawDate;
}
