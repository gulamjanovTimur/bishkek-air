// Type-level tests, checked by `npm run typecheck`: they fail if message keys stop being typed.
import { useTranslations } from "next-intl";

import type { Messages } from "@/shared/i18n";

export function useMessageKeyChecks() {
  const t = useTranslations("appHeader");
  t("title");

  // @ts-expect-error -- a typo in a message key must fail typecheck
  t("titel");

  // @ts-expect-error -- an unknown namespace must fail typecheck
  useTranslations("appHeadr");
}

// @ts-expect-error -- every locale must provide all keys of the reference `ru` dictionary
export const localeWithMissingKey: Messages = { appHeader: {} };
