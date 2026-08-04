# Commercial release checklist

## Web

- Set `NEXT_PUBLIC_AUTH_ENABLED=true` only after configuring `AUTH_SECRET`, `AUTH_URL`, and at least one OAuth provider (see [SETUP_V1.md](./SETUP_V1.md)).
- Run `npm run db:generate` and `npm run db:migrate` after reviewing the subscription and entitlement schema.
- Configure `BILLING_WEBHOOK_SECRET` and send signed entitlement events to `/api/billing/webhook`.
- Connect Stripe Checkout/Customer Portal and Apple/Google purchase validation to that webhook contract. Never grant premium access from client state.

## Mobile stores

The current product is a responsive PWA. A store build still needs a native shell, store-specific purchase SDK integration, deep-link configuration, and release signing. Capacitor is the intended shell; Android can also use a Trusted Web Activity when native purchase requirements are handled separately.

Before submission:

- Publish `/privacy`, `/terms`, and `/delete-account`.
- Add the privacy URL, data-safety declarations, age rating, and account deletion flow to both store consoles.
- Add a visible “not investment advice” disclaimer to onboarding and relevant lessons.
- Verify that service-worker runtime caching never stores auth, progress, entitlement, or billing responses.
