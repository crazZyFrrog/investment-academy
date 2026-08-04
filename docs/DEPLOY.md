# Production deploy (Version 1.0)

## Рекомендуемый стек

- **App:** [Timeweb Cloud App Platform](https://timeweb.cloud/services/apps) (Next.js **с SSR**)
- **Database:** [Timeweb PostgreSQL (DBaaS)](https://timeweb.cloud/docs/dbaas/dbaas-create)

Полный ручной план по всем пунктам (Postgres, Google, env, migrate, Timeweb):  
**[GUIDE_V1_MANUAL.md](./GUIDE_V1_MANUAL.md)**.

Краткий гайд Timeweb: **[GUIDE_TIMEWEB_V1.md](./GUIDE_TIMEWEB_V1.md)**.

## Быстрый чек-лист

1. Запушь `main` на GitHub.
2. Создай Postgres в Timeweb → собери `DATABASE_URL` (`?sslmode=require`).
3. Создай Google OAuth Web Client + redirect URIs.
4. Локально: `.env.local` → `npm run db:migrate` → проверь вход.
5. App Platform → Next.js → **включить SSR** → подключить репозиторий.
6. Задай env:
   - `NEXT_PUBLIC_AUTH_ENABLED=true`
   - `NEXT_PUBLIC_SITE_URL` / `AUTH_URL` = HTTPS URL приложения
   - `AUTH_SECRET`
   - `DATABASE_URL`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
7. Добавь production redirect в Google Console.
8. Smoke-test: login → урок → sync → `/api/health`.

## Notes

- Без `NEXT_PUBLIC_AUTH_ENABLED=true` сайт остаётся в guest-only режиме.
- Подписки и App Store / Google Play — после 1.0 (см. [COMMERCIAL_RELEASE.md](./COMMERCIAL_RELEASE.md)).
