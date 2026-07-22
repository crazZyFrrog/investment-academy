"use client";

import { useSession } from "next-auth/react";
import { getGuestId } from "./use-user-id.guest";

/**
 * Session-aware identity for Version 1.0 (AUTH_ENABLED = true).
 * Kept intact; not wired into the active app flow while auth is disabled.
 */
export function useUserId(): string {
  const { data: session } = useSession();
  if (session?.user?.id) {
    return session.user.id;
  }
  return getGuestId();
}
