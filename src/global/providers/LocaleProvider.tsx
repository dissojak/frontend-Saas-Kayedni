"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LOCALE,
  getLocaleDirection,
  isSupportedLocale,
  type LocaleCode,
} from "@global/lib/locales";
import { LocaleContext, type LocaleContextValue } from "@global/providers/localeContext";

const LOCALE_STORAGE_KEY = "kayedni.locale";
const LOCALE_COOKIE_KEY = "kayedni_locale";

function getNavigatorLocale(): LocaleCode {
  if (typeof navigator === "undefined") {
    return DEFAULT_LOCALE;
  }

  const preferred = navigator.language?.split("-")[0]?.toLowerCase();
  return isSupportedLocale(preferred) ? preferred : DEFAULT_LOCALE;
}

function applyHtmlDirection(locale: LocaleCode) {
  if (typeof document === "undefined") {
    return;
  }

  const direction = getLocaleDirection(locale);
  document.documentElement.lang = locale;
  document.documentElement.dir = direction;
}

export function LocaleProvider({ children }: React.PropsWithChildren) {
  const [locale, setLocale] = useState<LocaleCode>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isSupportedLocale(saved)) {
        setLocale(saved);
        return;
      }
    } catch {
      // Ignore localStorage access failures.
    }

    setLocale(getNavigatorLocale());
  }, []);

  useEffect(() => {
    applyHtmlDirection(locale);

    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore localStorage access failures.
    }

    if (typeof document !== "undefined") {
      document.cookie = `${LOCALE_COOKIE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`;
    }
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction: getLocaleDirection(locale),
      setLocale,
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
