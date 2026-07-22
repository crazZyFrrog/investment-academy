"use client";

const GUEST_ID_KEY = "investment-academy-guest-id";

export function getGuestId(): string {
  if (typeof window === "undefined") {
    return "guest-ssr";
  }

  const existing = localStorage.getItem(GUEST_ID_KEY);
  if (existing) {
    return existing;
  }

  const guestId = `guest-${crypto.randomUUID()}`;
  localStorage.setItem(GUEST_ID_KEY, guestId);
  return guestId;
}

/** Guest-only identity — no Auth.js session fetch. */
export function useUserId(): string {
  return getGuestId();
}
