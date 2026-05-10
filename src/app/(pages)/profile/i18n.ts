import type { LocaleCode } from "@global/lib/locales";

export type ProfileKey =
  | "profile_default_name"
  | "profile_subtitle"
  | "profile_verified_user"
  | "profile_saving_changes"
  | "profile_personal_info_title"
  | "profile_personal_info_desc"
  | "profile_save"
  | "profile_full_name"
  | "profile_name_placeholder"
  | "profile_email_address"
  | "profile_read_only"
  | "profile_phone_number"
  | "profile_phone_placeholder"
  | "profile_updating_password"
  | "profile_security_title"
  | "profile_security_desc"
  | "profile_update_password"
  | "profile_current_password"
  | "profile_current_password_placeholder"
  | "profile_new_password"
  | "profile_new_password_placeholder"
  | "profile_confirm_password"
  | "profile_confirm_password_placeholder"
  | "profile_password_requirements"
  | "profile_account_details"
  | "profile_display_name"
  | "profile_not_set"
  | "profile_email_label"
  | "profile_role"
  | "profile_role_fallback_user"
  | "profile_protected_account"
  | "profile_protected_account_desc"
  | "profile_account_status"
  | "profile_completion"
  | "profile_status"
  | "profile_active"
  | "profile_2fa_title"
  | "profile_2fa_desc"
  | "profile_2fa_disable"
  | "profile_2fa_disabling"
  | "profile_2fa_setup"
  | "profile_2fa_preparing"
  | "profile_2fa_code_label"
  | "profile_2fa_status_label"
  | "profile_2fa_status_enabled"
  | "profile_2fa_status_disabled"
  | "profile_2fa_method_label"
  | "profile_2fa_method_app"
  | "profile_2fa_method_email"
  | "profile_2fa_method_sms"
  | "profile_2fa_method_backup"
  | "profile_2fa_send_code"
  | "profile_2fa_sending_code"
  | "profile_2fa_qr_help"
  | "profile_2fa_manual_key_label"
  | "profile_2fa_enable"
  | "profile_2fa_enabling"
  | "profile_2fa_active_note"
  | "profile_2fa_regenerate_backup"
  | "profile_2fa_regenerating_backup"
  | "profile_2fa_download_backup"
  | "profile_2fa_backup_note"
  | "profile_2fa_protected_badge"
  | "profile_2fa_not_enabled_badge"
  | "profile_2fa_method_telegram"
  | "profile_2fa_method_app_desc"
  | "profile_2fa_method_email_desc"
  | "profile_2fa_method_telegram_desc"
  | "profile_2fa_method_backup_desc"
  | "profile_2fa_add"
  | "profile_2fa_remove"
  | "profile_2fa_removing"
  | "profile_2fa_cancel"
  | "profile_2fa_confirm_remove_desc"
  | "profile_2fa_remove_send_code_first"
  | "profile_2fa_remove_code_sent_notice"
  | "profile_2fa_backup_flow_title"
  | "profile_2fa_backup_flow_desc"
  | "profile_2fa_backup_send_email"
  | "profile_2fa_backup_sending_email"
  | "profile_2fa_backup_code_sent_notice"
  | "profile_2fa_backup_generate_btn"
  | "profile_2fa_backup_generating"
  | "profile_2fa_backup_close"
  | "profile_toast_update_success_title"
  | "profile_toast_update_success_desc"
  | "profile_toast_update_failed_title"
  | "profile_toast_update_failed_desc"
  | "profile_toast_password_success_title"
  | "profile_toast_password_success_desc"
  | "profile_toast_password_failed_title"
  | "profile_toast_password_failed_desc"
  | "profile_toast_photo_success_title"
  | "profile_toast_photo_success_desc"
  | "profile_toast_photo_failed_title"
  | "profile_toast_photo_failed_desc"
  | "profile_toast_2fa_setup_ready_title"
  | "profile_toast_2fa_setup_ready_desc"
  | "profile_toast_2fa_setup_failed_title"
  | "profile_toast_2fa_setup_failed_desc"
  | "profile_toast_2fa_enabled_title"
  | "profile_toast_2fa_enabled_desc"
  | "profile_toast_2fa_enable_failed_title"
  | "profile_toast_2fa_enable_failed_desc"
  | "profile_toast_2fa_disabled_title"
  | "profile_toast_2fa_disabled_desc"
  | "profile_toast_2fa_disable_failed_title"
  | "profile_toast_2fa_disable_failed_desc"
  | "profile_toast_2fa_code_sent_title"
  | "profile_toast_2fa_code_sent_desc"
  | "profile_toast_2fa_code_send_failed_title"
  | "profile_toast_2fa_code_send_failed_desc"
  | "profile_toast_backup_codes_title"
  | "profile_toast_backup_codes_desc"
  | "profile_toast_backup_codes_failed_title"
  | "profile_toast_backup_codes_failed_desc";

const PROFILE_DICTIONARY: Record<LocaleCode, Record<ProfileKey, string>> = {
  en: {
    profile_default_name: "Your Profile",
    profile_subtitle: "Manage your account settings and preferences.",
    profile_verified_user: "Verified User",
    profile_saving_changes: "Saving changes...",
    profile_personal_info_title: "Personal Information",
    profile_personal_info_desc: "Update your personal details",
    profile_save: "Save",
    profile_full_name: "Full Name",
    profile_name_placeholder: "John Doe",
    profile_email_address: "Email Address",
    profile_read_only: "Read-only",
    profile_phone_number: "Phone Number",
    profile_phone_placeholder: "+1 (555) 000-0000",
    profile_updating_password: "Updating password...",
    profile_security_title: "Security Settings",
    profile_security_desc: "Manage your password and security",
    profile_update_password: "Update Password",
    profile_current_password: "Current Password",
    profile_current_password_placeholder: "Enter current password",
    profile_new_password: "New Password",
    profile_new_password_placeholder: "Min. 8 characters",
    profile_confirm_password: "Confirm Password",
    profile_confirm_password_placeholder: "Re-enter password",
    profile_password_requirements:
      "Password requirements: At least 8 characters, using a mix of letters, numbers & symbols for maximum security.",
    profile_account_details: "Account Details",
    profile_display_name: "Display Name",
    profile_not_set: "Not set",
    profile_email_label: "Email",
    profile_role: "Role",
    profile_role_fallback_user: "User",
    profile_protected_account: "Protected Account",
    profile_protected_account_desc: "Critical information changes require admin verification.",
    profile_account_status: "Account Status",
    profile_completion: "Completion",
    profile_status: "Status",
    profile_active: "Active",
    profile_2fa_title: "Two-factor authentication",
    profile_2fa_desc: "Enable one or more methods: app, email, Telegram SMS, and backup codes.",
    profile_2fa_disable: "Disable 2FA",
    profile_2fa_disabling: "Disabling...",
    profile_2fa_setup: "Set up 2FA",
    profile_2fa_preparing: "Preparing...",
    profile_2fa_code_label: "Verification code",
    profile_2fa_status_label: "Status",
    profile_2fa_status_enabled: "Enabled on this account",
    profile_2fa_status_disabled: "Currently disabled",
    profile_2fa_method_label: "Method",
    profile_2fa_method_app: "Authenticator app",
    profile_2fa_method_email: "Email code",
    profile_2fa_method_sms: "SMS code",
    profile_2fa_method_backup: "Backup code",
    profile_2fa_send_code: "Send code",
    profile_2fa_sending_code: "Sending...",
    profile_2fa_qr_help:
      "Scan this QR code in Google Authenticator, Authy, or another TOTP app, then enter the code.",
    profile_2fa_manual_key_label: "Manual entry key",
    profile_2fa_enable: "Enable method",
    profile_2fa_enabling: "Enabling...",
    profile_2fa_active_note:
      "Two-factor authentication is active. Use a current code to disable it or regenerate backup codes.",
    profile_2fa_regenerate_backup: "Regenerate backup codes",
    profile_2fa_regenerating_backup: "Regenerating...",
    profile_2fa_download_backup: "Download backup codes (.txt)",
    profile_2fa_backup_note:
      "Store backup codes in a safe place. Each code can be used one time only.",
    profile_2fa_protected_badge: "Protected",
    profile_2fa_not_enabled_badge: "Not enabled",
    profile_2fa_method_telegram: "Telegram",
    profile_2fa_method_app_desc: "Use Google Authenticator, Authy, or any TOTP app",
    profile_2fa_method_email_desc: "A code is sent to your email address each time you log in",
    profile_2fa_method_telegram_desc: "Receive one-time codes directly via Telegram bot",
    profile_2fa_method_backup_desc: "Emergency one-time codes stored offline for account recovery",
    profile_2fa_add: "Set up",
    profile_2fa_remove: "Remove",
    profile_2fa_removing: "Removing...",
    profile_2fa_cancel: "Cancel",
    profile_2fa_confirm_remove_desc:
      "Enter a valid verification code from this method to remove it.",
    profile_2fa_remove_send_code_first: "Send a verification code to your email or Telegram first.",
    profile_2fa_remove_code_sent_notice:
      "A verification code was sent. Enter it below to confirm removal.",
    profile_2fa_backup_flow_title: "Generate new backup codes",
    profile_2fa_backup_flow_desc:
      "For security, confirm your identity via email before generating new codes.",
    profile_2fa_backup_send_email: "Send email verification code",
    profile_2fa_backup_sending_email: "Sending code…",
    profile_2fa_backup_code_sent_notice: "Code sent to your email. Enter it below.",
    profile_2fa_backup_generate_btn: "Generate new codes",
    profile_2fa_backup_generating: "Generating…",
    profile_2fa_backup_close: "Close",
    profile_toast_update_success_title: "Profile updated successfully!",
    profile_toast_update_success_desc: "Your changes have been saved securely.",
    profile_toast_update_failed_title: "Update failed",
    profile_toast_update_failed_desc: "Failed to update profile.",
    profile_toast_password_success_title: "Password changed successfully!",
    profile_toast_password_success_desc: "Your account security has been updated.",
    profile_toast_password_failed_title: "Password change failed",
    profile_toast_password_failed_desc: "Failed to change password.",
    profile_toast_photo_success_title: "Profile photo updated!",
    profile_toast_photo_success_desc: "Your new profile picture has been saved successfully.",
    profile_toast_photo_failed_title: "Upload failed",
    profile_toast_photo_failed_desc: "Failed to upload image.",
    profile_toast_2fa_setup_ready_title: "2FA setup is ready",
    profile_toast_2fa_setup_ready_desc: "Scan the QR code or pick another method.",
    profile_toast_2fa_setup_failed_title: "Unable to prepare 2FA",
    profile_toast_2fa_setup_failed_desc: "Please try again.",
    profile_toast_2fa_enabled_title: "2FA enabled",
    profile_toast_2fa_enabled_desc: "Your selected method is now active.",
    profile_toast_2fa_enable_failed_title: "Enable 2FA failed",
    profile_toast_2fa_enable_failed_desc: "Enter a valid code and try again.",
    profile_toast_2fa_disabled_title: "2FA disabled",
    profile_toast_2fa_disabled_desc: "Your account now uses password-only login.",
    profile_toast_2fa_disable_failed_title: "Disable 2FA failed",
    profile_toast_2fa_disable_failed_desc: "Enter a valid code and try again.",
    profile_toast_2fa_code_sent_title: "Code sent",
    profile_toast_2fa_code_sent_desc: "A verification code was sent successfully.",
    profile_toast_2fa_code_send_failed_title: "Failed to send code",
    profile_toast_2fa_code_send_failed_desc: "Unable to send verification code.",
    profile_toast_backup_codes_title: "Backup codes regenerated",
    profile_toast_backup_codes_desc: "Download and store them securely.",
    profile_toast_backup_codes_failed_title: "Backup codes failed",
    profile_toast_backup_codes_failed_desc: "Unable to regenerate backup codes.",
  },
  fr: {
    profile_default_name: "Votre profil",
    profile_subtitle: "Gerez les parametres et preferences de votre compte.",
    profile_verified_user: "Utilisateur verifie",
    profile_saving_changes: "Enregistrement...",
    profile_personal_info_title: "Informations personnelles",
    profile_personal_info_desc: "Mettez a jour vos informations personnelles",
    profile_save: "Enregistrer",
    profile_full_name: "Nom complet",
    profile_name_placeholder: "Jean Dupont",
    profile_email_address: "Adresse e-mail",
    profile_read_only: "Lecture seule",
    profile_phone_number: "Telephone",
    profile_phone_placeholder: "+216 00 000 000",
    profile_updating_password: "Mise a jour du mot de passe...",
    profile_security_title: "Parametres de securite",
    profile_security_desc: "Gerez votre mot de passe et la securite du compte",
    profile_update_password: "Mettre a jour le mot de passe",
    profile_current_password: "Mot de passe actuel",
    profile_current_password_placeholder: "Entrez votre mot de passe actuel",
    profile_new_password: "Nouveau mot de passe",
    profile_new_password_placeholder: "Min. 8 caracteres",
    profile_confirm_password: "Confirmer le mot de passe",
    profile_confirm_password_placeholder: "Saisissez a nouveau le mot de passe",
    profile_password_requirements:
      "Exigences : au moins 8 caracteres avec un melange de lettres, chiffres et symboles.",
    profile_account_details: "Details du compte",
    profile_display_name: "Nom affiche",
    profile_not_set: "Non renseigne",
    profile_email_label: "E-mail",
    profile_role: "Role",
    profile_role_fallback_user: "Utilisateur",
    profile_protected_account: "Compte protege",
    profile_protected_account_desc: "Les changements critiques necessitent une verification admin.",
    profile_account_status: "Statut du compte",
    profile_completion: "Completion",
    profile_status: "Statut",
    profile_active: "Actif",
    profile_2fa_title: "Authentification a deux facteurs",
    profile_2fa_desc:
      "Activez une ou plusieurs methodes : application, e-mail, Telegram SMS et codes de secours.",
    profile_2fa_disable: "Desactiver 2FA",
    profile_2fa_disabling: "Desactivation...",
    profile_2fa_setup: "Configurer 2FA",
    profile_2fa_preparing: "Preparation...",
    profile_2fa_code_label: "Code de verification",
    profile_2fa_status_label: "Statut",
    profile_2fa_status_enabled: "Active sur ce compte",
    profile_2fa_status_disabled: "Actuellement desactivee",
    profile_2fa_method_label: "Methode",
    profile_2fa_method_app: "Application d'authentification",
    profile_2fa_method_email: "Code par e-mail",
    profile_2fa_method_sms: "Code par SMS",
    profile_2fa_method_backup: "Code de secours",
    profile_2fa_send_code: "Envoyer le code",
    profile_2fa_sending_code: "Envoi...",
    profile_2fa_qr_help:
      "Scannez ce QR code dans Google Authenticator, Authy ou une autre application TOTP, puis saisissez le code.",
    profile_2fa_manual_key_label: "Cle manuelle",
    profile_2fa_enable: "Activer la methode",
    profile_2fa_enabling: "Activation...",
    profile_2fa_active_note:
      "La double authentification est active. Utilisez un code valide pour la desactiver ou regenerer les codes de secours.",
    profile_2fa_regenerate_backup: "Regenerer les codes de secours",
    profile_2fa_regenerating_backup: "Regeneration...",
    profile_2fa_download_backup: "Telecharger les codes de secours (.txt)",
    profile_2fa_backup_note:
      "Conservez les codes de secours dans un endroit sur. Chaque code est utilisable une seule fois.",
    profile_2fa_protected_badge: "Protégé",
    profile_2fa_not_enabled_badge: "Non activé",
    profile_2fa_method_telegram: "Telegram",
    profile_2fa_method_app_desc: "Utilisez Google Authenticator, Authy ou une autre app TOTP",
    profile_2fa_method_email_desc: "Un code est envoyé à votre adresse e-mail à chaque connexion",
    profile_2fa_method_telegram_desc:
      "Recevez des codes à usage unique directement via le bot Telegram",
    profile_2fa_method_backup_desc:
      "Codes de secours à usage unique pour la récupération du compte",
    profile_2fa_add: "Configurer",
    profile_2fa_remove: "Supprimer",
    profile_2fa_removing: "Suppression...",
    profile_2fa_cancel: "Annuler",
    profile_2fa_confirm_remove_desc: "Saisissez un code valide pour supprimer cette méthode.",
    profile_2fa_remove_send_code_first:
      "Envoyez d'abord un code de vérification par e-mail ou Telegram.",
    profile_2fa_remove_code_sent_notice:
      "Un code de vérification a été envoyé. Saisissez-le pour confirmer la suppression.",
    profile_2fa_backup_flow_title: "Générer de nouveaux codes de secours",
    profile_2fa_backup_flow_desc:
      "Pour la sécurité, confirmez votre identité par e-mail avant de générer de nouveaux codes.",
    profile_2fa_backup_send_email: "Envoyer le code de vérification par e-mail",
    profile_2fa_backup_sending_email: "Envoi du code…",
    profile_2fa_backup_code_sent_notice: "Code envoyé à votre e-mail. Saisissez-le ci-dessous.",
    profile_2fa_backup_generate_btn: "Générer de nouveaux codes",
    profile_2fa_backup_generating: "Génération…",
    profile_2fa_backup_close: "Fermer",
    profile_toast_update_success_title: "Profil mis a jour !",
    profile_toast_update_success_desc: "Vos changements ont ete enregistres.",
    profile_toast_update_failed_title: "Mise a jour echouee",
    profile_toast_update_failed_desc: "Impossible de mettre a jour le profil.",
    profile_toast_password_success_title: "Mot de passe mis a jour !",
    profile_toast_password_success_desc: "La securite de votre compte a ete renforcee.",
    profile_toast_password_failed_title: "Echec de mise a jour du mot de passe",
    profile_toast_password_failed_desc: "Impossible de changer le mot de passe.",
    profile_toast_photo_success_title: "Photo de profil mise a jour !",
    profile_toast_photo_success_desc: "Votre nouvelle photo a bien ete enregistree.",
    profile_toast_photo_failed_title: "Echec du televersement",
    profile_toast_photo_failed_desc: "Impossible de televerser l'image.",
    profile_toast_2fa_setup_ready_title: "Configuration 2FA prete",
    profile_toast_2fa_setup_ready_desc: "Scannez le QR code ou choisissez une autre methode.",
    profile_toast_2fa_setup_failed_title: "Impossible de preparer 2FA",
    profile_toast_2fa_setup_failed_desc: "Veuillez reessayer.",
    profile_toast_2fa_enabled_title: "2FA activee",
    profile_toast_2fa_enabled_desc: "La methode selectionnee est maintenant active.",
    profile_toast_2fa_enable_failed_title: "Activation 2FA echouee",
    profile_toast_2fa_enable_failed_desc: "Saisissez un code valide et reessayez.",
    profile_toast_2fa_disabled_title: "2FA desactivee",
    profile_toast_2fa_disabled_desc: "Votre compte utilise maintenant uniquement le mot de passe.",
    profile_toast_2fa_disable_failed_title: "Desactivation 2FA echouee",
    profile_toast_2fa_disable_failed_desc: "Saisissez un code valide et reessayez.",
    profile_toast_2fa_code_sent_title: "Code envoye",
    profile_toast_2fa_code_sent_desc: "Un code de verification a ete envoye avec succes.",
    profile_toast_2fa_code_send_failed_title: "Envoi du code echoue",
    profile_toast_2fa_code_send_failed_desc: "Impossible d'envoyer le code de verification.",
    profile_toast_backup_codes_title: "Codes de secours regeneres",
    profile_toast_backup_codes_desc: "Telechargez-les et conservez-les en securite.",
    profile_toast_backup_codes_failed_title: "Echec des codes de secours",
    profile_toast_backup_codes_failed_desc: "Impossible de regenerer les codes de secours.",
  },
  ar: {
    profile_default_name: "ملفك الشخصي",
    profile_subtitle: "ادِر اعدادات حسابك وتفضيلاتك.",
    profile_verified_user: "مستخدم موثّق",
    profile_saving_changes: "جار حفظ التغييرات...",
    profile_personal_info_title: "البيانات الشخصية",
    profile_personal_info_desc: "حدّث بياناتك الشخصية",
    profile_save: "حفظ",
    profile_full_name: "الاسم الكامل",
    profile_name_placeholder: "محمد علي",
    profile_email_address: "البريد الالكتروني",
    profile_read_only: "للقراءة فقط",
    profile_phone_number: "رقم الهاتف",
    profile_phone_placeholder: "+216 00 000 000",
    profile_updating_password: "جار تحديث كلمة المرور...",
    profile_security_title: "اعدادات الامان",
    profile_security_desc: "ادِر كلمة المرور وامان الحساب",
    profile_update_password: "تحديث كلمة المرور",
    profile_current_password: "كلمة المرور الحالية",
    profile_current_password_placeholder: "ادخل كلمة المرور الحالية",
    profile_new_password: "كلمة المرور الجديدة",
    profile_new_password_placeholder: "8 احرف على الاقل",
    profile_confirm_password: "تأكيد كلمة المرور",
    profile_confirm_password_placeholder: "اعد ادخال كلمة المرور",
    profile_password_requirements:
      "متطلبات كلمة المرور: 8 احرف على الاقل مع مزيج من الحروف والارقام والرموز.",
    profile_account_details: "تفاصيل الحساب",
    profile_display_name: "الاسم الظاهر",
    profile_not_set: "غير محدد",
    profile_email_label: "البريد الالكتروني",
    profile_role: "الدور",
    profile_role_fallback_user: "مستخدم",
    profile_protected_account: "حساب محمي",
    profile_protected_account_desc: "تغيير البيانات الحساسة يتطلب تحققا من الادمن.",
    profile_account_status: "حالة الحساب",
    profile_completion: "الاكتمال",
    profile_status: "الحالة",
    profile_active: "نشط",
    profile_2fa_title: "المصادقة الثنائية",
    profile_2fa_desc:
      "فعّل طريقة واحدة أو اكثر: تطبيق المصادقة، البريد، الرسائل القصيرة، والرموز الاحتياطية.",
    profile_2fa_disable: "تعطيل المصادقة الثنائية",
    profile_2fa_disabling: "جار التعطيل...",
    profile_2fa_setup: "اعداد المصادقة الثنائية",
    profile_2fa_preparing: "جار التحضير...",
    profile_2fa_code_label: "رمز التحقق",
    profile_2fa_status_label: "الحالة",
    profile_2fa_status_enabled: "مفعلة على هذا الحساب",
    profile_2fa_status_disabled: "غير مفعلة حاليا",
    profile_2fa_method_label: "الطريقة",
    profile_2fa_method_app: "تطبيق المصادقة",
    profile_2fa_method_email: "رمز البريد الالكتروني",
    profile_2fa_method_sms: "رمز الرسائل القصيرة",
    profile_2fa_method_backup: "رمز احتياطي",
    profile_2fa_send_code: "ارسال الرمز",
    profile_2fa_sending_code: "جار الارسال...",
    profile_2fa_qr_help:
      "امسح رمز QR في Google Authenticator او Authy او أي تطبيق TOTP، ثم ادخل الرمز.",
    profile_2fa_manual_key_label: "مفتاح الادخال اليدوي",
    profile_2fa_enable: "تفعيل الطريقة",
    profile_2fa_enabling: "جار التفعيل...",
    profile_2fa_active_note:
      "المصادقة الثنائية مفعلة. استخدم رمزا صالحا للتعطيل او لاعادة توليد الرموز الاحتياطية.",
    profile_2fa_regenerate_backup: "اعادة توليد الرموز الاحتياطية",
    profile_2fa_regenerating_backup: "جار اعادة التوليد...",
    profile_2fa_download_backup: "تحميل الرموز الاحتياطية (.txt)",
    profile_2fa_backup_note: "احفظ الرموز الاحتياطية في مكان آمن. كل رمز يُستخدم مرة واحدة فقط.",
    profile_2fa_protected_badge: "محمي",
    profile_2fa_not_enabled_badge: "غير مفعّل",
    profile_2fa_method_telegram: "تيليغرام",
    profile_2fa_method_app_desc: "استخدم Google Authenticator أو Authy أو أي تطبيق TOTP",
    profile_2fa_method_email_desc: "يتم إرسال رمز إلى بريدك الإلكتروني في كل تسجيل دخول",
    profile_2fa_method_telegram_desc: "استقبل رموزاً لمرة واحدة مباشرة عبر بوت تيليغرام",
    profile_2fa_method_backup_desc: "رموز طوارئ احتياطية لاستعادة الحساب",
    profile_2fa_add: "إعداد",
    profile_2fa_remove: "إزالة",
    profile_2fa_removing: "جارٍ الإزالة...",
    profile_2fa_cancel: "إلغاء",
    profile_2fa_confirm_remove_desc: "أدخل رمزاً صالحاً من هذه الطريقة لإزالتها.",
    profile_2fa_remove_send_code_first: "أرسل رمز التحقق أولاً عبر البريد الإلكتروني أو تيليغرام.",
    profile_2fa_remove_code_sent_notice: "تم إرسال رمز التحقق. أدخله أدناه لتأكيد الإزالة.",
    profile_2fa_backup_flow_title: "إنشاء رموز احتياطية جديدة",
    profile_2fa_backup_flow_desc: "للأمان، أكد هويتك عبر البريد الإلكتروني قبل إنشاء رموز جديدة.",
    profile_2fa_backup_send_email: "إرسال رمز التحقق بالبريد الإلكتروني",
    profile_2fa_backup_sending_email: "جارٍ الإرسال…",
    profile_2fa_backup_code_sent_notice: "تم إرسال الرمز إلى بريدك الإلكتروني. أدخله أدناه.",
    profile_2fa_backup_generate_btn: "إنشاء رموز جديدة",
    profile_2fa_backup_generating: "جارٍ الإنشاء…",
    profile_2fa_backup_close: "إغلاق",
    profile_toast_update_success_title: "تم تحديث الملف الشخصي!",
    profile_toast_update_success_desc: "تم حفظ التغييرات بنجاح.",
    profile_toast_update_failed_title: "فشل التحديث",
    profile_toast_update_failed_desc: "تعذر تحديث الملف الشخصي.",
    profile_toast_password_success_title: "تم تحديث كلمة المرور!",
    profile_toast_password_success_desc: "تم تعزيز امان حسابك.",
    profile_toast_password_failed_title: "فشل تحديث كلمة المرور",
    profile_toast_password_failed_desc: "تعذر تغيير كلمة المرور.",
    profile_toast_photo_success_title: "تم تحديث صورة الملف!",
    profile_toast_photo_success_desc: "تم حفظ الصورة الجديدة بنجاح.",
    profile_toast_photo_failed_title: "فشل الرفع",
    profile_toast_photo_failed_desc: "تعذر رفع الصورة.",
    profile_toast_2fa_setup_ready_title: "اعداد المصادقة الثنائية جاهز",
    profile_toast_2fa_setup_ready_desc: "امسح رمز QR او اختر طريقة اخرى.",
    profile_toast_2fa_setup_failed_title: "تعذر تجهيز المصادقة الثنائية",
    profile_toast_2fa_setup_failed_desc: "يرجى المحاولة مرة اخرى.",
    profile_toast_2fa_enabled_title: "تم تفعيل المصادقة الثنائية",
    profile_toast_2fa_enabled_desc: "الطريقة المحددة مفعلة الآن.",
    profile_toast_2fa_enable_failed_title: "فشل تفعيل المصادقة الثنائية",
    profile_toast_2fa_enable_failed_desc: "ادخل رمزا صحيحا ثم حاول مجددا.",
    profile_toast_2fa_disabled_title: "تم تعطيل المصادقة الثنائية",
    profile_toast_2fa_disabled_desc: "سيتم تسجيل الدخول بكلمة المرور فقط.",
    profile_toast_2fa_disable_failed_title: "فشل تعطيل المصادقة الثنائية",
    profile_toast_2fa_disable_failed_desc: "ادخل رمزا صحيحا ثم حاول مجددا.",
    profile_toast_2fa_code_sent_title: "تم ارسال الرمز",
    profile_toast_2fa_code_sent_desc: "تم ارسال رمز التحقق بنجاح.",
    profile_toast_2fa_code_send_failed_title: "فشل ارسال الرمز",
    profile_toast_2fa_code_send_failed_desc: "تعذر ارسال رمز التحقق.",
    profile_toast_backup_codes_title: "تم توليد الرموز الاحتياطية",
    profile_toast_backup_codes_desc: "قم بتحميلها وحفظها في مكان آمن.",
    profile_toast_backup_codes_failed_title: "فشل الرموز الاحتياطية",
    profile_toast_backup_codes_failed_desc: "تعذر اعادة توليد الرموز الاحتياطية.",
  },
};

export function profileT(locale: LocaleCode, key: ProfileKey): string {
  const dictionary = PROFILE_DICTIONARY[locale] ?? PROFILE_DICTIONARY.en;
  return dictionary[key] ?? PROFILE_DICTIONARY.en[key];
}
