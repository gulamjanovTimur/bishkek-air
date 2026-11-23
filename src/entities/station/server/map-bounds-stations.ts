import {
  waqiBoundsStationSchema,
  type WaqiBoundsStation,
} from "@/shared/api/waqi";
import { getAqiLevel } from "@/shared/lib/aqi";

import type { Station } from "../model/station";

// WAQI дописывает город и страну к названию; в интерфейсе они лишние
const NAME_TAIL = ", Bishkek, Kyrgyzstan";

function trimNameTail(name: string): string {
  return name.endsWith(NAME_TAIL) ? name.slice(0, -NAME_TAIL.length) : name;
}

function parseAqi(aqi: string | undefined): number | null {
  if (aqi === undefined) return null;
  const value = Number(aqi);
  return Number.isFinite(value) ? value : null;
}

function parseTime(time: string | undefined): string | null {
  if (time === undefined) return null;
  const date = new Date(time);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function mapBoundsStation(item: WaqiBoundsStation): Station {
  const aqi = parseAqi(item.aqi);
  return {
    id: item.uid,
    name: trimNameTail(item.station.name),
    coordinates: { lat: item.lat, lng: item.lon },
    aqi,
    level: aqi === null ? null : getAqiLevel(aqi),
    updatedAt: parseTime(item.station.time),
  };
}

/**
 * Превращает `data` ответа WAQI `map/bounds` в станции домена.
 * Станции, не прошедшие валидацию, пропускаются: одна битая точка не должна ломать весь список.
 */
export function mapBoundsStations(data: unknown[]): Station[] {
  return data.flatMap((item) => {
    const parsed = waqiBoundsStationSchema.safeParse(item);
    return parsed.success ? [mapBoundsStation(parsed.data)] : [];
  });
}
