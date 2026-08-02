# Investment Academy — Architecture

Production-ready PWA for investment education. Stack: Next.js App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, Framer Motion, Lucide Icons.

## Layers

- `src/app/` — routes, layouts, API handlers, service worker entry
- `src/features/` — user scenarios (catalog, learning, progress, auth, pwa)
- `src/components/` — reusable UI by screen domain
- `src/domain/` — pure business rules (progress merge, completion)
- `src/data/` — repositories (content FS, IndexedDB, PostgreSQL)
- `content/` — git-versioned MDX lessons and course metadata

## Content strategy

Courses live under `content/courses/{slug}/` with `meta.json` and `lessons/*.mdx`. Loaders validate via Zod and expose domain entities through `ContentRepository`.

## Progress strategy

Offline-first dual storage:

1. **IndexedDB** — canonical local snapshot + sync outbox (all users)
2. **PostgreSQL** — remote snapshot for authenticated users via `/api/progress`

Conflict policy: higher lesson status wins; tie-break by score, then `completedAt`.

Zustand stores UI preferences only — not course progress.

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/about` | About |
| `/login`, `/register` | Auth |
| `/dashboard` | Academy home |
| `/courses` | Catalog |
| `/courses/[courseSlug]` | Course overview |
| `/courses/[courseSlug]/lessons/[lessonSlug]` | Lesson player |
| `/progress` | Progress dashboard |
| `/settings` | Account & PWA install |

## PWA

Serwist service worker (`src/app/sw.ts`) with precache + runtime caching. Manifest at `public/manifest.webmanifest`. Offline banner and install prompt in `src/features/pwa/`.

## Auth

Auth.js (NextAuth v5) code, routes, and dependencies remain in the repo.

**Current status (pre–Version 1.0):** authentication integration is disabled via `AUTH_ENABLED = false` in `src/data/auth/flags.ts`.

- Guest Mode is the default identity (`useUserId` → local guest id).
- `SessionProvider` is not mounted, so there is no automatic `/api/auth/session` fetch.
- Login/register UI is gated; Auth.js handlers under `/api/auth/*` are still present.
- Set `AUTH_ENABLED` to `true` and switch `src/hooks/use-user-id.ts` to the session export to re-enable for Version 1.0.

## Database

Drizzle ORM schema in `src/data/db/schema.ts`. Run migrations with:

```bash
npm run db:generate
npm run db:migrate
```

## Development

```bash
cp .env.example .env.local
npm run dev
```

Set `DATABASE_URL` and `AUTH_SECRET` for authenticated remote sync.

## Testing layout

- Unit tests: co-located in `src/**/*.test.ts` (Vitest)
- E2E smoke: `tests/e2e/` (Playwright)

See [tests/README.md](../tests/README.md).
