# Архитектура

## Стек

| Область | Выбор | Почему |
|---|---|---|
| UI | React 19 + TypeScript (strict) | Основной стек проекта |
| Сборка | Vite | Быстрый dev-сервер, SPA без SSR достаточно (ADR 0001) |
| Карта | MapLibre GL JS + `react-map-gl/maplibre` | Открытый, без токена Mapbox (ADR 0002) |
| Подложка карты | OpenFreeMap (стиль `liberty`) | Бесплатные векторные тайлы без ключа |
| Серверное состояние | TanStack Query | Кэш, повторы, статусы загрузки (ADR 0003) |
| UI-состояние | URL search params + локальный state | Шаринг ссылкой, без глобального стора (ADR 0003) |
| Таблица | TanStack Table | Headless, сортировка/фильтрация |
| Тесты | Vitest, React Testing Library, MSW, Playwright | Unit, компонентные, e2e |
| Деплой | Vercel | Статика + serverless-функция для прокси к API (ADR 0004) |

## Структура (Feature-Sliced Design)

```
src/
  app/            # провайдеры (QueryClient, Router), глобальные стили, точка входа
  pages/
    map/          # единственная страница: карта + панель + таблица
  widgets/
    air-map/      # карта со слоем станций и кластерами
    station-panel/# карточка выбранной станции
    stations-table/
    aqi-legend/
  features/
    select-station/   # выбор станции, синхронизация с URL
    search-stations/
  entities/
    station/      # доменный тип Station, маппер из WAQI, хуки useStations / useStation
  shared/
    api/          # http-клиент, типы ответов WAQI, валидация
    lib/aqi/      # уровни AQI, цвета, тексты рекомендаций
    ui/           # базовые компоненты
    config/       # константы: границы Бишкека, интервалы обновления
api/
  waqi/[...path].ts   # Vercel Function: прокси к WAQI с токеном и кэшем
```

Правила: слой может импортировать только из слоёв ниже; между слайсами одного слоя — только через `index.ts`.

## Данные

### Внешний API (WAQI)

Используемые эндпоинты (через наш прокси `/api/waqi/...`):

- `map/bounds?latlng=<lat1>,<lng1>,<lat2>,<lng2>&networks=all` — список станций в прямоугольнике: координаты, `uid`, `aqi`, название, время.
- `feed/@<uid>/` — детали станции: общий `aqi`, `dominentpol`, `iaqi` (показатели по загрязнителям), `time`, `attributions`, `forecast.daily`.

Особенности, которые важно учесть:
- `aqi` в `map/bounds` приходит строкой и может быть `"-"`, если данных нет → в домене это `aqi: number | null`.
- Значения в `iaqi` — это **индексы AQI по каждому загрязнителю**, а не концентрации в мкг/м³. Подписывать в UI нужно соответственно.
- Опечатка `dominentpol` — так в API, в домене называем `dominantPollutant`.
- Атрибуция источников (`attributions`) обязательна к показу.

### Границы Бишкека

`shared/config`: прямоугольник примерно `42.78,74.45 — 42.95,74.75`, центр карты `42.8746, 74.5698`, начальный zoom 11–12. Уточнить по данным при реализации.

### Доменная модель

```ts
type AqiLevel = 'good' | 'moderate' | 'sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';

interface Station {
  id: number;            // WAQI uid
  name: string;
  coordinates: { lat: number; lng: number };
  aqi: number | null;
  level: AqiLevel | null;
  updatedAt: string | null; // ISO
}

interface StationDetails extends Station {
  dominantPollutant: string | null;
  pollutants: Record<string, number>; // индексы по загрязнителям (pm25, pm10, no2, ...)
  forecast: { pollutant: string; day: string; avg: number; min: number; max: number }[];
  attributions: { name: string; url: string }[];
}
```

### Уровни AQI (шкала US EPA)

| AQI | Уровень | Цвет |
|---|---|---|
| 0–50 | Хорошо | `#00e400` |
| 51–100 | Умеренно | `#ffff00` |
| 101–150 | Вредно для чувствительных групп | `#ff7e00` |
| 151–200 | Вредно | `#ff0000` |
| 201–300 | Очень вредно | `#8f3f97` |
| 301+ | Опасно | `#7e0023` |

### Кэширование

- Прокси: `Cache-Control: s-maxage=300, stale-while-revalidate=600` — CDN Vercel отдаёт кэш, WAQI не перегружаем.
- TanStack Query: `staleTime` 5 минут для списка станций и деталей.

## Состояние

- Серверные данные — TanStack Query (`entities/station`).
- Выбранная станция — `?station=<uid>` в URL. Карта, таблица и панель читают одно и то же значение — синхронизация без общего стора.
- Локальный UI (открыта ли панель на мобильном, текст поиска до debounce) — `useState` в компоненте.

## Производительность

- Станции рендерятся одним GeoJSON-слоем MapLibre (WebGL), не React-компонентами-маркерами.
- Кластеризация — встроенная в GeoJSON source (`cluster: true`).
- Карта и таблица — ленивые чанки, если это даст измеримый выигрыш.
- Все оптимизации — с замерами «до/после» в PR.
