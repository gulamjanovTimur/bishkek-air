import { z } from "zod";

/**
 * Конверт любого ответа WAQI. При ошибке WAQI отвечает HTTP 200 со `status: "error"`,
 * а в `data` лежит причина.
 */
export const waqiEnvelopeSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("ok"), data: z.unknown() }),
  z.object({ status: z.literal("error"), data: z.unknown() }),
]);

/**
 * Станция из ответа `map/bounds`.
 * Без uid, координат и названия станцию не показать, поэтому они обязательны; остальное — нет.
 */
export const waqiBoundsStationSchema = z.object({
  uid: z.number().int(),
  lat: z.number(),
  lon: z.number(),
  // Строка с числом или "-", если данных нет
  aqi: z.string().optional(),
  station: z.object({
    name: z.string(),
    // ISO-время последнего измерения
    time: z.string().optional(),
  }),
});

export type WaqiBoundsStation = z.infer<typeof waqiBoundsStationSchema>;

/**
 * `data` ответа `map/bounds`. Здесь проверяется только, что это список:
 * станции валидируются по одной, чтобы битая станция не ломала весь ответ.
 */
export const waqiBoundsDataSchema = z.array(z.unknown());
