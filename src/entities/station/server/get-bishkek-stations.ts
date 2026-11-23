import "server-only";

import { fetchWaqi, waqiBoundsDataSchema } from "@/shared/api/waqi";
import { BISHKEK_BOUNDS } from "@/shared/config";

import { mapBoundsStations } from "./map-bounds-stations";
import type { Station } from "../model/station";

/** Станции Бишкека из WAQI в доменном формате. */
export async function getBishkekStations(): Promise<Station[]> {
  const { south, west, north, east } = BISHKEK_BOUNDS;
  const data = await fetchWaqi(
    "map/bounds/",
    {
      latlng: [south, west, north, east].join(","),
      // Без networks=all WAQI не отдаёт станции гражданских сетей, а других в Бишкеке сейчас нет
      networks: "all",
    },
    waqiBoundsDataSchema,
  );
  return mapBoundsStations(data);
}
