"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { AUTH_ENABLED } from "@/data/auth/flags";

/**
 * When AUTH_ENABLED is false, skip SessionProvider entirely so NextAuth
 * does not fetch `/api/auth/session` on mount, focus, or interval.
 * Auth.js files and handlers remain available for Version 1.0.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  if (!AUTH_ENABLED) {
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
