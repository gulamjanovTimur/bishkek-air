import { QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import type { ReactElement, ReactNode } from "react";

import { makeQueryClient } from "@/shared/api";
import { defaultLocale, getIntlConfig } from "@/shared/i18n";

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  /** Initial URL search params, e.g. `"?station=123"` or `{ station: "123" }`. */
  searchParams?: string | Record<string, string>;
}

/**
 * Renders a client component with the app providers: TanStack Query with the app defaults
 * (but no retries, so failures show up at once), next-intl with the `ru` dictionary,
 * and the nuqs testing adapter.
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
