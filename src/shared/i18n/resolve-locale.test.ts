import { describe, expect, it } from "vitest";

import { resolveLocale } from "@/shared/i18n";

describe("resolveLocale", () => {
  it("defaults to ru when the language cookie is missing", () => {
    expect(resolveLocale(undefined)).toBe("ru");
  });

  it("uses a supported language from the cookie", () => {
    expect(resolveLocale("en")).toBe("en");
    expect(resolveLocale("ru")).toBe("ru");
  });

  it("falls back to ru for an unsupported cookie value", () => {
    expect(resolveLocale("de")).toBe("ru");
    expect(resolveLocale("EN")).toBe("ru");
    expect(resolveLocale("")).toBe("ru");
  });
});
