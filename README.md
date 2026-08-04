# Investment Academy

PWA для спокойного обучения инвестициям: курсы, уроки с тестами, локальный и облачный прогресс.

## Version 1.0

- Гостевой режим с офлайн-прогрессом (IndexedDB)
- Вход через Google/Apple при `NEXT_PUBLIC_AUTH_ENABLED=true`
- Синхронизация пройденных уроков между устройствами
- Объединение гостевого прогресса с аккаунтом после входа
- Legal-страницы: `/privacy`, `/terms`, `/delete-account`

Подписки и магазины приложений — этап после 1.0 (см. [docs/COMMERCIAL_RELEASE.md](docs/COMMERCIAL_RELEASE.md)).

## Quick start (guest)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Включить auth + sync

Следуйте [docs/SETUP_V1.md](docs/SETUP_V1.md):

1. Postgres + `DATABASE_URL`
2. `AUTH_SECRET`, `AUTH_URL`, OAuth credentials
3. `NEXT_PUBLIC_AUTH_ENABLED=true`
4. `npm run db:migrate`
5. `npm run dev`

## Scripts

- `npm run dev` — development server
- `npm run build` / `npm run start` — production
- `npm run lint` / `npm run typecheck` / `npm test` / `npm run test:e2e`
- `npm run lighthouse` — mobile Lighthouse audit
- `npm run db:generate` / `npm run db:migrate` — Drizzle migrations

## Checklist

```bash
npm test
npm run typecheck
npm run test:e2e
npm run build
```

Auth-mode (после настройки env):

1. Войти через Google
2. Объединить гостевой прогресс (если был)
3. Завершить урок → синхронизация в Settings
4. Проверить прогресс во втором браузере

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/GUIDE_V1_MANUAL.md](docs/GUIDE_V1_MANUAL.md), [docs/GUIDE_TIMEWEB_V1.md](docs/GUIDE_TIMEWEB_V1.md), [docs/SETUP_V1.md](docs/SETUP_V1.md), [docs/COMMERCIAL_RELEASE.md](docs/COMMERCIAL_RELEASE.md).

## Stack

Next.js · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Zustand · TanStack Query · Framer Motion · Lucide · Auth.js · Drizzle · Serwist · Vitest
