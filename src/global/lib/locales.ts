export type LocaleCode = "en" | "fr" | "ar";

export const SUPPORTED_LOCALES: LocaleCode[] = ["en", "fr", "ar"];
export const DEFAULT_LOCALE: LocaleCode = "en";

export function isSupportedLocale(value: string | null | undefined): value is LocaleCode {
  return value === "en" || value === "fr" || value === "ar";
}

export function getLocaleDirection(locale: LocaleCode): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
