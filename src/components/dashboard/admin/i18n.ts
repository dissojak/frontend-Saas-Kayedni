import type { LocaleCode } from '@global/lib/locales';

export type AdminKey =
  | 'loading'
  | 'logout'
  | 'admin_control_panel'
  | 'management_system_name'
  | 'welcome_back_name'
  | 'control_panel_subtitle'
  | 'quick_actions'
  | 'recent_activity'
  | 'recent_activity_desc'
  | 'total_users'
  | 'total_bookings'
  | 'active_businesses'
  | 'pending_reviews'
  | 'manage_users_title'
  | 'manage_users_desc'
  | 'view_analytics_title'
  | 'view_analytics_desc'
  | 'business_overview_title'
  | 'business_overview_desc'
  | 'system_settings_title'
  | 'system_settings_desc'
  | 'activity_new_user_registered'
  | 'activity_business_verified'
  | 'activity_booking_created'
  | 'activity_payment_processed'
  | 'activity_time_5_minutes'
  | 'activity_time_1_hour'
  | 'activity_time_2_hours'
  | 'activity_time_3_hours'
  | 'admin_access'
  | 'admin_login'
  | 'secure_access_subtitle'
  | 'email_address'
  | 'password'
  | 'forgot_password'
  | 'sign_in'
  | 'signing_in'
  | 'back_to_home'
  | 'security_note'
  | 'admin_dashboard'
  | 'welcome_admin_name'
  | 'administrator'
  | 'tab_businesses'
  | 'tab_users'
  | 'tab_analytics'
  | 'tab_billing'
  | 'recent_businesses'
  | 'add_business'
  | 'table_business'
  | 'table_owner'
  | 'table_category'
  | 'table_staff'
  | 'table_status'
  | 'view'
  | 'view_all_businesses'
  | 'recent_users'
  | 'add_user'
  | 'table_name'
  | 'table_email'
  | 'table_role'
  | 'table_registered'
  | 'table_bookings'
  | 'view_all_users'
  | 'system_analytics'
  | 'analytics_placeholder'
  | 'subscription_plans'
  | 'free_tier'
  | 'free_tier_desc'
  | 'free_tier_price'
  | 'edit'
  | 'add_new_plan'
  | 'status_active'
  | 'status_pending'
  | 'category_barber'
  | 'category_education'
  | 'category_gaming'
  | 'category_fitness'
  | 'role_client'
  | 'role_business'
  | 'role_staff'
  | 'stat_active_users'
  | 'stat_businesses'
  | 'stat_total_bookings'
  | 'stat_revenue'
  | 'change_from_last_month'
  | 'error_access_denied_admin_required'
  | 'error_login_failed'
  | 'error_login_unexpected';

const ADMIN_DICTIONARY: Record<LocaleCode, Record<AdminKey, string>> = {
  en: {
    loading: 'Loading...',
    logout: 'Logout',
    admin_control_panel: 'Admin Control Panel',
    management_system_name: 'Kayedni Management System',
    welcome_back_name: 'Welcome back, {name}!',
    control_panel_subtitle: "Here's what is happening with your platform today.",
    quick_actions: 'Quick Actions',
    recent_activity: 'Recent Activity',
    recent_activity_desc: 'Latest system activities and updates',
    total_users: 'Total Users',
    total_bookings: 'Total Bookings',
    active_businesses: 'Active Businesses',
    pending_reviews: 'Pending Reviews',
    manage_users_title: 'Manage Users',
    manage_users_desc: 'View and manage user accounts',
    view_analytics_title: 'View Analytics',
    view_analytics_desc: 'System analytics and reports',
    business_overview_title: 'Business Overview',
    business_overview_desc: 'Manage registered businesses',
    system_settings_title: 'System Settings',
    system_settings_desc: 'Configure system settings',
    activity_new_user_registered: 'New user registered',
    activity_business_verified: 'Business verified',
    activity_booking_created: 'Booking created',
    activity_payment_processed: 'Payment processed',
    activity_time_5_minutes: '5 minutes ago',
    activity_time_1_hour: '1 hour ago',
    activity_time_2_hours: '2 hours ago',
    activity_time_3_hours: '3 hours ago',
    admin_access: 'Admin Access',
    admin_login: 'Admin Login',
    secure_access_subtitle: 'Secure access to the control panel',
    email_address: 'Email Address',
    password: 'Password',
    forgot_password: 'Forgot password?',
    sign_in: 'Sign In',
    signing_in: 'Signing in...',
    back_to_home: 'Back to home',
    security_note: 'This is a secured admin area. All access is logged.',
    admin_dashboard: 'Admin Dashboard',
    welcome_admin_name: 'Welcome, {name} ({role})',
    administrator: 'Administrator',
    tab_businesses: 'Businesses',
    tab_users: 'Users',
    tab_analytics: 'Analytics',
    tab_billing: 'Billing',
    recent_businesses: 'Recent Businesses',
    add_business: 'Add Business',
    table_business: 'Business',
    table_owner: 'Owner',
    table_category: 'Category',
    table_staff: 'Staff',
    table_status: 'Status',
    view: 'View',
    view_all_businesses: 'View All Businesses',
    recent_users: 'Recent Users',
    add_user: 'Add User',
    table_name: 'Name',
    table_email: 'Email',
    table_role: 'Role',
    table_registered: 'Registered',
    table_bookings: 'Bookings',
    view_all_users: 'View All Users',
    system_analytics: 'System Analytics',
    analytics_placeholder: 'Analytics charts will appear here',
    subscription_plans: 'Subscription Plans',
    free_tier: 'Free Tier',
    free_tier_desc: 'Basic booking functionality',
    free_tier_price: '$0 / month',
    edit: 'Edit',
    add_new_plan: 'Add New Plan',
    status_active: 'Active',
    status_pending: 'Pending',
    category_barber: 'Barber',
    category_education: 'Education',
    category_gaming: 'Gaming',
    category_fitness: 'Fitness',
    role_client: 'Client',
    role_business: 'Business',
    role_staff: 'Staff',
    stat_active_users: 'Active Users',
    stat_businesses: 'Businesses',
    stat_total_bookings: 'Total Bookings',
    stat_revenue: 'Revenue',
    change_from_last_month: '+{value}% from last month',
    error_access_denied_admin_required: 'Access denied. Admin privileges required.',
    error_login_failed: 'Login failed',
    error_login_unexpected: 'An error occurred during login',
  },
  fr: {
    loading: 'Chargement...',
    logout: 'Se deconnecter',
    admin_control_panel: 'Panneau de controle admin',
    management_system_name: 'Systeme de gestion Kayedni',
    welcome_back_name: 'Bon retour, {name} !',
    control_panel_subtitle: 'Voici ce qui se passe sur votre plateforme aujourd hui.',
    quick_actions: 'Actions rapides',
    recent_activity: 'Activite recente',
    recent_activity_desc: 'Dernieres activites et mises a jour du systeme',
    total_users: 'Utilisateurs totaux',
    total_bookings: 'Reservations totales',
    active_businesses: 'Businesses actifs',
    pending_reviews: 'Avis en attente',
    manage_users_title: 'Gerer les utilisateurs',
    manage_users_desc: 'Voir et gerer les comptes utilisateurs',
    view_analytics_title: 'Voir les analyses',
    view_analytics_desc: 'Analyses et rapports systeme',
    business_overview_title: 'Vue des businesses',
    business_overview_desc: 'Gerer les businesses enregistres',
    system_settings_title: 'Parametres systeme',
    system_settings_desc: 'Configurer les parametres systeme',
    activity_new_user_registered: 'Nouvel utilisateur inscrit',
    activity_business_verified: 'Business verifie',
    activity_booking_created: 'Reservation creee',
    activity_payment_processed: 'Paiement traite',
    activity_time_5_minutes: 'Il y a 5 minutes',
    activity_time_1_hour: 'Il y a 1 heure',
    activity_time_2_hours: 'Il y a 2 heures',
    activity_time_3_hours: 'Il y a 3 heures',
    admin_access: 'Acces admin',
    admin_login: 'Connexion admin',
    secure_access_subtitle: 'Acces securise au panneau de controle',
    email_address: 'Adresse e-mail',
    password: 'Mot de passe',
    forgot_password: 'Mot de passe oublie ?',
    sign_in: 'Se connecter',
    signing_in: 'Connexion...',
    back_to_home: 'Retour a l accueil',
    security_note: 'Zone admin securisee. Tous les acces sont journalises.',
    admin_dashboard: 'Tableau de bord admin',
    welcome_admin_name: 'Bienvenue, {name} ({role})',
    administrator: 'Administrateur',
    tab_businesses: 'Businesses',
    tab_users: 'Utilisateurs',
    tab_analytics: 'Analyses',
    tab_billing: 'Facturation',
    recent_businesses: 'Businesses recents',
    add_business: 'Ajouter un business',
    table_business: 'Business',
    table_owner: 'Proprietaire',
    table_category: 'Categorie',
    table_staff: 'Personnel',
    table_status: 'Statut',
    view: 'Voir',
    view_all_businesses: 'Voir tous les businesses',
    recent_users: 'Utilisateurs recents',
    add_user: 'Ajouter un utilisateur',
    table_name: 'Nom',
    table_email: 'E-mail',
    table_role: 'Role',
    table_registered: 'Inscrit',
    table_bookings: 'Reservations',
    view_all_users: 'Voir tous les utilisateurs',
    system_analytics: 'Analyses systeme',
    analytics_placeholder: 'Les graphiques d analyse apparaitront ici',
    subscription_plans: 'Plans d abonnement',
    free_tier: 'Offre gratuite',
    free_tier_desc: 'Fonctionnalites de reservation de base',
    free_tier_price: '0 $ / mois',
    edit: 'Modifier',
    add_new_plan: 'Ajouter un nouveau plan',
    status_active: 'Actif',
    status_pending: 'En attente',
    category_barber: 'Barbier',
    category_education: 'Education',
    category_gaming: 'Jeux',
    category_fitness: 'Fitness',
    role_client: 'Client',
    role_business: 'Business',
    role_staff: 'Personnel',
    stat_active_users: 'Utilisateurs actifs',
    stat_businesses: 'Businesses',
    stat_total_bookings: 'Reservations totales',
    stat_revenue: 'Revenus',
    change_from_last_month: '+{value}% depuis le mois dernier',
    error_access_denied_admin_required: 'Acces refuse. Privileges administrateur requis.',
    error_login_failed: 'Echec de connexion',
    error_login_unexpected: 'Une erreur est survenue pendant la connexion',
  },
  ar: {
    loading: 'جاري التحميل...',
    logout: 'تسجيل الخروج',
    admin_control_panel: 'لوحة تحكم الادمن',
    management_system_name: 'نظام إدارة كايدني',
    welcome_back_name: 'مرحبا بعودتك، {name}!',
    control_panel_subtitle: 'إليك ما يحدث في منصتك اليوم.',
    quick_actions: 'إجراءات سريعة',
    recent_activity: 'النشاط الاخير',
    recent_activity_desc: 'احدث نشاطات وتحديثات النظام',
    total_users: 'اجمالي المستخدمين',
    total_bookings: 'اجمالي الحجوزات',
    active_businesses: 'الانشطة النشطة',
    pending_reviews: 'المراجعات المعلقة',
    manage_users_title: 'ادارة المستخدمين',
    manage_users_desc: 'عرض وادارة حسابات المستخدمين',
    view_analytics_title: 'عرض التحليلات',
    view_analytics_desc: 'تحليلات وتقارير النظام',
    business_overview_title: 'نظرة عامة على الانشطة',
    business_overview_desc: 'ادارة الانشطة المسجلة',
    system_settings_title: 'اعدادات النظام',
    system_settings_desc: 'تهيئة اعدادات النظام',
    activity_new_user_registered: 'تم تسجيل مستخدم جديد',
    activity_business_verified: 'تم توثيق نشاط',
    activity_booking_created: 'تم انشاء حجز',
    activity_payment_processed: 'تمت معالجة دفعة',
    activity_time_5_minutes: 'منذ 5 دقائق',
    activity_time_1_hour: 'منذ ساعة',
    activity_time_2_hours: 'منذ ساعتين',
    activity_time_3_hours: 'منذ 3 ساعات',
    admin_access: 'وصول الادمن',
    admin_login: 'تسجيل دخول الادمن',
    secure_access_subtitle: 'وصول امن الى لوحة التحكم',
    email_address: 'البريد الالكتروني',
    password: 'كلمة المرور',
    forgot_password: 'هل نسيت كلمة المرور؟',
    sign_in: 'تسجيل الدخول',
    signing_in: 'جاري تسجيل الدخول...',
    back_to_home: 'العودة الى الرئيسية',
    security_note: 'هذه منطقة ادمن محمية. يتم تسجيل كل عمليات الوصول.',
    admin_dashboard: 'لوحة الادمن',
    welcome_admin_name: 'اهلا، {name} ({role})',
    administrator: 'مدير النظام',
    tab_businesses: 'الانشطة',
    tab_users: 'المستخدمون',
    tab_analytics: 'التحليلات',
    tab_billing: 'الفوترة',
    recent_businesses: 'الانشطة الحديثة',
    add_business: 'اضافة نشاط',
    table_business: 'النشاط',
    table_owner: 'المالك',
    table_category: 'الفئة',
    table_staff: 'الموظفون',
    table_status: 'الحالة',
    view: 'عرض',
    view_all_businesses: 'عرض كل الانشطة',
    recent_users: 'المستخدمون الجدد',
    add_user: 'اضافة مستخدم',
    table_name: 'الاسم',
    table_email: 'البريد الالكتروني',
    table_role: 'الدور',
    table_registered: 'تاريخ التسجيل',
    table_bookings: 'الحجوزات',
    view_all_users: 'عرض كل المستخدمين',
    system_analytics: 'تحليلات النظام',
    analytics_placeholder: 'ستظهر مخططات التحليل هنا',
    subscription_plans: 'خطط الاشتراك',
    free_tier: 'الخطة المجانية',
    free_tier_desc: 'وظائف الحجز الاساسية',
    free_tier_price: '0$ / شهر',
    edit: 'تعديل',
    add_new_plan: 'اضافة خطة جديدة',
    status_active: 'نشط',
    status_pending: 'قيد الانتظار',
    category_barber: 'حلاقة',
    category_education: 'تعليم',
    category_gaming: 'العاب',
    category_fitness: 'لياقة',
    role_client: 'عميل',
    role_business: 'نشاط',
    role_staff: 'موظف',
    stat_active_users: 'المستخدمون النشطون',
    stat_businesses: 'الانشطة',
    stat_total_bookings: 'اجمالي الحجوزات',
    stat_revenue: 'الايرادات',
    change_from_last_month: '+{value}% مقارنة بالشهر الماضي',
    error_access_denied_admin_required: 'تم الرفض. صلاحيات الادمن مطلوبة.',
    error_login_failed: 'فشل تسجيل الدخول',
    error_login_unexpected: 'حدث خطا اثناء تسجيل الدخول',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, token: string) => String(params[token] ?? `{${token}}`));
}

export function adminT(
  locale: LocaleCode,
  key: AdminKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = ADMIN_DICTIONARY[locale] ?? ADMIN_DICTIONARY.en;
  const value = dictionary[key] ?? ADMIN_DICTIONARY.en[key];
  return interpolate(value, params);
}

export function adminLocaleTag(locale: LocaleCode): string {
  if (locale === 'fr') {
    return 'fr-FR';
  }

  if (locale === 'ar') {
    return 'ar-TN';
  }

  return 'en-US';
}
