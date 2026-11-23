# Bishkek Air

[![CI](https://github.com/gulamjanovTimur/bishkek-air/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/gulamjanovTimur/bishkek-air/actions/workflows/ci.yml)

Интерактивная карта качества воздуха в Бишкеке: станции на карте, индекс AQI, карточка станции и список станций. Интерфейс на русском и английском.

Данные — [World Air Quality Index (WAQI)](https://waqi.info/).

## Стек

Next.js (App Router), React 19, TypeScript, TanStack Query, nuqs, next-intl, Vitest + React Testing Library. Подробнее — [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) и [docs/adr/](docs/adr/).

## Локальный запуск

Нужен Node.js 24 (версия в `.nvmrc`; с nvm: `nvm use`).

```bash
npm install
cp .env.example .env.local   # впишите WAQI_TOKEN: https://aqicn.org/data-platform/token/
npm run dev                  # http://localhost:3000
```

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | Dev-сервер |
| `npm run build` | Прод-сборка |
| `npm run start` | Запуск прод-сборки |
| `npm run lint` | ESLint без предупреждений |
| `npm run typecheck` | Проверка типов (`tsc --noEmit`) |
| `npm run test` | Unit- и компонентные тесты (Vitest) |
| `npm run test:e2e` | E2E-тесты (пока заглушка) |
| `npm run format` | Prettier |

Задача готова, когда проходят `lint`, `typecheck`, `test` и `build`.

## Язык интерфейса

Язык хранится в cookie `locale` (`ru` или `en`). Без cookie интерфейс на русском, язык браузера не учитывается (ADR 0008).
