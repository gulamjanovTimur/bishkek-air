import { getBishkekStations } from "@/entities/station/server";

// CDN отдаёт кэш 5 минут и ещё 10 минут — устаревший, пока обновляет фоном (ADR 0007)
const CACHE_CONTROL = "s-maxage=300, stale-while-revalidate=600";

/** `GET /api/stations` — станции Бишкека в доменном формате; `502`, если данные от WAQI получить не удалось. */
export async function GET(): Promise<Response> {
  try {
    const stations = await getBishkekStations();
    return Response.json(stations, {
      headers: { "Cache-Control": CACHE_CONTROL },
    });
  } catch (error) {
    console.error("GET /api/stations failed", error);
    return Response.json(
      { error: "Failed to load stations from the data provider" },
      { status: 502 },
    );
  }
}
