"use client";

import { useSession } from "next-auth/react";
import { useSyncExternalStore } from "react";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { getGuestId } from "./use-user-id.guest";

function subscribeGuestId() {
  // Guest id is stable after the first client read.
  return () => {};
}

/**
 * Session-aware identity for Version 1.0.
 * Falls back to guest id when auth is off or the user is not signed in.
 * Guest fallback uses useSyncExternalStore so SSR/hydration stay "".
 */
export function useUserId(): string {
  const { data: session } = useSession();
  const guestId = useSyncExternalStore(subscribeGuestId, getGuestId, () => "");

  if (AUTH_ENABLED && session?.user?.id) {
    return session.user.id;
  }

  return guestId;
}
