import { en } from "./messages/en";
import { ru, type Messages } from "./messages/ru";

export const locales = ["ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export const timeZone = "Asia/Bishkek";

export const localeCookieName = "locale";

export const messagesByLocale: Record<Locale, Messages> = { ru, en };
