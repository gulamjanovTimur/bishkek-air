import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import {
  localeCookieName,
  messagesByLocale,
  resolveLocale,
  timeZone,
} from "@/shared/i18n";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(localeCookieName)?.value);

  return {
    locale,
    messages: messagesByLocale[locale],
    timeZone,
  };
});
