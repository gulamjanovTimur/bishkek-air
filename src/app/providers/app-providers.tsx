import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import { ClientProviders } from "./client-providers";

/** Серверный компонент: next-intl передаёт клиенту язык, сообщения и часовой пояс из `i18n/request.ts`. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider>
      <ClientProviders>{children}</ClientProviders>
    </NextIntlClientProvider>
  );
}
