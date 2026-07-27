# Investment Academy

PWA для спокойного обучения инвестициям: курсы, уроки с тестами, локальный прогресс.

## Режим сейчас (pre–1.0)

По умолчанию приложение работает **в гостевом режиме**:

- прогресс хранится локально (IndexedDB);
- Auth.js и sync на сервер **выключены** (`AUTH_ENABLED = false` в `src/data/auth/flags.ts`);
- для локальной разработки база данных не обязательна.

Гостевые возможности уже в продукте:

- последовательное открытие курсов и уроков;
- тесты с обязательными 100% перед завершением урока;
- черновик ответов квиза на устройстве;
- тема оформления, экспорт/импорт и сброс прогресса в `/settings`;
- поиск и фильтр курсов по тегам;
- установка как PWA.

Чтобы включить вход и синхронизацию прогресса позже (Version 1.0):

1. задайте переменные из `.env.example`;
2. поставьте `AUTH_ENABLED = true`;
3. переключите экспорт в `src/hooks/use-user-id.ts` на `./use-user-id.session`;
4. примените миграции БД (`npm run db:generate` / `npm run db:migrate`).

## Quick start

```bash
npm install
cp .env.example .env.local   # опционально для guest-only
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

На телефоне в той же Wi‑Fi: `http://<IP-вашего-ПК>:3000` (не `localhost`).
`npm run dev` слушает `0.0.0.0` и разрешает LAN в `allowedDevOrigins`.
После смены конфига перезапустите dev-сервер.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript (`tsc --noEmit`)
- `npm test` — unit tests (Vitest)
- `npm run test:e2e` — Playwright smoke (desktop / mobile / tablet)
- `npm run lighthouse` — mobile Lighthouse audit (needs `npm run build && npm run start` in another terminal)
- `npm run db:generate` — generate Drizzle migrations
- `npm run db:migrate` — apply migrations

## Guest checklist

```bash
npm test
npm run typecheck
npm run test:e2e
npm run build
npm run start          # в другом терминале
npm run lighthouse     # BASE_URL=http://127.0.0.1:3000 по умолчанию
```

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Stack

Next.js · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Zustand · TanStack Query · Framer Motion · Lucide · Auth.js · Drizzle · Serwist · Vitest
