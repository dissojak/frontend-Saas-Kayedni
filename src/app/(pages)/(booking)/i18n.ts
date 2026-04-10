import type { LocaleCode } from '@global/lib/locales';

export type BookingKey =
  | 'bookings_title'
  | 'bookings_new_appointment'
  | 'bookings_tab_upcoming'
  | 'bookings_tab_past'
  | 'bookings_empty_upcoming_title'
  | 'bookings_empty_upcoming_desc'
  | 'bookings_empty_past_title'
  | 'bookings_empty_past_desc'
  | 'bookings_book_appointment'
  | 'bookings_with'
  | 'bookings_status_confirmed'
  | 'bookings_status_pending'
  | 'bookings_status_completed'
  | 'bookings_status_cancelled'
  | 'bookings_status_no_show'
  | 'bookings_status_unknown'
  | 'bookings_reschedule'
  | 'bookings_cancel'
  | 'bookings_cancelling'
  | 'bookings_leave_review'
  | 'bookings_book_again'
  | 'bookings_unknown_business'
  | 'bookings_unknown_staff'
  | 'bookings_unknown_service'
  | 'checkout_loading_details'
  | 'checkout_title'
  | 'checkout_special_requests_label'
  | 'checkout_special_requests_placeholder'
  | 'checkout_summary_title'
  | 'checkout_summary_service'
  | 'checkout_summary_staff'
  | 'checkout_summary_date'
  | 'checkout_summary_time'
  | 'checkout_minutes'
  | 'checkout_contact_full_name'
  | 'checkout_contact_email'
  | 'checkout_contact_phone'
  | 'checkout_payment_summary'
  | 'checkout_total'
  | 'checkout_payment_method'
  | 'checkout_pay_on_place'
  | 'checkout_pay_on_place_desc'
  | 'checkout_card'
  | 'checkout_coming_soon'
  | 'checkout_card_desc'
  | 'checkout_flouci_desc'
  | 'checkout_processing'
  | 'checkout_confirm_booking'
  | 'checkout_terms_prefix'
  | 'checkout_terms_link';

const BOOKING_DICTIONARY: Record<LocaleCode, Record<BookingKey, string>> = {
  en: {
    bookings_title: 'Your Bookings',
    bookings_new_appointment: 'Book New Appointment',
    bookings_tab_upcoming: 'Upcoming',
    bookings_tab_past: 'Past',
    bookings_empty_upcoming_title: 'No upcoming bookings',
    bookings_empty_upcoming_desc: "You don't have any upcoming appointments scheduled.",
    bookings_empty_past_title: 'No past bookings',
    bookings_empty_past_desc: "You don't have any past appointments.",
    bookings_book_appointment: 'Book an Appointment',
    bookings_with: 'with',
    bookings_status_confirmed: 'Confirmed',
    bookings_status_pending: 'Pending',
    bookings_status_completed: 'Completed',
    bookings_status_cancelled: 'Cancelled',
    bookings_status_no_show: 'No Show',
    bookings_status_unknown: 'Unknown',
    bookings_reschedule: 'Reschedule',
    bookings_cancel: 'Cancel',
    bookings_cancelling: 'Cancelling...',
    bookings_leave_review: 'Leave Review',
    bookings_book_again: 'Book Again',
    bookings_unknown_business: 'Unknown Business',
    bookings_unknown_staff: 'Unknown Staff',
    bookings_unknown_service: 'Unknown Service',
    checkout_loading_details: 'Loading your booking details...',
    checkout_title: 'Complete Your Booking',
    checkout_special_requests_label: 'Special Requests (Optional)',
    checkout_special_requests_placeholder: 'Any specific requirements or notes for your appointment',
    checkout_summary_title: 'Booking Details',
    checkout_summary_service: 'Service',
    checkout_summary_staff: 'Staff',
    checkout_summary_date: 'Date',
    checkout_summary_time: 'Time',
    checkout_minutes: '{minutes} minutes',
    checkout_contact_full_name: 'Full Name',
    checkout_contact_email: 'Email',
    checkout_contact_phone: 'Phone Number',
    checkout_payment_summary: 'Payment Summary',
    checkout_total: 'Total',
    checkout_payment_method: 'Payment Method',
    checkout_pay_on_place: 'Pay on Place',
    checkout_pay_on_place_desc: 'Pay when you arrive at the location',
    checkout_card: 'Credit/Debit Card',
    checkout_coming_soon: 'Coming Soon',
    checkout_card_desc: 'Pay securely with Stripe',
    checkout_flouci_desc: 'Pay with Flouci mobile wallet',
    checkout_processing: 'Processing...',
    checkout_confirm_booking: 'Confirm Booking',
    checkout_terms_prefix: 'By confirming, you agree to our',
    checkout_terms_link: 'Terms of Service',
  },
  fr: {
    bookings_title: 'Vos reservations',
    bookings_new_appointment: 'Nouvelle reservation',
    bookings_tab_upcoming: 'A venir',
    bookings_tab_past: 'Passees',
    bookings_empty_upcoming_title: 'Aucune reservation a venir',
    bookings_empty_upcoming_desc: 'Vous n\'avez aucun rendez-vous planifie.',
    bookings_empty_past_title: 'Aucune reservation passee',
    bookings_empty_past_desc: 'Vous n\'avez aucun rendez-vous passe.',
    bookings_book_appointment: 'Reserver un rendez-vous',
    bookings_with: 'avec',
    bookings_status_confirmed: 'Confirme',
    bookings_status_pending: 'En attente',
    bookings_status_completed: 'Termine',
    bookings_status_cancelled: 'Annule',
    bookings_status_no_show: 'Absence',
    bookings_status_unknown: 'Inconnu',
    bookings_reschedule: 'Reprogrammer',
    bookings_cancel: 'Annuler',
    bookings_cancelling: 'Annulation...',
    bookings_leave_review: 'Laisser un avis',
    bookings_book_again: 'Reserver encore',
    bookings_unknown_business: 'Business inconnu',
    bookings_unknown_staff: 'Staff inconnu',
    bookings_unknown_service: 'Service inconnu',
    checkout_loading_details: 'Chargement des details de reservation...',
    checkout_title: 'Finaliser votre reservation',
    checkout_special_requests_label: 'Demandes speciales (optionnel)',
    checkout_special_requests_placeholder: 'Precisez vos besoins ou notes pour ce rendez-vous',
    checkout_summary_title: 'Details de reservation',
    checkout_summary_service: 'Service',
    checkout_summary_staff: 'Staff',
    checkout_summary_date: 'Date',
    checkout_summary_time: 'Heure',
    checkout_minutes: '{minutes} min',
    checkout_contact_full_name: 'Nom complet',
    checkout_contact_email: 'E-mail',
    checkout_contact_phone: 'Telephone',
    checkout_payment_summary: 'Resume du paiement',
    checkout_total: 'Total',
    checkout_payment_method: 'Mode de paiement',
    checkout_pay_on_place: 'Paiement sur place',
    checkout_pay_on_place_desc: 'Payez a votre arrivee',
    checkout_card: 'Carte bancaire',
    checkout_coming_soon: 'Bientot',
    checkout_card_desc: 'Paiement securise via Stripe',
    checkout_flouci_desc: 'Payer avec le portefeuille Flouci',
    checkout_processing: 'Traitement...',
    checkout_confirm_booking: 'Confirmer la reservation',
    checkout_terms_prefix: 'En confirmant, vous acceptez nos',
    checkout_terms_link: 'Conditions d\'utilisation',
  },
  ar: {
    bookings_title: 'حجوزاتي',
    bookings_new_appointment: 'حجز موعد جديد',
    bookings_tab_upcoming: 'القادمة',
    bookings_tab_past: 'السابقة',
    bookings_empty_upcoming_title: 'لا توجد حجوزات قادمة',
    bookings_empty_upcoming_desc: 'ليس لديك اي مواعيد قادمة حاليا.',
    bookings_empty_past_title: 'لا توجد حجوزات سابقة',
    bookings_empty_past_desc: 'ليس لديك اي مواعيد سابقة.',
    bookings_book_appointment: 'احجز موعدا',
    bookings_with: 'مع',
    bookings_status_confirmed: 'مؤكد',
    bookings_status_pending: 'بانتظار التاكيد',
    bookings_status_completed: 'مكتمل',
    bookings_status_cancelled: 'ملغي',
    bookings_status_no_show: 'عدم حضور',
    bookings_status_unknown: 'غير معروف',
    bookings_reschedule: 'اعادة جدولة',
    bookings_cancel: 'الغاء',
    bookings_cancelling: 'جار الالغاء...',
    bookings_leave_review: 'اترك تقييما',
    bookings_book_again: 'احجز مرة اخرى',
    bookings_unknown_business: 'شركة غير معروفة',
    bookings_unknown_staff: 'موظف غير معروف',
    bookings_unknown_service: 'خدمة غير معروفة',
    checkout_loading_details: 'جار تحميل تفاصيل الحجز...',
    checkout_title: 'اكمل حجزك',
    checkout_special_requests_label: 'طلبات خاصة (اختياري)',
    checkout_special_requests_placeholder: 'اي متطلبات او ملاحظات خاصة بموعدك',
    checkout_summary_title: 'تفاصيل الحجز',
    checkout_summary_service: 'الخدمة',
    checkout_summary_staff: 'الموظف',
    checkout_summary_date: 'التاريخ',
    checkout_summary_time: 'الوقت',
    checkout_minutes: '{minutes} دقيقة',
    checkout_contact_full_name: 'الاسم الكامل',
    checkout_contact_email: 'البريد الالكتروني',
    checkout_contact_phone: 'رقم الهاتف',
    checkout_payment_summary: 'ملخص الدفع',
    checkout_total: 'الاجمالي',
    checkout_payment_method: 'طريقة الدفع',
    checkout_pay_on_place: 'الدفع في المكان',
    checkout_pay_on_place_desc: 'ادفع عند الوصول الى المكان',
    checkout_card: 'بطاقة بنكية',
    checkout_coming_soon: 'قريبا',
    checkout_card_desc: 'ادفع بأمان عبر Stripe',
    checkout_flouci_desc: 'الدفع بمحفظة Flouci',
    checkout_processing: 'جار المعالجة...',
    checkout_confirm_booking: 'تأكيد الحجز',
    checkout_terms_prefix: 'بتأكيدك للحجز، انت توافق على',
    checkout_terms_link: 'شروط الخدمة',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function bookingT(
  locale: LocaleCode,
  key: BookingKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = BOOKING_DICTIONARY[locale] ?? BOOKING_DICTIONARY.en;
  const value = dictionary[key] ?? BOOKING_DICTIONARY.en[key];
  return interpolate(value, params);
}
