import { messagesByLocale, timeZone, type Locale } from "./config";

/** Everything next-intl needs for a locale; shared by the request config and the test providers. */
export function getIntlConfig(locale: Locale) {
  return {
    locale,
    messages: messagesByLocale[locale],
    timeZone,
  };
}
