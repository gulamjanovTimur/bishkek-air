import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/shared/lib/test";

describe("renderWithProviders", () => {
  it("gives tests the app query defaults, except that failed queries are not retried", () => {
    const { queryClient } = renderWithProviders(<div />);

    const queryDefaults = queryClient.getDefaultOptions().queries;
    expect(queryDefaults?.staleTime).toBe(5 * 60 * 1000);
    expect(queryDefaults?.retry).toBe(false);
  });
});
