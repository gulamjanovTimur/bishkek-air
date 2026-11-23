# Bishkek Air

Интерактивная карта качества воздуха в Бишкеке: станции на карте, индекс AQI, карточка станции, список станций. Интерфейс на русском и английском.

## Документация проекта

- `GLOSSARY.md` — доменный язык проекта (термины, без деталей реализации). Используй эти термины в коде, задачах и обсуждениях.
- `docs/adr/` — архитектурные решения (ADR). Не противоречь им молча: если решение нужно пересмотреть, предложи новый ADR.
- `docs/ARCHITECTURE.md` — стек, структура FSD, работа с данными WAQI, доменные типы, кэширование.
- `planning/brief.md` — исходное описание продукта: проблема, сценарии, состав MVP. Первичный материал для spec.

## Стек

Next.js (App Router) + React 19 + TypeScript (strict), MapLibre GL через `react-map-gl/maplibre`, TanStack Query, nuqs, next-intl, TanStack Table, Vitest + React Testing Library + MSW, Playwright, ESLint + Prettier. Деплой — Vercel. Решения — ADR 0006–0008.

## Команды

```bash
npm run dev        # next dev
npm run build      # next build
npm run start      # запуск прод-сборки локально
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run test       # Vitest
npm run test:e2e   # Playwright
```

Задача готова, только когда проходят `lint`, `typecheck`, `test` и `build`.

## Git

- Одна задача — одна ветка: `feat/<номер>-<кратко>`, `fix/<номер>-<кратко>`, `chore/<номер>-<кратко>`.
- Коммиты — Conventional Commits на английском: `feat(map): render stations layer`.
- PR по шаблону `.github/pull_request_template.md`, в описании `Closes #<номер>`.

## Правила кода

- Структура — Feature-Sliced Design (см. `docs/ARCHITECTURE.md`). Импорты только сверху вниз по слоям, через public API слайса (`index.ts`).
- TypeScript strict, без `any`. Ответы WAQI валидируются и маппятся в доменные типы только на сервере (ADR 0007); клиент получает доменный формат из `/api/stations*` и не знает о формате WAQI.
- Граница сервер/клиент: компоненты серверные по умолчанию, `"use client"` — только там, где нужны состояние, эффекты или браузерные API (карта, поиск, переключатели). Модули, которые ходят в WAQI или читают `WAQI_TOKEN`, начинаются с `import "server-only"`.
- Роутинг Next (корневая `app/`) — тонкий: `page.tsx`, `layout.tsx` и `route.ts` только реэкспортируют или вызывают код из слоёв FSD в `src/`.
- Серверное состояние на клиенте — только TanStack Query (сервер заполняет его кэш предзагрузкой через `HydrationBoundary`). Состояние, которое должно переживать перезагрузку и делиться ссылкой (выбранная станция, фильтры), — в URL search params через nuqs (shallow, без серверного рендера на каждое изменение). Настройки пользователя (язык) — в cookie (ADR 0008). Глобальный стор не добавляем без ADR.
- Без лишних `useEffect`: производные данные вычисляются при рендере, `useMemo`/`useCallback` — когда есть измеримая причина или стабильная ссылка нужна зависимости.
- UI-тексты — только через i18n (next-intl, ADR 0008), на двух языках: `ru` (эталон и язык по умолчанию) и `en`. Строки прямо в JSX не пишем. Идентификаторы и комментарии в коде — на английском, доменные имена берутся из `GLOSSARY.md`.
- Доступность: интерактивные элементы доступны с клавиатуры, у иконок-кнопок есть `aria-label`, цвет AQI всегда дублируется числом и текстом уровня.
- Тесты: логика (`shared/lib`, мапперы, свежесть, хуки) — unit на Vitest; клиентские компоненты — RTL с MSW вместо реального API и `NuqsTestingAdapter` для URL; Route Handlers — как функции с замоканным `fetch` к WAQI; async Server Components не тестируем через RTL — их логику выносим в функции, страницу целиком проверяет e2e на Playwright.

## Секреты

- Токен WAQI — только в переменной окружения `WAQI_TOKEN` (локально `.env.local`, в Vercel — Environment Variables). Никогда не попадает в клиентский бандл и в git.
- Не используй префикс `NEXT_PUBLIC_` для секретов: такие переменные попадают в клиентский бандл.

## Agent skills

### Issue tracker

Задачи и спеки — GitHub Issues репозитория `gulamjanovTimur/bishkek-air`, работа через `gh`. См. `docs/agents/issue-tracker.md`.

### Triage labels

Стандартные метки: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. См. `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` и `docs/adr/` в корне репозитория. См. `docs/agents/domain.md`.
