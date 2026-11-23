import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/shared/lib/test";
import { AppHeader } from "@/widgets/app-header";

describe("AppHeader", () => {
  it("shows the app title as the page heading inside the banner", () => {
    renderWithProviders(<AppHeader />);

    const banner = screen.getByRole("banner");
    expect(
      within(banner).getByRole("heading", { level: 1, name: "Bishkek Air" }),
    ).toBeInTheDocument();
  });
});
