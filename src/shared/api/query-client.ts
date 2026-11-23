import {
  isServer,
  QueryClient,
  type DefaultOptions,
} from "@tanstack/react-query";

const DEFAULT_STALE_TIME_MS = 5 * 60 * 1000;

/** Creates a client with the app query defaults; `queryOverrides` replaces individual defaults (e.g. in tests). */
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
 * A fresh client per request on the server (no data shared between users),
 * a single client in the browser (survives re-renders and suspense).
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
