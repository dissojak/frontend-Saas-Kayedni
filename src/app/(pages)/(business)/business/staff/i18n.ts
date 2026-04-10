import type { LocaleCode } from '@global/lib/locales';

export type BusinessStaffKey =
  | 'loading_staff'
  | 'toast_failed_load_title'
  | 'toast_failed_load_desc'
  | 'toast_work_hours_required_title'
  | 'toast_work_hours_required_desc'
  | 'toast_invalid_hours_title'
  | 'toast_invalid_hours_desc'
  | 'toast_add_success_title'
  | 'toast_add_success_desc'
  | 'toast_add_failed_title'
  | 'toast_add_failed_desc'
  | 'toast_remove_success_title'
  | 'toast_remove_success_desc'
  | 'toast_remove_failed_title'
  | 'toast_remove_failed_desc'
  | 'toast_add_self_success_title'
  | 'toast_add_self_success_desc'
  | 'toast_add_self_failed_title'
  | 'toast_add_self_failed_desc'
  | 'toast_remove_self_success_title'
  | 'toast_remove_self_success_desc'
  | 'toast_remove_self_failed_title'
  | 'toast_remove_self_failed_desc'
  | 'title'
  | 'subtitle'
  | 'staff_count'
  | 'add_staff'
  | 'add_staff_member_title'
  | 'add_staff_member_desc'
  | 'email_address'
  | 'default_working_hours'
  | 'start_time'
  | 'end_time'
  | 'schedule_hint'
  | 'cancel'
  | 'adding'
  | 'self_card_title_active'
  | 'self_card_title_inactive'
  | 'self_card_desc_active'
  | 'self_card_desc_inactive'
  | 'remove_self'
  | 'removing'
  | 'also_work_here'
  | 'search_placeholder'
  | 'empty_search'
  | 'empty_default'
  | 'add_first_staff'
  | 'remove_staff'
  | 'about_title'
  | 'about_1'
  | 'about_2'
  | 'about_3'
  | 'about_4'
  | 'remove_dialog_title'
  | 'remove_dialog_desc'
  | 'remove_dialog_hint'
  | 'go_back'
  | 'yes_remove_staff'
  | 'setup_hours_title'
  | 'setup_hours_desc'
  | 'setting_up'
  | 'become_staff';

const BUSINESS_STAFF_DICTIONARY: Record<LocaleCode, Record<BusinessStaffKey, string>> = {
  en: {
    loading_staff: 'Loading staff members...',
    toast_failed_load_title: 'Failed to load staff',
    toast_failed_load_desc: 'Unable to fetch staff members. Please try again.',
    toast_work_hours_required_title: 'Work hours required',
    toast_work_hours_required_desc: 'Please set both start and end working times for the staff member.',
    toast_invalid_hours_title: 'Invalid work hours',
    toast_invalid_hours_desc: 'Start time must be before end time.',
    toast_add_success_title: 'Staff member added successfully',
    toast_add_success_desc: '{email} has been added to your team with their schedule auto-generated.',
    toast_add_failed_title: 'Failed to add staff member',
    toast_add_failed_desc: 'The user might not exist or is already part of your staff.',
    toast_remove_success_title: 'Staff member removed',
    toast_remove_success_desc: '{name} has been removed from your team.',
    toast_remove_failed_title: 'Failed to remove staff member',
    toast_remove_failed_desc: 'Unable to remove staff member. Please try again.',
    toast_add_self_success_title: "Great! You're now working as staff",
    toast_add_self_success_desc: 'Your availability has been set and services are waiting to be assigned.',
    toast_add_self_failed_title: 'Failed to add yourself as staff',
    toast_add_self_failed_desc: 'Unable to add yourself as staff. Please try again.',
    toast_remove_self_success_title: 'You stopped working as staff',
    toast_remove_self_success_desc: "You're now only managing your business.",
    toast_remove_self_failed_title: 'Failed to remove yourself from staff',
    toast_remove_self_failed_desc: 'Unable to remove yourself from staff. Please try again.',
    title: 'Staff Management',
    subtitle: 'Manage your team members and their access',
    staff_count: '{count} Staff Members',
    add_staff: 'Add Staff',
    add_staff_member_title: 'Add Staff Member',
    add_staff_member_desc: 'Enter the email and set the default working hours. Schedule will be auto-generated.',
    email_address: 'Email Address',
    default_working_hours: 'Default Working Hours',
    start_time: 'Start Time',
    end_time: 'End Time',
    schedule_hint: 'Schedule will be automatically generated for the next month.',
    cancel: 'Cancel',
    adding: 'Adding...',
    self_card_title_active: "You're working as staff",
    self_card_title_inactive: 'Do you also work here?',
    self_card_desc_active:
      'You are registered as a staff member. You can switch between Manager and Staff modes in the navbar.',
    self_card_desc_inactive:
      'Add yourself as a staff member to work alongside your team and manage your own schedule.',
    remove_self: 'Stop working as staff',
    removing: 'Removing...',
    also_work_here: 'I also work here',
    search_placeholder: 'Search staff by name or email...',
    empty_search: 'No staff members found matching your search',
    empty_default: 'No staff members yet',
    add_first_staff: 'Add Your First Staff Member',
    remove_staff: 'Remove Staff',
    about_title: 'About Staff Management',
    about_1: 'Staff members can manage services and bookings for your business',
    about_2: 'They need to be registered on the platform before you can add them',
    about_3: 'Staff members will receive notifications about their assignments',
    about_4: 'You can remove staff members at any time',
    remove_dialog_title: 'Remove Staff Member?',
    remove_dialog_desc: 'Are you sure you want to remove {name} from your team?',
    remove_dialog_hint: 'This action cannot be undone. They will lose access to manage your business.',
    go_back: 'Go Back',
    yes_remove_staff: 'Yes, Remove Staff',
    setup_hours_title: 'Set Your Working Hours',
    setup_hours_desc:
      'When you work as staff, clients can book services with you during these hours. You can change this later.',
    setting_up: 'Setting up...',
    become_staff: 'Become Staff',
  },
  fr: {
    loading_staff: 'Chargement des membres staff...',
    toast_failed_load_title: 'Impossible de charger le staff',
    toast_failed_load_desc: 'Impossible de recuperer les membres staff. Reessayez.',
    toast_work_hours_required_title: 'Horaires requis',
    toast_work_hours_required_desc: 'Veuillez definir l\'heure de debut et de fin.',
    toast_invalid_hours_title: 'Horaires invalides',
    toast_invalid_hours_desc: 'L\'heure de debut doit preceder l\'heure de fin.',
    toast_add_success_title: 'Membre staff ajoute',
    toast_add_success_desc: '{email} a ete ajoute a votre equipe avec planning auto-genere.',
    toast_add_failed_title: 'Echec d\'ajout du staff',
    toast_add_failed_desc: 'L\'utilisateur n\'existe pas ou fait deja partie du staff.',
    toast_remove_success_title: 'Membre staff retire',
    toast_remove_success_desc: '{name} a ete retire de votre equipe.',
    toast_remove_failed_title: 'Echec de suppression du staff',
    toast_remove_failed_desc: 'Impossible de retirer ce membre staff. Reessayez.',
    toast_add_self_success_title: 'Parfait ! Vous etes aussi staff',
    toast_add_self_success_desc: 'Votre disponibilite est definie et les services peuvent vous etre assignes.',
    toast_add_self_failed_title: 'Impossible de vous ajouter comme staff',
    toast_add_self_failed_desc: 'Echec de l\'operation. Reessayez.',
    toast_remove_self_success_title: 'Vous n\'etes plus staff',
    toast_remove_self_success_desc: 'Vous gerez maintenant uniquement votre business.',
    toast_remove_self_failed_title: 'Impossible de vous retirer du staff',
    toast_remove_self_failed_desc: 'Echec de l\'operation. Reessayez.',
    title: 'Gestion du staff',
    subtitle: 'Gerez les membres de votre equipe et leurs acces',
    staff_count: '{count} membres staff',
    add_staff: 'Ajouter staff',
    add_staff_member_title: 'Ajouter un membre staff',
    add_staff_member_desc: 'Entrez l\'e-mail puis definissez les horaires par defaut.',
    email_address: 'Adresse e-mail',
    default_working_hours: 'Horaires par defaut',
    start_time: 'Heure de debut',
    end_time: 'Heure de fin',
    schedule_hint: 'Le planning sera genere automatiquement pour le mois a venir.',
    cancel: 'Annuler',
    adding: 'Ajout...',
    self_card_title_active: 'Vous travaillez aussi comme staff',
    self_card_title_inactive: 'Travaillez-vous aussi ici ?',
    self_card_desc_active:
      'Vous etes enregistre comme staff. Vous pouvez basculer entre modes Manager et Staff dans la navbar.',
    self_card_desc_inactive:
      'Ajoutez-vous comme staff pour travailler avec votre equipe et gerer votre planning personnel.',
    remove_self: 'Arreter de travailler comme staff',
    removing: 'Suppression...',
    also_work_here: 'Je travaille aussi ici',
    search_placeholder: 'Rechercher staff par nom ou e-mail...',
    empty_search: 'Aucun membre staff ne correspond a votre recherche',
    empty_default: 'Aucun membre staff pour le moment',
    add_first_staff: 'Ajouter votre premier membre staff',
    remove_staff: 'Retirer staff',
    about_title: 'A propos de la gestion staff',
    about_1: 'Les membres staff peuvent gerer services et reservations',
    about_2: 'Ils doivent etre inscrits sur la plateforme avant ajout',
    about_3: 'Les membres staff recoivent des notifications d\'affectation',
    about_4: 'Vous pouvez retirer un membre staff a tout moment',
    remove_dialog_title: 'Retirer ce membre staff ?',
    remove_dialog_desc: 'Voulez-vous retirer {name} de votre equipe ?',
    remove_dialog_hint: 'Action irreversible. Cette personne perdra l\'acces a la gestion du business.',
    go_back: 'Retour',
    yes_remove_staff: 'Oui, retirer',
    setup_hours_title: 'Definissez vos horaires',
    setup_hours_desc:
      'Quand vous travaillez comme staff, les clients peuvent reserver avec vous pendant ces horaires.',
    setting_up: 'Configuration...',
    become_staff: 'Devenir staff',
  },
  ar: {
    loading_staff: 'جار تحميل اعضاء الفريق...',
    toast_failed_load_title: 'فشل تحميل الفريق',
    toast_failed_load_desc: 'تعذر جلب اعضاء الفريق. حاول مرة اخرى.',
    toast_work_hours_required_title: 'ساعات العمل مطلوبة',
    toast_work_hours_required_desc: 'يرجى تحديد وقت البداية ووقت النهاية للموظف.',
    toast_invalid_hours_title: 'ساعات عمل غير صالحة',
    toast_invalid_hours_desc: 'يجب ان يكون وقت البداية قبل وقت النهاية.',
    toast_add_success_title: 'تمت اضافة عضو فريق بنجاح',
    toast_add_success_desc: 'تمت اضافة {email} الى فريقك مع توليد الجدول تلقائيا.',
    toast_add_failed_title: 'فشلت اضافة عضو الفريق',
    toast_add_failed_desc: 'قد لا يكون المستخدم موجودا او هو مضاف بالفعل.',
    toast_remove_success_title: 'تمت ازالة عضو الفريق',
    toast_remove_success_desc: 'تمت ازالة {name} من فريقك.',
    toast_remove_failed_title: 'فشلت ازالة عضو الفريق',
    toast_remove_failed_desc: 'تعذر ازالة عضو الفريق. حاول مرة اخرى.',
    toast_add_self_success_title: 'ممتاز! انت تعمل ايضا كموظف',
    toast_add_self_success_desc: 'تم ضبط توفرك ويمكن الان اسناد الخدمات لك.',
    toast_add_self_failed_title: 'فشلت اضافتك كموظف',
    toast_add_self_failed_desc: 'تعذر اتمام العملية. حاول مرة اخرى.',
    toast_remove_self_success_title: 'توقفت عن العمل كموظف',
    toast_remove_self_success_desc: 'اصبحت الان تدير منشأتك فقط.',
    toast_remove_self_failed_title: 'فشلت ازالتك من الموظفين',
    toast_remove_self_failed_desc: 'تعذر اتمام العملية. حاول مرة اخرى.',
    title: 'ادارة الفريق',
    subtitle: 'ادِر اعضاء فريقك وصلاحيات وصولهم',
    staff_count: '{count} اعضاء فريق',
    add_staff: 'اضافة موظف',
    add_staff_member_title: 'اضافة عضو فريق',
    add_staff_member_desc: 'ادخل البريد الالكتروني وحدد ساعات العمل الافتراضية.',
    email_address: 'البريد الالكتروني',
    default_working_hours: 'ساعات العمل الافتراضية',
    start_time: 'وقت البداية',
    end_time: 'وقت النهاية',
    schedule_hint: 'سيتم توليد الجدول تلقائيا للشهر القادم.',
    cancel: 'الغاء',
    adding: 'جار الاضافة...',
    self_card_title_active: 'انت تعمل ايضا كموظف',
    self_card_title_inactive: 'هل تعمل هنا ايضا؟',
    self_card_desc_active:
      'تم تسجيلك كموظف. يمكنك التبديل بين وضعي المدير والموظف من شريط التنقل.',
    self_card_desc_inactive:
      'اضف نفسك كموظف للعمل مع فريقك وادارة جدولك الشخصي.',
    remove_self: 'التوقف عن العمل كموظف',
    removing: 'جار الازالة...',
    also_work_here: 'انا اعمل هنا ايضا',
    search_placeholder: 'ابحث عن الموظفين بالاسم او البريد...',
    empty_search: 'لا يوجد اعضاء فريق مطابقون لبحثك',
    empty_default: 'لا يوجد اعضاء فريق بعد',
    add_first_staff: 'اضف اول عضو فريق',
    remove_staff: 'ازالة الموظف',
    about_title: 'وصف ادارة الفريق',
    about_1: 'يمكن لاعضاء الفريق ادارة الخدمات والحجوزات للمنشأة',
    about_2: 'يجب ان يكونوا مسجلين في المنصة قبل اضافتهم',
    about_3: 'يتلقى اعضاء الفريق اشعارات حول المهام المسندة اليهم',
    about_4: 'يمكنك ازالة اي عضو فريق في اي وقت',
    remove_dialog_title: 'ازالة عضو الفريق؟',
    remove_dialog_desc: 'هل تريد بالتأكيد ازالة {name} من فريقك؟',
    remove_dialog_hint: 'لا يمكن التراجع عن هذا الاجراء. سيفقد الوصول الى ادارة منشأتك.',
    go_back: 'رجوع',
    yes_remove_staff: 'نعم، ازالة الموظف',
    setup_hours_title: 'حدد ساعات عملك',
    setup_hours_desc:
      'عند عملك كموظف، يمكن للعملاء الحجز معك خلال هذه الساعات. يمكنك تعديلها لاحقا.',
    setting_up: 'جار الاعداد...',
    become_staff: 'اصبح موظفا',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function businessStaffT(
  locale: LocaleCode,
  key: BusinessStaffKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = BUSINESS_STAFF_DICTIONARY[locale] ?? BUSINESS_STAFF_DICTIONARY.en;
  const value = dictionary[key] ?? BUSINESS_STAFF_DICTIONARY.en[key];
  return interpolate(value, params);
}
