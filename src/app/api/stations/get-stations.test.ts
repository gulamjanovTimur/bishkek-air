// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/stations";
import boundsFixture from "@fixtures/waqi/map-bounds.json";

function mockWaqiResponse(body: unknown) {
  const fetchMock = vi.fn(async () => Response.json(body));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("GET /api/stations", () => {
  beforeEach(() => {
    vi.stubEnv("WAQI_TOKEN", "test-token");
    vi.stubEnv("WAQI_BASE_URL", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns Bishkek stations in the domain format with CDN cache headers", async () => {
    mockWaqiResponse(boundsFixture);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe(
      "s-maxage=300, stale-while-revalidate=600",
    );
    const stations = await response.json();
    expect(stations).toHaveLength(7);
    expect(stations).toContainEqual({
      id: -182719,
      name: "Герцена улица",
      coordinates: { lat: 42.872, lng: 74.622 },
      aqi: 55,
      level: "moderate",
      updatedAt: "2026-11-23T14:29:10.000Z",
    });
  });

  it("requests all networks inside the Bishkek rectangle, revalidating every 5 minutes", async () => {
    const fetchMock = mockWaqiResponse(boundsFixture);

    await GET();

    expect(fetchMock).toHaveBeenCalledOnce();
    const [input, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit & { next?: { revalidate?: number } },
    ];
    const url = new URL(input);
    expect(url.origin + url.pathname).toBe("https://api.waqi.info/map/bounds/");
    expect(url.searchParams.get("latlng")).toBe("42.78,74.45,42.95,74.75");
    expect(url.searchParams.get("networks")).toBe("all");
    expect(url.searchParams.get("token")).toBe("test-token");
    expect(init.next?.revalidate).toBe(300);
  });

  it('responds 502 when WAQI answers with status "error"', async () => {
    mockWaqiResponse({ status: "error", data: "Invalid key" });

    const response = await GET();

    expect(response.status).toBe(502);
  });

  it.each([
    ["data is not a list", { status: "ok", data: { stations: [] } }],
    ["status is missing", { data: boundsFixture.data }],
    ["body is not an object", "Service Unavailable"],
  ])("responds 502 when the WAQI response is invalid: %s", async (_, body) => {
    mockWaqiResponse(body);

    const response = await GET();

    expect(response.status).toBe(502);
  });
});
