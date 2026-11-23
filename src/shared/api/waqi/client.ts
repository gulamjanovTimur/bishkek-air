import "server-only";

import type { z } from "zod";

import { waqiEnvelopeSchema } from "./schemas";

/** WAQI недоступен, ответил ошибкой или прислал ответ, не прошедший валидацию. */
export class WaqiError extends Error {
  override name = "WaqiError";
}

const DEFAULT_BASE_URL = "https://api.waqi.info";
// Сколько секунд Next кэширует ответ WAQI (ADR 0007)
const REVALIDATE_SECONDS = 300;

/**
 * GET-запрос к WAQI с токеном из `WAQI_TOKEN`: проверяет конверт ответа,
 * валидирует `data` по `dataSchema` и возвращает его.
 * Базовый URL можно подменить через `WAQI_BASE_URL` (мок-сервер в e2e).
 */
export async function fetchWaqi<T>(
  path: string,
  params: Record<string, string>,
  dataSchema: z.ZodType<T>,
): Promise<T> {
  const token = process.env.WAQI_TOKEN;
  if (!token) {
    throw new Error("WAQI_TOKEN is not set");
  }

  const baseUrl = process.env.WAQI_BASE_URL || DEFAULT_BASE_URL;
  const url = new URL(path, baseUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("token", token);

  const response = await fetch(url.toString(), {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  let body: unknown;
  try {
    body = await response.json();
  } catch (cause) {
    throw new WaqiError(
      `WAQI responded with non-JSON (HTTP ${response.status})`,
      { cause },
    );
  }

  const envelope = waqiEnvelopeSchema.safeParse(body);
  if (!envelope.success) {
    throw new WaqiError("WAQI response has an unexpected shape", {
      cause: envelope.error,
    });
  }
  if (envelope.data.status === "error") {
    throw new WaqiError(
      `WAQI responded with an error: ${String(envelope.data.data)}`,
    );
  }

  const data = dataSchema.safeParse(envelope.data.data);
  if (!data.success) {
    throw new WaqiError(`WAQI ${path} data has an unexpected shape`, {
      cause: data.error,
    });
  }
  return data.data;
}
