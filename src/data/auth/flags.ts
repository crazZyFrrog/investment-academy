/**
 * Auth + cloud sync gate for Version 1.0.
 * Enable with NEXT_PUBLIC_AUTH_ENABLED=true after configuring
 * DATABASE_URL, AUTH_SECRET, AUTH_URL, and at least one OAuth provider.
 * See docs/SETUP_V1.md.
 */
export const AUTH_ENABLED =
  process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";
