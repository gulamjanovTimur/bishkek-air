import { describe, expect, it } from "vitest";

import boundsFixture from "@fixtures/waqi/map-bounds.json";

import { mapBoundsStations } from "./map-bounds-stations";
import type { Station } from "../model/station";

function findStation(stations: Station[], id: number) {
  return stations.find((station) => station.id === id);
}

describe("mapBoundsStations", () => {
  const stations = mapBoundsStations(boundsFixture.data);

  it("maps a WAQI map/bounds station to the domain station", () => {
    expect(findStation(stations, -182719)).toEqual({
      id: -182719,
      name: "Герцена улица",
      coordinates: { lat: 42.872, lng: 74.622 },
      aqi: 55,
      level: "moderate",
      updatedAt: "2026-11-23T14:29:10.000Z",
    });
  });

  it('cuts the ", Bishkek, Kyrgyzstan" tail from the name without translating it', () => {
    expect(findStation(stations, 11403)?.name).toBe("US Embassy");
  });

  it('treats aqi "-" as no data, without a level', () => {
    expect(findStation(stations, -79522)).toMatchObject({
      aqi: null,
      level: null,
    });
  });

  it("skips a broken station without coordinates and keeps the rest", () => {
    expect(stations.map((station) => station.id)).toEqual([
      -79522, -456844, -182719, -82948, -2383594, 11403, -900001,
    ]);
  });

  it("keeps a station with missing aqi and time, setting those fields to null", () => {
    expect(findStation(stations, -900001)).toEqual({
      id: -900001,
      name: "Ахунбаева улица",
      coordinates: { lat: 42.8501, lng: 74.6012 },
      aqi: null,
      level: null,
      updatedAt: null,
    });
  });
});
