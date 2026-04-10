import type { LocaleCode } from '@global/lib/locales';

export type StaffScheduleKey =
  | 'loading_schedule'
  | 'title'
  | 'subtitle'
  | 'tab_calendar'
  | 'tab_settings'
  | 'bulk_edit'
  | 'exit_bulk_edit'
  | 'today'
  | 'selected_dates_count'
  | 'clear'
  | 'select_all'
  | 'change_status'
  | 'change_times'
  | 'legend_available'
  | 'legend_full'
  | 'legend_closed'
  | 'legend_sick'
  | 'legend_vacation'
  | 'legend_day_off'
  | 'legend_unavailable'
  | 'legend_user_edited'
  | 'default_work_hours_title'
  | 'default_work_hours_desc'
  | 'start_time'
  | 'end_time'
  | 'save_changes'
  | 'cancel'
  | 'edit_work_hours'
  | 'schedule_information'
  | 'schedule_info_bullet_1'
  | 'schedule_info_bullet_2'
  | 'schedule_info_bullet_3'
  | 'schedule_info_bullet_4'
  | 'edit_availability_title'
  | 'edit_availability_desc'
  | 'status'
  | 'status_available'
  | 'status_full'
  | 'status_closed'
  | 'status_sick'
  | 'status_vacation'
  | 'status_day_off'
  | 'status_unavailable'
  | 'status_full_long'
  | 'status_sick_leave'
  | 'change_status_multiple_title'
  | 'change_status_multiple_desc'
  | 'new_status'
  | 'update_selected_status'
  | 'update_all'
  | 'change_times_multiple_title'
  | 'change_times_multiple_desc'
  | 'update_selected_times'
  | 'validation_both_times_required'
  | 'validation_start_before_end'
  | 'error_update_work_hours'
  | 'error_update_availability'
  | 'error_bulk_update_status'
  | 'error_bulk_update_times'
  | 'week_sun'
  | 'week_mon'
  | 'week_tue'
  | 'week_wed'
  | 'week_thu'
  | 'week_fri'
  | 'week_sat';

const STAFF_SCHEDULE_DICTIONARY: Record<LocaleCode, Record<StaffScheduleKey, string>> = {
  en: {
    loading_schedule: 'Loading schedule...',
    title: 'My schedule',
    subtitle: 'Manage your availability and work hours',
    tab_calendar: 'Calendar',
    tab_settings: 'Settings',
    bulk_edit: 'Bulk edit',
    exit_bulk_edit: 'Exit bulk edit',
    today: 'Today',
    selected_dates_count: '{count} date(s) selected',
    clear: 'Clear',
    select_all: 'Select all',
    change_status: 'Change status',
    change_times: 'Change times',
    legend_available: 'Available',
    legend_full: 'Full',
    legend_closed: 'Closed',
    legend_sick: 'Sick',
    legend_vacation: 'Vacation',
    legend_day_off: 'Day off',
    legend_unavailable: 'Unavailable',
    legend_user_edited: 'User edited',
    default_work_hours_title: 'Default work hours',
    default_work_hours_desc: 'Set your default working hours. These will be used to generate your availability schedule.',
    start_time: 'Start time',
    end_time: 'End time',
    save_changes: 'Save changes',
    cancel: 'Cancel',
    edit_work_hours: 'Edit work hours',
    schedule_information: 'Schedule information',
    schedule_info_bullet_1: 'Your availability schedule is automatically generated based on your default work hours',
    schedule_info_bullet_2: 'Click on any future availability slot in the calendar to edit it',
    schedule_info_bullet_3: 'You can change the status (Available, Busy, Unavailable) or adjust the time',
    schedule_info_bullet_4: 'Changes are marked with an edit icon and override the auto-generated schedule',
    edit_availability_title: 'Edit availability',
    edit_availability_desc: 'Update your availability for {date}',
    status: 'Status',
    status_available: 'Available',
    status_full: 'Full',
    status_closed: 'Closed',
    status_sick: 'Sick',
    status_vacation: 'Vacation',
    status_day_off: 'Day off',
    status_unavailable: 'Unavailable',
    status_full_long: 'Full (all booked)',
    status_sick_leave: 'Sick leave',
    change_status_multiple_title: 'Change status for multiple dates',
    change_status_multiple_desc: 'Update status for {count} selected date(s)',
    new_status: 'New status',
    update_selected_status: 'This will update the status for all {count} selected dates.',
    update_all: 'Update all',
    change_times_multiple_title: 'Change times for multiple dates',
    change_times_multiple_desc: 'Update working times for {count} selected date(s)',
    update_selected_times: 'This will update the working times for all {count} selected dates.',
    validation_both_times_required: 'Both start time and end time are required. Please fill in both fields.',
    validation_start_before_end: 'Start time must be before end time.',
    error_update_work_hours: 'Failed to update work hours',
    error_update_availability: 'Failed to update availability',
    error_bulk_update_status: 'Failed to update status for some dates',
    error_bulk_update_times: 'Failed to update times for some dates',
    week_sun: 'Sun',
    week_mon: 'Mon',
    week_tue: 'Tue',
    week_wed: 'Wed',
    week_thu: 'Thu',
    week_fri: 'Fri',
    week_sat: 'Sat',
  },
  fr: {
    loading_schedule: 'Chargement du planning...',
    title: 'Mon planning',
    subtitle: 'Gerez vos disponibilites et vos horaires de travail',
    tab_calendar: 'Calendrier',
    tab_settings: 'Parametres',
    bulk_edit: 'Edition en lot',
    exit_bulk_edit: 'Quitter le mode lot',
    today: 'Aujourd hui',
    selected_dates_count: '{count} date(s) selectionnee(s)',
    clear: 'Effacer',
    select_all: 'Tout selectionner',
    change_status: 'Changer le statut',
    change_times: 'Changer les horaires',
    legend_available: 'Disponible',
    legend_full: 'Complet',
    legend_closed: 'Ferme',
    legend_sick: 'Malade',
    legend_vacation: 'Vacances',
    legend_day_off: 'Jour de repos',
    legend_unavailable: 'Indisponible',
    legend_user_edited: 'Modifie par l utilisateur',
    default_work_hours_title: 'Horaires de travail par defaut',
    default_work_hours_desc: 'Definissez vos horaires de travail par defaut. Ils seront utilises pour generer votre planning de disponibilite.',
    start_time: 'Heure de debut',
    end_time: 'Heure de fin',
    save_changes: 'Enregistrer les modifications',
    cancel: 'Annuler',
    edit_work_hours: 'Modifier les horaires de travail',
    schedule_information: 'Informations du planning',
    schedule_info_bullet_1: 'Votre planning de disponibilite est automatiquement genere selon vos horaires par defaut',
    schedule_info_bullet_2: 'Cliquez sur un creneau futur dans le calendrier pour le modifier',
    schedule_info_bullet_3: 'Vous pouvez changer le statut (Disponible, Complet, Indisponible) ou ajuster l heure',
    schedule_info_bullet_4: 'Les changements sont marques avec une icone d edition et remplacent le planning auto-genere',
    edit_availability_title: 'Modifier la disponibilite',
    edit_availability_desc: 'Mettez a jour votre disponibilite pour le {date}',
    status: 'Statut',
    status_available: 'Disponible',
    status_full: 'Complet',
    status_closed: 'Ferme',
    status_sick: 'Malade',
    status_vacation: 'Vacances',
    status_day_off: 'Jour de repos',
    status_unavailable: 'Indisponible',
    status_full_long: 'Complet (tout reserve)',
    status_sick_leave: 'Conge maladie',
    change_status_multiple_title: 'Changer le statut pour plusieurs dates',
    change_status_multiple_desc: 'Mettre a jour le statut pour {count} date(s) selectionnee(s)',
    new_status: 'Nouveau statut',
    update_selected_status: 'Cela mettra a jour le statut pour les {count} dates selectionnees.',
    update_all: 'Tout mettre a jour',
    change_times_multiple_title: 'Changer les horaires pour plusieurs dates',
    change_times_multiple_desc: 'Mettre a jour les horaires pour {count} date(s) selectionnee(s)',
    update_selected_times: 'Cela mettra a jour les horaires pour les {count} dates selectionnees.',
    validation_both_times_required: 'Les heures de debut et de fin sont obligatoires. Veuillez remplir les deux champs.',
    validation_start_before_end: 'L heure de debut doit etre avant l heure de fin.',
    error_update_work_hours: 'Echec de mise a jour des horaires de travail',
    error_update_availability: 'Echec de mise a jour de la disponibilite',
    error_bulk_update_status: 'Echec de mise a jour du statut pour certaines dates',
    error_bulk_update_times: 'Echec de mise a jour des horaires pour certaines dates',
    week_sun: 'Dim',
    week_mon: 'Lun',
    week_tue: 'Mar',
    week_wed: 'Mer',
    week_thu: 'Jeu',
    week_fri: 'Ven',
    week_sat: 'Sam',
  },
  ar: {
    loading_schedule: 'جار تحميل الجدول...',
    title: 'جدولي',
    subtitle: 'ادارة التوفر وساعات العمل',
    tab_calendar: 'التقويم',
    tab_settings: 'الاعدادات',
    bulk_edit: 'تعديل جماعي',
    exit_bulk_edit: 'انهاء التعديل الجماعي',
    today: 'اليوم',
    selected_dates_count: 'تم تحديد {count} تاريخ',
    clear: 'مسح',
    select_all: 'تحديد الكل',
    change_status: 'تغيير الحالة',
    change_times: 'تغيير الاوقات',
    legend_available: 'متاح',
    legend_full: 'ممتلئ',
    legend_closed: 'مغلق',
    legend_sick: 'مريض',
    legend_vacation: 'اجازة',
    legend_day_off: 'يوم راحة',
    legend_unavailable: 'غير متاح',
    legend_user_edited: 'تم تعديله بواسطة المستخدم',
    default_work_hours_title: 'ساعات العمل الافتراضية',
    default_work_hours_desc: 'حدد ساعات العمل الافتراضية الخاصة بك. سيتم استخدامها لانشاء جدول التوفر.',
    start_time: 'وقت البداية',
    end_time: 'وقت النهاية',
    save_changes: 'حفظ التغييرات',
    cancel: 'الغاء',
    edit_work_hours: 'تعديل ساعات العمل',
    schedule_information: 'معلومات الجدول',
    schedule_info_bullet_1: 'يتم انشاء جدول التوفر تلقائيا بناء على ساعات العمل الافتراضية',
    schedule_info_bullet_2: 'اضغط على اي خانة توفر مستقبلية في التقويم لتعديلها',
    schedule_info_bullet_3: 'يمكنك تغيير الحالة (متاح، ممتلئ، غير متاح) او تعديل الوقت',
    schedule_info_bullet_4: 'يتم تمييز التعديلات بايقونة تعديل وتتجاوز الجدول الذي تم انشاؤه تلقائيا',
    edit_availability_title: 'تعديل التوفر',
    edit_availability_desc: 'قم بتحديث توفرك ليوم {date}',
    status: 'الحالة',
    status_available: 'متاح',
    status_full: 'ممتلئ',
    status_closed: 'مغلق',
    status_sick: 'مريض',
    status_vacation: 'اجازة',
    status_day_off: 'يوم راحة',
    status_unavailable: 'غير متاح',
    status_full_long: 'ممتلئ (محجوز بالكامل)',
    status_sick_leave: 'اجازة مرضية',
    change_status_multiple_title: 'تغيير الحالة لعدة تواريخ',
    change_status_multiple_desc: 'تحديث الحالة لعدد {count} من التواريخ المحددة',
    new_status: 'الحالة الجديدة',
    update_selected_status: 'سيتم تحديث الحالة لكل التواريخ المحددة ({count}).',
    update_all: 'تحديث الكل',
    change_times_multiple_title: 'تغيير الاوقات لعدة تواريخ',
    change_times_multiple_desc: 'تحديث اوقات العمل لعدد {count} من التواريخ المحددة',
    update_selected_times: 'سيتم تحديث اوقات العمل لكل التواريخ المحددة ({count}).',
    validation_both_times_required: 'وقت البداية ووقت النهاية مطلوبان. يرجى تعبئة الحقلين.',
    validation_start_before_end: 'يجب ان يكون وقت البداية قبل وقت النهاية.',
    error_update_work_hours: 'فشل تحديث ساعات العمل',
    error_update_availability: 'فشل تحديث التوفر',
    error_bulk_update_status: 'فشل تحديث الحالة لبعض التواريخ',
    error_bulk_update_times: 'فشل تحديث الاوقات لبعض التواريخ',
    week_sun: 'الاحد',
    week_mon: 'الاثنين',
    week_tue: 'الثلاثاء',
    week_wed: 'الاربعاء',
    week_thu: 'الخميس',
    week_fri: 'الجمعة',
    week_sat: 'السبت',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function staffScheduleT(
  locale: LocaleCode,
  key: StaffScheduleKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = STAFF_SCHEDULE_DICTIONARY[locale] ?? STAFF_SCHEDULE_DICTIONARY.en;
  const value = dictionary[key] ?? STAFF_SCHEDULE_DICTIONARY.en[key];
  return interpolate(value, params);
}

export function staffScheduleLocaleTag(locale: LocaleCode): string {
  if (locale === 'fr') {
    return 'fr-FR';
  }

  if (locale === 'ar') {
    return 'ar-TN';
  }

  return 'en-US';
}
