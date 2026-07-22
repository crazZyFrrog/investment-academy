"use client";

import { useSession } from "next-auth/react";

const GUEST_ID_KEY = "investment-academy-guest-id";

function getGuestId(): string {
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

export function useUserId(): string {
  const { data: session } = useSession();
  if (session?.user?.id) {
    return session.user.id;
  }
  return getGuestId();
}
