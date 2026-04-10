import type { LocaleCode } from '@global/lib/locales';

export type ProfileKey =
  | 'profile_default_name'
  | 'profile_subtitle'
  | 'profile_verified_user'
  | 'profile_saving_changes'
  | 'profile_personal_info_title'
  | 'profile_personal_info_desc'
  | 'profile_save'
  | 'profile_full_name'
  | 'profile_name_placeholder'
  | 'profile_email_address'
  | 'profile_read_only'
  | 'profile_phone_number'
  | 'profile_phone_placeholder'
  | 'profile_updating_password'
  | 'profile_security_title'
  | 'profile_security_desc'
  | 'profile_update_password'
  | 'profile_current_password'
  | 'profile_current_password_placeholder'
  | 'profile_new_password'
  | 'profile_new_password_placeholder'
  | 'profile_confirm_password'
  | 'profile_confirm_password_placeholder'
  | 'profile_password_requirements'
  | 'profile_account_details'
  | 'profile_display_name'
  | 'profile_not_set'
  | 'profile_email_label'
  | 'profile_role'
  | 'profile_role_fallback_user'
  | 'profile_protected_account'
  | 'profile_protected_account_desc'
  | 'profile_account_status'
  | 'profile_completion'
  | 'profile_status'
  | 'profile_active'
  | 'profile_toast_update_success_title'
  | 'profile_toast_update_success_desc'
  | 'profile_toast_update_failed_title'
  | 'profile_toast_update_failed_desc'
  | 'profile_toast_password_success_title'
  | 'profile_toast_password_success_desc'
  | 'profile_toast_password_failed_title'
  | 'profile_toast_password_failed_desc'
  | 'profile_toast_photo_success_title'
  | 'profile_toast_photo_success_desc'
  | 'profile_toast_photo_failed_title'
  | 'profile_toast_photo_failed_desc';

const PROFILE_DICTIONARY: Record<LocaleCode, Record<ProfileKey, string>> = {
  en: {
    profile_default_name: 'Your Profile',
    profile_subtitle: 'Manage your account settings and preferences.',
    profile_verified_user: 'Verified User',
    profile_saving_changes: 'Saving changes...',
    profile_personal_info_title: 'Personal Information',
    profile_personal_info_desc: 'Update your personal details',
    profile_save: 'Save',
    profile_full_name: 'Full Name',
    profile_name_placeholder: 'John Doe',
    profile_email_address: 'Email Address',
    profile_read_only: 'Read-only',
    profile_phone_number: 'Phone Number',
    profile_phone_placeholder: '+1 (555) 000-0000',
    profile_updating_password: 'Updating password...',
    profile_security_title: 'Security Settings',
    profile_security_desc: 'Manage your password and security',
    profile_update_password: 'Update Password',
    profile_current_password: 'Current Password',
    profile_current_password_placeholder: 'Enter current password',
    profile_new_password: 'New Password',
    profile_new_password_placeholder: 'Min. 8 characters',
    profile_confirm_password: 'Confirm Password',
    profile_confirm_password_placeholder: 'Re-enter password',
    profile_password_requirements:
      'Password requirements: At least 8 characters, using a mix of letters, numbers & symbols for maximum security.',
    profile_account_details: 'Account Details',
    profile_display_name: 'Display Name',
    profile_not_set: 'Not set',
    profile_email_label: 'Email',
    profile_role: 'Role',
    profile_role_fallback_user: 'User',
    profile_protected_account: 'Protected Account',
    profile_protected_account_desc: 'Critical information changes require admin verification.',
    profile_account_status: 'Account Status',
    profile_completion: 'Completion',
    profile_status: 'Status',
    profile_active: 'Active',
    profile_toast_update_success_title: 'Profile updated successfully!',
    profile_toast_update_success_desc: 'Your changes have been saved securely.',
    profile_toast_update_failed_title: 'Update failed',
    profile_toast_update_failed_desc: 'Failed to update profile.',
    profile_toast_password_success_title: 'Password changed successfully!',
    profile_toast_password_success_desc: 'Your account security has been updated.',
    profile_toast_password_failed_title: 'Password change failed',
    profile_toast_password_failed_desc: 'Failed to change password.',
    profile_toast_photo_success_title: 'Profile photo updated!',
    profile_toast_photo_success_desc: 'Your new profile picture has been saved successfully.',
    profile_toast_photo_failed_title: 'Upload failed',
    profile_toast_photo_failed_desc: 'Failed to upload image.',
  },
  fr: {
    profile_default_name: 'Votre profil',
    profile_subtitle: 'Gerez les parametres et preferences de votre compte.',
    profile_verified_user: 'Utilisateur verifie',
    profile_saving_changes: 'Enregistrement...',
    profile_personal_info_title: 'Informations personnelles',
    profile_personal_info_desc: 'Mettez a jour vos informations personnelles',
    profile_save: 'Enregistrer',
    profile_full_name: 'Nom complet',
    profile_name_placeholder: 'Jean Dupont',
    profile_email_address: 'Adresse e-mail',
    profile_read_only: 'Lecture seule',
    profile_phone_number: 'Telephone',
    profile_phone_placeholder: '+216 00 000 000',
    profile_updating_password: 'Mise a jour du mot de passe...',
    profile_security_title: 'Parametres de securite',
    profile_security_desc: 'Gerez votre mot de passe et la securite du compte',
    profile_update_password: 'Mettre a jour le mot de passe',
    profile_current_password: 'Mot de passe actuel',
    profile_current_password_placeholder: 'Entrez votre mot de passe actuel',
    profile_new_password: 'Nouveau mot de passe',
    profile_new_password_placeholder: 'Min. 8 caracteres',
    profile_confirm_password: 'Confirmer le mot de passe',
    profile_confirm_password_placeholder: 'Saisissez a nouveau le mot de passe',
    profile_password_requirements:
      'Exigences : au moins 8 caracteres avec un melange de lettres, chiffres et symboles.',
    profile_account_details: 'Details du compte',
    profile_display_name: 'Nom affiche',
    profile_not_set: 'Non renseigne',
    profile_email_label: 'E-mail',
    profile_role: 'Role',
    profile_role_fallback_user: 'Utilisateur',
    profile_protected_account: 'Compte protege',
    profile_protected_account_desc: 'Les changements critiques necessitent une verification admin.',
    profile_account_status: 'Statut du compte',
    profile_completion: 'Completion',
    profile_status: 'Statut',
    profile_active: 'Actif',
    profile_toast_update_success_title: 'Profil mis a jour !',
    profile_toast_update_success_desc: 'Vos changements ont ete enregistres.',
    profile_toast_update_failed_title: 'Mise a jour echouee',
    profile_toast_update_failed_desc: 'Impossible de mettre a jour le profil.',
    profile_toast_password_success_title: 'Mot de passe mis a jour !',
    profile_toast_password_success_desc: 'La securite de votre compte a ete renforcee.',
    profile_toast_password_failed_title: 'Echec de mise a jour du mot de passe',
    profile_toast_password_failed_desc: 'Impossible de changer le mot de passe.',
    profile_toast_photo_success_title: 'Photo de profil mise a jour !',
    profile_toast_photo_success_desc: 'Votre nouvelle photo a bien ete enregistree.',
    profile_toast_photo_failed_title: 'Echec du televersement',
    profile_toast_photo_failed_desc: 'Impossible de televerser l\'image.',
  },
  ar: {
    profile_default_name: 'ملفك الشخصي',
    profile_subtitle: 'ادِر اعدادات حسابك وتفضيلاتك.',
    profile_verified_user: 'مستخدم موثّق',
    profile_saving_changes: 'جار حفظ التغييرات...',
    profile_personal_info_title: 'البيانات الشخصية',
    profile_personal_info_desc: 'حدّث بياناتك الشخصية',
    profile_save: 'حفظ',
    profile_full_name: 'الاسم الكامل',
    profile_name_placeholder: 'محمد علي',
    profile_email_address: 'البريد الالكتروني',
    profile_read_only: 'للقراءة فقط',
    profile_phone_number: 'رقم الهاتف',
    profile_phone_placeholder: '+216 00 000 000',
    profile_updating_password: 'جار تحديث كلمة المرور...',
    profile_security_title: 'اعدادات الامان',
    profile_security_desc: 'ادِر كلمة المرور وامان الحساب',
    profile_update_password: 'تحديث كلمة المرور',
    profile_current_password: 'كلمة المرور الحالية',
    profile_current_password_placeholder: 'ادخل كلمة المرور الحالية',
    profile_new_password: 'كلمة المرور الجديدة',
    profile_new_password_placeholder: '8 احرف على الاقل',
    profile_confirm_password: 'تأكيد كلمة المرور',
    profile_confirm_password_placeholder: 'اعد ادخال كلمة المرور',
    profile_password_requirements:
      'متطلبات كلمة المرور: 8 احرف على الاقل مع مزيج من الحروف والارقام والرموز.',
    profile_account_details: 'تفاصيل الحساب',
    profile_display_name: 'الاسم الظاهر',
    profile_not_set: 'غير محدد',
    profile_email_label: 'البريد الالكتروني',
    profile_role: 'الدور',
    profile_role_fallback_user: 'مستخدم',
    profile_protected_account: 'حساب محمي',
    profile_protected_account_desc: 'تغيير البيانات الحساسة يتطلب تحققا من الادمن.',
    profile_account_status: 'حالة الحساب',
    profile_completion: 'الاكتمال',
    profile_status: 'الحالة',
    profile_active: 'نشط',
    profile_toast_update_success_title: 'تم تحديث الملف الشخصي!',
    profile_toast_update_success_desc: 'تم حفظ التغييرات بنجاح.',
    profile_toast_update_failed_title: 'فشل التحديث',
    profile_toast_update_failed_desc: 'تعذر تحديث الملف الشخصي.',
    profile_toast_password_success_title: 'تم تحديث كلمة المرور!',
    profile_toast_password_success_desc: 'تم تعزيز امان حسابك.',
    profile_toast_password_failed_title: 'فشل تحديث كلمة المرور',
    profile_toast_password_failed_desc: 'تعذر تغيير كلمة المرور.',
    profile_toast_photo_success_title: 'تم تحديث صورة الملف!',
    profile_toast_photo_success_desc: 'تم حفظ الصورة الجديدة بنجاح.',
    profile_toast_photo_failed_title: 'فشل الرفع',
    profile_toast_photo_failed_desc: 'تعذر رفع الصورة.',
  },
};

export function profileT(locale: LocaleCode, key: ProfileKey): string {
  const dictionary = PROFILE_DICTIONARY[locale] ?? PROFILE_DICTIONARY.en;
  return dictionary[key] ?? PROFILE_DICTIONARY.en[key];
}
