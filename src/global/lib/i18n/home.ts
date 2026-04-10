import type { LocaleCode } from '@global/lib/locales';

export type HomeKey =
  | 'hero_badge_prefix'
  | 'hero_badge_text'
  | 'hero_title_prefix'
  | 'hero_title_highlight'
  | 'hero_description'
  | 'search_hint'
  | 'for_business_prompt'
  | 'for_business_cta'
  | 'featured_title'
  | 'featured_subtitle'
  | 'featured_unknown_category'
  | 'featured_nearby'
  | 'featured_reviews'
  | 'featured_browse_all'
  | 'testimonials_title'
  | 'testimonials_subtitle'
  | 'testimonials_role_customer'
  | 'testimonials_role_customer_with_business'
  | 'mobile_badge'
  | 'mobile_title_line1'
  | 'mobile_title_line2'
  | 'mobile_description'
  | 'mobile_app_store_top'
  | 'mobile_app_store_bottom'
  | 'mobile_google_play_top'
  | 'mobile_google_play_bottom'
  | 'mobile_rating_label'
  | 'mobile_downloads_label'
  | 'final_title'
  | 'final_description'
  | 'final_start_booking'
  | 'final_register_business'
  | 'calendar_prev_month'
  | 'calendar_next_month'
  | 'booking_demo_badge'
  | 'booking_demo_title'
  | 'booking_demo_description'
  | 'booking_demo_cta'
  | 'booking_demo_feature_telegram'
  | 'booking_demo_feature_reviews'
  | 'booking_demo_feature_247'
  | 'booking_demo_alt_staff_service'
  | 'booking_demo_alt_date_time'
  | 'featured_category_barber'
  | 'featured_category_education'
  | 'featured_category_gaming'
  | 'featured_location_downtown'
  | 'featured_location_online'
  | 'featured_location_west_mall'
  | 'testimonials_fallback_business_style_studio'
  | 'testimonials_fallback_business_gamezone'
  | 'testimonials_fallback_service_tech_support'
  | 'testimonials_fallback_comment_1'
  | 'testimonials_fallback_comment_2'
  | 'testimonials_fallback_comment_3';

const HOME_DICTIONARY: Record<LocaleCode, Record<HomeKey, string>> = {
  en: {
    hero_badge_prefix: 'New:',
    hero_badge_text: 'The future of booking is here',
    hero_title_prefix: 'Book Services with',
    hero_title_highlight: 'Confidence',
    hero_description:
      'Find and book appointments with local professionals instantly. From barbers to tutors, all in one seamless platform.',
    search_hint: 'Searching categories. Type one more letter to search businesses.',
    for_business_prompt: 'Own a business?',
    for_business_cta: 'Kayedni for Business',
    featured_title: 'Top Professionals Ready to Help',
    featured_subtitle: 'Browse verified, highly-rated service providers.',
    featured_unknown_category: 'General Services',
    featured_nearby: 'Near by',
    featured_reviews: 'reviews',
    featured_browse_all: 'Browse All Professionals',
    testimonials_title: 'Loved by Thousands',
    testimonials_subtitle: 'Real stories from our happy customers and businesses who use platform daily.',
    testimonials_role_customer: 'Customer',
    testimonials_role_customer_with_business: 'Customer - {business}',
    mobile_badge: 'Mobile App',
    mobile_title_line1: 'Manage Bookings',
    mobile_title_line2: 'On-the-Go',
    mobile_description:
      'Experience the full power of Kayedni in your pocket. Get push notifications, instant booking management, and real-time analytics wherever you are.',
    mobile_app_store_top: 'Download on the',
    mobile_app_store_bottom: 'App Store',
    mobile_google_play_top: 'GET IT ON',
    mobile_google_play_bottom: 'Google Play',
    mobile_rating_label: 'App Store Rating',
    mobile_downloads_label: 'Downloads',
    final_title: 'Join Thousands Booking Smarter',
    final_description: 'Get started free today. No credit card required. Scale your business with Kayedni.',
    final_start_booking: 'Start Booking Free',
    final_register_business: 'Register Your Business',
    calendar_prev_month: 'Previous month',
    calendar_next_month: 'Next month',
    booking_demo_badge: 'Smarter Scheduling',
    booking_demo_title: 'Book Your Perfect Appointment in Minutes.',
    booking_demo_description:
      'Find the right professionals, compare availability, and book instantly. Get Telegram confirmations and smart reminders 30 minutes before your appointment starts. No phone calls, no surprises - just the service you need, when you need it.',
    booking_demo_cta: 'Find Your Professional',
    booking_demo_feature_telegram: 'Telegram reminders',
    booking_demo_feature_reviews: 'Browse real reviews',
    booking_demo_feature_247: 'Book 24/7',
    booking_demo_alt_staff_service: 'Select staff and service',
    booking_demo_alt_date_time: 'Select date and time',
    featured_category_barber: 'Barber',
    featured_category_education: 'Education',
    featured_category_gaming: 'Gaming',
    featured_location_downtown: 'Downtown',
    featured_location_online: 'Online',
    featured_location_west_mall: 'West Mall',
    testimonials_fallback_business_style_studio: 'Style Studio',
    testimonials_fallback_business_gamezone: 'GameZone',
    testimonials_fallback_service_tech_support: 'Tech Support',
    testimonials_fallback_comment_1:
      'The platform transformed how I manage appointments. My revenue increased by 40% in the first month alone.',
    testimonials_fallback_comment_2:
      'Finally, a booking platform that actually works! Easy to find services, fast booking, and reliable reminders.',
    testimonials_fallback_comment_3:
      'The best tool for managing my schedule. My clients love the instant confirmations and I love the automated admin.',
  },
  fr: {
    hero_badge_prefix: 'Nouveau :',
    hero_badge_text: 'Le futur de la reservation est deja la',
    hero_title_prefix: 'Reservez vos services avec',
    hero_title_highlight: 'confiance',
    hero_description:
      'Trouvez et reservez instantanement des rendez-vous avec des professionnels locaux. Du barber au tutorat, tout est reuni sur une seule plateforme.',
    search_hint: 'Recherche des categories en cours. Ajoutez une lettre pour lancer la recherche de businesses.',
    for_business_prompt: 'Vous avez un business ?',
    for_business_cta: 'Kayedni for Business',
    featured_title: 'Des professionnels verifies, prets a vous aider',
    featured_subtitle: 'Parcourez des prestataires verifies et tres bien notes.',
    featured_unknown_category: 'Services generaux',
    featured_nearby: 'A proximite',
    featured_reviews: 'avis',
    featured_browse_all: 'Voir tous les professionnels',
    testimonials_title: 'Adore par des milliers d\'utilisateurs',
    testimonials_subtitle: 'Des retours reels de clients et de businesses qui utilisent la plateforme chaque jour.',
    testimonials_role_customer: 'Client',
    testimonials_role_customer_with_business: 'Client - {business}',
    mobile_badge: 'Application mobile',
    mobile_title_line1: 'Gerez vos reservations',
    mobile_title_line2: 'ou que vous soyez',
    mobile_description:
      'Profitez de toute la puissance de Kayedni dans votre poche : notifications push, gestion instantanee des reservations et analyses en temps reel.',
    mobile_app_store_top: 'Telecharger sur',
    mobile_app_store_bottom: 'App Store',
    mobile_google_play_top: 'DISPONIBLE SUR',
    mobile_google_play_bottom: 'Google Play',
    mobile_rating_label: 'Note App Store',
    mobile_downloads_label: 'Telechargements',
    final_title: 'Rejoignez des milliers d\'utilisateurs qui reservent mieux',
    final_description: 'Commencez gratuitement aujourd\'hui. Aucune carte bancaire requise. Faites grandir votre business avec Kayedni.',
    final_start_booking: 'Commencer gratuitement',
    final_register_business: 'Inscrire votre business',
    calendar_prev_month: 'Mois precedent',
    calendar_next_month: 'Mois suivant',
    booking_demo_badge: 'Planification intelligente',
    booking_demo_title: 'Reservez votre rendez-vous ideal en quelques minutes.',
    booking_demo_description:
      'Trouvez le bon professionnel, comparez les disponibilites et reservez instantanement. Recevez des confirmations Telegram et des rappels intelligents 30 minutes avant votre rendez-vous.',
    booking_demo_cta: 'Trouver un professionnel',
    booking_demo_feature_telegram: 'Rappels Telegram',
    booking_demo_feature_reviews: 'Avis verifies',
    booking_demo_feature_247: 'Reservation 24/7',
    booking_demo_alt_staff_service: 'Selection du staff et du service',
    booking_demo_alt_date_time: 'Selection de la date et de l\'heure',
    featured_category_barber: 'Barber',
    featured_category_education: 'Education',
    featured_category_gaming: 'Gaming',
    featured_location_downtown: 'Centre-ville',
    featured_location_online: 'En ligne',
    featured_location_west_mall: 'West Mall',
    testimonials_fallback_business_style_studio: 'Style Studio',
    testimonials_fallback_business_gamezone: 'GameZone',
    testimonials_fallback_service_tech_support: 'Support technique',
    testimonials_fallback_comment_1:
      'La plateforme a transforme ma gestion des rendez-vous. Mon chiffre d\'affaires a augmente de 40 % des le premier mois.',
    testimonials_fallback_comment_2:
      'Enfin une plateforme de reservation qui fonctionne vraiment ! Recherche facile, reservation rapide et rappels fiables.',
    testimonials_fallback_comment_3:
      'Le meilleur outil pour gerer mon planning. Mes clients adorent les confirmations instantanees et moi, l\'automatisation.',
  },
  ar: {
    hero_badge_prefix: 'جديد:',
    hero_badge_text: 'مستقبل الحجوزات اصبح متاحا اليوم',
    hero_title_prefix: 'احجز خدماتك بكل',
    hero_title_highlight: 'ثقة',
    hero_description:
      'ابحث واحجز مواعيدك فورا مع محترفين بالقرب منك. من الحلاقة الى الدروس الخاصة، كل شيء في منصة واحدة سهلة الاستخدام.',
    search_hint: 'نعرض لك الفئات الان. اكتب حرفا اضافيا لبدء البحث عن الشركات.',
    for_business_prompt: 'هل تملك شركة؟',
    for_business_cta: 'قيدني للشركات',
    featured_title: 'افضل المحترفين بانتظارك',
    featured_subtitle: 'تصفح مزودي خدمات موثوقين وتقييماتهم مرتفعة.',
    featured_unknown_category: 'خدمات عامة',
    featured_nearby: 'بالقرب منك',
    featured_reviews: 'تقييمات',
    featured_browse_all: 'تصفح كل المحترفين',
    testimonials_title: 'محبوب من الاف العملاء',
    testimonials_subtitle: 'تعليقات حقيقية من عملاء وشركات يعتمدون على المنصة يوميا.',
    testimonials_role_customer: 'عميل',
    testimonials_role_customer_with_business: 'عميل - {business}',
    mobile_badge: 'تطبيق الموبايل',
    mobile_title_line1: 'ادِر حجوزاتك',
    mobile_title_line2: 'من اي مكان',
    mobile_description:
      'استخدم قوة قيدني كاملة من هاتفك: اشعارات فورية، ادارة لحظية للحجوزات، وتحليلات مباشرة اينما كنت.',
    mobile_app_store_top: 'حمّل من',
    mobile_app_store_bottom: 'App Store',
    mobile_google_play_top: 'متوفر على',
    mobile_google_play_bottom: 'Google Play',
    mobile_rating_label: 'تقييم التطبيق',
    mobile_downloads_label: 'مرات التنزيل',
    final_title: 'انضم لآلاف المستخدمين الذين يحجزون بذكاء',
    final_description: 'ابدأ مجانا اليوم. لا حاجة لبطاقة بنكية. طور شركتك مع قيدني.',
    final_start_booking: 'ابدأ الحجز مجانا',
    final_register_business: 'سجّل شركتك',
    calendar_prev_month: 'الشهر السابق',
    calendar_next_month: 'الشهر التالي',
    booking_demo_badge: 'جدولة اكثر ذكاء',
    booking_demo_title: 'احجز موعدك المثالي خلال دقائق.',
    booking_demo_description:
      'ابحث عن المختص المناسب، قارن المواعيد المتاحة، واحجز مباشرة. تصلك تأكيدات تيليجرام وتذكيرات ذكية قبل الموعد بـ30 دقيقة.',
    booking_demo_cta: 'ابحث عن محترفك',
    booking_demo_feature_telegram: 'تذكيرات تيليجرام',
    booking_demo_feature_reviews: 'تقييمات موثوقة',
    booking_demo_feature_247: 'حجز على مدار الساعة',
    booking_demo_alt_staff_service: 'اختيار الموظف والخدمة',
    booking_demo_alt_date_time: 'اختيار التاريخ والوقت',
    featured_category_barber: 'حلاقة',
    featured_category_education: 'تعليم',
    featured_category_gaming: 'العاب',
    featured_location_downtown: 'وسط المدينة',
    featured_location_online: 'اونلاين',
    featured_location_west_mall: 'ويست مول',
    testimonials_fallback_business_style_studio: 'ستايل ستوديو',
    testimonials_fallback_business_gamezone: 'جيم زون',
    testimonials_fallback_service_tech_support: 'دعم تقني',
    testimonials_fallback_comment_1:
      'هذه المنصة غيرت طريقة ادارة المواعيد لدي. زادت ايراداتي بنسبة 40٪ خلال الشهر الاول فقط.',
    testimonials_fallback_comment_2:
      'اخيرا منصة حجز تعمل فعلا! البحث سهل، الحجز سريع، والتذكيرات موثوقة.',
    testimonials_fallback_comment_3:
      'افضل اداة لادارة جدولي. عملائي يحبون التأكيدات الفورية وانا احب تقليل العمل اليدوي.',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function homeT(
  locale: LocaleCode,
  key: HomeKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = HOME_DICTIONARY[locale] ?? HOME_DICTIONARY.en;
  const value = dictionary[key] ?? HOME_DICTIONARY.en[key];
  return interpolate(value, params);
}