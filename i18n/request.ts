import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { getIntlConfig, localeCookieName, resolveLocale } from "@/shared/i18n";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(localeCookieName)?.value);

  return getIntlConfig(locale);
});
