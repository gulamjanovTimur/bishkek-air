import { describe, expect, it } from "vitest";

import { getAqiLevel } from "@/shared/lib/aqi";

describe("getAqiLevel", () => {
  it.each([
    [0, "good"],
    [50, "good"],
    [51, "moderate"],
    [100, "moderate"],
    [101, "sensitive"],
    [150, "sensitive"],
    [151, "unhealthy"],
    [200, "unhealthy"],
    [201, "very-unhealthy"],
    [300, "very-unhealthy"],
    [301, "hazardous"],
    [999, "hazardous"],
  ])("maps AQI %i to the %s level by the US EPA scale", (aqi, level) => {
    expect(getAqiLevel(aqi)).toBe(level);
  });
});
