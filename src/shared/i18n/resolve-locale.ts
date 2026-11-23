import { defaultLocale, locales, type Locale } from "./config";

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Picks the UI language from the language cookie value (ADR 0008).
 * The browser language is intentionally ignored: without a valid cookie the UI is in `ru`.
 */
export function resolveLocale(cookieValue: string | undefined): Locale {
  return cookieValue !== undefined && isLocale(cookieValue)
    ? cookieValue
    : defaultLocale;
}
