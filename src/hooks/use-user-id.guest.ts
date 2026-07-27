"use client";

import { useSyncExternalStore } from "react";
import { createId } from "@/lib/id";

const GUEST_ID_KEY = "investment-academy-guest-id";

let cachedGuestId: string | null = null;

function createGuestId(): string {
  return `guest-${createId()}`;
}

/** Browser-only guest identity. Empty string during SSR / before mount. */
export function getGuestId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  if (cachedGuestId) {
    return cachedGuestId;
  }

  const existing = localStorage.getItem(GUEST_ID_KEY);
  if (existing) {
    cachedGuestId = existing;
    return existing;
  }

  const guestId = createGuestId();
  localStorage.setItem(GUEST_ID_KEY, guestId);
  cachedGuestId = guestId;
  return guestId;
}

function subscribe() {
  // Identity is stable for the session after first client read
  return () => {};
}

/**
 * Guest-only identity — no Auth.js session fetch.
 * Returns "" on the server; progress queries should be `enabled: Boolean(userId)`.
 */
export function useUserId(): string {
  return useSyncExternalStore(subscribe, getGuestId, () => "");
}
