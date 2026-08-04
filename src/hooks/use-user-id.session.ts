"use client";

import { useSession } from "next-auth/react";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { getGuestId } from "./use-user-id.guest";

/**
 * Session-aware identity for Version 1.0.
 * Falls back to guest id when auth is off or the user is not signed in.
 */
export function useUserId(): string {
  const { data: session } = useSession();

  if (AUTH_ENABLED && session?.user?.id) {
    return session.user.id;
  }

  return getGuestId();
}
