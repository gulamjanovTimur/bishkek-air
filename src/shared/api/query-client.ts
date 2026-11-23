import {
  isServer,
  QueryClient,
  type DefaultOptions,
} from "@tanstack/react-query";

const DEFAULT_STALE_TIME_MS = 5 * 60 * 1000;

/** Создаёт клиент с настройками запросов приложения; `queryOverrides` заменяет отдельные настройки (например, в тестах). */
export function makeQueryClient(queryOverrides?: DefaultOptions["queries"]) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME_MS,
        retry: 2,
        ...queryOverrides,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * На сервере — новый клиент на каждый запрос (данные не делятся между пользователями),
 * в браузере — один клиент на всё время работы (переживает ре-рендеры и suspense).
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
