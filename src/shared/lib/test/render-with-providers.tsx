import { QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import type { ReactElement, ReactNode } from "react";

import { makeQueryClient } from "@/shared/api";
import { defaultLocale, getIntlConfig } from "@/shared/i18n";

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  /** Начальные search params URL, например `"?station=123"` или `{ station: "123" }`. */
  searchParams?: string | Record<string, string>;
}

/**
 * Рендерит клиентский компонент с провайдерами приложения: TanStack Query с настройками приложения
 * (но без повторных попыток, чтобы ошибки проявлялись сразу), next-intl со словарём `ru`
 * и тестовый адаптер nuqs.
 */
export function renderWithProviders(
  ui: ReactElement,
  { searchParams, ...options }: RenderWithProvidersOptions = {},
) {
  const queryClient = makeQueryClient({ retry: false });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider {...getIntlConfig(defaultLocale)}>
          <NuqsTestingAdapter searchParams={searchParams}>
            {children}
          </NuqsTestingAdapter>
        </NextIntlClientProvider>
      </QueryClientProvider>
    );
  }

  return { queryClient, ...render(ui, { wrapper: Wrapper, ...options }) };
}
