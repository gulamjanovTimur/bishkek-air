// Тесты на уровне типов, проверяются `npm run typecheck`: падают, если ключи сообщений перестанут типизироваться.
import { useTranslations } from "next-intl";

import type { Messages } from "@/shared/i18n";

export function useMessageKeyChecks() {
  const t = useTranslations("appHeader");
  t("title");

  // @ts-expect-error -- опечатка в ключе сообщения должна ломать typecheck
  t("titel");

  // @ts-expect-error -- неизвестный namespace должен ломать typecheck
  useTranslations("appHeadr");
}

// @ts-expect-error -- каждый язык обязан содержать все ключи эталонного словаря `ru`
export const localeWithMissingKey: Messages = { appHeader: {} };
