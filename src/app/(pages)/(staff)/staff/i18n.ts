import type { LocaleCode } from '@global/lib/locales';

export type StaffKey =
  | 'stats_loading'
  | 'stats_title'
  | 'stats_subtitle'
  | 'stats_badge_analytics'
  | 'back_to_dashboard'
  | 'dashboard_loading_workspace'
  | 'dashboard_title'
  | 'dashboard_welcome_back'
  | 'dashboard_default_staff_name'
  | 'dashboard_badge_staff_member'
  | 'dashboard_no_business_title'
  | 'dashboard_no_business_desc'
  | 'dashboard_business_id_found'
  | 'dashboard_business_gallery_title'
  | 'dashboard_thumbnail_alt'
  | 'dashboard_analytics_title'
  | 'dashboard_hide_charts'
  | 'resign_dialog_title'
  | 'resign_dialog_default_business'
  | 'resign_dialog_warning_title'
  | 'resign_dialog_warning_remove_access'
  | 'resign_dialog_warning_convert_client'
  | 'resign_dialog_warning_logout'
  | 'resign_dialog_hint'
  | 'resign_dialog_stay'
  | 'resign_dialog_leaving'
  | 'resign_dialog_confirm_leave'
  | 'toast_error_title'
  | 'toast_error_user_not_found'
  | 'toast_auth_required_title'
  | 'toast_auth_required_desc'
  | 'toast_no_business_title'
  | 'toast_no_business_desc'
  | 'toast_success_resigned_title'
  | 'toast_success_resigned_desc'
  | 'toast_failed_resign_title'
  | 'toast_failed_resign_desc'
  | 'business_card_you_work_at'
  | 'business_card_location'
  | 'business_card_phone'
  | 'business_card_email'
  | 'business_card_services'
  | 'business_card_team_members'
  | 'quick_stats_total_bookings'
  | 'quick_stats_completed'
  | 'quick_stats_upcoming'
  | 'quick_stats_no_show_cancelled'
  | 'quick_actions_bookings_title'
  | 'quick_actions_bookings_desc'
  | 'quick_actions_go_to_bookings'
  | 'quick_actions_schedule_title'
  | 'quick_actions_schedule_desc'
  | 'quick_actions_view_schedule'
  | 'quick_actions_performance_title'
  | 'quick_actions_performance_desc'
  | 'quick_actions_hide_charts'
  | 'quick_actions_view_charts'
  | 'business_qr_panel_title'
  | 'business_qr_panel_desc'
  | 'business_qr_panel_updated'
  | 'business_qr_view'
  | 'business_qr_share'
  | 'business_qr_unavailable'
  | 'services_section_title'
  | 'services_section_subtitle'
  | 'services_section_create_service'
  | 'services_section_all_services'
  | 'services_section_all_services_desc'
  | 'services_section_browse'
  | 'services_section_my_services'
  | 'services_section_my_services_desc'
  | 'services_section_view_edit'
  | 'services_section_new_service'
  | 'services_section_new_service_desc'
  | 'services_section_create'
  | 'leave_section_title'
  | 'leave_section_desc'
  | 'leave_section_default_business'
  | 'leave_section_button';

const STAFF_DICTIONARY: Record<LocaleCode, Record<StaffKey, string>> = {
  en: {
    stats_loading: 'Loading your stats...',
    stats_title: 'Performance Stats',
    stats_subtitle: 'Your booking analytics and insights',
    stats_badge_analytics: 'Analytics',
    back_to_dashboard: 'Back to dashboard',
    dashboard_loading_workspace: 'Loading your workspace...',
    dashboard_title: 'My Workspace',
    dashboard_welcome_back: 'Welcome back, {name}!',
    dashboard_default_staff_name: 'Staff',
    dashboard_badge_staff_member: 'Staff Member',
    dashboard_no_business_title: 'No Business Linked',
    dashboard_no_business_desc:
      'Your account is not currently linked to a business. Please contact your employer or log out and log back in to refresh your account data.',
    dashboard_business_id_found: 'Business ID found: {id} (loading may have failed)',
    dashboard_business_gallery_title: 'Business Gallery',
    dashboard_thumbnail_alt: 'Thumbnail {index}',
    dashboard_analytics_title: 'Analytics Dashboard',
    dashboard_hide_charts: 'Hide Charts',
    resign_dialog_title: 'Leave {business}?',
    resign_dialog_default_business: 'Business',
    resign_dialog_warning_title: 'This action will:',
    resign_dialog_warning_remove_access: 'Remove your staff access to this business',
    resign_dialog_warning_convert_client: 'Convert your account to a regular client',
    resign_dialog_warning_logout: 'Log you out of your current session',
    resign_dialog_hint: 'You can still book services as a client after leaving.',
    resign_dialog_stay: 'No, Stay',
    resign_dialog_leaving: 'Leaving...',
    resign_dialog_confirm_leave: 'Yes, Leave',
    toast_error_title: 'Error',
    toast_error_user_not_found: 'User information not found. Please try logging in again.',
    toast_auth_required_title: 'Authentication required',
    toast_auth_required_desc: 'Please log in again to continue.',
    toast_no_business_title: 'No business found',
    toast_no_business_desc: 'You are not currently linked to any business.',
    toast_success_resigned_title: 'Successfully resigned',
    toast_success_resigned_desc: 'You have left the business. You will now be logged out.',
    toast_failed_resign_title: 'Failed to resign',
    toast_failed_resign_desc: 'Unable to leave the business. Please try again.',
    business_card_you_work_at: 'You work at',
    business_card_location: 'Location',
    business_card_phone: 'Phone',
    business_card_email: 'Email',
    business_card_services: 'Services',
    business_card_team_members: 'Team Members',
    quick_stats_total_bookings: 'Total Bookings',
    quick_stats_completed: 'Completed',
    quick_stats_upcoming: 'Upcoming',
    quick_stats_no_show_cancelled: 'No Show / Cancelled',
    quick_actions_bookings_title: 'My Bookings',
    quick_actions_bookings_desc: 'View and manage all your appointments',
    quick_actions_go_to_bookings: 'Go to bookings',
    quick_actions_schedule_title: 'My Schedule',
    quick_actions_schedule_desc: 'Manage your availability and working hours',
    quick_actions_view_schedule: 'View schedule',
    quick_actions_performance_title: 'Performance',
    quick_actions_performance_desc: '{rate}% completion rate • {total} total bookings',
    quick_actions_hide_charts: 'Hide charts',
    quick_actions_view_charts: 'View charts',
    business_qr_panel_title: 'Business QR',
    business_qr_panel_desc: 'Open the active business QR, print it, or share the link.',
    business_qr_panel_updated: 'Last updated',
    business_qr_view: 'View QR',
    business_qr_share: 'Share Business',
    business_qr_unavailable: 'QR not available yet.',
    services_section_title: 'Services Management',
    services_section_subtitle: 'Manage services you provide',
    services_section_create_service: 'Create Service',
    services_section_all_services: 'All Services',
    services_section_all_services_desc: 'View all {count} business services',
    services_section_browse: 'Browse',
    services_section_my_services: 'My Services',
    services_section_my_services_desc: 'Services you currently provide',
    services_section_view_edit: 'View & Edit',
    services_section_new_service: 'New Service',
    services_section_new_service_desc: 'Create a custom service',
    services_section_create: 'Create',
    leave_section_title: 'Leave This Business',
    leave_section_desc:
      "If you wish to leave {business}, you can resign from your staff position. You'll become a regular client.",
    leave_section_default_business: 'this business',
    leave_section_button: 'Leave Business',
  },
  fr: {
    stats_loading: 'Chargement de vos statistiques...',
    stats_title: 'Statistiques de performance',
    stats_subtitle: 'Vos analyses et indicateurs de reservation',
    stats_badge_analytics: 'Analytique',
    back_to_dashboard: 'Retour au tableau de bord',
    dashboard_loading_workspace: 'Chargement de votre espace...',
    dashboard_title: 'Mon espace',
    dashboard_welcome_back: 'Bon retour, {name} !',
    dashboard_default_staff_name: 'Employe',
    dashboard_badge_staff_member: 'Membre du personnel',
    dashboard_no_business_title: 'Aucun business lie',
    dashboard_no_business_desc:
      'Votre compte n est actuellement lie a aucun business. Contactez votre employeur ou reconnectez-vous pour rafraichir vos donnees.',
    dashboard_business_id_found: 'Identifiant business trouve : {id} (le chargement a peut-etre echoue)',
    dashboard_business_gallery_title: 'Galerie du business',
    dashboard_thumbnail_alt: 'Miniature {index}',
    dashboard_analytics_title: 'Tableau analytique',
    dashboard_hide_charts: 'Masquer les graphiques',
    resign_dialog_title: 'Quitter {business} ?',
    resign_dialog_default_business: 'le business',
    resign_dialog_warning_title: 'Cette action va :',
    resign_dialog_warning_remove_access: 'Retirer votre acces staff a ce business',
    resign_dialog_warning_convert_client: 'Convertir votre compte en client regulier',
    resign_dialog_warning_logout: 'Vous deconnecter de votre session actuelle',
    resign_dialog_hint: 'Vous pourrez toujours reserver des services comme client apres avoir quitte.',
    resign_dialog_stay: 'Non, rester',
    resign_dialog_leaving: 'Depart...',
    resign_dialog_confirm_leave: 'Oui, quitter',
    toast_error_title: 'Erreur',
    toast_error_user_not_found: 'Informations utilisateur introuvables. Reconnectez-vous puis reessayez.',
    toast_auth_required_title: 'Authentification requise',
    toast_auth_required_desc: 'Reconnectez-vous pour continuer.',
    toast_no_business_title: 'Aucun business trouve',
    toast_no_business_desc: 'Vous n etes actuellement lie a aucun business.',
    toast_success_resigned_title: 'Demission reussie',
    toast_success_resigned_desc: 'Vous avez quitte le business. Vous allez etre deconnecte.',
    toast_failed_resign_title: 'Echec de la demission',
    toast_failed_resign_desc: 'Impossible de quitter le business. Veuillez reessayer.',
    business_card_you_work_at: 'Vous travaillez chez',
    business_card_location: 'Adresse',
    business_card_phone: 'Telephone',
    business_card_email: 'Email',
    business_card_services: 'Services',
    business_card_team_members: 'Membres equipe',
    quick_stats_total_bookings: 'Reservations totales',
    quick_stats_completed: 'Terminees',
    quick_stats_upcoming: 'A venir',
    quick_stats_no_show_cancelled: 'No-show / Annulees',
    quick_actions_bookings_title: 'Mes reservations',
    quick_actions_bookings_desc: 'Voir et gerer tous vos rendez-vous',
    quick_actions_go_to_bookings: 'Aller aux reservations',
    quick_actions_schedule_title: 'Mon planning',
    quick_actions_schedule_desc: 'Gerer vos disponibilites et horaires',
    quick_actions_view_schedule: 'Voir le planning',
    quick_actions_performance_title: 'Performance',
    quick_actions_performance_desc: '{rate}% de taux de completion • {total} reservations au total',
    quick_actions_hide_charts: 'Masquer les graphiques',
    quick_actions_view_charts: 'Voir les graphiques',
    business_qr_panel_title: 'QR du business',
    business_qr_panel_desc: 'Ouvrez le QR actif, imprimez-le ou partagez le lien.',
    business_qr_panel_updated: 'Derniere mise a jour',
    business_qr_view: 'Voir le QR',
    business_qr_share: 'Partager le business',
    business_qr_unavailable: 'QR pas encore disponible.',
    services_section_title: 'Gestion des services',
    services_section_subtitle: 'Gerez les services que vous proposez',
    services_section_create_service: 'Creer un service',
    services_section_all_services: 'Tous les services',
    services_section_all_services_desc: 'Voir les {count} services du business',
    services_section_browse: 'Parcourir',
    services_section_my_services: 'Mes services',
    services_section_my_services_desc: 'Services que vous proposez actuellement',
    services_section_view_edit: 'Voir et modifier',
    services_section_new_service: 'Nouveau service',
    services_section_new_service_desc: 'Creer un service personnalise',
    services_section_create: 'Creer',
    leave_section_title: 'Quitter ce business',
    leave_section_desc:
      'Si vous souhaitez quitter {business}, vous pouvez demissionner de votre poste staff. Vous deviendrez un client regulier.',
    leave_section_default_business: 'ce business',
    leave_section_button: 'Quitter le business',
  },
  ar: {
    stats_loading: 'جار تحميل احصاءاتك...',
    stats_title: 'احصاءات الاداء',
    stats_subtitle: 'تحليلات وموشرات حجوزاتك',
    stats_badge_analytics: 'التحليلات',
    back_to_dashboard: 'العودة الى لوحة التحكم',
    dashboard_loading_workspace: 'جار تحميل مساحة عملك...',
    dashboard_title: 'مساحة عملي',
    dashboard_welcome_back: 'اهلا بعودتك، {name}!',
    dashboard_default_staff_name: 'الموظف',
    dashboard_badge_staff_member: 'عضو فريق العمل',
    dashboard_no_business_title: 'لا يوجد نشاط مرتبط',
    dashboard_no_business_desc:
      'حسابك غير مرتبط حاليا باي نشاط. يرجى التواصل مع صاحب العمل او تسجيل الخروج ثم الدخول مجددا لتحديث بيانات الحساب.',
    dashboard_business_id_found: 'تم العثور على معرف النشاط: {id} (قد يكون التحميل فشل)',
    dashboard_business_gallery_title: 'معرض النشاط',
    dashboard_thumbnail_alt: 'صورة مصغرة {index}',
    dashboard_analytics_title: 'لوحة التحليلات',
    dashboard_hide_charts: 'اخفاء المخططات',
    resign_dialog_title: 'هل تريد مغادرة {business}؟',
    resign_dialog_default_business: 'النشاط',
    resign_dialog_warning_title: 'هذا الاجراء سوف:',
    resign_dialog_warning_remove_access: 'يزيل صلاحية الموظف الخاصة بك لهذا النشاط',
    resign_dialog_warning_convert_client: 'يحوّل حسابك الى عميل عادي',
    resign_dialog_warning_logout: 'يسجل خروجك من جلستك الحالية',
    resign_dialog_hint: 'لا يزال بامكانك حجز الخدمات كعميل بعد المغادرة.',
    resign_dialog_stay: 'لا، ابق',
    resign_dialog_leaving: 'جار المغادرة...',
    resign_dialog_confirm_leave: 'نعم، غادر',
    toast_error_title: 'خطا',
    toast_error_user_not_found: 'تعذر العثور على معلومات المستخدم. يرجى تسجيل الدخول مرة اخرى.',
    toast_auth_required_title: 'مطلوب تسجيل الدخول',
    toast_auth_required_desc: 'يرجى تسجيل الدخول مرة اخرى للمتابعة.',
    toast_no_business_title: 'لا يوجد نشاط',
    toast_no_business_desc: 'انت غير مرتبط حاليا باي نشاط.',
    toast_success_resigned_title: 'تمت المغادرة بنجاح',
    toast_success_resigned_desc: 'لقد غادرت النشاط. سيتم تسجيل خروجك الان.',
    toast_failed_resign_title: 'فشلت عملية المغادرة',
    toast_failed_resign_desc: 'تعذر مغادرة النشاط. يرجى المحاولة مرة اخرى.',
    business_card_you_work_at: 'انت تعمل في',
    business_card_location: 'الموقع',
    business_card_phone: 'الهاتف',
    business_card_email: 'البريد الالكتروني',
    business_card_services: 'الخدمات',
    business_card_team_members: 'اعضاء الفريق',
    quick_stats_total_bookings: 'اجمالي الحجوزات',
    quick_stats_completed: 'المكتملة',
    quick_stats_upcoming: 'القادمة',
    quick_stats_no_show_cancelled: 'عدم حضور / ملغاة',
    quick_actions_bookings_title: 'حجوزاتي',
    quick_actions_bookings_desc: 'عرض وادارة جميع مواعيدك',
    quick_actions_go_to_bookings: 'الذهاب الى الحجوزات',
    quick_actions_schedule_title: 'جدولي',
    quick_actions_schedule_desc: 'ادارة التوفر وساعات العمل',
    quick_actions_view_schedule: 'عرض الجدول',
    quick_actions_performance_title: 'الاداء',
    quick_actions_performance_desc: 'نسبة انجاز {rate}% • اجمالي الحجوزات {total}',
    quick_actions_hide_charts: 'اخفاء المخططات',
    quick_actions_view_charts: 'عرض المخططات',
    business_qr_panel_title: 'رمز QR للنشاط',
    business_qr_panel_desc: 'افتح رمز QR الحالي او اطبعه او شارك الرابط.',
    business_qr_panel_updated: 'آخر تحديث',
    business_qr_view: 'عرض QR',
    business_qr_share: 'مشاركة النشاط',
    business_qr_unavailable: 'رمز QR غير متاح بعد.',
    services_section_title: 'ادارة الخدمات',
    services_section_subtitle: 'ادارة الخدمات التي تقدمها',
    services_section_create_service: 'انشاء خدمة',
    services_section_all_services: 'كل الخدمات',
    services_section_all_services_desc: 'عرض جميع خدمات النشاط ({count})',
    services_section_browse: 'تصفح',
    services_section_my_services: 'خدماتي',
    services_section_my_services_desc: 'الخدمات التي تقدمها حاليا',
    services_section_view_edit: 'عرض وتعديل',
    services_section_new_service: 'خدمة جديدة',
    services_section_new_service_desc: 'انشاء خدمة مخصصة',
    services_section_create: 'انشاء',
    leave_section_title: 'مغادرة هذا النشاط',
    leave_section_desc:
      'اذا كنت تريد مغادرة {business}، يمكنك الاستقالة من دورك كموظف. ستصبح عميلا عاديا.',
    leave_section_default_business: 'هذا النشاط',
    leave_section_button: 'مغادرة النشاط',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, token: string) => String(params[token] ?? `{${token}}`));
}

export function staffT(
  locale: LocaleCode,
  key: StaffKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = STAFF_DICTIONARY[locale] ?? STAFF_DICTIONARY.en;
  const value = dictionary[key] ?? STAFF_DICTIONARY.en[key];
  return interpolate(value, params);
}
