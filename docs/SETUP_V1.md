# Version 1.0 setup

## 1. PostgreSQL

Create a managed Postgres database (Neon, Supabase, Railway, or local Docker).

Copy the connection string into `.env.local`:

```bash
DATABASE_URL=postgres://user:pass@host:5432/investment_academy
```

## 2. Auth secrets

```bash
# 32+ random characters
AUTH_SECRET=...
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_ENABLED=true
```

For production, set `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your public HTTPS domain.

## 3. Google OAuth

1. Open [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create an OAuth 2.0 Client ID (Web application).
3. Authorized redirect URI:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://<your-domain>/api/auth/callback/google`
4. Put `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local` / Vercel env.

Apple Sign In is optional for web 1.0; add it the same way if needed for iOS users.

## 4. Migrations

```bash
npm run db:generate
npm run db:migrate
```

## 5. Run with auth

```bash
npm run dev
```

Open `/login`, sign in with Google, complete a lesson, then check sync in Settings.

## 6. Production (Timeweb)

Полный гайд для новичка: **[GUIDE_TIMEWEB_V1.md](./GUIDE_TIMEWEB_V1.md)**.

Кратко:

1. Postgres в Timeweb → `DATABASE_URL`
2. Google OAuth credentials
3. App Platform: Next.js **с SSR** + env из `.env.example`
4. Прописать production URL в `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` и в Google redirect URI
5. Smoke-test: login → lesson → sync → `/api/health`