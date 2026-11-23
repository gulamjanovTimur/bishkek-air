import type { AqiLevel } from "@/shared/lib/aqi";

/** Станция в доменном формате, который отдают `/api/stations*` (см. «Станция» в GLOSSARY.md). */
export interface Station {
  /** uid станции в WAQI; бывает отрицательным у станций гражданских сетей */
  id: number;
  /** Название без хвоста «, Bishkek, Kyrgyzstan», без перевода */
  name: string;
  coordinates: { lat: number; lng: number };
  aqi: number | null;
  level: AqiLevel | null;
  /** ISO-время последнего измерения */
  updatedAt: string | null;
}
