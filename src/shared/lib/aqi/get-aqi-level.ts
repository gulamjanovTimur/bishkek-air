/** Уровень AQI по шкале US EPA (см. «Уровень AQI» в GLOSSARY.md). */
export type AqiLevel =
  | "good"
  | "moderate"
  | "sensitive"
  | "unhealthy"
  | "very-unhealthy"
  | "hazardous";

// Верхние границы уровней включительно, по возрастанию
const LEVEL_UPPER_BOUNDS: readonly [number, AqiLevel][] = [
  [50, "good"],
  [100, "moderate"],
  [150, "sensitive"],
  [200, "unhealthy"],
  [300, "very-unhealthy"],
];

/** Возвращает уровень AQI для значения индекса. */
export function getAqiLevel(aqi: number): AqiLevel {
  const match = LEVEL_UPPER_BOUNDS.find(([upperBound]) => aqi <= upperBound);
  return match ? match[1] : "hazardous";
}
