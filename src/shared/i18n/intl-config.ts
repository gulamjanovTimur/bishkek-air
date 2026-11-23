import { messagesByLocale, timeZone, type Locale } from "./config";

/** Всё, что нужно next-intl для языка; общее для конфигурации запроса и тестовых провайдеров. */
export function getIntlConfig(locale: Locale) {
  return {
    locale,
    messages: messagesByLocale[locale],
    timeZone,
  };
}
