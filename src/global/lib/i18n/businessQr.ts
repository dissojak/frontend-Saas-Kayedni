import type { LocaleCode } from '@global/lib/locales';

export type BusinessQrKey =
  | 'dialog_title'
  | 'dialog_description'
  | 'dialog_unavailable'
  | 'dialog_target_label'
  | 'dialog_updated_label'
  | 'dialog_image_alt'
  | 'action_view_qr'
  | 'action_share_business'
  | 'action_copy_link'
  | 'action_download'
  | 'action_print'
  | 'action_open_link'
  | 'share_whatsapp'
  | 'share_facebook'
  | 'share_x'
  | 'share_telegram'
  | 'share_caption'
  | 'toast_link_copied'
  | 'toast_link_copy_failed'
  | 'toast_download_failed'
  | 'toast_print_failed'
  | 'toast_share_failed';

const BUSINESS_QR_DICTIONARY: Record<LocaleCode, Record<BusinessQrKey, string>> = {
  en: {
    dialog_title: 'Business QR',
    dialog_description: 'Scan, share, download, or print the QR for this business.',
    dialog_unavailable: 'QR code is not available yet.',
    dialog_target_label: 'Business link',
    dialog_updated_label: 'Last updated',
    dialog_image_alt: 'Business QR code for {name}',
    action_view_qr: 'View QR',
    action_share_business: 'Share Business',
    action_copy_link: 'Copy link',
    action_download: 'Download',
    action_print: 'Print',
    action_open_link: 'Open link',
    share_whatsapp: 'WhatsApp',
    share_facebook: 'Facebook',
    share_x: 'X',
    share_telegram: 'Telegram',
    share_caption: 'Check out {name}: {url}',
    toast_link_copied: 'Business link copied to clipboard.',
    toast_link_copy_failed: 'Could not copy the link.',
    toast_download_failed: 'Could not download the QR image.',
    toast_print_failed: 'Could not open the print view.',
    toast_share_failed: 'Could not open the share link.',
  },
  fr: {
    dialog_title: 'QR du business',
    dialog_description: 'Scannez, partagez, telechargez ou imprimez le QR de ce business.',
    dialog_unavailable: 'Le QR code n est pas encore disponible.',
    dialog_target_label: 'Lien du business',
    dialog_updated_label: 'Derniere mise a jour',
    dialog_image_alt: 'QR code du business {name}',
    action_view_qr: 'Voir le QR',
    action_share_business: 'Partager le business',
    action_copy_link: 'Copier le lien',
    action_download: 'Telecharger',
    action_print: 'Imprimer',
    action_open_link: 'Ouvrir le lien',
    share_whatsapp: 'WhatsApp',
    share_facebook: 'Facebook',
    share_x: 'X',
    share_telegram: 'Telegram',
    share_caption: 'Decouvrez {name} : {url}',
    toast_link_copied: 'Lien du business copie dans le presse-papiers.',
    toast_link_copy_failed: 'Impossible de copier le lien.',
    toast_download_failed: 'Impossible de telecharger l image QR.',
    toast_print_failed: 'Impossible d ouvrir la vue impression.',
    toast_share_failed: 'Impossible d ouvrir le lien de partage.',
  },
  ar: {
    dialog_title: 'رمز QR للنشاط',
    dialog_description: 'امسح الرمز او شاركه او نزله او اطبعه لهذا النشاط.',
    dialog_unavailable: 'رمز QR غير متاح بعد.',
    dialog_target_label: 'رابط النشاط',
    dialog_updated_label: 'آخر تحديث',
    dialog_image_alt: 'رمز QR للنشاط {name}',
    action_view_qr: 'عرض QR',
    action_share_business: 'مشاركة النشاط',
    action_copy_link: 'نسخ الرابط',
    action_download: 'تنزيل',
    action_print: 'طباعة',
    action_open_link: 'فتح الرابط',
    share_whatsapp: 'واتساب',
    share_facebook: 'فيسبوك',
    share_x: 'X',
    share_telegram: 'تيليجرام',
    share_caption: 'اطلع على {name}: {url}',
    toast_link_copied: 'تم نسخ رابط النشاط.',
    toast_link_copy_failed: 'تعذر نسخ الرابط.',
    toast_download_failed: 'تعذر تنزيل صورة QR.',
    toast_print_failed: 'تعذر فتح نافذة الطباعة.',
    toast_share_failed: 'تعذر فتح رابط المشاركة.',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replaceAll(/\{(\w+)\}/g, (_, token: string) => String(params[token] ?? `{${token}}`));
}

export function businessQrT(locale: LocaleCode, key: BusinessQrKey, params?: Record<string, string | number>): string {
  const dictionary = BUSINESS_QR_DICTIONARY[locale] ?? BUSINESS_QR_DICTIONARY.en;
  const value = dictionary[key] ?? BUSINESS_QR_DICTIONARY.en[key];
  return interpolate(value, params);
}