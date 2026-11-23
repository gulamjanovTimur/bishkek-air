import { isServer, QueryClient } from "@tanstack/react-query";

const FIVE_MINUTES = 5 * 60 * 1000;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: FIVE_MINUTES,
        retry: 2,
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
