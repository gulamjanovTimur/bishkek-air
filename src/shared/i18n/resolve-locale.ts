import { defaultLocale, locales, type Locale } from "./config";

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Выбирает язык интерфейса по значению языковой cookie (ADR 0008).
 * Язык браузера намеренно не учитывается: без корректной cookie интерфейс на `ru`.
 */
export function resolveLocale(cookieValue: string | undefined): Locale {
  return cookieValue !== undefined && isLocale(cookieValue)
    ? cookieValue
    : defaultLocale;
}
