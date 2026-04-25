import type { LocaleCode } from '@global/lib/locales';

export type DashboardKey =
  | 'dashboard_loading'
  | 'dashboard_error_title'
  | 'dashboard_error_login_required'
  | 'dashboard_error_no_business'
  | 'dashboard_error_invalid_user'
  | 'dashboard_error_fetch_failed'
  | 'dashboard_title_business'
  | 'dashboard_welcome_back'
  | 'dashboard_owner_fallback'
  | 'dashboard_toggle_show_analytics'
  | 'dashboard_toggle_hide_analytics'
  | 'dashboard_role_business_owner'
  | 'dashboard_total_bookings'
  | 'dashboard_completed'
  | 'dashboard_staff_members'
  | 'dashboard_services'
  | 'dashboard_total_revenue'
  | 'dashboard_revenue_from_completed'
  | 'dashboard_view_details'
  | 'dashboard_manage_bookings_title'
  | 'dashboard_manage_bookings_desc'
  | 'dashboard_manage_bookings_cta'
  | 'dashboard_manage_staff_title'
  | 'dashboard_manage_staff_desc'
  | 'dashboard_manage_staff_cta'
  | 'dashboard_manage_services_title'
  | 'dashboard_manage_services_desc'
  | 'dashboard_manage_services_cta'
  | 'dashboard_recent_bookings_title'
  | 'dashboard_recent_bookings_desc'
  | 'dashboard_view_all'
  | 'dashboard_at'
  | 'dashboard_no_bookings_title'
  | 'dashboard_no_bookings_desc'
  | 'dashboard_view_all_bookings'
  | 'dashboard_status_confirmed'
  | 'dashboard_status_pending'
  | 'dashboard_status_completed'
  | 'dashboard_status_cancelled'
  | 'dashboard_status_no_show'
  | 'dashboard_status_unknown'
  | 'dashboard_stats_great'
  | 'dashboard_stats_completion_rate'
  | 'dashboard_stats_total_revenue'
  | 'dashboard_stats_completed'
  | 'dashboard_stats_cancellation_rate'
  | 'dashboard_chart_monthly_bookings'
  | 'dashboard_chart_no_data'
  | 'dashboard_chart_legend_completed'
  | 'dashboard_chart_legend_cancelled'
  | 'dashboard_chart_legend_no_show'
  | 'dashboard_chart_legend_upcoming'
  | 'dashboard_chart_status_distribution'
  | 'dashboard_chart_total'
  | 'dashboard_chart_top_services_completed'
  | 'dashboard_chart_bookings_count'
  | 'dashboard_insight_title'
  | 'dashboard_insight_high'
  | 'dashboard_insight_mid'
  | 'dashboard_insight_low'
  | 'dashboard_month_jan'
  | 'dashboard_month_feb'
  | 'dashboard_month_mar'
  | 'dashboard_month_apr'
  | 'dashboard_month_may'
  | 'dashboard_month_jun'
  | 'dashboard_month_jul'
  | 'dashboard_month_aug'
  | 'dashboard_month_sep'
  | 'dashboard_month_oct'
  | 'dashboard_month_nov'
  | 'dashboard_month_dec';

const DASHBOARD_DICTIONARY: Record<LocaleCode, Record<DashboardKey, string>> = {
  en: {
    dashboard_loading: 'Loading your dashboard...',
    dashboard_error_title: 'Error Loading Dashboard',
    dashboard_error_login_required:
      'Please log in to access the dashboard. If you just logged in, refresh the page.',
    dashboard_error_no_business:
      'No business is linked to this account. Log out and log in again, or create a business first.',
    dashboard_error_invalid_user: 'Invalid user data. Please log in again.',
    dashboard_error_fetch_failed: 'Failed to load dashboard data. Please try again.',
    dashboard_title_business: 'Business Dashboard',
    dashboard_welcome_back: 'Welcome back, {name}!',
    dashboard_owner_fallback: 'Owner',
    dashboard_toggle_show_analytics: 'Show Analytics',
    dashboard_toggle_hide_analytics: 'Hide Analytics',
    dashboard_role_business_owner: 'Business Owner',
    dashboard_total_bookings: 'Total Bookings',
    dashboard_completed: 'Completed',
    dashboard_staff_members: 'Staff Members',
    dashboard_services: 'Services',
    dashboard_total_revenue: 'Total Revenue',
    dashboard_revenue_from_completed: 'From {count} completed bookings',
    dashboard_view_details: 'View Details',
    dashboard_manage_bookings_title: 'Manage Bookings',
    dashboard_manage_bookings_desc: 'View and manage all appointments',
    dashboard_manage_bookings_cta: 'Go to bookings',
    dashboard_manage_staff_title: 'Manage Staff',
    dashboard_manage_staff_desc: 'Add or remove team members',
    dashboard_manage_staff_cta: 'View team',
    dashboard_manage_services_title: 'Manage Services',
    dashboard_manage_services_desc: 'Create and edit your offerings',
    dashboard_manage_services_cta: 'View services',
    dashboard_recent_bookings_title: 'Recent Bookings',
    dashboard_recent_bookings_desc: 'Latest appointments',
    dashboard_view_all: 'View All',
    dashboard_at: 'at',
    dashboard_no_bookings_title: 'No Bookings Yet',
    dashboard_no_bookings_desc: 'You do not have bookings yet. Your appointments will appear here.',
    dashboard_view_all_bookings: 'View All Bookings',
    dashboard_status_confirmed: 'Confirmed',
    dashboard_status_pending: 'Pending',
    dashboard_status_completed: 'Completed',
    dashboard_status_cancelled: 'Cancelled',
    dashboard_status_no_show: 'No Show',
    dashboard_status_unknown: 'Unknown',
    dashboard_stats_great: 'Great!',
    dashboard_stats_completion_rate: 'Completion Rate',
    dashboard_stats_total_revenue: 'Total Revenue',
    dashboard_stats_completed: 'Completed',
    dashboard_stats_cancellation_rate: 'Cancellation Rate',
    dashboard_chart_monthly_bookings: 'Monthly Bookings',
    dashboard_chart_no_data: 'No data available',
    dashboard_chart_legend_completed: 'Completed',
    dashboard_chart_legend_cancelled: 'Cancelled',
    dashboard_chart_legend_no_show: 'No Show',
    dashboard_chart_legend_upcoming: 'Upcoming',
    dashboard_chart_status_distribution: 'Status Distribution',
    dashboard_chart_total: 'Total',
    dashboard_chart_top_services_completed: 'Top Services (Completed)',
    dashboard_chart_bookings_count: '{count} bookings',
    dashboard_insight_title: 'Performance Insight',
    dashboard_insight_high: '{rate}% completion rate is outstanding. You are delivering exceptional service quality.',
    dashboard_insight_mid: 'Your completion rate is {rate}%. Focus on reducing no-shows by sending reminders.',
    dashboard_insight_low:
      'Your completion rate is {rate}%. Follow up with clients before appointments to reduce cancellations and no-shows.',
    dashboard_month_jan: 'Jan',
    dashboard_month_feb: 'Feb',
    dashboard_month_mar: 'Mar',
    dashboard_month_apr: 'Apr',
    dashboard_month_may: 'May',
    dashboard_month_jun: 'Jun',
    dashboard_month_jul: 'Jul',
    dashboard_month_aug: 'Aug',
    dashboard_month_sep: 'Sep',
    dashboard_month_oct: 'Oct',
    dashboard_month_nov: 'Nov',
    dashboard_month_dec: 'Dec',
  },
  fr: {
    dashboard_loading: 'Chargement de votre tableau de bord...',
    dashboard_error_title: 'Erreur de chargement du dashboard',
    dashboard_error_login_required:
      'Connectez-vous pour acceder au dashboard. Si vous venez de vous connecter, actualisez la page.',
    dashboard_error_no_business:
      'Aucun business lie a ce compte. Deconnectez-vous puis reconnectez-vous, ou creez un business.',
    dashboard_error_invalid_user: 'Donnees utilisateur invalides. Veuillez vous reconnecter.',
    dashboard_error_fetch_failed: 'Impossible de charger les donnees du dashboard. Reessayez.',
    dashboard_title_business: 'Dashboard Business',
    dashboard_welcome_back: 'Bon retour, {name} !',
    dashboard_owner_fallback: 'Responsable',
    dashboard_toggle_show_analytics: 'Afficher analytics',
    dashboard_toggle_hide_analytics: 'Masquer analytics',
    dashboard_role_business_owner: 'Business Owner',
    dashboard_total_bookings: 'Reservations totales',
    dashboard_completed: 'Terminees',
    dashboard_staff_members: 'Membres staff',
    dashboard_services: 'Services',
    dashboard_total_revenue: 'Revenu total',
    dashboard_revenue_from_completed: 'Sur {count} reservations terminees',
    dashboard_view_details: 'Voir details',
    dashboard_manage_bookings_title: 'Gerer reservations',
    dashboard_manage_bookings_desc: 'Voir et gerer tous les rendez-vous',
    dashboard_manage_bookings_cta: 'Aller aux reservations',
    dashboard_manage_staff_title: 'Gerer staff',
    dashboard_manage_staff_desc: 'Ajouter ou retirer des membres',
    dashboard_manage_staff_cta: 'Voir equipe',
    dashboard_manage_services_title: 'Gerer services',
    dashboard_manage_services_desc: 'Creer et modifier vos offres',
    dashboard_manage_services_cta: 'Voir services',
    dashboard_recent_bookings_title: 'Reservations recentes',
    dashboard_recent_bookings_desc: 'Derniers rendez-vous',
    dashboard_view_all: 'Voir tout',
    dashboard_at: 'a',
    dashboard_no_bookings_title: 'Aucune reservation pour le moment',
    dashboard_no_bookings_desc: 'Vous n\'avez pas encore de reservations. Elles apparaitront ici.',
    dashboard_view_all_bookings: 'Voir toutes les reservations',
    dashboard_status_confirmed: 'Confirme',
    dashboard_status_pending: 'En attente',
    dashboard_status_completed: 'Termine',
    dashboard_status_cancelled: 'Annule',
    dashboard_status_no_show: 'Absence',
    dashboard_status_unknown: 'Inconnu',
    dashboard_stats_great: 'Super !',
    dashboard_stats_completion_rate: 'Taux de completion',
    dashboard_stats_total_revenue: 'Revenu total',
    dashboard_stats_completed: 'Terminees',
    dashboard_stats_cancellation_rate: 'Taux d\'annulation',
    dashboard_chart_monthly_bookings: 'Reservations mensuelles',
    dashboard_chart_no_data: 'Aucune donnee disponible',
    dashboard_chart_legend_completed: 'Terminees',
    dashboard_chart_legend_cancelled: 'Annulees',
    dashboard_chart_legend_no_show: 'Absence',
    dashboard_chart_legend_upcoming: 'A venir',
    dashboard_chart_status_distribution: 'Repartition des statuts',
    dashboard_chart_total: 'Total',
    dashboard_chart_top_services_completed: 'Top services (termines)',
    dashboard_chart_bookings_count: '{count} reservations',
    dashboard_insight_title: 'Insight performance',
    dashboard_insight_high: 'Le taux de completion ({rate}%) est excellent. Qualite de service remarquable.',
    dashboard_insight_mid:
      'Votre taux de completion est de {rate}%. Reduisez les absences avec des rappels pour l\'ameliorer.',
    dashboard_insight_low:
      'Votre taux de completion est de {rate}%. Relancez les clients avant les rendez-vous pour reduire annulations et absences.',
    dashboard_month_jan: 'Janv',
    dashboard_month_feb: 'Fevr',
    dashboard_month_mar: 'Mars',
    dashboard_month_apr: 'Avr',
    dashboard_month_may: 'Mai',
    dashboard_month_jun: 'Juin',
    dashboard_month_jul: 'Juil',
    dashboard_month_aug: 'Aout',
    dashboard_month_sep: 'Sept',
    dashboard_month_oct: 'Oct',
    dashboard_month_nov: 'Nov',
    dashboard_month_dec: 'Dec',
  },
  ar: {
    dashboard_loading: 'جار تحميل لوحة التحكم...',
    dashboard_error_title: 'خطأ في تحميل لوحة التحكم',
    dashboard_error_login_required:
      'يرجى تسجيل الدخول للوصول الى لوحة التحكم. اذا سجلت الدخول للتو، حدّث الصفحة.',
    dashboard_error_no_business:
      'لا توجد منشأة مرتبطة بهذا الحساب. سجّل الخروج ثم ادخل مجددا، او انشئ منشأة اولا.',
    dashboard_error_invalid_user: 'بيانات المستخدم غير صالحة. يرجى تسجيل الدخول مجددا.',
    dashboard_error_fetch_failed: 'تعذر تحميل بيانات لوحة التحكم. حاول مرة اخرى.',
    dashboard_title_business: 'لوحة تحكم المنشأة',
    dashboard_welcome_back: 'اهلا بعودتك، {name}!',
    dashboard_owner_fallback: 'المالك',
    dashboard_toggle_show_analytics: 'عرض التحليلات',
    dashboard_toggle_hide_analytics: 'اخفاء التحليلات',
    dashboard_role_business_owner: 'مالك المنشأة',
    dashboard_total_bookings: 'اجمالي الحجوزات',
    dashboard_completed: 'المكتملة',
    dashboard_staff_members: 'اعضاء الفريق',
    dashboard_services: 'الخدمات',
    dashboard_total_revenue: 'اجمالي الايرادات',
    dashboard_revenue_from_completed: 'من {count} حجوزات مكتملة',
    dashboard_view_details: 'عرض التفاصيل',
    dashboard_manage_bookings_title: 'ادارة الحجوزات',
    dashboard_manage_bookings_desc: 'عرض وادارة كل المواعيد',
    dashboard_manage_bookings_cta: 'عرض الحجوزات',
    dashboard_manage_staff_title: 'ادارة الفريق',
    dashboard_manage_staff_desc: 'اضافة او ازالة اعضاء الفريق',
    dashboard_manage_staff_cta: 'عرض الفريق',
    dashboard_manage_services_title: 'ادارة الخدمات',
    dashboard_manage_services_desc: 'انشئ خدماتك وعدّلها',
    dashboard_manage_services_cta: 'عرض الخدمات',
    dashboard_recent_bookings_title: 'احدث الحجوزات',
    dashboard_recent_bookings_desc: 'اخر المواعيد',
    dashboard_view_all: 'عرض الكل',
    dashboard_at: 'الساعة',
    dashboard_no_bookings_title: 'لا توجد حجوزات بعد',
    dashboard_no_bookings_desc: 'ليس لديك حجوزات حاليا. ستظهر مواعيدك هنا.',
    dashboard_view_all_bookings: 'عرض كل الحجوزات',
    dashboard_status_confirmed: 'مؤكد',
    dashboard_status_pending: 'قيد الانتظار',
    dashboard_status_completed: 'مكتمل',
    dashboard_status_cancelled: 'ملغي',
    dashboard_status_no_show: 'عدم حضور',
    dashboard_status_unknown: 'غير معروف',
    dashboard_stats_great: 'ممتاز!',
    dashboard_stats_completion_rate: 'نسبة الاكتمال',
    dashboard_stats_total_revenue: 'اجمالي الايرادات',
    dashboard_stats_completed: 'المكتملة',
    dashboard_stats_cancellation_rate: 'نسبة الالغاء',
    dashboard_chart_monthly_bookings: 'حجوزات شهرية',
    dashboard_chart_no_data: 'لا توجد بيانات متاحة',
    dashboard_chart_legend_completed: 'مكتملة',
    dashboard_chart_legend_cancelled: 'ملغاة',
    dashboard_chart_legend_no_show: 'عدم حضور',
    dashboard_chart_legend_upcoming: 'قادمة',
    dashboard_chart_status_distribution: 'توزيع الحالات',
    dashboard_chart_total: 'الاجمالي',
    dashboard_chart_top_services_completed: 'اكثر الخدمات (مكتملة)',
    dashboard_chart_bookings_count: '{count} حجوزات',
    dashboard_insight_title: 'مؤشر الاداء',
    dashboard_insight_high: 'نسبة الاكتمال {rate}% ممتازة. جودة الخدمة لديك عالية جدا.',
    dashboard_insight_mid: 'نسبة الاكتمال لديك {rate}%. قلّل عدم الحضور عبر تذكيرات قبل الموعد.',
    dashboard_insight_low:
      'نسبة الاكتمال لديك {rate}%. تواصل مع العملاء قبل الموعد لتقليل الالغاءات وعدم الحضور.',
    dashboard_month_jan: 'يناير',
    dashboard_month_feb: 'فبراير',
    dashboard_month_mar: 'مارس',
    dashboard_month_apr: 'ابريل',
    dashboard_month_may: 'مايو',
    dashboard_month_jun: 'يونيو',
    dashboard_month_jul: 'يوليو',
    dashboard_month_aug: 'اغسطس',
    dashboard_month_sep: 'سبتمبر',
    dashboard_month_oct: 'اكتوبر',
    dashboard_month_nov: 'نوفمبر',
    dashboard_month_dec: 'ديسمبر',
  },
};

const STATUS_KEY_BY_CODE: Record<string, DashboardKey> = {
  CONFIRMED: 'dashboard_status_confirmed',
  PENDING: 'dashboard_status_pending',
  COMPLETED: 'dashboard_status_completed',
  CANCELLED: 'dashboard_status_cancelled',
  NO_SHOW: 'dashboard_status_no_show',
};

const MONTH_KEY_BY_SHORT: Record<string, DashboardKey> = {
  Jan: 'dashboard_month_jan',
  Feb: 'dashboard_month_feb',
  Mar: 'dashboard_month_mar',
  Apr: 'dashboard_month_apr',
  May: 'dashboard_month_may',
  Jun: 'dashboard_month_jun',
  Jul: 'dashboard_month_jul',
  Aug: 'dashboard_month_aug',
  Sep: 'dashboard_month_sep',
  Oct: 'dashboard_month_oct',
  Nov: 'dashboard_month_nov',
  Dec: 'dashboard_month_dec',
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function dashboardT(
  locale: LocaleCode,
  key: DashboardKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = DASHBOARD_DICTIONARY[locale] ?? DASHBOARD_DICTIONARY.en;
  const value = dictionary[key] ?? DASHBOARD_DICTIONARY.en[key];
  return interpolate(value, params);
}

export function dashboardStatusT(locale: LocaleCode, status: string | null | undefined): string {
  if (!status) {
    return dashboardT(locale, 'dashboard_status_unknown');
  }

  const normalized = status.toUpperCase();
  const key = STATUS_KEY_BY_CODE[normalized];
  if (!key) {
    return dashboardT(locale, 'dashboard_status_unknown');
  }

  return dashboardT(locale, key);
}

export function dashboardMonthT(locale: LocaleCode, month: string): string {
  const normalized = month.slice(0, 3);
  const key = MONTH_KEY_BY_SHORT[normalized];
  if (!key) {
    return month;
  }

  return dashboardT(locale, key);
}
