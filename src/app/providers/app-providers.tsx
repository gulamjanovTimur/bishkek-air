import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import { ClientProviders } from "./client-providers";

/** Server component: next-intl passes locale, messages and time zone from `i18n/request.ts` to the client. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider>
      <ClientProviders>{children}</ClientProviders>
    </NextIntlClientProvider>
  );
}
