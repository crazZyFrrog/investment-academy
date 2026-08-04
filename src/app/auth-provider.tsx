"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { AUTH_ENABLED } from "@/data/auth/flags";

/**
 * When AUTH_ENABLED is false, skip SessionProvider so NextAuth
 * does not fetch `/api/auth/session` on mount.
 * Enable with NEXT_PUBLIC_AUTH_ENABLED=true (see docs/SETUP_V1.md).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  if (!AUTH_ENABLED) {
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
