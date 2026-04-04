import { createContext } from "react";
import type { LocaleCode } from "@global/lib/locales";

export interface LocaleContextValue {
  locale: LocaleCode;
  direction: "ltr" | "rtl";
  setLocale: (nextLocale: LocaleCode) => void;
}

export const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);
